Todo API Endpoints
1. Retrieve all todos / Create a new todo

GET /todos/ → Get a list of all todos

POST /todos/ → Create a new todo

2. Retrieve / Update / Partially update / Delete a specific todo

GET /todos/<pk>/ → Get details of a specific todo

PUT /todos/<pk>/ → Update a todo (replace all fields)

PATCH /todos/<pk>/ → Partially update a todo (update specific fields)

DELETE /todos/<pk>/ → Delete a todo


SET UP INSTRUCTIONS

Set up a virtual environment.

Generate a requirements.txt file.

Install the necessary packages.

Create the following files: main.py, database.py, models.py, and schemas.py.

Go to Render and set up a PostgreSQL database.

Connect the database by configuring it in database.py.

Upload your FastAPI project to GitHub.

Add the environment variable for the database.

Deploy your GitHub repository to Render.

Copy the deployed Render link and integrate it into your Vite frontend.

Push your Vite project to GitHub.

Run npm run build and npm run deploy.

Navigate to GitHub settings, then to Pages, click your link, and copy it.

Add this link to the allow_origins in main.py.

Push the updated FastAPI project to GitHub.
