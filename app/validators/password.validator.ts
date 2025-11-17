export const PASSWORD_MIN_LENGTH = 8;

export const PASSWORD_VALIDATOR = {
  required: true,
  validate: {
    containUpperCase: (v: any) => v ? /(?=.*[A-Z])/.test(v as string) : true,
    containLowerCase: (v: any) => v ? /(?=.*[a-z])/.test(v as string) : true,
    containNumber: (v: any) => v ? /(?=.*\d)/.test(v as string) : true,
    onlyLatin: (v: any) => v ? /^(?:[^A-Za-z\p{L}]|[A-Za-z])*$/u.test(v as string) : true,
    specialSymbol: (v: any) => v ? /(?=.*[^A-Za-z0-9])/.test(v as string) : true,
  },
  minLength: PASSWORD_MIN_LENGTH,
};
