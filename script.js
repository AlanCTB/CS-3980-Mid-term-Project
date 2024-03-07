const apiUrl = 'http://127.0.0.1:8000/items/';

document.addEventListener('DOMContentLoaded', function() {
    generateCalendar();
    fetchTodos();
    document.getElementById('todoForm').addEventListener('submit', handleFormSubmit);

});

async function fetchTodos() {
    const response = await fetch(apiUrl);
    const todos = await response.json();

    todos.forEach(item => {
        // Create a date object from the due_date string
        const dueDate = new Date(item.due_date + 'T00:00:00Z'); // Treat the date as UTC
        const dayElement = document.getElementById(`day-${dueDate.getUTCDate()}`); // Use getUTCDate to avoid timezone issues
    
        if (dayElement) {
            const todoItem = document.createElement('div');
            todoItem.textContent = `${item.title}: ${item.description}`;
            dayElement.appendChild(todoItem);
        } else {
            console.error(`No element found for day ${dueDate.getUTCDate()}`);
        }
    });
    
    
}

async function handleFormSubmit(e) {
    e.preventDefault();
    // Ensure IDs match your form and that you're capturing all values correctly
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const priority = document.getElementById('priority').value;
    const isRecurring = document.getElementById('isRecurring').checked;
    const dueDate = document.getElementById('dueDate').value; // Ensure format matches YYYY-MM-DD

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title, 
            description, 
            priority, 
            is_recurring: isRecurring, 
            due_date: dueDate // Ensure this key matches your backend model
        }),
    });

    if (response.ok) {
        fetchTodos(); // Refresh todos and the calendar
    } else {
        // It's good to handle errors to know if something went wrong
        console.error("Failed to add todo item.");
    }
}

function generateCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = ''; // Clear existing calendar content

    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.id = `day-${day}`;
        dayElement.textContent = day; // Simple display of the day number
        calendar.appendChild(dayElement);
    }
}
