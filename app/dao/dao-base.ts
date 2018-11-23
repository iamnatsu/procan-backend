import { dbHandler as handler } from '../middle/db';
import { ObjectId, MongoError, FilterQuery } from 'mongodb';
import * as Boom from 'boom';

export interface DaoIFace {
    COLLECTION_NAME: string;
}

export class DaoBase<T> {
  COLLECTION_NAME: string;
  
  get(id: String): Promise<Object> {
    return handler.db.collection(this.COLLECTION_NAME).findOne({ id: id }, { projection: { _id: 0 } }).then(result => {
      return result
    }).catch(e => {
      throw Boom.badRequest(e.errmsg);
    });
  }
  
  find(query: FilterQuery<T>): Promise<Array<Object>> {
    return handler.db.collection(this.COLLECTION_NAME).find(query, { projection: { _id: 0 } }).toArray().then(result => {
      return result;
    }).catch(e => {
      throw Boom.badRequest(e.errmsg);
    });
  }
  
  post(payload: Object): Promise<Object> {
    return handler.db.collection(this.COLLECTION_NAME).insertOne(payload).then(result => {
      payload['id'] = (result.ops[0]._id as ObjectId).toHexString();
      return handler.db.collection(this.COLLECTION_NAME).updateOne({'_id': result.ops[0]._id}, {$set: payload}).then(result => {
        return payload;
      }).catch(e => {
        throw Boom.badRequest(e.errmsg);
      });
    }).catch((e: MongoError) => {
      throw Boom.badRequest(e.errmsg);
    });
  }
  
  put(id: string, payload: Object): Promise<Object> {
    return handler.db.collection(this.COLLECTION_NAME).updateOne({ id: id }, { $set: payload }).then(result => {
      return this.get(id);
    }).catch(e => {
      throw Boom.badRequest(e.errmsg);
    });
  }
  
  delete(id: String): Promise<Object> {
    return handler.db.collection(this.COLLECTION_NAME).deleteOne({ id: id }).then(result => {
      return result
    }).catch(e => {
      throw Boom.badRequest(e.errmsg);
    });
  }
}
  