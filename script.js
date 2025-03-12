document.addEventListener('DOMContentLoaded', async function() {
    let calendarEl = document.getElementById('calendar');
    
    // Lade Events aus der GitHub JSON-Datei
    let events = [];
    try {
        const response = await fetch('https://raw.githubusercontent.com/EUER-GITHUB-USERNAME/azubi-kalender/main/events.json');
        events = await response.json();
    } catch (error) {
        console.error("Fehler beim Laden der Events:", error);
    }

    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: events.map(event => ({
            title: event.title,
            start: event.start,
            end: event.end,
            color: event.type === "Urlaub" ? "green" : event.type === "Berufsschule" ? "blue" : "gray"
        }))
    });

    calendar.render();
});