// express is used to reduce our work of serving files on requests.
//as previously we used to serve file with if else statements
// handles routing

const express=require("express");
const fs=require("fs");
const path= require("path");
const { allowedNodeEnvironmentFlags } = require("process");
const app= express();
const port = process.env.PORT || 80;

const store = require("store2");

require("./db/connection");
const MentorRegis= require("./models/mentor_reg_schema");
const MenteeRegis= require("./models/mentee_reg_schema");
const adminRegis= require("./models/admin_reg_schema");
const mentormenteemsg=require("./models/messege.js");
// const feedfrommentor=require("./models/feedback_mentor.js");
const mentorCounter=require("./models/counterschema");
const menteeCounter=require("./models/counterschema4mentee");


// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')) // For serving static files
//app.use(express.urlencoded())
app.use(express.urlencoded({ extended: true }))

// PUG SPECIFIC STUFF
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', path.join(__dirname, 'views')) // Set the views directory

app.use(express.json());

// ENDPOINTS
app.get('/', (req, res)=>{
      
      res.status(200).render('index.pug');
})

// registration part start here
app.get('/registration',  (req, res)=>{
      res.status(200).render('registration.pug');
})
app.post('/mentor-registration', async(req, res)=>{
      try{
            // console.log(req.body.mentorpassword);
         const regmentor= new MentorRegis({
            mentorname: req.body.mentorname,
            mentoremail: req.body.mentoremail,
            mentorgender: req.body.mentorgender,
            mentorphone: req.body.mentormobile,
            mentorpassingyear: req.body.mentor_passing_year,
            mentorpassword : req.body.mentorpassword,
            mentordepartment : req.body.mentordepartment,
            mentorlanguage : req.body.mentorlanguage,
            mentorcompany : req.body.mentorcompany
         })
      //    console.log(regmentor);
         await regmentor.save(); 
         res.status(201).redirect("/login");
      }catch(error){
            console.log(error)

            res.status(400).send(error);
      }
})


app.post('/mentee-registration', async(req, res)=>{
      try{
            // console.log(req.body.mentorpassword);
         const regmentee= new MenteeRegis({
            menteename: req.body.menteename,
            menteeemail: req.body.menteeemail,
            menteegender: req.body.menteegender,
            menteephone: req.body.menteemobile,
            menteepassword : req.body.menteepassword,
            menteedepartment : req.body.menteedepartment,
            menteelanguage : req.body.menteelanguage,
            menteesemester : req.body.menteesemester
         })
      //    console.log(regmentor);
         await regmentee.save();
         res.status(201).redirect("/login");
      }catch(error){
            console.log(error)

            res.status(400).send(error);
      }
})

app.post('/admin-registration', async(req, res)=>{
      try{
            // console.log(req.body.mentorpassword);
         const regadmin= new adminRegis({
            adminname: req.body.adminname,
            adminemail: req.body.adminemail,
            adminpassword : req.body.adminpassword
         })
         await regadmin.save();
         res.status(201).redirect("/login");
      }catch(error){
            console.log(error)
res.status(400).send(error);
      }
})
// registration part end here



// login part start here
app.get('/login', (req, res)=>{

      res.status(200).render('login.pug');
})

app.post('/admin-login', async(req, res)=>{
      try{
            const email= req.body.log_adminemail;
            const password= req.body.log_adminpassword;
            const userdata = await adminRegis.findOne({adminemail:email});
            if(userdata.adminpassword===password){
                  store.set('key1', email);
                  res.status(201).redirect("/admin");
            }
            else
            {
                  res.status(400).send("password not matched");
            }

      }catch(error){
            res.status(400).send(error);
            console.log(error);
      }
})



app.post('/mentor-login', async(req, res)=>{
      try{  
            // let data = {
            //       mentor : {
      
            //       },
            //       mentee:{
      
            //       },
            //       messeged:{

            //       }
            // };
            const email= req.body.login_mentoremail;
            const password= req.body.login_mentorpassword;
            store.set('currentmentoremail', email);
            
            // data.mentor = await MentorRegis.findOne({mentoremail:email});

            mentor = await MentorRegis.findOne({mentoremail:email});

            // data.mentee = await MenteeRegis.findOne({assignedmentor:data.mentor.mentor_id});


            //console.log(data.mentor.mentorname);
            // const temp = await mentormenteemsg.find({mentorid:data.mentor.mentor_id,menteeid:data.mentee.mentee_id});
            // if(temp.length==0)
            // {  
            //       data.messeged.messege="No messege Yet";
            //       data.messeged.mentorid=0;
            //       data.messeged.menteeid=0;
            // }
            // else
            // {     
            //       data.messeged = await mentormenteemsg.find({mentorid:data.mentor.mentor_id,menteeid:data.mentee.mentee_id});
            // }

            //console.log(data.messeged);
             //console.log(data.messeged[0].messege);
            if(mentor.mentorpassword===password){
                  // res.status(200).render('mentor.pug',{
                  //       data:data
                  // });
                  res.redirect('/mentor');
            }
            else
            {
                  res.status(400).send("password not matched");
            }

      }catch(error){
            res.status(400).send(error);
            console.log(error);
      }
})

