// mentor section
const mongoose= require("mongoose");
const sequencing = require("../models/counterschema");
const mentorregSchema =new mongoose.Schema({
  mentor_id: Number,
  mentorname:{
      type: String,
      required:true
  },
  mentoremail:{
      type: String,
      required: true
  },
  mentorgender:{
      type: String,
      required: true
  },
  mentorphone:{
      type: Number,
      required: true,
      unique:true
  },
  mentorpassingyear:{
    type: Number,
    required: true
  },
  mentorpassword :{
    type: String,
    required: true
  },
  mentordepartment :{
    type: String,
    required: true
  },
  mentorlanguage :{
    type: String,
    required: true
  },
  mentorcompany :{
    type: String,
    required: true
  },
  assignedmentee :{
    type: Number,
    default: 0
  }


})

mentorregSchema.pre("save", function (next) {
  let doc = this;
  sequencing.getSequenceNextValue("user_id").
  then(counter => {
      console.log("mentor counter:", counter);
      if(!counter) {
          sequencing.insertCounter("user_id")
          .then(counter => {
              doc.mentor_id = counter;
              next();
          })
          .catch(error => next(error))
      } else {
          doc.mentor_id = counter;
          next();
      }
  })
  .catch(error => next(error))
});

// now we need to create a collection
const Mentorreg= new mongoose.model("Mentorreg",mentorregSchema);
module.exports=Mentorreg;



