import { UserStub } from '../tests/stups/user.stup';

export const UsersService = jest.fn().mockReturnValue({
  signup: jest.fn().mockResolvedValue({
    success: true,
    message: 'User created successfully',
    data: UserStub.create(),
  }),

  findAll: jest.fn().mockResolvedValue({
    success: true,
    data: UserStub.createMany(3),
  }),

  findOne: jest.fn().mockResolvedValue({
    success: true,
    data: UserStub.create(),
  }),

  update: jest.fn().mockResolvedValue({
    success: true,
    message: 'User updated successfully',
    data: UserStub.update(),
  }),

  remove: jest.fn().mockResolvedValue({
    success: true,
    message: 'User deleted successfully',
  }),
});
