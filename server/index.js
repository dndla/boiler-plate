const express = require('express')
const app = express()
const dotenv = require('dotenv');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const { User } = require('./models/Users')
const { auth } = require('./middleware/auth');

// lib config
dotenv.config();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

console.log('DB_ID');
console.log(process.env.DB_ID);

mongoose
  .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}`,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('db connecteed'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!~~ '))

app.get('/api/hello', (req, res) => res.send('Hello World!~~ '))
  

app.post('/api/users/register', (req, res) => {

  const user = new User(req.body)

  user.save((err, doc) => {
    if(err) return res.json({ success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})

app.post('/api/users/login', (req, res) => {

  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
    if(!isMatch)
      return res.json({ success : false, message : "비밀번호가 틀렸습니다." })

    user.generateToken((err, user) => {
      if(err) return res.status(400).send(err);

      res.cookie("x_auth", user.token)
        .status(200)
        .json({ success : true, userId: user._id})
    })
  })
  })
  
})

app.get('/api/users/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) => {

  User.findOneAndUpdate({ _id: req.user._id}, {token : ""}, (err, user)=>{
    if (err) return res.json({ success: false, err });

    return res.status(200).json({ success: true});
  })
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})