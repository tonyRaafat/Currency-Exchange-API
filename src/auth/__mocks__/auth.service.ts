import { UserStub } from '../../users/tests/stups/user.stup';

export const AuthService = jest.fn().mockReturnValue({
  verifyUser: jest.fn().mockResolvedValue(UserStub.create()),

  login: jest.fn().mockImplementation((user, response) => {
    response.cookie('Authorization', 'mockToken', {
      httpOnly: true,
      expires: new Date(),
    });
  }),

  logout: jest.fn().mockImplementation((response) => {
    response.clearCookie('Authorization');
    return { msg: 'logged out succesfuly' };
  }),
});
