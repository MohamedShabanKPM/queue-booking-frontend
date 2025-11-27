export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  user: UserDto;
}

export interface UserDto {
  id: number;
  name: string;
  email: string;
  role: string;
}

