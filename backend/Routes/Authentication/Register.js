const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { connectToMongoDB, closeMongoDBConnection } = require('../../Database/connectDB');
require('dotenv').config();

const saltRounds = 10;
const secretKey = process.env.SECRET_KEY;

const router = express.Router();

router.post("/signUp", async (req, res) => {
    const userData = {
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
    };

    const db = await connectToMongoDB();
    const col = db.collection("Students");

    const existingUser = await col.findOne({ email: userData.email });

    if (existingUser) {
      res.status(409).json({ message: "User already exists!" }).send();
    } else {
      const hashedPassword = bcrypt.hashSync(userData.password, saltRounds);
      userData.password = hashedPassword;

      const userDocument = {
        name: userData.name,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        password: hashedPassword,
      };

      const result = await col.insertOne(userDocument);
      if (result) {
        jwt.sign(userData, secretKey, { expiresIn: "1h" }, (err, token) => {
          if (err) {
            res.status(500).json({ message: "Error generating token" });
          } else {
            const response = {
              name: userData.name,
              email: userData.email,
            };
            res
              .status(200)
              .cookie("jwt", token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true, // Ensures the cookie is accessible only via HTTP(S) requests
                secure: true, // Ensures the cookie is sent only over HTTPS in production
              })
              .json(response);
          }
        });
      }
    }
});

module.exports = router;
