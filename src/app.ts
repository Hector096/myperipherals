import express from "express";
import mongoose from "mongoose";
import session from "express-session"
import passport from 'passport'
import dotenv from 'dotenv'
import cookieParser  from "cookie-parser"

import mongo from "connect-mongo"
import {MONGODB_URI,SESSION_SECRET } from "./utils/secrets"
import bodyParser from "body-parser";
import compression from "compression"
import lusca from "lusca";



//Import Controllers
import * as homeController from  "./controllers/homeController"
import * as userController from  "./controllers/userController"

const MongoStore =  mongo(session);

dotenv.config();


//Initialize Express app
const app = express();

//Mongo Connection
const mongoUrl = MONGODB_URI!;
 mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true } ).then(
  () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
console.log("connected") },
).catch(err => {
  console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
  // process.exit();
});


//Express Config
app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));



// Session Store
const sessionStore = new MongoStore({ url: mongoUrl,autoReconnect:true });
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: SESSION_SECRET!,
  store: sessionStore,
  cookie:{
    maxAge: 1000 *60*60*24 
  }
}));

//PASSPORT CONFIG
app.use(passport.initialize());
app.use(passport.session());


//Routes
app.get('/',homeController.index)
app.get('/login',userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/register', userController.getSignup);
app.post('/register',userController.postSignup);




// app.use(lusca({
//   csrf: true,
//   xframe: 'SAMEORIGIN',
//   xssProtection: true,
//   nosniff: true
// }));
// app.use((req, res, next) => {
//   res.locals.user = req.user;
//   next();
// });
// app.use((req, res, next) => {
//   // After successful login, redirect back to the intended page
//   if (!req.user &&
//   req.path !== "/login" &&
//   req.path !== "/signup" &&
//   !req.path.match(/^\/auth/) &&
//   !req.path.match(/\./)) {
//       req.session.returnTo = req.path;
//   } else if (req.user &&
//   req.path == "/account") {
//       req.session.returnTo = req.path;
//   }
//   next();
// });
// app.use(
//   express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
// );



app.listen(5000, () => {
  console.log('Running on port 5000');
});
