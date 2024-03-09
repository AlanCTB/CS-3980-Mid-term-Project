const apiUrl = 'http://127.0.0.1:8000/items/';
let currentDate = new Date();
let todos = [];
let currentItemID = null;

document.addEventListener('DOMContentLoaded', function() {
    generateCalendar(currentDate);
    fetchTodos();
    setupEventListeners();
});

function setupEventListeners() {
    // Event listener for opening the todo form popup
    document.getElementById('myBtn').addEventListener('click', showTodoForm);
    // Event listeners for month navigation
    document.getElementById('prevMonth').addEventListener('click', () => changeMonth(-1));
    document.getElementById('nextMonth').addEventListener('click', () => changeMonth(1));
    document.getElementById('clearEventsBtn').addEventListener('click', clearAllEvents);
    // Event listener for the todo form submission
    document.getElementById('todoForm').addEventListener('submit', handleFormSubmit);
    // Event Listener for remove Item button
    document.getElementById('removeItemBtn').addEventListener('click', async function() {
        if (currentItemID) {
            await fetch(`${apiUrl}/${currentItemID}`, { method: 'DELETE' });
            fetchTodos(); // Refresh the todos displayed
            document.getElementById('eventDescriptionPopup').style.display = 'none'; // Hide the modal
        }
    });
    // Close modal events
    document.querySelectorAll('.close').forEach(closeButton => {
        closeButton.onclick = function() {
            this.parentElement.parentElement.style.display = "none";
        }
    });
    window.onclick = function(event) {
        if (event.target.className.includes('modal')) {
            event.target.style.display = "none";
        }
    };
}

function showTodoForm() {
    document.getElementById('todoFormPopup').style.display = 'block';
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const priority = document.getElementById('priority').value;
    const isRecurring = document.getElementById('isRecurring').checked;
    const dueDate = document.getElementById('dueDate').value; // YYYY-MM-DD

    if (!isRecurring) {
        // If not recurring, post the event as usual
        await postEvent({ title, description, priority, due_date: dueDate, is_recurring: isRecurring });
    } else {
        // If recurring, calculate and post all subsequent weekly occurrences until the end of the year
        const startDate = new Date(dueDate + 'T00:00:00');
        const endDate = new Date(startDate.getFullYear(), 11, 31); 
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 7)) {
            await postEvent({ title, description, priority, due_date: date.toISOString().split('T')[0], is_recurring: isRecurring });
        }
    }
    fetchTodos(); // Refresh the todos
    document.getElementById('todoFormPopup').style.display = 'none';
}

async function postEvent(event) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Failed to submit event:', error);
    }
}

function changeMonth(change) {
    currentDate.setMonth(currentDate.getMonth() + change);
    generateCalendar(currentDate);
    fetchTodos(); 
}

function generateCalendar(date) {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = ''; // Clear existing calendar

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    document.getElementById('currentMonth').textContent = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    // Setting the date to the correct days in the week by adding placeholders
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    for (let i = 0; i < firstDayOfMonth; i++) {
        const placeholder = document.createElement('div');
        calendar.appendChild(placeholder);
    }
    // displaying all days correctly on the calendar
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.id = `day-${day}`;
        dayElement.textContent = day;
        calendar.appendChild(dayElement);
        if (currentDate.getMonth() === new Date().getMonth() && day === new Date().getDate() && currentDate.getFullYear() === new Date().getFullYear()) {
            dayElement.classList.add('current-day');
        }
    }
    
}

async function fetchTodos() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        todos = await response.json();
        clearCalendarEvents();
        todos.forEach(item => {
            addEventToCalendar(item);
        });
    } catch (error) {
        console.error('Failed to fetch todos:', error);
    }
}

function addEventToCalendar(item) {
    const dueDate = new Date(item.due_date + 'T00:00:00'); // Ensures date is correct on the calendar
    const calendarMonth = currentDate.getMonth();
    const calendarYear = currentDate.getFullYear();

    if (dueDate.getMonth() === calendarMonth && dueDate.getFullYear() === calendarYear) {
        const dayElementId = `day-${dueDate.getDate()}`;
        const dayElement = document.getElementById(dayElementId);
        if (dayElement) {
            const todoItem = document.createElement('div');
            todoItem.textContent = item.title;
            todoItem.classList.add('todo-item');
            switch (item.priority) {
                case 'High':
                    todoItem.classList.add('priority-high');
                    break;
                case 'Medium':
                    todoItem.classList.add('priority-medium');
                    break;
                case 'Low':
                    todoItem.classList.add('priority-low');
                    break;
            }
            todoItem.addEventListener('click', () => showEventDescription(item));
            // Append todo item to the correct day element
            dayElement.appendChild(todoItem);
        }
    }
}

function showEventDescription(item) {
    const descriptionModal = document.getElementById('eventDescriptionPopup');
    document.getElementById('eventDescription').textContent = item.description;
    currentItemID = item.id;
    descriptionModal.style.display = 'block';
    const removeBtn = document.getElementById('removeItemBtn');
    removeBtn.removeEventListener('click', removeItemHandler);
    removeBtn.addEventListener('click', removeItemHandler);
}

async function clearCalendarEvents() {
    const dayCells = document.querySelectorAll('#calendar > div'); 
    dayCells.forEach(cell => {
        const events = cell.querySelectorAll('.todo-item');
        events.forEach(event => event.remove());
    });
}

async function removeItemHandler() {
    if (currentItemID) {
        await fetch(`${apiUrl}${currentItemID}`, { method: 'DELETE' });
        fetchTodos(); // Refresh the todos displayed
        document.getElementById('eventDescriptionPopup').style.display = 'none'; // Hide the modal
    }
}

async function clearAllEvents() {
    const confirmation = confirm("Are you sure you want to delete all events?");
    if (confirmation) {
        try {
            const response = await fetch(apiUrl, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Failed to delete all events');
            }
            fetchTodos(); // Refresh the todos displayed
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

