# PHARMA-CO HAART COLLECTION WEB-APP

 ## Project Setup:

Frontend (React + Vite):
Create a new React project using Vite: npm create vite@latest my-project --template react (or yarn create vite my-project --template react if you use Yarn).
Navigate into the project directory: cd my-project
Install necessary dependencies (e.g., for making API calls): npm install axios (or yarn add axios). Axios is a popular choice for making HTTP requests to your backend.
Backend (Python):
Set up a virtual environment (recommended): python3 -m venv venv (or python -m venv venv depending on your Python setup). Activate it: source venv/bin/activate (Linux/macOS) or venv\Scripts\activate (Windows).
Install Flask or Django (Flask is generally simpler for smaller projects): pip install Flask (or pip install Django if you choose Django). Django is more feature-rich and provides more structure, but Flask might be easier to learn initially.
Install the MySQL connector: pip install mysql-connector-python
Database (MySQL):
Install MySQL Server if you don't have it already.
Create a database for your project. You can do this using the MySQL command-line client or a GUI tool like phpMyAdmin or MySQL Workbench. Remember the database name, username, and password you set up.

## Project Structure:

Run the frontend and backend servers separately. The frontend server will serve the React app, while the backend server will handle API requests and interact with the database.
Frontend - Yarn run dev
Backend - Python3 main.py for db creation and uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000 for running the backend server.