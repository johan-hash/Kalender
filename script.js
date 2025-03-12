// Firebase-Konfiguration (ersetzen Sie dies mit Ihren eigenen Werten aus der Firebase Console)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    databaseURL: "YOUR_REALTIME_DATABASE_URL" // Fügen Sie die Realtime-Datenbank-URL hinzu
};

// Firebase initialisieren
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

// Benutzer anonym anmelden (für Testzwecke)
auth.signInAnonymously()
    .then(userCredential => {
        console.log('Anonym angemeldet:', userCredential.user.uid);
    })
    .catch(error => {
        console.error('Fehler bei der anonymen Anmeldung:', error);
    });

document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    let events = [];

    // Events aus Realtime-Datenbank laden
    function loadEvents() {
        database.ref('events').on('value', (snapshot) => {
            events = [];
            snapshot.forEach((childSnapshot) => {
                const event = childSnapshot.val();
                event.id = childSnapshot.key; // Verwende den Key als ID
                events.push(event);
            });
            calendar.render();
        }, (error) => {
            console.error('Fehler beim Laden der Events:', error);
            events = [];
            calendar.render();
        });
    }

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
                database.ref('events/' + info.event.id).remove()
                    .then(() => {
                        info.event.remove();
                        events = events.filter(event => event.id !== info.event.id);
                    })
                    .catch(error => console.error('Fehler beim Löschen:', error));
            }
        },
        eventDrop: function(info) {
            updateEvent(info.event);
        },
        eventResize: function(info) {
            updateEvent(info.event);
        }
    });

    // Events laden und Kalender rendern
    loadEvents();

    // Event speichern
    document.getElementById('saveEvent').addEventListener('click', function() {
        const title = document.getElementById('eventTitle').value;
        const start = document.getElementById('eventStart').value;
        const end = document.getElementById('eventEnd').value || start;
        const color = document.getElementById('eventColor').value;

        if (title && start) {
            const newEvent = {
                title: title,
                start: start,
                end: end,
                backgroundColor: color,
                borderColor: color
            };

            // Event in Realtime-Datenbank speichern
            const newEventRef = database.ref('events').push();
            newEventRef.set(newEvent)
                .then(() => {
                    newEvent.id = newEventRef.key;
                    events.push(newEvent);
                    calendar.addEvent(newEvent);

                    // Modal schließen und Formular zurücksetzen
                    const modal = bootstrap.Modal.getInstance(document.getElementById('eventModal'));
                    modal.hide();
                    document.getElementById('eventForm').reset();
                })
                .catch(error => console.error('Fehler beim Speichern:', error));
        } else {
            alert('Bitte fülle mindestens Titel und Startdatum aus!');
        }
    });

    // Event aktualisieren
    function updateEvent(event) {
        const updatedEvent = {
            title: event.title,
            start: event.start.toISOString().split('T')[0],
            end: event.end ? event.end.toISOString().split('T')[0] : event.start.toISOString().split('T')[0],
            backgroundColor: event.backgroundColor,
            borderColor: event.borderColor
        };

        database.ref('events/' + event.id).update(updatedEvent)
            .catch(error => console.error('Fehler beim Aktualisieren:', error));
    }
});