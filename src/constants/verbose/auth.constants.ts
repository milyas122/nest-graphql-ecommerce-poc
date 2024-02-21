import { UserRole } from 'src/auth/entities/user.entity';

export const authConstants = {
  emailNotEmpty: 'email must not empty',
  emailMustBeValid: 'email must be a valid email',
  nameNotEmpty: 'name must not empty',
  nameMustBeString: 'name must be a string',
  passwordNotEmpty: 'password must not empty',
  passwordMustBeString: 'password must be a string',
  emailAlreadyExist: 'email already exist',
  emailPasswordError: 'email or password is invalid',
  userNotFound: 'user not found',
  roleMustBeValid: `role should be one of these ${Object.values(UserRole).join(', ')}`,
};
