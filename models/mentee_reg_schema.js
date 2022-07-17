//mentee section
const mongoose= require("mongoose");
const sequencingmentee = require("../models/counterschema4mentee");
const menteeregSchema =new mongoose.Schema({
  mentee_id: Number,
  menteename:{
      type: String,
      required:true
  },
  menteeemail:{
      type: String,
  },
  menteegender:{
      type: String,
      required: true
  },
  menteephone:{
      type: Number,
      required: true,
      unique:true
  },
  menteepassword :{
    type: String,
    required: true
  },
  menteedepartment :{
    type: String,
    required: true
  },
  menteelanguage :{
    type: String,
    required: true
  },
  menteesemester :{
    type: Number,
    required: true
  },
  assignedmentor :{
    type: Number,
    default: 0
  }
})

menteeregSchema.pre("save", function (next) {
  let doc = this;
  sequencingmentee.getSequenceNextValue("user_id").
  then(CounterMentee => {
      console.log("mentee counter:", CounterMentee);
      if(!CounterMentee) {
          sequencingmentee.insertCounter("user_id")
          .then(CounterMentee => {
              doc.mentee_id = CounterMentee;
              next();
          })
          .catch(error => next(error))
      } else {
          doc.mentee_id = CounterMentee;
          next();
      }
  })
  .catch(error => next(error))
});


// now we need to create a collection
const Menteereg= new mongoose.model("Menteereg",menteeregSchema);
module.exports=Menteereg;