app.get('/mentorlogout', (req, res)=>{

      store.set('currentmentoremail', null);
      
      res.status(200).render('index.pug');
})
app.get('/menteelogout', (req, res)=>{

      store.set('currentmenteeemail', null);
      
      res.status(200).render('index.pug');
})


app.post('/mentee-login', async(req, res)=>{
      try{   
            // let data = {
            //       mentor : {
      
            //       },
            //       mentee:{
      
            //       },
            //       messeged:{

            //       }
            // };
            const email= req.body.login_menteeemail;
            const password= req.body.login_menteepassword;
            store.set('currentmenteeemail', email);
           

            mentee= await MenteeRegis.findOne({menteeemail:email});

            // data.mentee= await MenteeRegis.findOne({menteeemail:email});
            // data.mentor= await MentorRegis.findOne({assignedmentee:data.mentee.mentee_id});
            //console.log(data.mentor);
            // const temp = await mentormenteemsg.find({mentorid:data.mentor.mentor_id,menteeid:data.mentee.mentee_id});
            // if(temp.length==0)
            // {  
            //       data.messeged.messege="No messege Yet";
            //       data.messeged.mentorid=0;
            //       data.messeged.menteeid=0;
            // }
            // else
            // {     
            //       data.messeged = await mentormenteemsg.find({mentorid:data.mentor.mentor_id,menteeid:data.mentee.mentee_id});
            // }

            if(mentee.menteepassword===password)
            {
                  // res.status(200).render('mentee.pug',{
                  //       data:data
                  // });
                  res.redirect('/mentee');

            }
            else
            {
                  res.status(400).send("password not matched");
            }

      }catch(error){
            res.status(400).send(error);
            console.log(error);
      }
})


// login part ends here

// assingment of the mentor start here
app.post('/assignment', async (req,res)=>{
      try{   
            const assigned=req.body.map;
            const idmentor=req.body.id;


            await MentorRegis.updateOne({assignedmentee:assigned},
            { $set: {assignedmentee: 0 } }, function(err, res) 
            {
                  if (!err)
                  { }
                  else
                  console.log("error aa gaya");                  
            }).clone();

            // here we are taking the mentor 
            // then finding the mentee assigned to him if anyone is previously assigned to him
            //  
            const tempmentor = await MentorRegis.findOne({mentor_id:idmentor});
             const  assigned_mentee=tempmentor.assignedmentee;
            //console.log(assigned_mentee);
                  await MenteeRegis.updateOne({mentee_id:assigned_mentee},
                  { $set: {assignedmentor:0} }, function(err, res) 
                  {     
                        if (!err)
                        {  }
                        else
                        console.log("error aa gaya");                  
                  }).clone();
            

            await MentorRegis.updateOne({mentor_id:idmentor},
            { $set: {assignedmentee:assigned} }, function(err, res) 
            {
                  if (!err)
                  { }
                  else
                  console.log("error aa gaya");                  
            }).clone();

            await MenteeRegis.updateOne({mentee_id:assigned},
            { $set: {assignedmentor : idmentor} }, function(err, res) 
            {
                  if (!err)
                  { }
                  else
                  console.log("error aa gaya");                  
            }).clone();
            // const menteedata = await MenteeRegis.findOne({mentee_id:assigned});
            res.status(201).redirect("/admin");
      }
      catch(error){
            res.status(400).send(error);
            console.log(error);
      }
})

// assingment of the mentor start here

