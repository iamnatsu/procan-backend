import { Task } from '../model/task';
import { DaoBase, DaoIFace } from './dao-base';
import * as Boom from 'boom';

export class TaskDao extends DaoBase<Task> implements DaoIFace {
  COLLECTION_NAME = 'TASK';

  async put(id: string, task: Task) {
    this.validateUpdate(id, task);
    return super.put(id, task);
  }

  async post(task: Task) {
    await this.validate(task);
    return super.post(task);
  }

  private async validate(task: Task) {
    if (!task.name) {
      throw Boom.badRequest('必須項目エラー: タスク名');
    }
    if (!task.projectId) {
      throw Boom.badRequest('必須項目エラー: プロジェクトID');
    }
  }

  private async validateUpdate(id: string, task: Task) {
    await this.validate(task);
  }
}