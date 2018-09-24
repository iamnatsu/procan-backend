const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'procan';

export function initDB() {
  MongoClient.connect(url, (err, client) => {
      if (err) {
          console.dir(err);
      } else {
          console.log("Connected successfully to mongo");
          const db = client.db(dbName);
          const user = db.collection('user');
          user.find({}).toArray((err, docs) => {
              console.dir(docs);
          })
      }
  });
}

export class DBHandler {
  public db: any;
}