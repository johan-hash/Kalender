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
        editable: true,
        eventDrop: function(info) {
            updateEvent(info.event);
        },
        eventResize: function(info) {
            updateEvent(info.event);
        }
    });

    calendar.render();

    function updateEvent(event) {
        const index = events.findIndex(e => e.id === event.id);
        if (index !== -1) {
            const updatedEvent = {
                id: event.id,
                title: event.title,
                start: event.start.toISOString().split('T')[0],
                end: event.end ? new Date(event.end).toISOString().split('T')[0] : null,
                backgroundColor: event.backgroundColor,
                borderColor: event.borderColor
            };
            if (updatedEvent.end) {
                // Rückgängigmachen der Anpassung für FullCalendar, damit der Endtag in events.json inklusiv ist
                const endDate = new Date(updatedEvent.end);
                endDate.setDate(endDate.getDate() - 1);
                updatedEvent.end = endDate.toISOString().split('T')[0];
            }
            events[index] = updatedEvent;
            saveEventsToConsole();
        }
    }

    function saveEventsToConsole() {
        // Events ohne Anpassung ausgeben, da sie bereits für inklusiven Endtag korrekt sind
        console.log('Aktualisierte Events (kopiere dies in events.json):', JSON.stringify(events, null, 2));
    }
});