import { SetMetadata } from '@nestjs/common';
import { Role } from '../../users/dto/create-user.dto';

export const ROLE_KEY = 'roles';
export const Roles = (...roles: [Role, ...Role[]]) =>
  SetMetadata(ROLE_KEY, roles);
