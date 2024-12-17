const Project = require("../models/Projects");
const Menu = require("../models/menu");
const cloudinary = require("../../utils/cloudinary");
const { formattedResult } = require("../utils/Consts");
const { Op, Sequelize } = require("sequelize");

exports.getMenuOptions = async (req, res) => {
  try {
    const menus = await Menu.findAll({
      attributes: ["menu_id", "menu_name"],
      // include: [
      //   {
      //     model: Project,
      //     as: "Projects", // Use the alias from the association
      //     attributes: ["project_name", "project_desc", "pictures"],
      //   },
      // ],
      order: [["menu_name", "ASC"]],
    });

    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch menus with projects",
      error: error.message,
    });
  }
};
exports.getProjectsByMenuId = async (req, res) => {
  try {
    const { menu_id } = req.query;

    //#region Returning Projects
    // Fetch aminities along with menu_name
    // const aminities = await Project.findAll({
    //   where: { menu_id },
    //   include: {
    //     model: Menu,
    //     attributes: ["menu_name", "menu_id"], // Fetch menu_name from Menu model
    //   },
    //   attributes: ["project_name", "project_desc", "pictures"], // Only fetch relevant project fields
    // });
    // const result = formattedResult(aminities);
    // res.status(200).json(result);
    //#endregion
    //#region Returing distinct Projects
    const distinctProjects = await Project.findAll({
      where: { menu_id },
      attributes: [
        [
          Sequelize.fn("DISTINCT", Sequelize.col("project_name")),
          "project_name",
        ],
      ],
    });

    res.status(200).json(distinctProjects);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch aminities", error: error.message });
  }
};
exports.getProjects = async (req, res) => {
  try {
    const findAll = await Project.findAll({
      include: {
        model: Menu,
        attributes: ["menu_name", "menu_id"], // Fetch menu_name from Menu model
      },
      attributes: [
        "project_id",
        "project_name",
        "onGoingProject",
        "project_desc",
        "pictures",
      ],
    });
    const result = formattedResult(findAll);
    res.status(200).json({ result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch Projects", error: error.message });
  }
};
exports.createProject = async (req, res) => {
  try {
    const { menu_name, project_name, project_desc, onGoingProject, pictures } =
      req.body;

    // Check if the menu already exists (case-insensitive)
    let menu = await Menu.findOne({
      where: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("menu_name")), // Convert column value to lowercase
        menu_name.toLowerCase() // Convert input to lowercase
      ),
    });

    // If menu doesn't exist, create a new menu
    if (!menu) {
      menu = await Menu.create({ menu_name });
    }

    // Create the new Project
    const newProject = await Project.create({
      project_name,
      onGoingProject,
      project_desc,
      pictures: [],
      menu_id: menu.menu_id, // Use the menu_id from the created/found menu
    });
    // Generate a unique folder name using the property ID
    const folderName = `${process.env.CLOUDINARY_DB}/Projects_${newProject.project_id}`;

    // Upload pictures to Cloudinary
    const uploadPromises = pictures?.map((base64Data) => {
      return cloudinary.uploader.upload(base64Data, {
        folder: folderName, // Specify the folder for uploaded images
      });
    });

    const uploadedImages = await Promise.all(uploadPromises || []);

    // Update the property with the uploaded images
    await newProject.update({ pictures: uploadedImages });
    res.status(201).json({
      message: "Project created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create Project",
      error: error.message,
    });
  }
};
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { menu_name, project_name, onGoingProject, project_desc, pictures } =
      req.body;

    // Find the existing Project by id
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if the menu_name exists or create a new one
    let menu = await Menu.findOne({
      where: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("menu_name")),
        menu_name.toLowerCase()
      ),
    });

    if (!menu) {
      menu = await Menu.create({ menu_name });
    }

    // Prepare folder for Cloudinary images
    const folderName = `${process.env.CLOUDINARY_DB}/Projects_${id}`;

    // Fetch existing Cloudinary images
    const cloudinaryFiles = await cloudinary.api.resources({
      type: "upload",
      prefix: folderName,
    });
    const cloudinaryPublicIds = cloudinaryFiles.resources.map(
      (file) => file.public_id
    );

    // Identify pictures to keep and delete
    const updatedPublicIds = pictures
      .map((pic) => pic.public_id)
      .filter(Boolean); // Keep only valid public_ids
    const deletePromises = cloudinaryPublicIds
      .filter((publicId) => !updatedPublicIds.includes(publicId))
      .map((publicId) => cloudinary.uploader.destroy(publicId));
    await Promise.all(deletePromises);

    // Upload new base64 images to Cloudinary
    const uploadPromises = pictures
      .filter((pic) => typeof pic === "string")
      .map((base64Data) =>
        cloudinary.uploader.upload(base64Data, { folder: folderName })
      );

    const uploadedImages = await Promise.all(uploadPromises);

    // Merge existing images with newly uploaded images
    const allImages = [
      ...pictures.filter((pic) => typeof pic !== "string"), // Existing images
      ...uploadedImages, // Newly uploaded images
    ];

    // Update the Project with new data
    project.menu_id = menu.menu_id; // Update menu_id based on menu_name
    project.project_name = project_name || project.project_name;
    project.onGoingProject = onGoingProject;
    project.project_desc = project_desc || project.project_desc;
    project.pictures = allImages;
    console.log("project", project);
    await project.save();

    deleteUnusedMenus();

    res.status(200).json({
      message: "Project updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update Project",
      error: error.message,
    });
  }
};
const deleteUnusedMenus = async () => {
  try {
    // Find all Menu IDs that have no associated Projects
    const unusedMenus = await Menu.findAll({
      include: [
        {
          model: Project,
          attributes: [], // No need to fetch Project data
          required: false, // LEFT JOIN: Include even if no Projects exist
        },
      ],
      where: {
        "$Projects.project_id$": { [Op.is]: null }, // Check where no Projects are associated
      },
    });

    // Extract unused Menu IDs
    const unusedMenuIds = unusedMenus.map((menu) => menu.menu_id);

    if (unusedMenuIds.length > 0) {
      // Delete unused Menu records
      await Menu.destroy({
        where: {
          menu_id: { [Op.in]: unusedMenuIds },
        },
      });
      console.log(`Deleted unused Menus: ${unusedMenuIds.join(", ")}`);
    } else {
      console.log("No unused Menus to delete.");
    }
  } catch (error) {
    console.error("Error deleting unused Menus:", error.message);
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the project by ID
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Extract the pictures array from the project
    const { pictures } = project;

    // If there are pictures, proceed with deleting them from Cloudinary
    if (pictures && pictures.length > 0) {
      const folderName = pictures[0]?.folder;

      // Delete all pictures associated with the project
      const deletePromises = pictures.map((picture) =>
        cloudinary.uploader.destroy(picture.public_id)
      );
      await Promise.all(deletePromises);

      // Check if there are any remaining files in the folder and delete them
      const filesInFolder = await cloudinary.api.resources({
        type: "upload",
        prefix: folderName,
      });

      const deleteFilePromises = filesInFolder.resources.map((file) =>
        cloudinary.uploader.destroy(file.public_id)
      );
      await Promise.all(deleteFilePromises);

      // Finally, delete the folder itself
      await cloudinary.api.delete_folder(folderName);
    }

    // Delete the project from the database
    await project.destroy();

    deleteUnusedMenus();

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete project", error: error.message });
  }
};
