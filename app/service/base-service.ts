import { Audit, Operation, Opeartor } from '../model/common';
import { getToken } from '../middle/credential';
import { Credential } from '../model/credential';
import { UserService } from './user-service';

export class BaseService {
  async createAudit(token?: string) {
    const audit = new Audit();
    const operation = await this.currentOperation(token)
    audit.create = operation;
    audit.modify = operation;
    return audit;
  }

  async updateAudit(audit = new Audit(), token?: string) {
    const operation = await this.currentOperation(token)
    if (!audit.create) audit.create = operation;
    audit.modify = operation;
    return audit;
  }

  private async currentOperation(token?: string) {
    const operation = new Operation();
    operation.at = new Date();
    operation.operator = await this.currentOperator(token)
    return operation;
  }

  private async currentOperator(token?: string) {
    if (token) {
      try {
        const t = await getToken(token);
        const c: Credential = JSON.parse(t);
        const userService = new UserService();
        const user = await userService.get(c.userId);
        // トークンから操作者を構築
        return new Opeartor(user.id, user.name);
      } catch (e) {
        return new Opeartor('$system', '$system');
      }
    } else {
      return new Opeartor('$system', '$system');
    }
  }
}