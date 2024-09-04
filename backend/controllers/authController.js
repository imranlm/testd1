const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { saltRounds, secretKey } = require("../config");
const { Student, Instructor, Payment } = require("../model/dbModel");
const { connectToMongoDB } = require("../services/authService");

const signUp = async (req, res) => {
  const userData = {
    name: req.body.name,
    email: req.body.email,
    contact: req.body.phoneNumber,
    password: req.body.password,
  };


  try { 
    await connectToMongoDB();

    // Check if the email exists in the Student or Instructor collections
    const existingUser =
      (await Student.findOne({ email: userData.email })) ||
      (await Instructor.findOne({ email: userData.email }));

    if (existingUser) {
      return res.status(409).json({ message: "User already exists!" });
    }

    // Check if the email exists in the Payment collection
    const paymentRecord = await Payment.findOne({ email: userData.email });

    const hashedPassword = bcrypt.hashSync(userData.password, saltRounds);
    userData.password = hashedPassword;

    const user = new Student(userData); // Save user in Student model
    await user.save();

    // If a payment record exists, associate it with the new user
    if (paymentRecord) {
      await updateUserCoursesAndSimulators(user, paymentRecord);
    }

    const tokenPayload = {
      email: user.email,
      id: user._id,
      userType: "student",
    };

    jwt.sign(tokenPayload, secretKey, { expiresIn: "24h" }, (err, token) => {
      if (err) {
        return res.status(500).json({ message: "Error generating token" });
      }

      const response = {
        name: user.name,
        email: user.email,
        userType: "student",
      };

      res
        .status(200)
        .cookie("jwt", token, {
          expires: new Date(Date.now() + 604800000), // 7 days
   
          path: "/", // Available across the whole site
        })
        .cookie("userType", "student", {
          expires: new Date(Date.now() + 604800000), // 7 days
    
          path: "/", // Available across the whole site
        })
        .json(response);
    });
  } catch (error) {
    console.error("Error in signUp:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUserCoursesAndSimulators = async (user, payment) => {
  const {
    courseId: courseIdArray,
    courseName: courseNameArray,
    expiryDate: expiryDateArray,
  } = payment;

  for (let i = 0; i < courseIdArray.length; i++) {
    const courseId = courseIdArray[i].id;
    const courseName = courseNameArray[i].title;
    const courseType = courseNameArray[i].type; // Get the type (course or simulator)
    const expiryDate = expiryDateArray[i].date;

    if (courseType === "course") {
      const isCourseEnrolled = user.coursesEnrolled.some(
        (enrolledCourse) =>
          enrolledCourse.courseId.toString() === courseId.toString()
      );

      if (!isCourseEnrolled) {
        user.coursesEnrolled.push({
          courseId: courseId,
          manualCourseId: courseName,
          progress: 0,
          startDate: new Date(),
          endDate: expiryDate,
        });
      }
    } else if (courseType === "simulator") {
      const isSimulatorPurchased = user.simulatorsPurchased.some(
        (purchasedSimulator) =>
          purchasedSimulator.simulatorId.toString() === courseId.toString()
      );

      if (!isSimulatorPurchased) {
        user.simulatorsPurchased.push({
          simulatorId: courseId,
          manualSimulatorId: courseName,
          startDate: new Date(),
          endDate: expiryDate,
          modules: [],
        });
      }
    }
  }

  await user.save();
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    await connectToMongoDB();

    // Check if the user exists in the Student or Instructor collection
    let user = await Student.findOne({ email });
    let userType = "student"; // Assume student by default

    if (!user) {
      user = await Instructor.findOne({ email });
      if (user) {
        userType = "instructor"; // Update to instructor if found in Instructor collection
      }
    }

    if (!user) {
      // Check if the email exists in the Payment collection
      const paymentRecord = await Payment.findOne({ email });
      if (paymentRecord) {
        return res
          .status(403)
          .json({ message: "Please complete your registration." });
      }

      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const tokenPayload = {
      email: user.email,
      id: user._id,
      userType: userType, // Include userType in the token payload
    };

    jwt.sign(tokenPayload, secretKey, { expiresIn: "24h" }, (err, token) => {
      if (err) {
        return res.status(500).json({ message: "Error generating token" });
      }

      res
        .status(200)
        .cookie("jwt", token, {
          expires: new Date(Date.now() + 604800000),
          path: "/",
        })
        .cookie("userType", userType, {
          expires: new Date(Date.now() + 604800000),
          path: "/",
        })
        .json({ email: user.email, name: user.name, userType: userType });
    });
  } catch (error) {
    console.error("Error in signIn:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  await res.clearCookie("jwt");
  res.status(200).send({ message: "Logged out successfully" });
};

module.exports = {
  signUp,
  signIn,
  logout,
};
