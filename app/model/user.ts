import { Audit } from "./common";

export class User {
  id: string;
  loginId: string;
  name: string;
  password: string;
  audit: Audit;

  constructor(args?: {id?: string, loginId: string, name: string, password?: string}) {
    if (!args) return;

    if (args.id) this.id = args.id;
    this.loginId = args.loginId;
    this.name = args.name;
    if (args.password) this.password = args.password;
  }
}