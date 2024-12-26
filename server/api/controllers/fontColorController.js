const FontColor = require("../models/fontcolor");
const Joi = require("joi");
exports.getFontColor = async (req, res) => {
  try {
    const fontColor = await FontColor.findOne();
    if (fontColor) {
      res.status(200).json(fontColor);
    } else {
      // Return the default value if no record exists
      res.status(200).json({ font_name: "Work Sans" });
    }
  } catch (error) {
    console.error("Error fetching font color:", error);
    res.status(500).json({ error: "Failed to fetch font color." });
  }
};
exports.updateFontColor = async (req, res) => {
  const { font_name } = req.params;
  if (!font_name) {
    return res.status(400).json({ error: "Font name is required" });
  }

  try {
    const [fontColor, created] = await FontColor.findOrCreate({
      where: { pack_id: 1 }, // Assuming only one record is needed
      defaults: { font_name: "Work Sans" },
    });

    if (!created) {
      // Update the existing record
      fontColor.font_name = font_name;
      await fontColor.save();
    }

    res.status(200).json({
      message: created ? "Font color created" : "Font color updated",
      fontColor,
    });
  } catch (error) {
    console.error("Error updating font color:", error);
    res.status(500).json({ error: "Failed to update font color." });
  }
};
