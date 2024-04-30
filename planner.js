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
const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // Getting the first day of the month
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // Getting the last date of the month
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // Getting the last day of the month
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // Getting the last date of the previous month
    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) { // Creating a list of the previous month's last days
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) { // Creating a list of all days of the current month

        // Adding the active class to the list if the current day, month, and year matched
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() 
                     && currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) { // Creating a list of the next month's first days
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
    }
    currentDate.innerText = `${months[currMonth]} ${currYear}`; // Passing the current month and year as currentDate text
    daysTag.innerHTML = liTag;
}
renderCalendar();


prevNextIcon.forEach(icon => { // Getting the previous and next icons
    icon.addEventListener("click", () => { // Adding the click event on both icons

        // If the clicked icon is the previous icon then decrement current month by 1 else increment it by 1
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if(currMonth < 0 || currMonth > 11) { // If the current month is less than 0 or greater than 11

            // Creating a new date of the current year & month and pass it as the date value
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear(); // Updating the current year with the new date year
            currMonth = date.getMonth(); // Updating the current month with new date month
        } else {
            date = new Date(); // Pass the current date as the date value
        }
        renderCalendar(); // Calling the renderCalendar function
    });
});
