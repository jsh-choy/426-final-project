document.addEventListener('DOMContentLoaded', () => {
    renderCalendar();
    setupEventModal();
});

const daysTag = document.querySelector(".days"),
currentDate = document.querySelector(".current-date"),
prevNextIcon = document.querySelectorAll(".icons span");

// This gets the new date, along with current month and year
let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();

// Putting months in an array
const months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];


// Rendering the calendar
function renderCalendar() {
    let firstDayOfMonth = new Date(currYear, currMonth, 1).getDay(),
        lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate(),
        lastDayOfMonth = new Date(currYear, currMonth, lastDateOfMonth).getDay(),
        lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate();
    let liTag = "";

    for (let i = firstDayOfMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateOfLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateOfMonth; i++) {
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }

    for (let i = lastDayOfMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayOfMonth + 1}</li>`;
    }

    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;

    // Adding click event listeners to days
    daysTag.querySelectorAll('li').forEach(day => {
        day.onclick = () => { // Use onclick to replace any old handlers
            const dayNumber = day.innerText;
            const date = `${currYear}-${currMonth + 1}-${dayNumber}`; // Adjust month for proper format
            document.getElementById('eventDate').value = date;
            document.getElementById('eventModal').style.display = 'block';
        };
    });
}

prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0 || currMonth > 11) {
            currYear += currMonth < 0 ? -1 : 1;
            currMonth = (currMonth + 12) % 12;
        }
        date = new Date(currYear, currMonth, 1); // Resets date to avoid date overflow
        renderCalendar();
    });
});


function openEventForm(date) {
    document.getElementById('eventDate').value = date; // Assuming you have a hidden field for date
    document.getElementById('eventModal').style.display = 'block';
}


function setupEventModal() {
    const modal = document.getElementById('eventModal');
    const closeBtn = document.querySelector('.modal .close');
    const form = document.getElementById('eventForm');

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        submitEventForm();
    });
}


function submitEventForm() {
    const form = document.getElementById('eventForm');
    const eventData = {
        date: form.eventDate.value,
        title: form.title.value,
        description: form.description.value,
        location: form.location.value,
        duration: parseInt(form.duration.value, 10)
    };

    fetch('http://localhost:3000/events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
    })
    .then(response => response.json())
    .then(data => {
        alert("Event created successfully!");
        clearFormFields();  // Function call to clear the form
        document.getElementById('eventModal').style.display = 'none';
        renderCalendar(); // Refresh the calendar to show the new event
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Failed to create event.");
        clearFormFields();
    });
}

function clearFormFields() {
    // Assuming all form fields need to be cleared
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('location').value = '';
    document.getElementById('duration').value = '';
}

function deleteEvent(eventId) {
    fetch(`http://localhost:3000/events/events/${eventId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            alert("Event deleted successfully!");
            renderCalendar();
        } else {
            alert("Failed to delete event.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error deleting event.");
    });
}