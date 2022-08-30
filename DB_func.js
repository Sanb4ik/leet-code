const mongoose = require('mongoose');

const DoesExist = (_name) =>
  new Promise((resolve, reject) => {

    Leetcode.find({ name: _name }, (err, res) => {
      if (res.length === 0) {
       //console.log("not found please try save " + _name, res.length);
       resolve(true);
      }
      else {
        //console.log("false");
        resolve(false);
      }
    });
 })

    mongoose.connect('mongodb://localhost:27017/Leetcode');
    var Leetcode = mongoose.model('Submissions', { name: String, runtime: Number, language: String, url: String});
 
async function CreateMongoObject( _submission){
  
    let mongo = new Leetcode({
       name: _submission.name,
       runtime: _submission.runtime,
       status: _submission.status,
       language: _submission.language,
       url: _submission.url
    })
    DoesExist(_submission.name)
      .then((data) =>{
        if(data){
          MongoSave(mongo, _submission.name)
        }
      })
  
}

async function MongoSave(mongo, _name) {
  mongo.save().then(() => 
  console.log("save success " + _name)) 
}

module.exports = {CreateMongoObject}