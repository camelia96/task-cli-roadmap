#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Colors
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  white: "\x1b[37m",
};

// JSON File path
const filePath = path.join(__dirname, "tasks.json");

// Menu
const menu = () => {
  console.log(`${colors.yellow}#Task lists options#${colors.reset}
${colors.cyan}add <Task name>                       Adds a new task with the chosen name
update <Task id> <New task name>      Updates the name of an existing task
delete <Task id>                      Deletes a task
list                                  Lists all tasks
list <done/todo/in-progress>          Lists tasks by status
mark-<in-progress/done>               Marks a tasks's status
`);
};

// Create file if it doesn't exist
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([], null, 2, "utf8"));
  console.log(
    `\n${colors.magenta}Tasks list created! Start adding tasks to your new list.${colors.reset}\n`
  );
}

// Args
const args = process.argv.slice(2);

// The first arg -> What will be done to the ask
const argsAction = args[0];
// The second arg -> Either the task's description or ID
const argsData = args[1];
// The third arg -> Some actions need extra data, either ID or task description
const argsExtra = args[2];

//Get the list's elements
const list = JSON.parse(fs.readFileSync(filePath, "utf8"));

// Write to file
function writeFile(data) {
  fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8", (err) => {
    if (err) {
      return false;
    }
    return;
  });
}

// Get next id
function getNextId(list) {
  console.log(
    list.length > 0 ? Math.max(...list.map((task) => task.id)) + 1 : 1
  );
  console.log(
    list.reduce((max, task) => (task.id > max ? task.id : max), 1) + 1
  );
  return list.reduce((max, task) => (task.id > max ? task.id : max), 1) + 1;
}

// List tasks
function listTasks(list) {
  list.forEach((element) => {
    console.log(`${element.id} # ${element.description} - ${element.status}`);
  });
}
// Add new task
function addNewTask(description) {
  // Create new task structure
  const newTask = {
    id: getNextId(list),
    description: description,
    status: "todo",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Add to list
  list.push(newTask);

  //Add data to JSON file
  writeFile(list);
  console.log(`${colors.green}Task created successfully`);
}

// Update task
function updateTask(id, description) {
  //Get the user's chosen task
  const chosenTask = list.find((element) => element.id == id);

  if (chosenTask) {
    // Change the task's properties
    chosenTask.description = description;
    chosenTask.updatedAt = new Date();

    // Edit JSON file
    writeFile(list);

    console.log(`${colors.green}Task updated successfully`);
  } else {
    console.log(`${colors.red}Please check your ID exists in the list`);
  }
}

// Mark task
function markTask(newStatus, id) {
  //Get the user's chosen task
  const chosenTask = list.find((element) => element.id == id);

  if (chosenTask) {
    // Change the task's properties
    chosenTask.status = newStatus;

    // Edit JSON file
    writeFile(list);

    console.log(`${colors.green}Task marked successfully`);
  } else {
    console.log(`${colors.red}Please check your ID exists in the list`);
  }
}

// If theres no action from the command line, show the menu
if (!argsAction) {
  menu();
} else {
  // ADD ACTION
  if (argsAction.includes("add")) {
    //To add, there must be a name/description
    if (argsData) {
      addNewTask(argsData);
    } else {
      console.log(`${colors.red}You need a name to create a new task.`);
    }
    // LIST ACTION
  } else if (argsAction.includes("list")) {
    if (list.length > 0) {
      // If the user introduced the status of the tasks to show, the list gets filtered
      if (argsData) {
        const filteredList = list.filter((element) => {
          return element.status === argsData;
        });

        if (filteredList.length > 0) {
          listTasks(filteredList);
        } else {
          console.log(
            `${colors.yellow}No tasks found with this filter. Add a new one!`
          );
        }
      } else {
        // If the user wants to see the whole list
        listTasks(list);
      }
    } else {
      console.log(`${colors.yellow}No tasks found. Add a new one!`);
    }

    // MARK ACTION
  } else if (argsAction.includes("mark")) {
    // Get new status
    let newStatus = argsAction.split("-");

    newStatus.shift();

    newStatus = newStatus.join("-");

    // Mark the chosen task if it has an ID and the right description
    if (argsData) {
      if (newStatus && (newStatus == "in-progress" || newStatus == "done")) {
        markTask(newStatus, argsData);
      } else {
        console.log(
          `${colors.red}You need to choose a status to mark your task, either "mark-in-progress" or "mark-done"`
        );
      }
    } else {
      console.log(`${colors.red}You need the task's ID`);
    }

    // UPDATE ACTION
  } else if (argsAction.includes("update")) {
    // Update needs description
    if (!argsExtra) {
      console.log(`${colors.red}You need a new description to update the task`);
    } else {
      updateTask(argsData, argsExtra);
    }

    // DELETE ACTION
  } else if (argsAction.includes("delete")) {
    // Filter new array without the task the user want to delete
    const newList = list.filter((element) => element.id != argsData);

    writeFile(newList);

    console.log(`${colors.green}Task deleted successfully`);
  } else {
    menu();
  }
}
