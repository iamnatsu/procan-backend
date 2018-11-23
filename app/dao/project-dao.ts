import { Project } from '../model/project';
import { DaoBase, DaoIFace } from './dao-base';
import * as Boom from 'boom';

export class ProjectDao extends DaoBase<Project> implements DaoIFace {
  COLLECTION_NAME = 'PROJECT';

  async put(id: string, project: Project) {
    this.validateUpdate(id, project);
    return super.put(id, project);
  }

  async post(project: Project) {
    await this.validate(project);
    return super.post(project);
  }

  private async validate(project: Project) {
    if (!project.name) {
      throw Boom.badRequest('必須項目エラー: プロジェクト名');
    }
  }

  private async validateUpdate(id: string, project: Project) {
    await this.validate(project);
  }
}