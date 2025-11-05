export const PASSWORD_MIN_LENGTH = 8;

export const PASSWORD_VALIDATOR = {
  required: true,
  validate: {
    containUpperCase: (v: string) => v ? (/^(?=.*[A-Z]).+$/.test(v)) : true,
    containLowerCase: (v: string) => v ? (/^(?=.*[a-z]).+$/.test(v)) : true,
    containNumber: (v: string) => v ? (/^(?=.*\d).+$/.test(v)) : true,
    onlyLatin: (v: string) => v ? (/^(?:[^A-Za-z\p{L}]|[A-Za-z])*$/u.test(v)) : true,
    specialSymbol: (v: string) => v ? (/^(?=.*[^A-Za-z0-9]).+$/.test(v)) : true,
  },
  minLength: PASSWORD_MIN_LENGTH,
};
