import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
//import bscrypt from 'bscrypt'

/*const pool = mysql
	.createPool({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'chat',
	})
	.promise();
	*/
const pool = mysql
	.createPool({
		host: 'brrf6psdcyxks0dubpq5-mysql.services.clever-cloud.com',
		user: 'usdgtjk5ikbpb5pt',
		password: '1IxxKXZKo1p1A7LuG6Gy',
		database: 'brrf6psdcyxks0dubpq5',
	})
	.promise();
// USERS TABLE FUNCTIONS

export async function getIdByEmail(email) {
	const [res] = await pool.query(`SELECT id FROM users WHERE email = ?`, [email]);
	if (res.length <= 0) {
		return -1;
	} else return res[0].id;
}

export async function getUserByUsername(email) {
	const [res] = await pool.query(`SELECT email FROM users WHERE email = ?`, [email]);
	if (res.length <= 0) return -1;
	else return 1;
}

export async function getUserById(id) {
	const [res] = await pool.query(`SELECT email, username FROM users WHERE id = ?`, [id]);
	return res[0];
}

export async function getUserinfo(id) {
	const [res] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
	return res;
}

export async function login(email) {
	const [res] = await pool.query(`SELECT password FROM users WHERE email = ?`, [email]);
	if (res.length > 0) return res[0].password;
	return -1;
}

export async function createUser(user, password, email) {
	const a = await getUserByUsername(email);
	if (a == -1) {
		const [res] = await pool.query(
			`
            INSERT INTO users (username, password, email)
            VALUES (?,?,?)
        `,
			[user, password, email]
		);
		return res.insertId;
	} else return -1;
}

// veriifcationCode
export async function postVerificationCode(verificationCode) {
	const [res] = await pool.query('INSERT INTO verifycode (code) values (?)', [verificationCode]);
	return res.insertId;
}

export async function getVerificationCode(insertId) {
	const [res] = await pool.query('SELECT code FROM verifycode where id = ?', [insertId]);
	if (res.length > 0) {
		return res[0].code;
	} else return -1;
}

export async function deleteVerificationCode(insertId) {
	const [res] = await pool.query('DELETE FROM verifycode where id = ?', [insertId]);
	return res.affectedRows;
}

// TASKLIST TABLE FUNCTIONS

export async function createTasklist(userId, name, is_daily, is_weekly, is_monthly) {
	const [res] = await pool.query(
		`
        INSERT INTO tasklist (name, is_daily, is_weekly, is_monthly)
        VALUES (?, ?, ?, ?)`,
		[name, is_daily, is_weekly, is_monthly]
	);

	if (res.insertId) {
		const [ans] = await pool.query(
			`
        INSERT INTO tasklist_to_user (user_id, tasklist_id)
        VALUES (?, ?)`,
			[userId, res.insertId]
		);
		return ans.insertId;
	} else {
		return -1;
	}
}

export async function createTask(name, tasklist_id) {
	const [res] = await pool.query(
		`
        INSERT INTO task ( name, tasklist_id, completed)
        VALUES ( ?, ?, ?)`,
		[name, tasklist_id, 0]
	);

	if (res.insertId) {
		return res.insertId;
	} else {
		return -1;
	}
}

export async function gettasklists(userId) {
	let res = [];
	//	let connection;

	const [tasklist] = await pool.query(
		`
     	SELECT tl.*
		FROM tasklist_to_user tu
		INNER JOIN tasklist tl ON tl.id = tu.tasklist_id
		WHERE tu.user_id = ?; 
		`,
		[userId]
	);
	res.push(tasklist);
	const [task] = await pool.query(
		`
     	SELECT  t.*
		FROM tasklist_to_user tu
		INNER JOIN task t ON t.tasklist_id = tu.id
		WHERE tu.user_id = ?; 
		`,
		[userId]
	);
	res.push(task);
	/*
	try {
		connection = await pool.getConnection();

		const [tasklistId] = await connection.query(
			`
			SELECT tasklist_id FROM tasklist_to_user 
			WHERE user_id = ?`,
			[userId]
		);

		if (!tasklistId.length) return -1;

		for (const e of tasklistId) {
			console.log(e.tasklist_id);
			const tasklist = await getTasklist(e.tasklist_id);
			res.push(tasklist);
		}
	} catch (error) {
		console.error('Error en gettasklists:', error);
	} finally {
		if (connection) connection.release();
	}*/
	return res;
}

export async function getTasklist(id) {
	let connection;
	const res = {
		tasklist: {},
		task: {},
	};
	try {
		connection = await pool.getConnection();

		const [rows] = await connection.query(`SELECT * FROM tasklist WHERE id = ?`, [id]);

		res.tasklist = rows.length ? rows[0] : {};

		if (res.tasklist) {
			res.task = await getTask(id);
		} else {
			return -1;
		}
	} catch (error) {
		console.error('Error en gettasklist:', error);
	} finally {
		if (connection) connection.release(); // Liberar la conexión
	}

	return res;
}

export async function getTask(tasklist_id) {
	let connection;
	let res;
	try {
		connection = await pool.getConnection();

		const [rows] = await connection.query(`SELECT * FROM task WHERE tasklist_id = ?`, [tasklist_id]);
		console.log(rows);
		res = rows;
		if (!res) return -1;
	} catch (error) {
		console.error('Error en gettask:', error);
	} finally {
		if (connection) connection.release(); // Liberar la conexión
	}
	return res;
}

const show = await gettasklists(35);
console.log(show);
//console.log(show[8].task[1].id);
//console.log(await getTasklist(1));
/*
export async function getNoteFromUser(user, noteId) {
	const id = await getIdByUsername(user);
	const [res] = await pool.query('SELECT * FROM snotes WHERE created_by = ? and id = ?', [id, noteId]);
	return res;
}

export async function getNotesFromUser(user) {
	const id = await getIdByUsername(user);
	const [res] = await pool.query(`SELECT * FROM notes WHERE created_by = ?`, [id]);
	return res;
}

export async function deleteNoteFromUser(user, noteId) {
	const id = user;
	const [res] = await pool.query(`DELETE FROM notes WHERE id = ? AND created_by = ?`, [noteId, id]);
	return res.affectedRows;
}

export async function updateNoteFromUser(user, noteId, newTitle, newDescription) {
	const id = user;
	const [res] = await pool.query(
		`
        UPDATE notes 
        SET title = ?, description = ? 
        WHERE id = ? AND created_by = ?`,
		[newTitle, newDescription, noteId, id]
	);
	return res.affectedRows;
}

export async function updateDeletedStatus(user, noteId, status) {
	const id = user;
	const [res] = await pool.query(
		`
        UPDATE notes 
        SET deleted = ?
        WHERE id = ? AND created_by = ?`,
		[status, noteId, id]
	);
	return res.affectedRows;
}
*/
