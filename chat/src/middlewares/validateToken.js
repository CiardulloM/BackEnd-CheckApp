import jwt from 'jsonwebtoken';
import { SECRET_TOKEN } from '../config/secretToken.js';

export const authRequired = (req, res, next) => {
	const { token } = req.cookies;

	if (!token)
		return res.status(401).json({
			message: 'unauthorized',
		});

	jwt.verify(token, SECRET_TOKEN, (err, data) => {
		if (err)
			return res.status(401).json({
				message: 'unauthorized',
			});

		req.user = data;

		next();
	});
};
