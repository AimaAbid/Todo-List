let tasks = [];
let editId = 0;

let flag = -1;
selectedIndex = -1;


function getData() {
	tasks = [];

	for (let i = 0; i < localStorage.length; i++) {
		let key = localStorage.key(i);
		if (key.startsWith("task_")) {
			let task = JSON.parse(localStorage.getItem(key));
			tasks.push(task);
		}
	}

	// Sort the tasks by id ascending
	tasks.sort((a, b) => a.id - b.id);
	temp = ``;
	temp += `<table  class='table '>
        <tr>
            <th> id   </th> 
            <th> Task   </th>
            <th> Priority   </th>
            <th> Due Date   </th>
            <th>Category</th>
            <th> Delete   </th>
            <th> Edit   </th>
			<th> Action</th>

            </tr>`;

	showData(tasks);
}

function markStatus(id, status) {
	console.log("id=" + id + " status=" + status);

	if (status === "incomplete") {
		for (var i = 0; i < tasks.length; i++) {
			if (tasks[i].id == id) {
				tasks[i].status = "complete";
				tasks[i].rowColor = "table-success";

				// update the task in localStorage
				localStorage.setItem("task_" + id, JSON.stringify(tasks[i]));
				console.log(
					"Stored in localStorage:",
					localStorage.getItem("task_" + id)
				);

				break;
			}
		}
	} else if (status === "complete") {
		for (var i = 0; i < tasks.length; i++) {
			if (tasks[i].id == id) {
				tasks[i].status = "incomplete";
				tasks[i].rowColor = "table-warning";

				// update the task in localStorage
				localStorage.setItem("task_" + id, JSON.stringify(tasks[i]));
				console.log(
					"Stored in localStorage:",
					localStorage.getItem("task_" + id)
				);

				break;
			}
		}
	}
	getData();
}

function showPopup() {
	flag = 1;

	document.getElementById("popup").style.visibility = "visible";
}
function closepopup() {
	document.getElementById("popup").style.visibility = "hidden";
}
// /////////////////////////Add Todo//////////////////////////////////////////////
function adddata() {
	
	if (flag == 1) {
		// add a new task
		task = document.getElementById("task").value;
		priority = document.getElementById("priority").value;
		dueDate = document.getElementById("dueDate").value;
		category = document.getElementById("category").value;
		status = "incomplete";
		rowColor = "table-warning";

		id = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;

		obj = { id: id, task, priority, dueDate, category, status, rowColor };

		// Store
		localStorage.setItem("task_" + id, JSON.stringify(obj));
	} else if (flag == 2) {
		//edit
		// update and save

		task = document.getElementById("task").value;
		priority = document.getElementById("priority").value;
		dueDate = document.getElementById("dueDate").value;
		category = document.getElementById("category").value;

		getData();

		for (var i = 0; i < tasks.length; i++) {
			if (tasks[i].id == editId) {
				console.log("editId " + editId);
				status = tasks[i].status;
				rowColor = tasks[i].rowColor;
				id = tasks[i].id;
				break;
			}
		}
		obj = { id: id, task, priority, dueDate, category, status, rowColor };
		console.log(obj);

		// Store
		localStorage.setItem("task_" + id, JSON.stringify(obj));
	}

	closepopup();
	getData();
}

function deleteIt(id) {
	getData();
	// Remove the task from the localStorage
	localStorage.removeItem("task_" + id);

	for (var i = 0; i < tasks.length; i++) {
		if (tasks[i].id == id) {
			var response = tasks.splice(i, 1); //remove task from tasks array
			if (response) {
				alert("Task has been deleted");
			}
			break;
		}
	}
	getData();
}

function editIt(id) {
	editId = id;
	flag = 2;
	console.log("id = " + id);
	document.getElementById("popup").style.visibility = "visible";
	getData();
	//retrieve old values
	for (var i = 0; i < tasks.length; i++) {
		if (tasks[i].id == id) {
			// get
			document.getElementById("task").value = tasks[i].task;
			document.getElementById("priority").value = tasks[i].priority;
			document.getElementById("dueDate").value = tasks[i].dueDate;
			document.getElementById("category").value = tasks[i].category;

			break;
		}
	}
}

function getFilteredPriority() {
	
	item = document.getElementById("searchByPriority").value;
	console.log("item: " + item);

	getData();

	tasks = tasks.filter((task) => {
		return task.priority == item;
	});

	showData(tasks);
}

function getFilteredDate() {
	
	item = document.getElementById("searchByDate").value;
	console.log("item: " + item);

	getData();

	tasks = tasks.filter((task) => {
		return task.dueDate == item;
	});

	showData(tasks);
}

function getFilteredCategory() {
	
	
	item = document.getElementById("searchByCategory").value;
	console.log("item: " + item);

	getData();

	tasks = tasks.filter((task) => {
		return task.category == item;
	});

	showData(tasks);
}

function getFilteredStatus() {
	
	item = document.getElementById("searchByStatus").value;
	item = item.toLowerCase();
	console.log("item: " + item);

	getData();

	tasks = tasks.filter((task) => {
		return task.status == item;
	});

	showData(tasks);
}

function searchData() {
	
	item = document.getElementById("search").value;
	console.log("item: " + item);

	getData();
	console.log("tasks:" + tasks[0]);
	if (item != "All" && item != "all") {
		tasks = tasks.filter((task) => {
			return (
				//case sensetive
				task.task == item ||
				task.priority == item ||
				task.dueDate == item ||
				task.category == item ||
				task.status == item ||
				//if we give input in lower case
				task.task.toLowerCase() == item ||
				task.priority.toLowerCase() == item ||
				task.dueDate.toLowerCase() == item ||
				task.category.toLowerCase() == item ||
				task.status.toLowerCase() == item ||
				// if term is actually in lowercase but give input in upper case
				task.task == item.toLowerCase() ||
				task.priority == item.toLowerCase() ||
				task.dueDate == item.toLowerCase() ||
				task.category == item.toLowerCase() ||
				task.status == item.toLowerCase()
			);
		});
	}
	showData(tasks);
}

function showData(tasksArray) {
	
	temp = ``;

	if (tasksArray.length === 0) {
		temp += `<p class="text-center text-danger">No tasks yet!</p>`;
	} else {
		temp += `<table  class='table '>
        <tr>
            <th> id   </th> 
            <th> Task   </th>
            <th> Priority   </th>
            <th> Due Date   </th>
            <th>Category</th>
            <th> Delete   </th>
            <th> Edit   </th>
			<th> Action</th>

            </tr>`;
		tasksArray.forEach((task) => {
			temp += `  <tr class=${task.rowColor}  >
		            <td > ${task.id}   </td>
		            <td> ${task.task}   </td>
		            <td> ${task.priority}   </td>
		            <td> ${task.dueDate}   </td>
		            <td> ${task.category}   </td>
		            <td> <button class='btn btn-danger' onclick="deleteIt(${task.id})"> Delete</button>  </td>
		            <td> <button class='btn btn-info' onclick="editIt(${task.id})" > Edit</button>  </td>
					

		           `;
			if (task.status === "incomplete") {
				temp += `<td><button class='btn btn-success' onclick="markStatus(${task.id}, '${task.status}')">Mark as Done</button></td></tr>`;
			} else if (task.status === "complete") {
				temp += `<td><button class='btn btn-success' onclick="markStatus(${task.id}, '${task.status}')">Mark as undone</button></td></tr>`;
			}
		});
		temp += `</table>`;
	}
	document.getElementById("overview").innerHTML = temp;
}
