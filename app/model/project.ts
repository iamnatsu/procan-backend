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
   * 担当者
   */
  assignees: Array<User>;
  /**
   * 公開範囲
   */
  permissionLevel: number;
}

