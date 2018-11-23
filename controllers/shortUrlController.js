exports.REDIRECT_URL = async function(req, res, next) {
  const dbConnect = require('../datastore/dbConnect');
  const urlPattern = /[A-Za-z0-9_-]+/;  
  
  try{
    //Get current db connection
    const db = await dbConnect.getDb();
  
    //Make sure a new url is provided and it matches the url pattern
    if(req.params.shortUrl) {
      if(req.params.shortUrl.match(urlPattern)){
        
        //Get url using short id
        try{
          res.redirect((await db.collection('short-url').findOne({value: req.params.shortUrl})).key);
          
        } catch (err) {
            next({status: 500, message: err});
        }
      } else {
        next({status: 400, message: "Invalid shortUrl provided"});
      }
    
    } else {
      next({status: 400, message: "Missing shortUrl parameter"});
    } 
  } catch (err) {
    next({status: 500, message: err});
  }
};
