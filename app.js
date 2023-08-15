require('dotenv').config()
const express = require("express");
const fs = require("fs");
const path = require("path");
const { allowedNodeEnvironmentFlags } = require("process");
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken")
const auth = require("./routes/auth")
const bcrypt = require('bcrypt');

// middleware
app.use("", auth);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());

const port = process.env.PORT || 80;

const store = require("store2");

require("./db/connection");
const MentorRegis = require("./models/mentor_reg_schema");
const MenteeRegis = require("./models/mentee_reg_schema");
const adminRegis = require("./models/admin_reg_schema");
const mentormenteemsg = require("./models/messege.js");
// const feedfrommentor=require("./models/feedback_mentor.js");
const mentorCounter = require("./models/counterschema");
const menteeCounter = require("./models/counterschema4mentee");


// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')) // For serving static files
//app.use(express.urlencoded())


// PUG SPECIFIC STUFF
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', path.join(__dirname, 'views')) // Set the views directory

app.use(express.json());


// ENDPOINTS
app.get('/', (req, res) => {
      res.status(200).render('index.pug');
})







// assingment of the mentor start here
app.post('/assignment', async (req, res) => {
      try {
            const assigned = req.body.map;
            const idmentor = req.body.id;

            await MentorRegis.updateOne({ assignedmentee: assigned },
                  { $set: { assignedmentee: 0 } }, function (err, res) {
                        if (!err) { }
                        else
                              console.log("error aa gaya");
                  }).clone();

            // here we are taking the mentor 
            // then finding the mentee assigned to him if anyone is previously assigned to him
            //  
            const tempmentor = await MentorRegis.findOne({ mentor_id: idmentor });
            const assigned_mentee = tempmentor.assignedmentee;

            await MenteeRegis.updateOne({ mentee_id: assigned_mentee },
                  { $set: { assignedmentor: 0 } }, function (err, res) {
                        if (!err) { }
                        else
                              console.log("error aa gaya");
                  }).clone();


            await MentorRegis.updateOne({ mentor_id: idmentor },
                  { $set: { assignedmentee: assigned } }, function (err, res) {
                        if (!err) { }
                        else
                              console.log("error aa gaya");
                  }).clone();

            await MenteeRegis.updateOne({ mentee_id: assigned },
                  { $set: { assignedmentor: idmentor } }, function (err, res) {
                        if (!err) { }
                        else
                              console.log("error aa gaya");
                  }).clone();
            // const menteedata = await MenteeRegis.findOne({mentee_id:assigned});
            res.status(201).redirect("/admin");
      }
      catch (error) {
            res.status(400).send(error);
            console.log(error);
      }
})

// assingment of the mentor start here

app.get('/mentee', async (req, res) => {
      try {
            let data = {
                  mentor: {

                  },
                  mentee: {

                  },
                  messeged: {

                  }
            };
            const token = req.cookies.jwt;
            try {
                  const user = jwt.verify(token, process.env.SECRET_KEY);
                  var email = user.emailToStore;
                  console.log(email);

                  data.mentee = await MenteeRegis.findOne({ menteeemail: email });
                  data.mentor = await MentorRegis.findOne({ assignedmentee: data.mentee.mentee_id });

                  if (data.mentor == null) {
                        res.render('notalloted.pug');
                  }
                  else {
                        const temp = await mentormenteemsg.find({ mentorid: data.mentor.mentor_id, menteeid: data.mentee.mentee_id });
                        if (temp.length == 0) {
                              data.messeged.messege = "No messege Yet";
                              data.messeged.mentorid = 0;
                              data.messeged.menteeid = 0;
                        }
                        else {
                              data.messeged = await mentormenteemsg.find({ mentorid: data.mentor.mentor_id, menteeid: data.mentee.mentee_id });
                        }

                        res.status(200).render('mentee.pug', {
                              data: data
                        });
                  }
            }catch(error){
                  res.redirect('/login');
            }
      } catch (error) {
            res.status(400).send(error);
            console.log(error);
      }

      //res.status(200).render('mentee.pug');
})
app.get('/mentor', async (req, res) => {
      try {
            let data = {
                  mentor: {

                  },
                  mentee: {

                  },
                  messeged: {

                  }
            };
            const token = req.cookies.jwt;
            try {
                  const user = jwt.verify(token, process.env.SECRET_KEY);
                  var email = user.emailToStore;
                  data.mentor = await MentorRegis.findOne({ mentoremail: email });
                  data.mentee = await MenteeRegis.findOne({ assignedmentor: data.mentor.mentor_id });
                  if (data.mentee == null) {
                        res.render('notalloted.pug');
                  }
                  else {
                        const temp = await mentormenteemsg.find({ mentorid: data.mentor.mentor_id, menteeid: data.mentee.mentee_id });
                        if (temp.length == 0) {
                              data.messeged.messege = "No messege Yet";
                              data.messeged.mentorid = 0;
                              data.messeged.menteeid = 0;
                        }
                        else {
                              data.messeged = await mentormenteemsg.find({ mentorid: data.mentor.mentor_id, menteeid: data.mentee.mentee_id });
                        }

                        res.status(200).render('mentor.pug', {
                              data: data
                        });
                  }
            } catch (error) {
                  res.redirect('/login');
            }
      } catch (error) {
            res.status(400).send(error);
            console.log(error);
      }

})

app.get('/admin', async (req, res) => {

      let data = {
            mentor: {

            },
            mentee: {

            }
      };
      const token = req.cookies.jwt;
      try {
            const user = jwt.verify(token, process.env.SECRET_KEY);
            if(user==null){
                  res.status(400).send("invalid user");
                  return res.status(400);
                 
            }
            data.mentor = await MentorRegis.find();
            data.mentee = await MenteeRegis.find();
            res.render('admin.pug', {
                  data: data
            });
      } catch (error) {
            console.log(error);
      }
})


app.post('/sendmsgbymentor', async (req, res) => {
      try {
            const mentmsg = new mentormenteemsg({
                  mentorid: req.body.mentorid,
                  menteeid: req.body.menteeid,
                  messege: req.body.messege,
                  From: req.body.from,
                  To: req.body.to
            })
            await mentmsg.save();
            res.redirect('/mentor');
      } catch (error) {
            res.status(400).send(error);
            console.log(error);
      }
})

app.post('/sendmsgbymentee', async (req, res) => {
      try {
            const mentmsg = new mentormenteemsg({
                  mentorid: req.body.mentorid,
                  menteeid: req.body.menteeid,
                  messege: req.body.messege,
                  From: req.body.from,
                  To: req.body.to
            })
            await mentmsg.save();
            res.redirect('/mentee');
      } catch (error) {
            res.status(400).send(error);
            console.log(error);
      }
})


// starting the server
app.listen(port, () => {
      console.log(`the app started sucessfully on port ${port}`);
})
