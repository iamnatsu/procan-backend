import { get, post, put, del } from '../middle/hapi';
import { Task, FindTaskRequest } from '../model/task';
import { TaskDao } from '../dao/task-dao';
import { BaseService } from './base-service';
import { ProjectService } from './project-service';
import { Opeartor, CRUD } from '../model/common';
import { User } from '../model/user';
import { FilterQuery } from 'mongodb';
import * as Boom from 'boom';
import { Project } from '../model/project';

export class TaskService extends BaseService {
  public path = '/task';
  private dao = new TaskDao();
  private _projectService = null;
  private projectService() {
    if(!this._projectService) {
      this._projectService = new ProjectService();
    }
    return this._projectService;
  }

  @get('/{id}')
  async get(id: string, token: string) {
    return this.dao.get(id).then(async (result: Task) => {
      const isValid = await this.projectService().checkPermissionById(result.projectId, token, CRUD.READ);
      return isValid ? result : null;
    });
  }

  @get('/find/{projectId}')
  async find(projectId: string, token: string) {
    if (projectId) {
      const isValid = await this.projectService().checkPermissionById(projectId, token, CRUD.READ);
      if (!isValid) return Promise.resolve([]);

      const query: FilterQuery<Task> = {};
      query['projectId'] = projectId;
      return this.dao.find(query)
    } else {
      return Promise.resolve([]);
    }
  }

  @post('/find', true)
  async find2(payload: FindTaskRequest, token: string) {
    if (payload) {
      const isValid = await this.projectService().checkPermissionById(payload.projectId, token, CRUD.READ);
      if (!isValid) return Promise.resolve([]);

      const query: FilterQuery<Task> = {};
      query['projectId'] = payload.projectId;
      return this.dao.find(query)
    } else {
      return Promise.resolve([]);
    }
  }

  @post('', true)
  async post(payload: Task, token?: string) {
    await this.checkPermission(payload, token);
    return this.dao.post(await this.prepareCreate(payload, token)).then((result: Task) => {
      return result;
    });
  }

  @put('/{id}', true)
  async put(id: string, payload: Task, token: string) {
    await this.checkPermission(payload, token);
    return this.dao.put(id, await this.prepareUpdate(payload, token)).then((result: Task) => {
      return result;
    });
  }

  async checkPermission(payload: Task, token: string) {
    if (payload && payload.projectId) {
      const isValid = await this.projectService().checkPermissionById(payload.projectId, token);
      if (!isValid) return Promise.resolve([]);
    } else {
      throw Boom.badRequest('必須項目エラー: プロジェクトID');
    }
  }

  @del('/{id}')
  async delete(id: string, token: string) {
    this.get(id, token).then(result => {
      if (result && result.id) {
        return this.dao.delete(id).then((result: Task) => {
          return;
        });
      } else {
        throw Boom.forbidden();
      }
    });
  }

  async deleteProjectTask(project: Project, token: string) {
    return this.dao.deleteMany({'projectId': project.id }).then((result: Task) => {
      return;
    });
  }

  private async prepareCreate(task: Task, token?: string) {
    task.audit = await this.createAudit(token);
    this.completeTask(task);
    return task;
  }

  private async prepareUpdate(task: Task, token?: string) {
    task.audit = await this.updateAudit(task.audit, token);
    this.completeTask(task);
    return task;
  }

  private completeTask(task: Task) {
    if (!task.owner) task.owner = this.castOperator(task.audit.create.operator);
  }

  private castOperator(operator: Opeartor) {
    const user = new User();
    user.id = operator.id;
    return user;
  }

}