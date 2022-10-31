import { UserTypes } from "../_interfaces/user-types";
import { IUser } from "../_interfaces/user.interface";

export class User implements IUser {
  _id?: number | undefined;
  name: string;
  email: string;
  role: UserTypes;

  constructor(attrs: Partial<IUser> = {}) {
    this._id = attrs._id;
    this.name = attrs.name!;
    this.email = attrs.email!;
    this.role = attrs.role!;
  }
}
