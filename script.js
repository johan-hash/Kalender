document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    let events = [];

    // Events laden
    fetch('events.json')
        .then(response => {
            if (!response.ok) throw new Error('Fehler beim Laden der Events');
            return response.json();
        })
        .then(data => {
            events = data;
            calendar.render();
        })
        .catch(error => {
            console.error('Fehler beim Laden der Events:', error);
            events = [];
            calendar.render();
        });

    // Kalender initialisieren
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'de',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: function(fetchInfo, successCallback) {
            successCallback(events);
        },
        editable: true,
        selectable: true,
        select: function(info) {
            document.getElementById('eventStart').value = info.startStr.split('T')[0];
            document.getElementById('eventEnd').value = info.endStr ? info.endStr.split('T')[0] : '';
            new bootstrap.Modal(document.getElementById('eventModal')).show();
        },
        eventClick: function(info) {
            if (confirm(`Möchtest du "${info.event.title}" löschen?`)) {
                info.event.remove();
                events = events.filter(event => event.id !== info.event.id);
            }
        },
        eventDrop: function(info) {
            updateEvent(info.event);
        },
        eventResize: function(info) {
            updateEvent(info.event);
        }
    });

    // Event speichern
    document.getElementById('saveEvent').addEventListener('click', function() {
        const title = document.getElementById('eventTitle').value;
        const start = document.getElementById('eventStart').value;
        const end = document.getElementById('eventEnd').value || start;
        const color = document.getElementById('eventColor').value;

        if (title && start) {
            const newEvent = {
                id: Date.now().toString(),
                title: title,
                start: start,
                end: end,
                backgroundColor: color,
                borderColor: color
            };

            events.push(newEvent);
            calendar.addEvent(newEvent);

            // Modal schließen und Formular zurücksetzen
            const modal = bootstrap.Modal.getInstance(document.getElementById('eventModal'));
            modal.hide();
            document.getElementById('eventForm').reset();
        } else {
            alert('Bitte fülle mindestens Titel und Startdatum aus!');
        }
    });

    // Event aktualisieren
    function updateEvent(event) {
        const index = events.findIndex(e => e.id === event.id);
        if (index !== -1) {
            events[index] = {
                id: event.id,
                title: event.title,
                start: event.start.toISOString().split('T')[0],
                end: event.end ? event.end.toISOString().split('T')[0] : event.start.toISOString().split('T')[0],
                backgroundColor: event.backgroundColor,
                borderColor: event.borderColor
            };
        }
    }
});