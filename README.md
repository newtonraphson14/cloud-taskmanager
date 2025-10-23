# ☁️ Cloud Task Manager

Simple task management API built with Azure Functions and SQL Database.

## 🚀 Live Demo
**API Endpoint:** https://ikbar-taskmanager.azurewebsites.net/api/tasks

## 💡 What It Does
- Create tasks (title, description, priority)
- View all tasks 
- Data stored in Azure SQL Database
- REST API ready for frontend
- **Modern web dashboard** (run `npx live-server frontend`)

## 🛠️ Tech Used
- Azure Functions (Node.js)
- Azure SQL Database
- Azure CLI for deployment
- HTML/CSS/JS Frontend

## Get All Tasks
```bash
curl -X GET https://ikbar-taskmanager.azurewebsites.net/api/tasks
```

## Frontend Dashboard
```bash
cd frontend
npx live-server
```

## 📂 Create New Task
```bash
curl -X POST https://ikbar-taskmanager.azurewebsites.net/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Azure", "description": "Build cloud apps", "priority": "high"}'
```

##🚦 Run Locally
```bash
# Install dependencies
npm install

# Start local server
func start

# Test locally
curl -X GET http://localhost:7071/api/tasks
```

## ☁️ Deploy to Azure
```bash
func azure functionapp publish ikbar-taskmanager
```
