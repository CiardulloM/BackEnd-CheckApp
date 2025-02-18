import { Resend } from 'resend';

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
