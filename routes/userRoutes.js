const express = require('express');
const { getProfile, getUsersList, updateUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Retrieves the profile of the logged-in user
 *     description: Gets the user's profile information
 *     security:
 *       - bearerAuth: []  # JWT Bearer token authentication
 *     responses:
 *       200:
 *         description: User profile successfully fetched
 *       401:
 *         description: Unauthorized, user not logged in
 */
router.get('/profile', authMiddleware, getProfile);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieves a list of users
 *     description: Fetches the list of users. Admins can see all users, regular users can see their own profile.
 *     security:
 *       - bearerAuth: []  # JWT Bearer token authentication
 *     responses:
 *       200:
 *         description: List of users successfully fetched
 *       401:
 *         description: Unauthorized, user not logged in
 *       403:
 *         description: Forbidden, admin access required
 */
router.get('/', authMiddleware, getUsersList);

/**
 * @swagger
 * /api/users/users/{userId}:
 *   patch:
 *     summary: Update user information
 *     description: Allows an admin to update any user's details or allows a user to update their own profile.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user whose information is to be updated.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *               password:
 *                 type: string
 *                 description: The new password for the user (optional).
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 description: The role of the user (only admin can update this).
 *     security:
 *       - bearerAuth: []  # JWT Bearer token authentication
 *     responses:
 *       200:
 *         description: User information successfully updated
 *       400:
 *         description: Invalid user ID or invalid data provided
 *       401:
 *         description: Unauthorized, user not logged in or permission denied
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.patch('/users/:userId', authMiddleware, updateUser);

module.exports = router;
