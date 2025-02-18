import express, { query } from 'express';
import { getUserById, getUserByUsername, getIdByEmail, createUser, login } from '../database.js';
import jwt from 'jsonwebtoken';
import { SECRET_TOKEN } from '../config/secretToken.js';
const router = express.Router();

router.get('/auth/verify', async (req, res) => {
	const { token } = req.cookies;
	if (!token)
		return res.status(401).json({
			message: 'unauthorized',
		});
	jwt.verify(token, SECRET_TOKEN, async (err, user) => {
		try {
			if (err)
				return res.status(401).json({
					message: 'unauthorized',
				});
			const userFound = await getUserById(user.id);
			if (!userFound)
				return res.status(401).json({
					message: 'unauthorized',
				});

			return res.json({
				id: userFound.id,
				username: userFound.username,
				email: userFound.email,
			});
		} catch (error) {
			console.log(error);
		}
	});
});

export default router;
