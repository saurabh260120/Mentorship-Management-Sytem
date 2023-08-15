const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xcx9puo.mongodb.net/atlasdatabase?retryWrites=true&w=majority`,
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