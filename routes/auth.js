const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_secret = "iamajayshuklatheownerofthissite";

const router = express.Router();
router.use(express.json());

//IMPORTING FILES AND CUSTOM MODULES
const User = require("../models/User");
const fetchData = require("../middleware/getUser");

//USER ROUTE 1
//Creating user using POST and validating using express validator
router.post(
  "/singUp",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("userName").isLength({ min: 4 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must contains at least 5 charectors").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //console.log(req.body);

    //If any validation brock
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      //Check if userName or Email already in use
      let user = await User.findOne({
        userName: req.body.userName
      });
      if (user) {
        return res.status(400).json({
          errors: "userName already taken",
        });
      }
      let mail = await User.findOne({
        email: req.body.email
      });
      if (mail) {
        return res.status(400).json({
          errors: "email already exist, please login to your account",
        });
      }
      
      //CREATE NEW USER
      //Securing Passwords of users
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        userName: req.body.userName,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_secret);
      // console.log(authToken);

      // res.json(user);
      res.json({ authToken });
    } catch (e) {
      console.error(errors.messege);
      res.status(500).json({ error: e });
    }
  }
);

//USER ROUTE 2
// Login user using POST and authenticating user
router.post(
  "/singIn",
  [
    body("userName", " invalid userName").isLength({ min: 4 }),
    body("password", "password cart be empty").isLength({
      min: 1,
    }),
  ],
  async (req, res) => {
    //If any validation brock
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // CHECKING IF USER EXIST
    const { userName, password } = req.body;

    try {
      const user = await User.findOne({ userName });
      if (!user) {
        return res.status(400).json({
          error:
            "unable to login, try again using current userName and password",
        });
      }
      const checkPass = await bcrypt.compare(password, user.password);
      // console.log(await bcrypt.compare(password, user.password));
      if (!checkPass) {
        console.log("userpass " + user.password + " " + "pass " + password);
        return res.status(400).json({
          error:
            "unable to login, try again using current userName and password",
        });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_secret);
      res.json({ authToken });
    } catch (e) {
      console.error(errors.messege);
      res.status(500).json({ error: e });
    }
  }
);

//USER ROUTE 3
// Getting user data
router.get("/getData", fetchData, async (req, res) => {
  //Middleware
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;

/** THINGS TO REMEMBER **/

//BCRYPT WILL HASH MY PASSWORDS AMD SALT ADD SOME EXTRA CHAR TO ENHANCE SECURITY OF PASSWORDS
// JWT WILL GIVE USERS A TOKEN SO USER WILL NOT HAVE TO LOGIN EVERY TIME WITH THE SAME DEVICE
