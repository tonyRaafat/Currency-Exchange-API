import { User } from 'src/users/entities/user.entity';
import { Role } from '../../dto/create-user.dto';
import { Types } from 'mongoose';

export class UserStub {
  static create(overrides: Partial<UserStub> = {}): User {
    return {
      _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'hashedPassword123',
      role: Role.user,
      ...overrides,
    };
  }

  static update(overrides: Partial<UserStub> = {}): User {
    return {
      _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
      name: 'Updated Name',
      email: 'johndoe@example.com',
      password: 'hashedPassword123',
      role: Role.user,
      ...overrides,
    };
  }

  static createMany(count: number, overrides: Partial<UserStub> = {}): User[] {
    return Array(count)
      .fill(null)
      .map((_, index) =>
        this.create({
          _id: new Types.ObjectId(`507f1f77bcf86cd7994390${index + 11}`),
          email: `johndoe${index + 1}@example.com`,
          ...overrides,
        }),
      );
  }
}
