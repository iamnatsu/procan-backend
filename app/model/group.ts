import { Audit } from "./common";
import { User } from './user'

export class Group {
  /**
   * ID
   */
  id: string;
  /**
   * 名称
   */
  name: string;
  /**
   * 担当者
   */
  assignees: Array<User>;
  /**
   * オーナー
   */
  owner: User;

  audit: Audit;
}
