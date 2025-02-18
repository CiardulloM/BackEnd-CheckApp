import crypto from 'crypto';

export function generateConfirmationCode() {
	return crypto.randomBytes(3).toString('hex'); // Código de 6 dígitos alfanuméricos
}
