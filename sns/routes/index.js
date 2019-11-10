var express = require('express');
var router = express.Router();

//var passport = require("passport");
//var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

var mongoose = require("mongoose");
var db = mongoose.connect('mongodb+srv://admin:yourPassword@mongodb-uj5w8.mongodb.net/test?retryWrites=true&w=majority',                {useNewUrlParser: true, useUnifiedTopology: true});

var Schema = mongoose.Schema;
               
var Post = new Schema({
	author: String,
	picture: String,
	contents: String,
	date: Date,
	like: Number,
	comments: Array
});

var postModel = mongoose.model('Post',Post);

var check_user = function(req) {
  
  return true;
  /*
  var answer;
  if(req.session.passport === undefined || req.session.passport.user === undefined) {
    console.log('로그인이 필요함');
    return false;
  }
  else {
    return true;
  }
  */
};

//router.use(passport.initialize);
//router.use(passport.session());

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("##SRV: / ..")
  res.render('index', { title: 'SNS 예제', name: '비로그인 유저' , picture: '/images/user.png' });
  /*
  if(req.user) {
    var name = req.user.displayName;
    var picture = req.__json.image.url;
    res.render('index', { title: 'SNS 예제', name: name , picture: picture });
  }
  else {
    res.render('index', { title: 'SNS 예제', name: '비로그인 유저' , picture: '/images/user.png' });
  }  
  */
});

router.get('/login', function (req, res, next) {
  console.log("##SRV: /login ..")
  res.render('login')
});

router.get('/load', function (req, res, next) {
  console.log("##SRV: /load ..")
  postModel.find( {}, function(err, data){
    // console.log("## SRV\n" + JSON.stringify(data));
    res.json(data);
  });
});

router.post('/write', function (req, res, next) {
  console.log("##SRV: /write ..");

  var author = req.body.author;
  var contents = req.body.contents;
  var picture = req.body.picture;
  var date = Date.now();
  var post = new postModel();

  post.author = author;
  post.contents = contents;
  post.picture = picture;
  post.date = date;
  post.like = 0;
  post.comments = [] ;
  post.save(function(err) {
    if(err) {
      throw err;
    }
    else {
      res.json({status: "SUCCESS"})
    }
  });
});

router.post('/unlike', function (req, res, next) {
  console.log("##SRV: /unlike ..");
  var _id = req.body._id;

  postModel.findOne( {_id: _id}, function(err, post){
    if(err) {
      throw err;
    } else {
      post.like--;
      post.save(function(err) {
        if(err) {
          throw err;
        }
        else {
          res.json({status: "SUCCESS"})
        }      
      });  
    }
  });
});

router.post('/like', function (req, res, next) {
  console.log("##SRV: /like ..");
  var _id = req.body._id;

  postModel.findOne( {_id: _id}, function(err, post){
    if(err) {
      throw err;
    } else {
      post.like++;
      post.save(function(err) {
        if(err) {
          throw err;
        }
        else {
          res.json({status: "SUCCESS"})
        }      
      });  
    }
  });
});

router.post('/del', function (req, res, next) {
  var _id = req.body._id;

  console.log("##SRV: /del .." + req.body._id)
  if (check_user(req)) {
    postModel.deleteOne ({_id: _id},function(err){
      if(err) {
        console.log("##SRV: del err2 =" )
				var stack = new Error().stack
				console.log( stack )        
        throw err;
      } 
      else {
        console.log("##SRV: deleted id=" + _id)
        res.json({status: "SUCCESS"});
      }
    });
  }  
});

router.post('/modify', function (req, res, next) {
  console.log("##SRV: /modify ..");
  var _id = req.body._id;
  var contents = req.body.contents;

  postModel.findOne({_id: _id}, function (err,post) {
   
    if(err) {
      throw err;
    }
    else {
      post.contents = contents;
      post.save(function(err) {
        if(err){
          throw err;
        }
        else{
          res.json({status: "SUCCESS"});      
        }
      });
    }

  });

});

router.post('/comment', function (req, res, next) {
  console.log("##SRV: /comment ..");
  var _id = req.body._id;
  var author = req.body.author;
  var comment = req.body.comment;
  var date =  Date.now();

  postModel.findOne({_id: _id}, function (err,post) {
   
    if(err) {
      throw err;
    }
    else {
      post.comments.push({author: author, comment: comment, date: date});
      post.save(function(err) {  
        if(err){
          throw err;
        }
        else{
          res.json({status: "SUCCESS"});      
        }
      });
    }
  });  
});

router.get('/auth/google', function(req, res){
  console.log("##SRV: /auth/google ..");
	// req.logout(); // google oAuth
	//res.redirect('/');
});

router.get('/auth/google/callback', function(req, res){
  console.log("##SRV: /auth/google/callback ..")
	// req.logout(); // google oAuth
	//res.redirect('/');
});

router.get('/logout', function(req, res){
  console.log("##SRV: /logout ..")
	// req.logout(); // google oAuth
	//res.redirect('/');
});

module.exports = router;
