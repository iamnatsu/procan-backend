import { LANGUAGE } from "./common";

export class Credential {
  'lastAccessedAt': string;
  'expireAt': string;
  'userId': string;
  'lastLoginAt': string;
  'payload': { [key: string]: string; };
  'temporarilyChildren': Array<Credential>;
  'name': string;
  'id': string;
  'lang': LANGUAGE
}