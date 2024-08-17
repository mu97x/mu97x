document.addEventListener('DOMContentLoaded', function() {
    const daysContainer = document.getElementById('days');
    const monthYear = document.getElementById('monthYear');
    const daysRemaining = document.getElementById('daysRemaining');
    const daysPassed = document.getElementById('daysPassed');
    const daysUntil = document.getElementById('daysUntil');
    const daysSince = document.getElementById('daysSince');
    const jumpToTodayButton = document.getElementById('jumpToToday');
    let selectedDate = null;
    let currentDate = new Date();

    function renderCalendar(year, month) {
        daysContainer.innerHTML = '';
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        for (let i = 0; i < firstDay; i++) {
            daysContainer.innerHTML += '<div></div>';
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = i;
            dayElement.classList.add('day');
            if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
                dayElement.classList.add('current');
            }
            dayElement.addEventListener('click', () => selectDate(year, month, i));
            daysContainer.appendChild(dayElement);
        }

        monthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;
        updateInfo(year, month);
    }

    function updateInfo(year, month) {
        const today = new Date();
        const selected = selectedDate ? new Date(year, month, selectedDate) : null;
        const start = new Date(year, 0, 1);
        const end = new Date(year + 1, 0, 1);

        const daysInYear = (end - start) / (1000 * 60 * 60 * 24);
        const daysPassedInYear = Math.floor((today - start) / (1000 * 60 * 60 * 24));
        const daysRemainingInYear = daysInYear - daysPassedInYear;

        daysRemaining.textContent = daysRemainingInYear;
        daysPassed.textContent = daysPassedInYear;

        if (selected) {
            const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const selectedDateOnly = new Date(year, month, selectedDate);
            const diff = selectedDateOnly - todayDateOnly;
            const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
            daysUntil.textContent = diffDays >= 0 ? `${diffDays} يوم` : 'التاريخ مضى';
            daysSince.textContent = diffDays < 0 ? `${Math.abs(diffDays)} يوم` : 'حتى الآن';
        } else {
            daysUntil.textContent = 'حدد تاريخًا';
            daysSince.textContent = 'حدد تاريخًا';
        }
    }

    function selectDate(year, month, day) {
        const allDays = document.querySelectorAll('.day');
        allDays.forEach(d => d.classList.remove('selected'));
        const selectedDay = document.querySelector(`.day:nth-child(${day + new Date(year, month, 1).getDay()})`);
        selectedDay.classList.add('selected');
        selectedDate = day;
        updateInfo(year, month);
    }

    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });

    jumpToTodayButton.addEventListener('click', () => {
        currentDate = new Date();
        renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });

    renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
});
