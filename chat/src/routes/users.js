import express, { query } from 'express';
import {
	getUserById,
	getUserByUsername,
	getIdByEmail,
	createUser,
	login,
	getVerificationCode,
	deleteVerificationCode,
} from '../database.js';
import { postVerificationCode } from '../database.js';
import { encrypt, compare } from '../helpers/encrypt.js';
import { createAccessToken } from '../helpers/jwt.js';
import { authRequired } from '../middlewares/validateToken.js';
import { generateConfirmationCode } from '../helpers/crypto.js';
import SendEmail from '../helpers/nodemailer.js';
const router = express.Router();

router.post('/register', async (req, res) => {
	const email = req.body.email;
	const user = req.body.username;
	const pass = await encrypt(req.body.password);

	const verificationCode = req.body.verificationCode;

	console.log(req.body.verifyCodeId);

	if (!req.body.verifyCodeId) {
		return res.status(201).json({
			message: 'incorrect confirmation code',
		});
	}

	const encriptedCode = await getVerificationCode(req.body.verifyCodeId);
	console.log(encriptedCode);
	if (encriptedCode == -1) {
		return res.status(201).json({
			message: 'incorrect confirmation code',
		});
	}

	const isVerificationCodeMatch = await compare(verificationCode, encriptedCode);
	await deleteVerificationCode(req.body.verifyCodeId);

	if (isVerificationCodeMatch) {
		if (user && pass && verificationCode) {
			const idUser = await createUser(user, pass, email);
			if (idUser > -1) {
				const token = await createAccessToken({ id: idUser });
				res.cookie('token', token);
				return res.json({
					message: 'user created successfully',
					id: idUser,
					email: email,
				});
			} else res.status(201).json('user already exist');
		} else res.status(201).json('validate error');
	} else res.status(201).json('validate error');
});

router.post('/login', async (req, res) => {
	const email = req.body.email;
	const pass = req.body.password;
	const verificationCode = req.body.verificationCode;
	const encrypted = await login(email);
	if (encrypted == -1) {
		return res.status(201).json({
			message: 'user not found',
		});
	}

	if (!req.body.verifyCodeId) {
		return res.status(201).json({
			message: 'incorrect confirmation code',
		});
	}

	const isMatch = await compare(pass, encrypted);
	const userId = await getIdByEmail(email);

	const encriptedCode = await getVerificationCode(req.body.verifyCodeId);
	if (encriptedCode == -1) {
		return res.status(201).json({
			message: 'incorrect confirmation code',
		});
	}

	const isVerificationCodeMatch = await compare(verificationCode, encriptedCode);
	await deleteVerificationCode(req.body.verifyCodeId);
	if (email && pass) {
		if (isMatch) {
			if (isVerificationCodeMatch) {
				const token = await createAccessToken({ id: userId });
				res.cookie('token', token);
				return res.json({
					message: 'user logged successfully',
					id: userId,
					email: email,
				});
			} else {
				return res.status(201).json({
					message: 'validation error ',
				});
			}
		} else {
			return res.status(201).json({
				message: 'email or password incorrect',
			});
		}
	} else return res.json({ message: 'incomplete form' });
});

router.post('/logout', async (req, res) => {
	res.cookie('token', '', {
		expires: new Date(0),
	});
	return res.status(200).json({
		message: 'user disconnected',
	});
});
router.post('/getverificationcode', async (req, res) => {
	const accion = req.body.accion;
	const confirmationCode = generateConfirmationCode();
	const encriptedCode = await encrypt(confirmationCode);
	const email = req.body.email;
	const user_id = await getIdByEmail(email);
	if (user_id != -1 || accion == -1) {
		const codeInsertId = await postVerificationCode(encriptedCode);
		if (codeInsertId) {
			await SendEmail(email, confirmationCode);
			return res.status(200).json({
				message: 'code sended successfully',
				codeInsertId: `${codeInsertId}`,
			});
		}
		return res.status(201).json({});
	} else if (accion == 1 && user_id == -1) {
		return res.status(201).json({ message: 'user not registrated' });
	} else return res.status(201).json({ message: 'user not found' });
});

export default router;
