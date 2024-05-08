document.addEventListener('DOMContentLoaded', () => {
    // Set up the CSS for event days
    const style = document.createElement('style');
    document.head.appendChild(style);
    style.sheet.insertRule(`.days li.event { background-color: #ffd700; color: white; }`, 0);

    // Fetch event dates and then render the calendar
    fetchEventDates().then(() => {
        renderCalendar();
        setupEventModal();
    });
});


const daysTag = document.querySelector(".days"),
currentDate = document.querySelector(".current-date"),
prevNextIcon = document.querySelectorAll(".icons span");

// This gets the new date, along with current month and year
let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth(),
currDay = 0;

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
        const currentDate = new Date(currYear, currMonth, i);
        const formattedDate = currentDate.toISOString().split('T')[0];
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? "active" : "";
        let hasEvent = eventDates.has(formattedDate) ? "event" : "";
        liTag += `<li class="${isToday} ${hasEvent}">${i}</li>`;
    }

    for (let i = lastDayOfMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayOfMonth + 1}</li>`;
    }

    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;

    daysTag.querySelectorAll('li').forEach(day => {
        day.onclick = () => {
            const dayNumber = day.innerText;
            const date = `${currYear}-${currMonth + 1}-${dayNumber}`; // Adjust month for proper format
            document.getElementById('eventDate').value = date;
            document.getElementById('eventModal').style.display = 'block';
            displayEvents(dayNumber, currMonth, currYear);
            currDay = dayNumber;
        };
    });

    setupDayClicks();
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

let eventDates = new Set();

async function fetchEventDates() {
    try {
        const response = await fetch('http://localhost:3000/events', { method: 'GET' });
        const data = await response.json();
        eventDates.clear(); // Clear old dates before setting new ones
        data.forEach(event => {
            const eventDate = new Date(event.date);
            eventDates.add(eventDate.toISOString().split('T')[0]); // Store dates in 'YYYY-MM-DD' format
        });
    } catch (error) {
        console.error('Error fetching event dates:', error);
    }
}

function submitEventForm() {
    const form = document.getElementById('eventForm');
    let newDate = new Date(form.eventDate.value);
    let[hours, mins] = form.time.value.split(":");
    newDate.setHours(hours);
    newDate.setMinutes(mins);
    const eventData = {
        date: newDate,
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
    if (!confirm("Are you sure you want to delete this event?")) {
        return; // Stop the function if the user cancels the confirmation
    }

    fetch(`http://localhost:3000/events/${eventId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            alert("Event deleted successfully!");
            renderCalendar(); // Re-render the calendar to reflect the deletion
            displayEvents(currDay, currMonth, currYear);
        } else {
            alert("Failed to delete event.");
            console.error('Delete failed:', response);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error deleting event.");
    });
}


function setupDayClicks() {
    const days = document.querySelectorAll('.days li:not(.inactive)');
    days.forEach(day => {
        day.addEventListener('click', () => {
            document.querySelectorAll('.days li').forEach(d => d.classList.remove('day-selected'));
            day.classList.add('day-selected');
            const dayNumber = day.innerText;
            const selectedDate = `${currYear}-${currMonth + 1}-${dayNumber}`;
            document.getElementById('eventDate').value = selectedDate;  // Set this date in your hidden input field
            document.getElementById('eventModal').style.display = 'block';  // Show the event modal
        });
    });
}


function displayEvents(day, month, year) {
    fetch('http://localhost:3000/events', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        const listDiv = document.getElementById("eventList");
        listDiv.innerHTML = "";
        data.forEach(event => {
            let date = new Date(event.date);
            if (date.getDate() == day && date.getMonth() == month && date.getFullYear() == year) {
                listDiv.innerHTML += `
                <div class="event-box">
                    <div class="event-title">${event.title}</div>
                    <hr>
                    <div class="date-time">${date.toDateString()}<br>${date.toTimeString()}</div>
                    <div class="event-description">${event.description}</div>
                    <div class="event-info">${event.location}<br>${event.duration} minutes</div>
                    <button class="delete-event" onclick="deleteEvent(${event.id})">Delete Event</button>
                </div>`;
            }
        });
    });
}
