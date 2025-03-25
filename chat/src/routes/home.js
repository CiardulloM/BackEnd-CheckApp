import express, { query } from 'express';
import { getUserinfo, createTasklist, createTask, getTasklist } from '../database.js';
import { encrypt, compare } from '../helpers/encrypt.js';
import { createAccessToken } from '../helpers/jwt.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = express.Router();

router.get('/main', authRequired, async (req, res) => {
	const user = await getUserinfo(req.user.id);

	return res.json({ user: user });
});

router.post('/createtasklist', async (req, res) => {
	console.log(req.body);
	let tasklist = {
		userId: req.body.user,
		name: req.body.name,
		is_daily: req.body.is_daily,
		is_weekly: req.body.is_weekly,
		is_monthly: req.body.is_monthly,
	};

	let tasks = req.body;
	delete tasks.user;
	delete tasks.name;
	delete tasks.is_daily;
	delete tasks.is_weekly;
	delete tasks.is_monthly;

	const tasklistId = await createTasklist(
		tasklist.userId,
		tasklist.name,
		tasklist.is_daily,
		tasklist.is_weekly,
		tasklist.is_monthly
	);

	await CreateTaskInDatabase(tasks, tasklistId);
	return res.json({ response: tasklist });
});

router.get('/gettasklists', authRequired, async (req, res) => {
	const tasklists = await getTasklist(req.id);
	console.log(tasklist);

	return res.json({ user: user });
});

const CreateTaskInDatabase = async (task, tasklistId) => {
	let res = -1;
	for (const key of Object.keys(task)) {
		res = await createTask(task[key], tasklistId);
	}
	return res;
};

export default router;
