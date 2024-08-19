const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const daysOfWeek = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDate = null;
let holidays = [];
let startDay = 0; // Default start day of the week
const today = new Date();

document.addEventListener("DOMContentLoaded", () => {
    loadSettings(); // Load settings from localStorage
    renderCalendar();
    document.getElementById("prevMonth").addEventListener("click", () => changeMonth(-1));
    document.getElementById("nextMonth").addEventListener("click", () => changeMonth(1));
    document.getElementById("prevYear").addEventListener("click", () => changeYear(-1));
    document.getElementById("nextYear").addEventListener("click", () => changeYear(1));
    document.getElementById("todayButton").addEventListener("click", goToToday);
    document.getElementById("selectHolidaysButton").addEventListener("click", openHolidayModal);
    document.getElementById("applyHolidays").addEventListener("click", applyHolidays);
    document.getElementById("selectStartDayButton").addEventListener("click", openStartDayModal);
    document.getElementById("applyStartDay").addEventListener("click", applyStartDay);
    document.querySelector("#holidayModal .close").addEventListener("click", closeHolidayModal);
    document.querySelector("#startDayModal .close").addEventListener("click", closeStartDayModal);
    window.addEventListener("click", (event) => {
        if (event.target === document.getElementById("holidayModal")) {
            closeHolidayModal();
        }
        if (event.target === document.getElementById("startDayModal")) {
            closeStartDayModal();
        }
    });
});

function renderCalendar() {
    const firstDay = (new Date(currentYear, currentMonth, 1).getDay() - startDay + 7) % 7;
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    let calendarHTML = "<tbody><tr>";

    // Create header for days of the week
    for (let i = 0; i < 7; i++) {
        const day = (i + startDay) % 7;
        calendarHTML += `<th>${daysOfWeek[day]}</th>`;
    }
    
    calendarHTML += "</tr><tr>";

    // Add empty cells before the start of the month
    for (let i = 0; i < firstDay; i++) {
        calendarHTML += "<td></td>";
    }

    // Add cells for the days of the month
    for (let date = 1; date <= lastDate; date++) {
        const currentDate = new Date(currentYear, currentMonth, date);
        const dayOfWeek = (currentDate.getDay() - startDay + 7) % 7;
        const isToday = currentDate.toDateString() === today.toDateString();
        const isSelected = selectedDate && currentDate.toDateString() === selectedDate.toDateString();
        const isHoliday = holidays.includes(dayOfWeek);

        calendarHTML += `<td class="${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${isHoliday ? 'holiday' : ''}" data-date="${currentDate.toDateString()}">${date}</td>`;

        if ((firstDay + date) % 7 === 0 && date !== lastDate) {
            calendarHTML += "</tr><tr>";
        }
    }

    calendarHTML += "</tr></tbody>";
    document.querySelector("#calendar").innerHTML = calendarHTML;

    const monthYear = monthNames[currentMonth];
    document.getElementById("monthYear").innerText = monthYear;
    document.getElementById("year").innerText = currentYear;

    document.querySelectorAll("#calendar td").forEach(cell => {
        cell.addEventListener("click", function() {
            const date = new Date(this.getAttribute("data-date"));
            selectedDate = date;
            renderCalendar();
            updateInfoMessage();
        });
    });
}

function changeMonth(delta) {
    currentMonth += delta;
    if (currentMonth > 11) {
        currentMonth = 0;
        changeYear(1);
    } else if (currentMonth < 0) {
        currentMonth = 11;
        changeYear(-1);
    }
    saveSettings(); // Save settings to localStorage
    renderCalendar();
}

function changeYear(delta) {
    currentYear += delta;
    saveSettings(); // Save settings to localStorage
    renderCalendar();
}

function goToToday() {
    currentMonth = today.getMonth();
    currentYear = today.getFullYear();
    selectedDate = null; // Clear selected date
    updateInfoMessage(); // Reset info message
    saveSettings(); // Save settings to localStorage
    renderCalendar();
}

function updateInfoMessage() {
    if (!selectedDate) return;

    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const selectedDateDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

    const timeDifference = selectedDateDate - todayDate;
    const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    let message = "";
    if (dayDifference > 0) {
        message = `أيام متبقية: ${dayDifference}`;
    } else if (dayDifference < 0) {
        message = `أيام مضت: ${Math.abs(dayDifference)}`;
    } else {
        message = "اليوم!";
    }

    document.getElementById("infoMessage").innerText = message;
}

function applyHolidays() {
    const selectedOptions = document.querySelectorAll("#holidayModal input[type='checkbox']:checked");
    holidays = Array.from(selectedOptions).map(option => parseInt(option.value));
    saveSettings(); // Save settings to localStorage
    renderCalendar();
    closeHolidayModal();
}

function openHolidayModal() {
    document.getElementById("holidayModal").style.display = "flex";
}

function closeHolidayModal() {
    document.getElementById("holidayModal").style.display = "none";
}

function applyStartDay() {
    const selectedOption = document.querySelector("#startDayModal input[type='radio']:checked");
    if (selectedOption) {
        startDay = parseInt(selectedOption.value);
        saveSettings(); // Save settings to localStorage
        renderCalendar();
        closeStartDayModal();
    }
}

function openStartDayModal() {
    document.getElementById("startDayModal").style.display = "flex";
}

function closeStartDayModal() {
    document.getElementById("startDayModal").style.display = "none";
}

// Save settings to localStorage
function saveSettings() {
    localStorage.setItem('currentMonth', currentMonth);
    localStorage.setItem('currentYear', currentYear);
    localStorage.setItem('startDay', startDay);
    localStorage.setItem('holidays', JSON.stringify(holidays));
}

// Load settings from localStorage
function loadSettings() {
    const savedMonth = localStorage.getItem('currentMonth');
    const savedYear = localStorage.getItem('currentYear');
    const savedStartDay = localStorage.getItem('startDay');
    const savedHolidays = localStorage.getItem('holidays');

    if (savedMonth !== null) {
        currentMonth = parseInt(savedMonth);
    }
    if (savedYear !== null) {
        currentYear = parseInt(savedYear);
    }
    if (savedStartDay !== null) {
        startDay = parseInt(savedStartDay);
    }
    if (savedHolidays !== null) {
        holidays = JSON.parse(savedHolidays);
    }
}
