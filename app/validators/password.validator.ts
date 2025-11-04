export const PASSWORD_MIN_LENGTH = 8;

export const PASSWORD_VALIDATOR = {
  required: true,
  validate: {
    containUpperCase: (v: string) => (/^(?=.*[A-Z]).+$/.test(v)),
    containLowerCase: (v: string) => (/^(?=.*[a-z]).+$/.test(v)),
    containNumber: (v: string) => (/^(?=.*\d).+$/.test(v)),
    onlyLatin: (v: string) => (/^(?:[^A-Za-z\p{L}]|[A-Za-z])*$/u.test(v)),
    specialSymbol: (v: string) => (/^(?=.*[^A-Za-z0-9]).+$/.test(v)),
  },
  minLength: PASSWORD_MIN_LENGTH,
};
