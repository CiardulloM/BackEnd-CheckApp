import jwt from 'jsonwebtoken';
import { SECRET_TOKEN } from '../config/secretToken.js';

export const createAccessToken = (payload) => {
	return new Promise((resolve, reject) => {
		jwt.sign(
			payload,
			SECRET_TOKEN,
			{
				expiresIn: '1m',
			},
			(err, token) => {
				if (err) reject(err);
				resolve(token);
			}
		);
	});
};
