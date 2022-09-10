/**
 * Check if input is a object
 * @param {any} obj - Input to check
 * @returns {boolean} - Boolean if input matches object or not
 */
export const isObject = (obj: any): boolean => {
	return obj === Object(obj);
};
