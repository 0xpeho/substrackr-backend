import { IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto{

  @IsString()
  @MinLength(4)
  @MaxLength(32)
  email:string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,{message: 'Password must contain: 1 Uppercase,1 lowercase, 1 number or special character'})
  password:string;

  @IsOptional()
  deviceId?:string
}