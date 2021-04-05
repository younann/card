const express = require("express");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3030;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/css',express.static(__dirname+'/css'))
app.use('/images',express.static(__dirname+'/images'))
app.use('/fonts',express.static(__dirname+'/fonts'))
app.use('/js',express.static(__dirname+'/js'))
app.use('/vendor',express.static(__dirname+'/vendor'))


//connect the db
mongoose.connect(
  "mongodb+srv://dbadmin:cardadmin@cluster0.qgnew.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

mongoose.connection.on("error", (err) => {
  console.error("error while connecting to db.....!!!!");
});

//data schema
const dataSchema = new mongoose.Schema({
  gender: String,
  firstName: String,
  middleName: String,
  lastName: String,
  birthDate: String,
  countrycode: Number,
  nationalNumber: Number,
  address: String,
  mobileNumber: Number,
  nameOnCard: String,
  email: String,
});


const userData = mongoose.model("userData", dataSchema);

//routing

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/thankyou", (req, res) => {
    res.sendFile(__dirname + "/thankpage.html");
  });
  
app.post("/", (req, res) => {
    let fullname=req.body.fullname;
    fullname=fullname.split(" ");
    let bdate = req.body.bdate;
    bdate = bdate.split("T");
    bdate = bdate.toString();

    let noc = req.body.nameoncard;

    let newUser = new userData({
      gender: req.body.gender,
      firstName: fullname[0],
      middleName: fullname[1],
      lastName: fullname[2],
      birthDate: bdate,
      countrycode: req.body.country,
      nationalNumber: req.body.nationalnumber,
      address: req.body.address,
      mobileNumber: req.body.phone,
      nameOnCard: noc.toUpperCase(),
      email: req.body.email,
    });
    
    userData.findOne({nationalNumber:req.body.nationalnumber},(err,existing)=>{
       if(existing){
        console.log('already here')
        }else{
            newUser.save();
            res.redirect('/thankyou')
        }
    })
});

app.listen(PORT, () => {
  console.log(`Server is listing on port:${PORT}....`);
});
