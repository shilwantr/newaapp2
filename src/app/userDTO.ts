// user.dto.ts
export interface UserDTO {
  id?: number;           // Optional if it's generated by the backend
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}
