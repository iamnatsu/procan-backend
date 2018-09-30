//const mongodb = require('mongodb');
import * as mongodb from 'mongodb';
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://mongo:27017';
const dbName = 'procan';

export function initDB(retryCnt = 1) {
  MongoClient.connect(url, async (err, client) => {
      if (err) {
          if (retryCnt <= 5){
            console.error('cannot connect db. retry in ' + (5 * retryCnt) + ' secs');
            await wait(5 * retryCnt);
            initDB(++retryCnt);
          } else {
            console.error('cannot connect db.');
          }
      } else {
          console.log("Connected successfully to mongo");
          dbHandler.db = client.db(dbName);
//          const user = dbHandler.db.collection('user');
//          user.find({}).toArray((err, docs) => {
//              console.dir(docs);
//          });
      }
  });
}

export class DBHandler {
  public db: mongodb.Db;
}

export const dbHandler = new DBHandler();

function sleepByPromise(sec) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
}
async function wait(sec) { 
    await sleepByPromise(sec);
}