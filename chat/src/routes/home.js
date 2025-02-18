import express, { query } from 'express';
import { getUserinfo } from '../database.js';
import { encrypt, compare } from '../helpers/encrypt.js';
import { createAccessToken } from '../helpers/jwt.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = express.Router();

router.get('/main', authRequired, async (req, res) => {
	const user = await getUserinfo(req.user.id);

	return res.json({ user: user });
});

export default router;
