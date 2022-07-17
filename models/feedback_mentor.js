// admin section
const mongoose= require("mongoose");

const feedbackmentorSchema =new mongoose.Schema({
    mentorid:{
        type: Number
    },
    mentoremail:{
        type: String
    },
    Feedback :{
      type: String
      
     // required: true
    },
    From: {
        type: String
    }
   
  });

  // now we need to create a collection
  const feedmentor= new mongoose.model("feedmentor",feedbackmentorSchema);
  module.exports=feedmentor;