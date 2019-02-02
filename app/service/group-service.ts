import { get, post, put, del } from '../middle/hapi';
import { Group } from '../model/group';
import { GroupDao } from '../dao/group-dao';
import { BaseService } from './base-service';
import { AuthService } from './auth-service';
import { Opeartor, CRUD } from '../model/common';
import { User } from '../model/user';
import { FilterQuery } from 'mongodb';
import { Credential } from '../model/credential';
import * as Boom from 'boom';
import { ProjectService } from './project-service';

export class GroupService extends BaseService {
  public path = '/group';
  private dao = new GroupDao();
  private authService = new AuthService();
  private _projectServie = null;

  private projectService(): ProjectService {
    if (!this._projectServie) {
      this._projectServie = new ProjectService();
    }
    return this._projectServie;
  }

  @get('/{id}')
  async get(id: string, token: string) {
    return this.dao.get(id).then(async (result: Group) => {
      return await this.checkPermission(result, token);
    });
  }

  async checkPermission(group: Group, token: string) {
    const credential: Credential | void = await this.authService.get(token);
    if (credential) {
      if (group.owner && group.owner.id === credential.userId) {
        return group;
      }
      const filtered = (group.assignees || []).filter(a => a.id === credential.userId);
      if (filtered && filtered.length > 0) {
        return group;
      }
      return null;
    } else {
      throw Boom.forbidden();
    }
  }

  async checkPermissionById(groupId: string, token: string, type = CRUD.UPDATE) {
    const g = await this.get(groupId, token);
    const p2 = await this.checkPermission(g, token);
    return p2 && p2.id;
  }

  @get('')
  public async find(token: string): Promise<Array<Group>> {
    const credential: Credential | void = await this.authService.get(token);
    if (credential) {
      const query: FilterQuery<Group> = {};
      query['$or'] = [ 
        {'assignees': { $elemMatch: { id: credential.userId }}},
        {'owner': { id: credential.userId }}
      ];
      return this.dao.find(query) as Promise<Array<Group>>;
    } else {
      return Promise.resolve([]);
    }
  }

  @post('', true)
  async post(payload: Group, token: string) {
    return this.dao.post(await this.prepareCreate(payload, token)).then((result: Group) => {
      return result;
    });
  }

  @put('/{id}', true)
  async put(id: string, payload: Group, token: string) {
    const isValid = this.checkPermissionById(id, token);
    if (!isValid) throw Boom.forbidden();

    return this.dao.put(id, await this.prepareUpdate(payload, token)).then((result: Group) => {
      return result;
    });
  }

  @del('/{id}')
  async delete(id: string, token: string) {
    const isValid = this.checkPermissionById(id, token);
    if (!isValid) throw Boom.forbidden();

    return this.dao.delete(id).then((result: Group) => {
      return this.projectService().deleteByGroupId(id, token);
    });
  }

  private async prepareCreate(group: Group, token?: string) {
    group.audit = await this.createAudit(token);
    this.completeGroup(group);
    return group;
  }

  private async prepareUpdate(group: Group, token?: string) {
    group.audit = await this.updateAudit(group.audit, token);
    this.completeGroup(group);
    return group;
  }

  private completeGroup(group: Group) {
    if (!group.owner) group.owner = this.castOperator(group.audit.create.operator);
  }

  private castOperator(operator: Opeartor) {
    const user = new User();
    user.id = operator.id;
    return user;
  }

}