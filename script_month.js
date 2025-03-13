document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    let events = [];

    fetch('events.json')
        .then(response => {
            if (!response.ok) throw new Error('Fehler beim Laden der Events');
            return response.json();
        })
        .then(data => {
            // Anpassen der Enddaten, um den Endtag inklusive anzuzeigen
            events = data.map(event => {
                if (event.end) {
                    const endDate = new Date(event.end);
                    endDate.setDate(endDate.getDate() + 1); // Endtag um einen Tag verschieben für FullCalendar
                    return {
                        ...event,
                        end: endDate.toISOString().split('T')[0]
                    };
                }
                return event;
            });
            calendar.setOption('events', events);
        })
        .catch(error => {
            console.error('Fehler beim Laden der Events:', error);
            events = [];
            calendar.setOption('events', events);
        });

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'de',
        firstDay: 1, // Woche beginnt mit Montag (0 = Sonntag, 1 = Montag, ...)
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: ''
        },
        views: {
            dayGridMonth: {
                titleFormat: { year: 'numeric', month: 'long' }
            }
        },
        events: events,
        editable: false // Drag-and-Drop deaktivieren
    });

    calendar.render();
});