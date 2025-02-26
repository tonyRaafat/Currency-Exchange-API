export const HashUtil = {
  hashPassword: jest
    .fn()
    .mockImplementation((password: string, salt: number) => {
      return Promise.resolve(`hashed_${password}_${salt}`);
    }),

  comparePassword: jest
    .fn()
    .mockImplementation((password: string, hashedPassword: string) => {
      return Promise.resolve(true);
    }),
};
