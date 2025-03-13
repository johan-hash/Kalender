document.addEventListener("DOMContentLoaded", function () {
    fetch("events.json")
        .then(response => {
            if (!response.ok) throw new Error(`HTTP-Fehler: ${response.status}`);
            return response.json();
        })
        .then(events => renderYearView(events))
        .catch(error => console.error("Fehler beim Laden der Events:", error));

    function renderYearView(events) {
        const yearView = document.getElementById("yearView");
        const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
        const year = 2025;
        const dayNames = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]; // Woche beginnt mit Montag

        monthNames.forEach((month, index) => {
            const daysInMonth = new Date(year, index + 1, 0).getDate();
            const firstDayOfMonth = new Date(year, index, 1).getDay(); // 0 = Sonntag, 1 = Montag, ...
            const monthDiv = document.createElement("div");
            monthDiv.className = "month-card";

            // Kopfzeile mit Wochentagen
            let monthContent = `<h5 class="text-center fw-bold">${month} ${year}</h5>`;
            monthContent += '<div class="calendar">';
            dayNames.forEach(day => {
                monthContent += `<div class="day-header">${day}</div>`;
            });

            // Offset für den ersten Tag (Montag-Start: So = 6, Mo = 0, ...)
            const adjustedFirstDay = (firstDayOfMonth + 6) % 7; // Verschiebt Sonntag ans Ende
            for (let i = 0; i < adjustedFirstDay; i++) {
                monthContent += `<div class="day"></div>`; // Leere Zellen vor Monatsbeginn
            }

            // Tage des Monats
            for (let day = 1; day <= daysInMonth; day++) {
                const currentDate = new Date(Date.UTC(year, index, day));
                const dateStr = currentDate.toISOString().split('T')[0];
                const dayOfWeek = (currentDate.getDay() + 6) % 7; // Montag = 0, ..., Sonntag = 6
                let dayClass = 'day';

                // Wochenenden markieren (Sa = 5, So = 6)
                if (dayOfWeek === 5 || dayOfWeek === 6) {
                    dayClass += ' weekend';
                } else {
                    // Prüfen, ob ein Event an diesem Tag existiert
                    const hasEvent = events.some(event => {
                        const start = new Date(event.start);
                        const end = new Date(event.end || event.start);
                        return currentDate >= start && currentDate <= end;
                    });
                    // Nur freie Tage (keine Events) hellgrün markieren
                    if (!hasEvent) {
                        dayClass += ' free-day';
                    }
                }

                monthContent += `<div class="${dayClass}">${day}</div>`;
            }

            monthContent += "</div>";
            monthDiv.innerHTML = monthContent;
            yearView.appendChild(monthDiv);
        });
    }
});