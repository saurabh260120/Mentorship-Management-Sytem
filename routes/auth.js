const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser');
const store = require("store2");

router.use(express.json());
router.use(express.urlencoded());
router.use(cookieParser());


require("../db/connection");
const MentorRegis = require("../models/mentor_reg_schema");
const MenteeRegis = require("../models/mentee_reg_schema");
const adminRegis = require("../models/admin_reg_schema");
const mentormenteemsg = require("../models/messege.js");
const mentorCounter = require("../models/counterschema");
const menteeCounter = require("../models/counterschema4mentee");

// registration part start here
router.get('/registration', (req, res) => {
      res.status(200).render('registration.pug');
})
router.post('/mentor-registration', async (req, res) => {
      try {

            const hashedPassword = await bcrypt.hash(req.body.mentorpassword, 10);
            const regmentor = new MentorRegis({
                  mentorname: req.body.mentorname,
                  mentoremail: req.body.mentoremail,
                  mentorgender: req.body.mentorgender,
                  mentorphone: req.body.mentormobile,
                  mentorpassingyear: req.body.mentor_passing_year,
                  mentorpassword: hashedPassword,
                  mentordepartment: req.body.mentordepartment,
                  mentorlanguage: req.body.mentorlanguage,
                  mentorcompany: req.body.mentorcompany
            })
            await regmentor.save();
            res.status(201).render("registration_msg.pug");
      } catch (error) {
            console.log(error)
            res.status(400).send(error);
      }
})


router.post('/mentee-registration', async (req, res) => {
      try {
            const hashedPassword = await bcrypt.hash(req.body.menteepassword, 10);
            const regmentee = new MenteeRegis({
                  menteename: req.body.menteename,
                  menteeemail: req.body.menteeemail,
                  menteegender: req.body.menteegender,
                  menteephone: req.body.menteemobile,
                  menteepassword: hashedPassword,
                  menteedepartment: req.body.menteedepartment,
                  menteelanguage: req.body.menteelanguage,
                  menteesemester: req.body.menteesemester
            })
            await regmentee.save();
            res.status(201).render("registration_msg.pug");
      } catch (error) {
            console.log(error)
            res.status(400).send(error);
      }
})

router.post('/admin-registration', async (req, res) => {
      try {
            const hashedPassword = await bcrypt.hash(req.body.adminpassword, 10);
            const regadmin = new adminRegis({
                  adminname: req.body.adminname,
                  adminemail: req.body.adminemail,
                  adminpassword: hashedPassword
            })
            await regadmin.save();
            res.status(201).render("registration_msg.pug");
      } catch (error) {
            console.log(error)
            res.status(400).send(error);
      }
})
// registration part end here

// login part start here
router.get('/login', (req, res) => {
      try {
            const token = req.cookies.jwt;
            try {
                  const user = jwt.verify(token, process.env.SECRET_KEY);
                  if (user.user == 'mentor') {
                        res.redirect('/mentor');
                  } else if (user.user == 'mentee') {
                        res.redirect('/mentee');
                  } else if (user.user == 'admin') {
                        res.redirect('/admin');
                  } else {
                        return res.status(200).render('login.pug');
                  }
            } catch (error) {
                  res.status(200).render('login.pug');
            }
      } catch (error) {
            res.status(200).render('login.pug');
            console.log(error);
      }
})

router.post('/admin-login', async (req, res) => {
      try {
            const email = req.body.log_adminemail;
            const password = req.body.log_adminpassword;
            const userdata = await adminRegis.findOne({ adminemail: email });
            if (email != "saurabh18187@gmail.com") {
                  res.render('invalidadmin.pug');
                  return res.status(400);
            }
            let isMatch = await bcrypt.compare(password, userdata.adminpassword);

            if (isMatch) {
                  const token = await jwt.sign({ emailToStore: userdata.adminemail, user: "admin" }, process.env.SECRET_KEY, { expiresIn: 10000 });

                  res.cookie('jwt', token, {
                        expires: new Date(Date.now() + 300000), httpOnIy: true
                  });

                  res.status(201).redirect("/admin");
            }
            else {
                  res.status(400).send("INVALID USER");
            }
      } catch (error) {
            res.status(400).send(error);
            console.log(error);
      }
})



router.post('/mentor-login', async (req, res) => {
      try {
            const email = req.body.login_mentoremail;
            const password = req.body.login_mentorpassword;

            mentor = await MentorRegis.findOne({ mentoremail: email });
            if (mentor === null) {
                  res.render('invalid.pug');
                  return res.status(400);
            }
            let isMatch = await bcrypt.compare(password, mentor.mentorpassword);

            if (isMatch) {
                  const token = await jwt.sign({ emailToStore: mentor.mentoremail, user: "mentor" }, process.env.SECRET_KEY, { expiresIn: 360000 });

                  res.cookie('jwt', token, {
                        expires: new Date(Date.now() + 300000), httpOnIy: true
                  });

                  res.redirect('/mentor');
            }
            else {
                  res.send("INVALID CREDENTIAL");
            }
      } catch (error) {
            res.status(400).send(error);
      }
})

router.get('/logout', async(req, res) => {

      res.clearCookie("jwt");
      res.status(200).render('index.pug');
})

router.get('/mentorlogout', (req, res) => {

      res.clearCookie("jwt");
      res.status(200).render('index.pug');
})
router.get('/menteelogout', (req, res) => {

      res.clearCookie("jwt");
      res.status(200).render('index.pug');
})


router.post('/mentee-login', async (req, res) => {
      try {
            const email = req.body.login_menteeemail;
            const password = req.body.login_menteepassword;
            mentee = await MenteeRegis.findOne({ menteeemail: email });

            if (mentee === null) {
                  res.render('invalid.pug');
                  return res.status(400);
            }
            let isMatch = await bcrypt.compare(password, mentee.menteepassword);
            if (isMatch) {
                  const token = await jwt.sign({ emailToStore: mentee.menteeemail, user: "mentee" }, process.env.SECRET_KEY, { expiresIn: 360000 });

                  res.cookie('jwt', token, {
                        expires: new Date(Date.now() + 300000), httpOnIy: true
                  });
                  res.redirect('/mentee');
            }
            else {
                  console.log("error in /mentee-login");
                  res.render('invalid.pug');
            }

      } catch (error) {
            res.status(400).send(error);
      }
})

// login part ends here

module.exports = router