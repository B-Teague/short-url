const dbConnect = require('../datastore/dbConnect');
exports.HOMEPAGE = async function(req, res, next) {
  
  //Initialize database connection
  try {
    const db = await dbConnect.getDb();
    res.sendFile('/app/views/index.html');  
  } catch (error) {
    next(error);
  }
};