document.addEventListener('DOMContentLoaded', function() {
    // Der Kalender Container
    const calendarEl = document.getElementById('calendar');

    // Lade die Events von GitHub oder einer lokalen Quelle
    loadEvents().then(events => {
        // Initialisiere den Kalender mit den geladenen Events
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth', // Monatsansicht
            validRange: { start: '2025-01-01', end: '2025-12-31' }, // Kalender nur für 2025 anzeigen
            initialDate: '2025-01-01', // Kalender startet mit dem 1. Januar 2025

            // Events werden hier an den Kalender übergeben
            events: events,
            
            // Zusatzoptionen für das Aussehen
            eventColor: '#3788d8', // Standardfarbe für Events
            eventTextColor: '#fff', // Textfarbe der Events
        });

        // Kalender rendern
        calendar.render();
    }).catch(error => {
        console.error('Fehler beim Laden der Events:', error);
    });
});

// Funktion zum Laden der Events aus einer externen JSON-Datei
async function loadEvents() {
    const eventsUrl = 'https://github.com/johan-hash/Kalender/blob/4540b23055743c3b9a1313d4c2572e5c342e0668/events.json'; // Link zur JSON-Datei
    try {
        const response = await fetch(eventsUrl);
        const events = await response.json();

        // Transformiere die Events, um sicherzustellen, dass sie korrekt im FullCalendar angezeigt werden
        return events.map(event => ({
            title: event.title,
            start: event.start,  // Startdatum
            end: event.end,      // Enddatum
            color: event.type === 'Urlaub' ? 'green' : event.type === 'Berufsschule' ? 'blue' : 'gray',
        }));
    } catch (error) {
        throw new Error('Fehler beim Laden der Events von der JSON-Datei');
    }
}