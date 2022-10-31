import { UserTypes } from "./user-types";

export interface IUser {
  _id?: number;
  name: string;
  email: string;
  role: UserTypes;
}
