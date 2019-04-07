import { Audit, LANGUAGE } from "./common";

export class User {
  id: string;
  loginId: string;
  name: string;
  password: string;
  lang: LANGUAGE;
  audit: Audit;

  constructor(args?: {id?: string, loginId: string, name: string, password?: string, lang?: LANGUAGE}) {
    if (!args) return;

    if (args.id) this.id = args.id;
    this.loginId = args.loginId;
    this.name = args.name;
    if (args.password) this.password = args.password;
    this.lang = args.lang || LANGUAGE.ja_JP;
  }
}