const dbConnect = (function() {
  const MongoClient = require('mongodb').MongoClient;
  const MLAB_URI = 'mongodb://'+ process.env.USER + ':' + encodeURIComponent(process.env.PASS) 
    + '@' + process.env.HOST + '.mlab.com:' + process.env.DB_PORT + '/' + process.env.DB;
  this.db = null;
  
  this.init = async function() {
      try{
        this.db = await MongoClient.connect(MLAB_URI);
        return this.db;
      } catch (err){
        throw new Error('Error connecting to Mongo Client: ' + err);
      }    
  };
  
  this.getDb = async function(){
    if(this.db != null){
      return this.db;
    } else {
      try{
        await this.init();
        return this.db;
      } catch (err) {
        throw err;
      }
    }
  };
  
  this.close = async function() {
    if(this.db != null) {
      try{
        this.db = await this.db.close();
        return this.db;
      } catch (err) {
        throw new Error('Error closing database connection: ' + this.err);
      }
    }
  };
  
  return this;
})();

module.exports = dbConnect;