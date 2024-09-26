# Task CLI

Sample solution for the [task-tracker](https://roadmap.sh/projects/task-tracker) challenge from [roadmap.sh](https://roadmap.sh/).

### Prerequisites

- You must have Node.js installed

### Technologies used
Node.js, Javascript

### Features

- Add, Update, and Delete tasks
- Mark a task as in progress or done
- List all tasks
- List all tasks that are done
- List all tasks that are not done
- List all tasks that are in progress

### Installation

```
# Clone the repository
git clone https://github.com/camelia96/task-cli-roadmap

# Move into the directory
cd task-cli-roadmap

```

### Usage

```linux
# See menu
mycli

# Add a new task
mycli add "New task description"

# List all tasks
mycli list

# List filtered tasks by status: done/todo/in-progress
mycli list <status>

# Update existing task description
mycli update <id> "New description"

# Mark existing task status
mycli mark-in-progress <id>
mycli mark-todo <id>

# Delete task
mycli delete <id>
```

### JSON file
> [!NOTE]
> The JSON file will automatically create if it doesn't detect one

```json
[{
    "id": 7,
    "description": "Take care of garden",
    "status": "todo",
    "createdAt": "2024-09-26T18:36:04.285Z",
    "updatedAt": "2024-09-26T18:36:04.285Z"
}]
```
