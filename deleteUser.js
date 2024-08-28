// deleteUser.js

// Dependencies and models
const express = require('express');
const router = express.Router();
const UserModel = require('./models/User'); // Adjust the path based on your project structure
const { authentication, authorisation } = require('./middleware/authMiddleware');

// Backend Controller Function to Delete User by Username
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

// Backend Route for Deleting a User by Username
router.post(
  "/delete/user",
  authentication, // Middleware for authentication
  authorisation({ isAdmin: false }), // Authorization logic, you can adjust this if only admins can delete users
  (req, res) => delete_user_by_username(req, res)
);

// Frontend HTML Form for Deleting a User
const deleteUserForm = `
  <form id="delete-user-form">
    <label for="other-username">Enter Username to Delete:</label>
    <input type="text" id="other-username" name="other-username" required>
    <button type="submit">Delete User</button>
  </form>
`;

document.body.innerHTML += deleteUserForm; // Append the form to the body

// Frontend JavaScript for Handling the Form Submission
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

// Export the router to be used in your app
module.exports = router;
