// routes/index.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const propertyController = require("../controllers/propertyController");
const inquiryController = require("../controllers/inquiryController");
const projectController = require("../controllers/projectController");
const authenticateUser = require("../middleware/authenticateUser");
const { apiLimiter } = require("../middleware/apiLimiter");

// User routes
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/forgotPassword", userController.forgotPassword);
router.post("/resetPassword", userController.resetPassword);
router.get("/users", authenticateUser, userController.allUsers);

//For Selectable Options
router.get("/stationOptions", propertyController.getStationOptions);
// Property routes
router.get("/properties", propertyController.getProperties);
router.post(
  "/createProperty",
  authenticateUser,
  propertyController.createProperty
);
router.put(
  "/property/:id",
  authenticateUser,
  propertyController.updateProperty
);
router.delete(
  "/property/:id",
  authenticateUser,
  propertyController.deleteProperty
);
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
  "/createAmenity",
  authenticateUser,
  projectController.createProject
);
router.put(
  "/updateAmenity/:id",
  authenticateUser,
  projectController.updateProject
);
router.delete(
  "/deleteAmenity/:id",
  authenticateUser,
  projectController.deleteProject
);

module.exports = router;
