Here’s a Markdown explanation of the code provided in `deleteUser.js`:

---

# Delete User Functionality

This guide walks you through the implementation of a basic "Delete User" functionality in a Node.js application. The implementation includes back-end logic, routing, and front-end user interaction, all compiled into a single file called `deleteUser.js`.

## File: `deleteUser.js`

The file contains the following components:

### 1. **Backend Controller Function: `delete_user_by_username`**

This function handles the logic for deleting a user from the database by their username. It receives the username via a `POST` request and interacts with the database using Sequelize.

- **Functionality**:
  - Verifies if the `username` is provided in the request body.
  - Attempts to delete the user with the given username from the database.
  - Returns a success or error message based on whether the user was found and deleted.

```javascript
const delete_user_by_username = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const deletedUser = await UserModel.destroy({
      where: {
        username: username
      }
    });

    if (deletedUser) {
      return res.status(200).json({ message: "User deleted successfully" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "An error occurred while deleting the user" });
  }
};
```

### 2. **Backend Route: `/delete/user`**

This route is defined using Express.js and connects the deletion logic to a specific endpoint (`/delete/user`). It ensures that only authenticated users can trigger the delete functionality.

- **Route Configuration**:
  - Uses `authentication` middleware to ensure the user is logged in.
  - Uses `authorisation` middleware to enforce role-based access (e.g., only certain roles can delete users).
  - Calls the `delete_user_by_username` controller function upon receiving a `POST` request.

```javascript
router.post(
  "/delete/user",
  authentication, // Middleware for authentication
  authorisation({ isAdmin: false }), // Authorization logic, you can adjust this if only admins can delete users
  (req, res) => delete_user_by_username(req, res)
);
```

### 3. **Frontend Form for Deleting a User**

The front-end part consists of an HTML form where the user can input the username of the account they wish to delete. The form is dynamically added to the web page.

```javascript
const deleteUserForm = `
  <form id="delete-user-form">
    <label for="other-username">Enter Username to Delete:</label>
    <input type="text" id="other-username" name="other-username" required>
    <button type="submit">Delete User</button>
  </form>
`;

document.body.innerHTML += deleteUserForm; // Append the form to the body
```

### 4. **Frontend JavaScript for Handling Form Submission**

This JavaScript snippet listens for the form submission event, prevents the default form submission behavior, and sends an asynchronous `POST` request to the back-end endpoint to delete the user.

- **Form Submission Logic**:
  - Retrieves the username entered by the user.
  - Sends a `POST` request to the `/delete/user` endpoint with the username in the request body.
  - Displays a success or error message based on the response.

```javascript
document.getElementById("delete-user-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("other-username").value;

  try {
    const response = await fetch(`http://localhost:4001/auth/delete/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert("User deleted successfully!");
    } else {
      alert(data.message || "An error occurred.");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    alert("Error deleting user");
  }
});
```

### 5. **Export the Router**

The `router` is exported so it can be used in the main application file, typically `app.js` or `index.js`.

```javascript
module.exports = router;
```

## Summary

- **Backend Logic**: Implements a user deletion function using Sequelize ORM.
- **Route Setup**: Secures the delete route with authentication and authorization middleware.
- **Frontend Interaction**: Simple form allows users to input a username and trigger the delete action.
