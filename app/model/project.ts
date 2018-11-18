import { Audit } from "./common";
import { User } from './user'
import { Schedule } from './schedule'

export class Project extends Schedule {
  /**
   * ID
   */
  id: string;
  /**
   * 名称
   */
  name: string;
  /**
   * 公開範囲
   */
  permissionLevel: PermissionLevel;
  /**
   * 担当者
   */
  assignees: Array<User>;
  /**
   * グループID
   */
  groupId: string;
  /**
   * オーナー
   */
  owner: User;

  audit: Audit;
}

export enum PermissionLevel {
  PUBLIC = 'PUBLIC',
  GROUP = 'GROUP',
  ASSIGNEES = 'ASSIGNEES' // and owner
}

export const ROOT_GROUP_ID = '$root';