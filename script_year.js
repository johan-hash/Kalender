document.addEventListener('DOMContentLoaded', function() {
    const yearViewEl = document.getElementById('yearView');
    const monthGridEl = document.getElementById('monthGrid'); // Konsistent mit year.html
    let events = [];

    fetch('events.json')
        .then(response => {
            if (!response.ok) throw new Error('Fehler beim Laden der Events');
            return response.json();
        })
        .then(data => {
            events = data;
            updateYearView();
        })
        .catch(error => {
            console.error('Fehler beim Laden der Events:', error);
            events = [];
            updateYearView();
        });

    function updateYearView() {
        monthGridEl.innerHTML = '';
        const currentYear = new Date().getFullYear();
        const months = [
            'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
            'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
        ];

        months.forEach((month, index) => {
            const monthEvents = events.filter(event => {
                const eventDate = new Date(event.start);
                return eventDate.getFullYear() === currentYear && eventDate.getMonth() === index;
            });

            const monthCard = document.createElement('div');
            monthCard.className = 'month-card';
            monthCard.innerHTML = `
                <div class="month-header" id="heading${index}">
                    <button class="month-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                        <i class="fas fa-calendar-day me-2"></i> ${month} ${currentYear}
                        ${monthEvents.length > 0 ? `<span class="badge rounded-pill bg-danger ms-auto">${monthEvents.length}</span>` : ''}
                    </button>
                </div>
                <div id="collapse${index}" class="collapse" aria-labelledby="heading${index}" data-bs-parent="#monthGrid">
                    <div class="month-body">
                        <ul class="list-group list-group-flush">
                            ${monthEvents.length > 0 ? monthEvents.map(event => `
                                <li class="list-group-item event-item" style="background-color: ${event.backgroundColor}; border-color: ${event.borderColor};">
                                    <strong>${event.title}</strong><br>
                                    <small>Start: ${event.start}${event.end ? ` | Ende: ${event.end}` : ''}</small>
                                </li>
                            `).join('') : `
                                <li class="list-group-item event-item placeholder-item">
                                    <p class="text-muted mb-0">Keine Abwesenheiten in diesem Monat.</p>
                                </li>
                            `}
                        </ul>
                    </div>
                </div>
            `;
            monthGridEl.appendChild(monthCard);
        });
    }
});