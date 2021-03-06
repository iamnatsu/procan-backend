import { Audit } from "./common";
import { User } from './user'
import { Status } from './status'
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
   * ステータス
   */
  statuses: Array<Status>;
  /**
   * タスク並び順（ガントチャート）
   */
  ganttOrder: Array<string>;
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