const Careers = require("../models/careers");
const Joi = require("joi");

// Validation Schema using Joi
const jobOpeningSchema = Joi.object({
  jobOpenings: Joi.array()
    .items(
      Joi.object({
        site: Joi.string().required().messages({
          "string.empty": "Site location cannot be empty.",
          "any.required": "Site location is required.",
        }),
        workers: Joi.array()
          .items(
            Joi.object({
              designation: Joi.string().required().messages({
                "string.empty": "Designation cannot be empty.",
                "any.required": "Designation is required.",
              }),
              count: Joi.number().integer().min(1).required().messages({
                "number.base": "Count must be a number.",
                "number.min": "Number of workers must be at least 1.",
                "any.required": "Worker count is required.",
              }),
            })
          )
          .min(1)
          .required()
          .messages({
            "array.min": "At least one worker must be added.",
            "any.required": "Workers list is required.",
          }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one job opening is required.",
      "any.required": "Job openings field is required.",
    }),
  contactDetails1: Joi.string().required().messages({
    "string.empty": "Contact 1 cannot be empty.",
    "any.required": "Contact 1 is required.",
  }),
  contactDetails2: Joi.string().required().messages({
    "string.empty": "Contact 2 cannot be empty.",
    "any.required": "Contact 2 is required.",
  }),
});

const CareersController = {
  // Fetch all career entries
  async getAllCareers(req, res) {
    try {
      const careers = await Careers.findAll();
      return res.status(200).json({ success: true, data: careers });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Server error", error });
    }
  },

  // Add new career entry
  async createCareer(req, res) {
    const { jobOpenings } = req.body;

    // if (error) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: error.details[0].message });
    // }

    try {
      const newCareer = await Careers.create({
        jobOpenings: jobOpenings,
      });

      return res.status(201).json({
        success: true,
        message: "Job openings successfully created.",
        data: newCareer,
      });
    } catch (err) {
      console.log("err", err);
      return res
        .status(500)
        .json({ success: false, message: "Server error", error: err });
    }
  },

  // Update an existing career entry
  async updateCareer(req, res) {
    const { id } = req.params;
    const { jobOpenings } = req.body;

    // if (error) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: error.details[0].message });
    // }

    try {
      const career = await Careers.findByPk(id);

      if (!career) {
        return res
          .status(404)
          .json({ success: false, message: "Job openings not found." });
      }

      career.jobOpenings = jobOpenings;

      await career.save();

      return res.status(200).json({
        success: true,
        message: "Job openings successfully updated.",
        data: career,
      });
    } catch (err) {
      console.log("err", err);
      return res
        .status(500)
        .json({ success: false, message: "Server error", error: err });
    }
  },

  // Delete a career entry by ID
  async deleteCareer(req, res) {
    const { id } = req.params;

    try {
      const career = await Careers.findByPk(id);

      if (!career) {
        return res
          .status(404)
          .json({ success: false, message: "Job openings not found." });
      }

      await career.destroy();

      return res.status(200).json({
        success: true,
        message: "Job openings successfully deleted.",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Server error", error });
    }
  },
};

module.exports = CareersController;
