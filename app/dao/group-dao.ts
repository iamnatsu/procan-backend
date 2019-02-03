import { Group } from '../model/group';
import { DaoBase, DaoIFace } from './dao-base';
import * as Boom from 'boom';

export class GroupDao extends DaoBase<Group> implements DaoIFace {
  COLLECTION_NAME = 'GROUP';

  async put(id: string, group: Group) {
    this.validateUpdate(id, group);
    return super.put(id, group);
  }

  async post(group: Group) {
    await this.validate(group);
    return super.post(group);
  }

  private async validate(group: Group) {
    if (!group.name) {
      throw Boom.badRequest('必須項目エラー: グループ名');
    }
  }

  private async validateUpdate(id: string, group: Group) {
    await this.validate(group);
  }
}