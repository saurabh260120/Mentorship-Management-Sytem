// admin section
const mongoose= require("mongoose");

const stumentormsgSchema =new mongoose.Schema({
    mentorid:{
        type: Number
    },
    menteeid:{
        type: Number
    },
    messege :{
      type: String,
      
     // required: true
    },
    From:{
        type:String
    },
    To:{
        type:String
    }
   
  });

  // now we need to create a collection
  const msg= new mongoose.model("msg",stumentormsgSchema);
  module.exports=msg;