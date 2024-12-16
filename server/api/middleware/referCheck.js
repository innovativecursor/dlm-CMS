const allowedOrigins = [
  "https://admin.DLM Realty and Construction Corpcostprestige.com",
  "https://www.admin.DLM Realty and Construction Corpcostprestige.com",
];

const refererCheck = (req, res, next) => {
  const referer = req.headers.referer;
  const origin = req.headers.origin;

  if (referer || origin) {
    const refererOrigin = referer ? new URL(referer).origin : null;
    const requestOrigin = origin || refererOrigin;

    if (allowedOrigins.includes(requestOrigin)) {
      return next();
    }
  }

  return res.status(403).json({ message: "Forbidden" });
};

module.exports = refererCheck;
