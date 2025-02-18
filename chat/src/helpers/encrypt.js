import bcrypt from 'bcrypt';

export const encrypt = async (text) => {
	return await bcrypt.hash(text, 10);
};

export const compare = async (text, encrypted) => {
	return await bcrypt.compare(text, encrypted);
};

export default { encrypt, compare };
