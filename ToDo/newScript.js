class TodoApp {
  constructor() {
    const tasks = localStorage.getItem("todos");

    if (typeof tasks === "string") {
      this.tasks = JSON.parse(tasks);
    } else {
      this.tasks = [];
    }
    this.renderTasks();
  }

  addTask(taskText, taskDate) {
    // check kiya ki date and text khali tu nahi h..
    if (!taskText || !taskDate) {
      alert("Please enter both task and date!");
      return;
    }

    // check kiya ki past date tu nahi h
    const today = new Date().toISOString().split("T")[0];
    if (taskDate < today) {
      alert("Cannot add a task with a past date!");
      return;
    }

    // const addTime = new Date().toLocaleString();

    // Date() method use kar ke current time nikala ..
    const currentTime = new Date();
    const Time = `${String(currentTime.getHours()).padStart(2, '0')} : ${String(currentTime.getMinutes()).padStart(2, '0')}: ${String(currentTime.getSeconds()).padStart(2, '0')}`;

    // object banaya sari value ko store karne ke liye ....
    const task = {
      id: Date.now(),
      text: taskText,
      date: taskDate,
      time: Time,
      editTime: null,
      completed: true,
    };
    this.tasks.push(task);
    this.renderTasks();
  }

  deleteTask(taskId) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    this.renderTasks();
  }

  editTask(taskId) {
    const task = this.tasks.find((task) => task.id === taskId);
    if (task) {
      const newTaskText = prompt("Edit Task Text:", task.text);
      const newTaskDate = prompt("Edit Task Date (YYYY-MM-DD):", task.date);

      const today = new Date().toISOString().split("T")[0];
      if (newTaskDate < today) {
        alert("Cannot set a past date!");
        return;
      }

      if (newTaskText && newTaskDate) {
        task.text = newTaskText;
        task.date = newTaskDate;
        task.editTime = new Date().toLocaleString();
        this.renderTasks();
      }
    }
  }

  toggleTaskCompletion(taskId) {
    const task = this.tasks.find((task) => task.id === taskId);
    if (task) {
      task.completed = !task.completed;
      console.log(task.completed);
      this.renderTasks();
    }
  }

  generateReportWithRange() {
    const startDateInput = document.getElementById("startDate").value;
    const endDateInput = document.getElementById("endDate").value;

    // Get today's date and set default start and end dates
    const today = new Date().toISOString().split("T")[0];

    if (endDateInput > today) {
      alert("Only past Report is gernate.");
      return;
    }

    // Ensure the end date doesn't exceed 7 days from today
    //const maxEndDate = new Date(today);
    // maxEndDate.setDate(today.getDate() - 7);


    let startDate = new Date(startDateInput || today);
    let endDate = new Date(endDateInput || today);

    // Format the start and end dates to match the task's date format (YYYY-MM-DD)
    const formattedStartDate = startDate.toISOString().split("T")[0]; // YYYY-MM-DD
    const formattedEndDate = endDate.toISOString().split("T")[0]; // YYYY-MM-DD

    // Filter tasks within the selected date range
    const filteredTasks = this.tasks.filter((task) => {
      // Convert the task date to string and compare it
      const taskDate = task.date; // Task date is already in the format YYYY-MM-DD
      return taskDate >= formattedStartDate && taskDate <= formattedEndDate;
    });


    // Render the report
    const reportContainer = document.getElementById("reportContainer");

    // Toggle the visibility of the report section
    if (reportContainer.style.display === "none" || !reportContainer.style.display) {
      reportContainer.style.display = "block"; // Show report

      reportContainer.innerHTML = `
        <h3>Tasks from ${formattedStartDate} to ${formattedEndDate}</h3>
        <table border="1" cellspacing="0" cellpadding="8" style="width: 100%; text-align: left; border-collapse: collapse;">
          <thead>
            <tr">
              <th>Task</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${filteredTasks.length > 0 ? filteredTasks.map((task) => `
              <tr>
                <td>${task.text}</td>
                <td>${task.completed ? 'pending' : 'Completed'}</td>
                <td>${task.date}</td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="3" style="text-align: center;">No tasks found for this period.</td>
              </tr>
            `}
          </tbody>
        </table>
      `;
    } else {
      reportContainer.style.display = "none"; // Hide report
    }
  }

  renderTasks() {
    const todoListElement = document.getElementById("todoList");
    todoListElement.innerHTML = "";

    this.tasks.forEach((task) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `<div class="list">
        <span class="task-text">${task.text}</span>
        <br />
        <small>${task.editTime ? `Edited at: ${task.editTime} | ${task.date}` : `Added at: ${task.date} |    ${task.time}`}</small>
        <div class="task-actions">
          <button class="editButton">Edit</button>
          <button class="deleteButton">Delete</button>
          <button class="toggleCompletion"> ${task.completed ? 'Pending' : 'Completed'}</button>
        </div>
        </div>
      `;
      todoListElement.appendChild(listItem);

      const deleteButton = listItem.querySelector(".deleteButton");
      deleteButton.addEventListener("click", () => this.deleteTask(task.id));

      const editButton = listItem.querySelector(".editButton");
      editButton.addEventListener("click", () => this.editTask(task.id));

      const toggleButton = listItem.querySelector(".toggleCompletion");
      toggleButton.addEventListener("click", () => this.toggleTaskCompletion(task.id));
    });

    this.save();
  }

  save() {
    localStorage.setItem("todos", JSON.stringify(this.tasks));
  }
}

// object create kiya....
const todo = new TodoApp();



document.getElementById("addTaskButton").addEventListener("click", () => {

  //values nikali  date and text ..
  const taskText = document.getElementById("taskInput").value;
  const taskDate = document.getElementById("dateInput").value;

  //object se addTask method ko call kiya...
  todo.addTask(taskText, taskDate);

  document.getElementById("taskInput").value = "";
  document.getElementById("dateInput").value = "";
});

document.getElementById("generateReportButton").addEventListener("click", () => {
  // object se report method ko call kiya..
  todo.generateReportWithRange();
});
