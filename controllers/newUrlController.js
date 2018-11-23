exports.CREATE_SHORT_URL = async function(req, res, next) {
  const dbConnect = require('../datastore/dbConnect');
  const shortId = require('shortid');
  const dns = require('dns');
  const urlPattern = /(https?:\/\/)((?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/;
  const dnsOptions = {
    family: 6,
    hint: dns.ADDRCONFIG | dns.V4MAPPED
  }
  
  try{
    //Get current db connection
    const db = await dbConnect.getDb();
    //Make sure a new url is provided and it matches the url pattern
    if(req.body.shortUrl) {
      const match = req.body.shortUrl.match(urlPattern);
      if(match){
        //Make sure the provided domain exists
        dns.lookup(match[2], async (err, addresses, family) => {
          if(addresses){
            const newUrl = {
              key: req.body.shortUrl,
              value: shortId.generate()
            };
            //Insert new url to mongo db
            try{
              await db.collection('short-url').insertOne(newUrl);
              res.json(await db.collection('short-url').findOne({key: newUrl.key}));
              //res.send(id);
            } catch (err) {
              if(err.code = 11000){
                try{
                  const shortUrl = await db.collection('short-url').findOne({key: newUrl.key});
                  res.json({original_url: shortUrl.key, short_url: shortUrl.value});
                } catch (err) {
                  next({status: 500, message: err});
                }
              } else {
                next({status: 500, message: err});
              }
            }
          } else {
            next({status: 400, message: "Invalid host name"});
          }
        });
      } else {
        next({status: 400, message: "Invalid URL provided"});
      }
    } else {
      next({status: 400, message: "Missing new URL parameter"});
    } 
  } catch (err) {
    next({status: 500, message: err});
  }
};

