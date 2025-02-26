import { User } from '../../../users/entities/user.entity';
import { Role } from '../../../users/dto/create-user.dto';
import { Types } from 'mongoose';

export class AuthStub {
  static createLoginDto() {
    return {
      email: 'johndoe@example.com',
      password: 'P@ssw0rd',
    };
  }

  static createAuthUser(): User {
    return {
      _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'hashedPassword123',
      role: Role.user,
    };
  }

  static createAuthResponse() {
    return {
      success: true,
      message: 'Authentication successful',
      data: this.createAuthUser(),
    };
  }

  static createToken() {
    return 'mockJwtToken.signedPayload.withSignature';
  }

  static createTokenPayload() {
    return {
      userId: '507f1f77bcf86cd799439011',
    };
  }
}
