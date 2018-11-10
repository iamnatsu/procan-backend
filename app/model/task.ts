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
	 * カンバン位置
	 */
	boardPos: number;
}
