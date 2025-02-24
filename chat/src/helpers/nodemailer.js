/*import { Resend } from 'resend';

const resend = new Resend('re_Xd3TMYLq_BAPFGnmhSugNw3jKSBFn4vfm');

resend.SendEmail = async function SendEmail(destinationEmail, verifyCode) {
	const { data, error } = await resend.emails.send({
		from: 'CheckApp <verify@resend.dev>',
		to: destinationEmail,
		subject: 'verify code',
		html: `your verification code is: <strong> ${verifyCode} </strong>`,
	});

	if (error) {
		return console.error({ error });
	}

	console.log({ data });
};

//await SendEmail('maxiciardu98@gmail.com', '2112');
export default resend;
*/

import nodemailer from 'nodemailer';

// Configurar el transporte SMTP con Gmail
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'checkappemails@gmail.com', //  Tu correo de Gmail
		pass: 'jtsfydqxgctoksik', // Usa la contraseña de aplicación
	},
});

const SendEmail = async (destinationEmail, verifyCode) => {
	// Configurar los datos del corre
	const mailOptions = {
		from: 'checkappemails@gmail.com',
		to: destinationEmail,
		subject: 'Verification Code',
		html: `your verification code is: <strong> ${verifyCode} </strong>`,
	};
	// Enviar el correo
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log('Error enviando correo:', error);
		} else {
			console.log('Correo enviado:', info.response);
		}
	});
};

export default SendEmail;
