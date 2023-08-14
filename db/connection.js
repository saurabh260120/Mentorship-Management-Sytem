const mongoose = require("mongoose");
//mongodb+srv://saurabhnitkcse:yfI5KruWOhTav7vS@cluster0.xcx9puo.mongodb.net/atlasdatabase?retryWrites=true&w=majority
// mongodb+srv://saurabhnitkcse:yfI5KruWOhTav7vS@cluster0.xcx9puo.mongodb.net/

mongoose.set("strictQuery", false);

mongoose.connect("mongodb+srv://saurabhnitkcse:yfI5KruWOhTav7vS@cluster0.xcx9puo.mongodb.net/atlasdatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(()=>{
      console.log('database connected');
  }).catch((e)=>{
      console.log(e);
  })
// mongoose.connect("mongodb://localhost:27017/dbms",
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   }).then(()=>{
//       console.log('database connected');
//   }).catch((e)=>{
//       console.log(e);
//   })