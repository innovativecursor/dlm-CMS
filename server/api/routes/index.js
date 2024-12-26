// routes/index.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const inquiryController = require("../controllers/inquiryController");
const projectController = require("../controllers/projectController");
const authenticateUser = require("../middleware/authenticateUser");
const careerController = require("../controllers/careerController");
const fontColorController = require("../controllers/fontColorController");
const { apiLimiter } = require("../middleware/apiLimiter");

// User routes
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/forgotPassword", userController.forgotPassword);
router.post("/resetPassword", userController.resetPassword);
router.get("/users", authenticateUser, userController.allUsers);

// Inquiry Routes
router.get(
  "/fetchInquiries",
  authenticateUser,
  inquiryController.fetchInquiries
);
router.post("/sendInquiry", apiLimiter, inquiryController.createInquiry);
router.delete(
  "/deleteInquiry/:id",
  authenticateUser,
  inquiryController.deleteInquiry
);
//Projects
router.get("/fetchMenuItems", projectController.getMenuOptions);
router.get("/fetchProjects", projectController.getProjects);
router.get("/getProjectsByMenuId", projectController.getProjectsByMenuId);
router.post(
  "/createProject",
  authenticateUser,
  projectController.createProject
);
router.put(
  "/updateProject/:id",
  authenticateUser,
  projectController.updateProject
);
router.delete(
  "/deleteProject/:id",
  authenticateUser,
  projectController.deleteProject
);
//Careers
router.get("/careers", careerController.getAllCareers);
router.post("/careers", authenticateUser, careerController.createCareer);
router.put("/careers/:id", authenticateUser, careerController.updateCareer);
router.delete("/careers/:id", authenticateUser, careerController.deleteCareer);
//Font and its Color
router.get("/getFontColor", authenticateUser, fontColorController.getFontColor);
router.put(
  "/updateFontColor/:font_name",
  authenticateUser,
  fontColorController.updateFontColor
);
module.exports = router;
