document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const completedList = document.getElementById('completedList'); 
    const resetButton = document.getElementById('resetButton');
    loadTasks();

    addTaskButton.addEventListener('click', () => {
        const taskValue = taskInput.value.trim();
        if (taskValue) {
            addTask(taskValue);
            taskInput.value = '';
            saveTasks();
        }
    });

    resetButton.addEventListener('click', () => {
        taskList.innerHTML = '';
        completedList.innerHTML = '';

        localStorage.removeItem('tasks');
        localStorage.removeItem('completedTasks');
    });

    function addTask(task) {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
            <input type="checkbox" class="checkbox">
            <span>${task}</span>
            <button class="delete-button">Delete</button>
        `;
        
        const checkbox = taskItem.querySelector('.checkbox');
        const deleteButton = taskItem.querySelector('.delete-button');

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                taskItem.classList.add('completed');
                moveToCompleted(taskItem);
            } else {
                taskItem.classList.remove('completed');
                moveToActive(taskItem);
            }
            saveTasks();
        });

        deleteButton.addEventListener('click', () => {
            taskItem.remove();
            saveTasks();
        });

        taskList.appendChild(taskItem);
    }

    function moveToCompleted(taskItem) {
        completedList.appendChild(taskItem);
    }

    function moveToActive(taskItem) {
        taskList.appendChild(taskItem);
    }

    function saveTasks() {
        const tasks = [];
        const taskItems = taskList.querySelectorAll('li');
        taskItems.forEach(item => {
            tasks.push({
                text: item.querySelector('span').textContent,
                completed: item.querySelector('.checkbox').checked
            });
        });

        const completedTasks = [];
        const completedItems = completedList.querySelectorAll('li');
        completedItems.forEach(item => {
            completedTasks.push({
                text: item.querySelector('span').textContent,
                completed: true
            });
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.innerHTML = `
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
                <span>${task.text}</span>
                <button class="delete-button">Delete</button>
            `;

            const checkbox = taskItem.querySelector('.checkbox');
            const deleteButton = taskItem.querySelector('.delete-button');

            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    taskItem.classList.add('completed');
                    moveToCompleted(taskItem);
                } else {
                    taskItem.classList.remove('completed');
                    moveToActive(taskItem);
                }
                saveTasks();
            });

            deleteButton.addEventListener('click', () => {
                taskItem.remove();
                saveTasks();
            });

            if (task.completed) {
                completedList.appendChild(taskItem);
            } else {
                taskList.appendChild(taskItem);
            }
        });
    }
});