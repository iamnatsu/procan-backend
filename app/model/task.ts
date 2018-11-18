import { Audit } from "./common";
import { User } from './user'
import { Schedule } from './schedule'

export class Task extends Schedule {
	/**
	 * ID
	 */
	id: string;
	/**
	 * 名称
	 */
	name: string;
	/**
	 * プロジェクトID
	 */
	projectId: string;
	/**
	 * 依存元タスクID
	 */
	predecessors: Array<{ id: string }>;
	/**
	 * 依存元タスクID
	 */
	successors: Array<{ id: string }>;
	/**
	 * 担当者
	 */
	assignees: Array<User>;
  /**
   * オーナー
   */
  owner: User;
	/**
	 * カンバン位置
	 */
	boardPos: number;

  audit: Audit;
}

export class FindTaskRequest {
	projectId: string;
}