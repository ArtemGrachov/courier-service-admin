export const EMAIL_REGEXP = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const EMAIL_VALIDATOR = (v: string) => EMAIL_REGEXP.test(v);
