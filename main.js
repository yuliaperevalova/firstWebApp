const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const todoList = document.getElementById('todoList');

    // Считываем из localStorage; может быть 2 случая:
    // 1) Уже массив объектов { text: "...", done: false } 
    // 2) Старый формат (массив строк)
    let storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Преобразуем все строки (если остались) в объекты { text, done: false }
    let tasks = storedTasks.map(item => {
        if (typeof item === 'string') {
            return { text: item, done: false };
        } else {
            // Если это уже объект, оставляем как есть.
            return item;
        }
    });

    // Функция сохранения в localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Функция рендеринга (отрисовки) всех задач
    function renderTasks() {
      // Сначала чистим список
        todoList.innerHTML = '';

      // Перебираем задачи и создаём для каждой <li>
        tasks.forEach((task, index) => {
            // li — &laquo;контейнер&raquo; одной задачи
            const li = document.createElement('li');
            li.className = 'todo-item';

            // Если задача помечена как выполненная, добавляем класс completed
            if (task.done) {
                li.classList.add('completed');
            }

            // Создаём чекбокс, который будет показывать/менять состояние done
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.done; // если задача выполнена — чекбокс отмечен
            // При изменении чекбокса переключаем состояние задачи
            checkbox.addEventListener('change', () => {
                tasks[index].done = checkbox.checked;
                saveTasks();
                renderTasks();
            });

            // span с текстом задачи
            const span = document.createElement('span');
            span.className = 'todo-text';
            span.textContent = task.text;

            // Кнопка "Удалить"
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-btn';
            deleteButton.textContent = 'Удалить';
            deleteButton.addEventListener('click', () => {
                deleteTask(index);
            });

            // Складываем всё в li
            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(deleteButton);

            // И добавляем li в общий список <ul>
            todoList.appendChild(li);
        });
    }

    // Функция добавления новой задачи
    function addTask() {
        const textValue = taskInput.value.trim();
        if (textValue) {
            // Добавляем в массив объект с текстом и начальным состоянием done: false
            tasks.push({ text: textValue, done: false });
            saveTasks();
            renderTasks();
            // Очищаем поле ввода
            taskInput.value = '';
        }
    }

    // Функция удаления задачи
    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    // Прикрепляем обработчики
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // При загрузке страницы сразу рисуем все задачи (если были сохранены ранее)
    renderTasks();