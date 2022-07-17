// admin section
const mongoose= require("mongoose");



const adminregSchema =new mongoose.Schema({
    adminname:{
        type: String,
        //required:true
    },
    adminemail:{
        type: String,
        //required: true,
        unique:true
    },
    adminpassword :{
      type: String,
     // required: true
    }
   
  });

  
 
  // now we need to create a collection
  const adminreg= new mongoose.model("adminreg",adminregSchema);
  module.exports=adminreg;