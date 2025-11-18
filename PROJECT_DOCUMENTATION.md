                           
                            FollowPath - Task Tracker Application

Final Project Documentation

1. Project Overview

FollowPath is a full-stack web application for task management that allows users to create, read, update, and delete tasks with status tracking and progress monitoring.

Live Demo:

Frontend: https://followpath-app.netlify.app

Backend API: https://followpath-app.onrender.com/tasks

GitHub Repository: https://github.com/betty0321/FollowPath-app

2. Technology Stack

Frontend
HTML5 - Page structure and semantics

CSS3 - Styling and responsive design

JavaScript (ES6+) - Client-side functionality and API communication

Netlify - Frontend deployment and hosting

Backend
Node.js - Runtime environment

Express.js - Web application framework

PostgreSQL - Relational database

Sequelize ORM - Database management and migrations

Render - Backend deployment and cloud hosting

Development & Deployment Tools
Git & GitHub - Version control and code repository

Postman - API testing and development

VS Code - Code editor

dotenv - Environment variable management

3. Database Schema

Tasks Table
sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  status ENUM('Pending', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Pending',
  completion INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
🔌 API Endpoints
RESTful CRUD Operations
Method	Endpoint	Description
GET	/tasks	Retrieve all tasks
GET	/tasks?status={status}	Filter tasks by status
POST	/tasks	Create a new task
PUT	/tasks/:id	Update a specific task
DELETE	/tasks/:id	Delete a specific task
Example API Response
json
{
  "id": 1,
  "title": "Sample Task",
  "description": "Do something fun",
  "dueDate": "2025-11-15",
  "status": "Pending",
  "completion": 0,
  "createdAt": "2025-11-12T19:34:59.808Z",
  "updatedAt": "2025-11-12T19:34:59.808Z"
}
4. Features Implemented

Core Functionality
✅ Create new tasks with title, description, due date, and status

✅ Read and display all tasks with sorting by due date

✅ Update task details (title, description, status, completion percentage)

✅ Delete tasks permanently

✅ Real-time progress tracking with completion percentages

User Interface
✅ Responsive design that works on desktop and mobile

✅ Status filtering (All, Pending, In Progress, Completed, Cancelled)

✅ Visual progress indicators

✅ Clean, intuitive task management interface

Technical Achievements
✅ Full CRUD operations with RESTful API

✅ PostgreSQL database with proper schema design

✅ Frontend-backend integration

✅ Cloud deployment on Render and Netlify

✅ Environment variable security

✅ Error handling and validation

5. Project Structure

text
FollowPath-app/
├── frontend/
│   ├── index.html          # Main application interface
│   ├── style.css           # Styling and responsive design
│   └── script.js           # Client-side functionality and API calls
├── Models/
│   ├── index.js            # Sequelize database connection
│   └── task.js             # Task model definition
├── server.js               # Express server and API routes
├── package.json            # Dependencies and scripts
└── .gitignore              # Git exclusion rules
🔧 Setup & Installation
Local Development
Clone the repository:

bash
git clone https://github.com/betty0321/FollowPath-app.git
Install dependencies:

bash
npm install
Set up environment variables in .env:

text
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tasktracker
DB_USER=postgres
DB_PASSWORD=your_password
PORT=5000
Start the development server:

bash
node server.js
Production Deployment
Backend: Automatically deployed to Render on git push

Frontend: Manually deployed to Netlify via drag-and-drop

Database: PostgreSQL hosted on Render with SSL encryption

6. Key Learning Outcomes

Full-Stack Development - Integrated frontend and backend systems

RESTful API Design - Created clean, predictable API endpoints

Database Management - PostgreSQL with Sequelize ORM and migrations

Cloud Deployment - Successfully deployed to Render and Netlify

Version Control - Professional Git workflow with GitHub

Environment Configuration - Secure management of sensitive data

Error Handling - Robust error management across the stack

7. Live URLs

Application: https://followpath-app.netlify.app

Backend API: https://followpath-app.onrender.com/tasks

Source Code: https://github.com/betty0321/FollowPath-app

8. Testing Instructions

Visit the application: https://followpath-app.netlify.app

Create a task: Use the "Add Task" functionality

Update progress: Modify task status and completion percentage

Filter tasks: Use the status filter dropdown

Test persistence: Refresh the page to confirm data saves

Verify API: Test endpoints directly via https://followpath-app.onrender.com/tasks

9. Submission Checklist

Backend and frontend code uploaded to GitHub

GitHub repository set to public

Backend deployed and accessible

Frontend deployed and functional

Full CRUD operations working

Database persistence verified

Documentation completed

All links tested and working

