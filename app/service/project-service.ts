import { get, post, put, del } from '../middle/hapi';
import { Project, PermissionLevel, ROOT_GROUP_ID } from '../model/project';
import { ProjectDao } from '../dao/project-dao';
import { BaseService } from './base-service';
import { AuthService } from './auth-service';
import { Opeartor, CRUD } from '../model/common';
import { User } from '../model/user';
import { FilterQuery } from 'mongodb';
import { Credential } from '../model/credential';
import * as Boom from 'boom';
import * as uuid4  from 'uuid/v4'
import { GroupService } from './group-service';
import { TaskService } from './task-service';

export class ProjectService extends BaseService {
  public path = '/project';
  private dao = new ProjectDao();
  private authService = new AuthService();
  private groupService = new GroupService();
  private taskService = new TaskService();

  @get('/{id}')
  async get(id: string, token: string) {
    return this.dao.get(id).then(async (result: Project) => {
      return await this.checkPermission(result, token, CRUD.READ);
    });
  }

  async checkPermission(project: Project, token: string, type = CRUD.UPDATE) {
    const credential: Credential | void = await this.authService.get(token);
    if (credential) {
      if (type === CRUD.READ && project.permissionLevel === PermissionLevel.PUBLIC) return project;

      if (project.owner && project.owner.id === credential.userId) {
        return project;
      }
      const filtered = (project.assignees || []).filter(a => a.id === credential.userId);
      if (filtered && filtered.length > 0) {
        return project;
      }
      if (project.groupId && project.groupId != ROOT_GROUP_ID) {
        // TODO 
      }
      return null;
    } else {
      throw Boom.forbidden();
    }
  }

  async checkPermissionById(projectId: string, token: string, type = CRUD.UPDATE) {
    const p = await this.get(projectId, token);
    if (type === CRUD.READ) return p && p.id;

    const p2 = await this.checkPermission(p, token, type);
    return p2 && p2.id;
  }

  @get('')
  async find(token: string) {
    const credential: Credential | void = await this.authService.get(token);
    if (credential) {
      const groups = await this.groupService.find(token);
      const query: FilterQuery<Project> = {};
      query['$or'] = [
        {'assignees': { $elemMatch: { id: credential.userId }}},
        {'owner': { id: credential.userId }},
        {'groupId': { $in: groups.map(g => g.id)}}
      ];
      return this.dao.find(query)
    } else {
      return Promise.resolve([]);
    }
  }

  @post('', true)
  async post(payload: Project, token: string) {
    return this.dao.post(await this.prepareCreate(payload, token)).then((result: Project) => {
      return result;
    });
  }

  @put('/{id}', true)
  async put(id: string, payload: Project, token: string) {
    const isValid = this.checkPermissionById(id, token);
    if (!isValid) throw Boom.forbidden();

    return this.dao.put(id, await this.prepareUpdate(payload, token)).then((result: Project) => {
      return result;
    });
  }

  @del('/{id}')
  async delete(id: string, token: string) {
    const isValid = this.checkPermissionById(id, token);
    if (!isValid) throw Boom.forbidden();
    return this.dao.delete(id).then((result: Project) => {
      return this.taskService.deleteProjectTask(result, token).then(() => {
        return;
      });
    });
  }

  async deleteByGroupId(groupId: string, token: string) {
    const credential: Credential | void = await this.authService.get(token);
    if (!credential) return Promise.resolve([]);
    const groups = await this.groupService.find(token);
    if (groups.findIndex(g => g.id === groupId) < 0) return Promise.resolve([]);

    const query: FilterQuery<Project> = {};
    query['$or'] = [
      {'groupId': { $in: groups.map(g => g.id)}}
    ];
    return this.dao.find(query).then(async (res: Project[]) => {
      if (!res) return;
        for (let i in res) {
          console.log("delete project: " + res[i].id)
          await this.delete(res[i].id, token);
        }
        return;
      })
  }

  private async prepareCreate(project: Project, token?: string) {
    project.audit = await this.createAudit(token);
    this.completeProject(project);
    return project;
  }

  private async prepareUpdate(project: Project, token?: string) {
    project.audit = await this.updateAudit(project.audit, token);
    this.completeProject(project);
    return project;
  }

  private completeProject(project: Project) {
    if (!project.groupId) project.groupId = ROOT_GROUP_ID;
    if (!project.permissionLevel) {
      if (project.groupId === ROOT_GROUP_ID) {
        project.permissionLevel = PermissionLevel.ASSIGNEES;
      } else if (project.groupId) {
        project.permissionLevel = PermissionLevel.GROUP;
      }
    }
    if (project.statuses && project.statuses.length > 0) {
      project.statuses.forEach(s => {
        if (!s.id) s.id = uuid4();
      })
    }
    if (!project.owner) project.owner = this.castOperator(project.audit.create.operator);
  }

  private castOperator(operator: Opeartor) {
    const user = new User();
    user.id = operator.id;
    return user;
  }

}

