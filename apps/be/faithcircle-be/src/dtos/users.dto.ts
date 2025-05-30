import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsOptional, IsBoolean, IsEnum, Matches } from 'class-validator';

// Enum for user roles
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  ADVISOR = 'advisor',
}

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  public password: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public first_name: string;

  @IsString()
  @IsNotEmpty()
  public last_name: string;

  @IsString()
  @IsOptional()
  public phone?: string;

  @IsString()
  @IsOptional()
  public address?: string;

  @IsEnum(UserRole)
  @IsOptional()
  public role?: UserRole = UserRole.USER;

  @IsString()
  @IsOptional()
  public language_preference?: string = 'en';

  @IsBoolean()
  @IsOptional()
  public is_active?: boolean = true;
}

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  public email?: string;

  @IsString()
  @IsOptional()
  @MinLength(9)
  @MaxLength(32)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  public password?: string;

  @IsString()
  @IsOptional()
  public name?: string;

  @IsString()
  @IsOptional()
  public first_name?: string;

  @IsString()
  @IsOptional()
  public last_name?: string;

  @IsString()
  @IsOptional()
  public phone?: string;

  @IsString()
  @IsOptional()
  public address?: string;

  @IsEnum(UserRole)
  @IsOptional()
  public role?: UserRole;

  @IsString()
  @IsOptional()
  public language_preference?: string;

  @IsBoolean()
  @IsOptional()
  public is_active?: boolean;
}

export class UserResponseDto {
  public id: string;
  public email: string;
  public name: string;
  public first_name: string;
  public last_name: string;
  public phone?: string;
  public address?: string;
  public role: UserRole;
  public language_preference: string;
  public created_at: Date;
  public updated_at: Date;
  public is_active: boolean;
}

export class UserLoginDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public current_password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  public new_password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  public confirm_password: string;
}
