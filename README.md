# RecipesProject

This is a server-side project built with **Node.js**. The project provides an API for managing recipes and categories. Each category contains recipes that belong to it, allowing users to organize and retrieve recipes easily.

## Features

- Manage **categories** (add, view, update, delete).
- Manage **recipes** (add, view, update, delete) within specific categories.
- Manage **users** (registration, login, update details, delete users, view users).
- RESTful API endpoints for interacting with categories, recipes, and users.
- JSON-based responses for easy integration with frontend applications.

## Technologies Used

- **Node.js**: The runtime environment for building the server.
- **Express.js**: A web framework for handling API routes.
- **MongoDB**: A NoSQL database for storing categories, recipes, and users.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB.
- **bcrypt**: For hashing and securely storing user passwords.
- **jsonwebtoken**: For user authentication and authorization.

## Project Structure

```
project-root/
|-- models/           # Mongoose models for Categories, Recipes, and Users
|-- routes/           # Express routes for API endpoints
|-- controllers/      # Logic for handling requests and responses
|-- config/           # Configuration files (e.g., database connection)
|-- app.js            # Main server file
|-- package.json      # Project dependencies and scripts
```

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the following:

   ```env
   PORT=3000
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:

   ```bash
   npm start
   ```

5. The server will run at `http://localhost:3000`.

## API Endpoints

### Categories

- **GET /api/categories**: Retrieve all categories.
- **POST /api/categories**: Create a new category.
  - Body:
    ```json
    {
      "code": "category-code",
      "description": "Category description"
    }
    ```
- **GET /api/categories/****:id**: Retrieve a specific category by ID.
- **PUT /api/categories/****:id**: Update a category by ID.
  - Body:
    ```json
    {
      "code": "new-category-code",
      "description": "Updated description"
    }
    ```
- **DELETE /api/categories/****:id**: Delete a category by ID.

### Recipes

- **GET /api/categories/****:categoryId****/recipes**: Retrieve all recipes in a category.
- **POST /api/categories/****:categoryId****/recipes**: Add a new recipe to a category.
  - Body:
    ```json
    {
      "title": "Recipe title",
      "ingredients": ["ingredient1", "ingredient2"],
      "instructions": "Steps to prepare the recipe."
    }
    ```
- **GET /api/categories/****:categoryId****/recipes/****:recipeId**: Retrieve a specific recipe by ID.
- **PUT /api/categories/****:categoryId****/recipes/****:recipeId**: Update a recipe by ID.
  - Body:
    ```json
    {
      "title": "Updated title",
      "ingredients": ["new-ingredient1", "new-ingredient2"],
      "instructions": "Updated steps."
    }
    ```
- **DELETE /api/categories/****:categoryId****/recipes/****:recipeId**: Delete a recipe by ID.

### Users

- **POST /api/users/register**: Register a new user.
  - Body:
    ```json
    {
      "name": "User name",
      "email": "user@example.com",
      "password": "user-password",
      "address": "User address (optional)",
      "role": 2
    }
    ```
- **POST /api/users/login**: Log in an existing user.
  - Body:
    ```json
    {
      "email": "user@example.com",
      "password": "user-password"
    }
    ```
- **GET /api/users**: Retrieve all users (Admins only).
  - Requires admin token in the `Authorization` header.
- **GET /api/users/****:id**: Retrieve a specific user by ID (Authenticated users only).
  - Requires user token in the `Authorization` header.
- **PUT /api/users/****:id**: Update user details (Authenticated users only).
  - Body:
    ```json
    {
      "name": "Updated name",
      "address": "Updated address"
    }
    ```
- **DELETE /api/users/****:id**: Delete a user (Admins only).
  - Requires admin token in the `Authorization` header.

## Authentication and Authorization

- **JWT (JSON Web Token)** is used for authentication.
- Each user is assigned a token upon registration or login.
- Tokens are required for accessing protected routes.
- Admins have a `role` of `1`, while regular users have a `role` of `2`.

---



