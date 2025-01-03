const FontColor = require("../models/fontcolor");
const Joi = require("joi");
exports.getFontColor = async (req, res) => {
  try {
    const fontColor = await FontColor.findOne();
    if (fontColor) {
      res.status(200).json(fontColor);
    }
  } catch (error) {
    console.error("Error fetching font color:", error);
    res.status(500).json({ error: "Failed to fetch font color." });
  }
};
exports.updateFontColor = async (req, res) => {
  const {
    font_name,
    navTextColor,
    navIconsColor,
    heroMainTextColor,
    heroSubTextColor,
    universalButtonColor,
    universalSelectorTextColor,
    universalHeadingTextColor,
    universalContentTextColor,
  } = req.body; // Use req.body for the request payload instead of req.params.

  try {
    const [fontColor, created] = await FontColor.findOrCreate({
      where: { pack_id: 1 }, // Assuming only one record is needed
      defaults: { font_name: "Work Sans" },
    });

    if (!created) {
      // Update only the fields that are provided and changed
      const updates = {};
      if (font_name && font_name !== fontColor.font_name)
        updates.font_name = font_name;
      if (navTextColor && navTextColor !== fontColor.navTextColor)
        updates.navTextColor = navTextColor;
      if (navIconsColor && navIconsColor !== fontColor.navIconsColor)
        updates.navIconsColor = navIconsColor;
      if (
        heroMainTextColor &&
        heroMainTextColor !== fontColor.heroMainTextColor
      )
        updates.heroMainTextColor = heroMainTextColor;
      if (heroSubTextColor && heroSubTextColor !== fontColor.heroSubTextColor)
        updates.heroSubTextColor = heroSubTextColor;
      if (
        universalButtonColor &&
        universalButtonColor !== fontColor.universalButtonColor
      )
        updates.universalButtonColor = universalButtonColor;
      if (
        universalSelectorTextColor &&
        universalSelectorTextColor !== fontColor.universalSelectorTextColor
      )
        updates.universalSelectorTextColor = universalSelectorTextColor;
      if (
        universalHeadingTextColor &&
        universalHeadingTextColor !== fontColor.universalHeadingTextColor
      )
        updates.universalHeadingTextColor = universalHeadingTextColor;
      if (
        universalContentTextColor &&
        universalContentTextColor !== fontColor.universalContentTextColor
      )
        updates.universalContentTextColor = universalContentTextColor;

      // Apply the updates only if there are changes
      if (Object.keys(updates).length > 0) {
        await fontColor.update(updates);
      }
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