app.get('/mentee', async (req, res)=>{
     try {
      let data = {
            mentor : {

            },
            mentee:{

            },
            messeged:{

            }
      };
      if( (store('currentmenteeemail')==null) )
      {
            res.send("Login Again")
      }
      else
      {
      var email = (store('currentmenteeemail'));
      
      data.mentee= await MenteeRegis.findOne({menteeemail:email});
      data.mentor= await MentorRegis.findOne({assignedmentee:data.mentee.mentee_id});
      
      if(data.mentor==null)
      {
            res.send("Mentor Not Assigned To You"); 
      }
      else
      {
      const temp = await mentormenteemsg.find({mentorid:data.mentor.mentor_id,menteeid:data.mentee.mentee_id});
      if(temp.length==0)
      {  
            data.messeged.messege="No messege Yet";
            data.messeged.mentorid=0;
            data.messeged.menteeid=0;
      }
      else
      {     
            data.messeged = await mentormenteemsg.find({mentorid:data.mentor.mentor_id,menteeid:data.mentee.mentee_id});
      }
     
      res.status(200).render('mentee.pug',{
            data:data
      });
      }
}
     } catch (error) {
      res.status(400).send(error);
      console.log(error);
     }
    
      //res.status(200).render('mentee.pug');
})
app.get('/mentor', async (req, res)=>{
//console.log(store('key1'));
      try {
            let data = {
                  mentor : {
      
                  },
                  mentee:{
      
                  },
                  messeged:{

                  }
            };
            if((store('currentmentoremail')==null))
            {
                  res.send("Login Again");
            }
            else
            {
            var email = (store('currentmentoremail'));

            data.mentor = await MentorRegis.findOne({mentoremail:email});
            data.mentee = await MenteeRegis.findOne({assignedmentor:data.mentor.mentor_id});
            // console.log(data.mentee);
            if(data.mentee==null)
            {
                  res.send("Mentee Not Assigned To You");
            }
            else
            {
            const temp = await mentormenteemsg.find({mentorid:data.mentor.mentor_id,menteeid:data.mentee.mentee_id});
            if(temp.length==0)
            {  
                  data.messeged.messege="No messege Yet";
                  data.messeged.mentorid=0;
                  data.messeged.menteeid=0;
            }
            else
            {     
                  data.messeged = await mentormenteemsg.find({mentorid:data.mentor.mentor_id,menteeid:data.mentee.mentee_id});
            }

            res.status(200).render('mentor.pug',{
                  data:data
            });
            }
      }
      } catch (error) {
            res.status(400).send(error);
            console.log(error);
      }


      //res.status(200).render('mentor.pug');
})

app.get('/admin',  async (req, res)=>{

      // res.render(MentorRegis.find());
      let data = {
            mentor : {

            },
            mentee:{

            }
      };
      try {      
            //console.log(store('key1'));
            data.mentor = await MentorRegis.find();
            data.mentee = await MenteeRegis.find();
            res.render('admin.pug',{
                    data : data
            }); 
      } catch (error) {           
            console.log(error);              
      }
})



     
app.post('/sendmsgbymentor', async(req, res)=>{
      try{  
            const mentmsg= new mentormenteemsg({
                  mentorid: req.body.mentorid,
                  menteeid: req.body.menteeid,
                  messege : req.body.messege,
                  From: req.body.from,
                  To: req.body.to
               })
            await mentmsg.save();
            res.redirect('/mentor');
      }catch(error){
            res.status(400).send(error);
            console.log(error);
      }
})

app.post('/sendmsgbymentee', async(req, res)=>{
      try{  
            const mentmsg= new mentormenteemsg({
                  mentorid: req.body.mentorid,
                  menteeid: req.body.menteeid,
                  messege : req.body.messege,
                  From: req.body.from,
                  To: req.body.to
               })
            await mentmsg.save();
               res.redirect('/mentee');
      }catch(error){
            res.status(400).send(error);
            console.log(error);
      }
})


// app.get('/feedback-admin' , async (req,res)=>{
//       try{

//             res.render('adminfeedback.pug');
            
//       } catch (error) {
//             console.log(error);  
//       }

// });

// app.get('/feedback-mentor' , async (req,res)=>{
//       try{

//             res.render('mentor_feedback.pug');
            
//       } catch (error) {
//             console.log(error);  
//       }

// });
            
// app.post('/feedfrmmentor', async(req, res)=>{
//       try{  

//             var email= (store('currentmentoremail'));
//             const mentor = await MentorRegis.findOne({mentoremail:email});
//             const mentfeed= new feedfrommentor({
//                   mentorid: mentor.mentor_id,
//                   mentoremail: email,
//                   Feedback : req.body.messege,
//                   From: req.body.from
//                })
//             await mentfeed.save();
//             res.redirect('/feedback-mentor');
//             }catch(error){
//             res.status(400).send(error);
//             console.log(error);
//       }
// })
// app.post('/admintomentor', async(req, res)=>{
//       try{  

//             var email= (store('currentmentoremail'));
//             const mentor = await MentorRegis.findOne({mentoremail:email});
//             const mentfeed= new feedfrommentor({
//                   mentorid: mentor.mentor_id,
//                   mentoremail: email,
//                   Feedback : req.body.messege,
//                   From: req.body.from
//                })
//             await mentfeed.save();
//             res.redirect('/feedback-mentor');
//             }catch(error){
//             res.status(400).send(error);
//             console.log(error);
//       }
// })

// starting the server
app.listen(port,()=>{
    console.log(`the app started sucessfully on port ${port}`);
})
