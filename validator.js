function validateQuestion(req, res, next) {
  const { question } = req.body;
  const errors = [];

  if (!question) {
    errors.push("Question is required");
  } else if (typeof question !== "string") {
    errors.push("Question must be a string");
  } else if (question.trim().length === 0) {
    errors.push("Question cannot be empty");
  } else if (question.length < 3) {
    errors.push("Question must be at least 3 characters long");
  } else if (question.length > 1000) {
    errors.push("Question must not exceed 1000 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors,
    });
  }

  // Sanitize question
  req.body.question = question.trim();
  next();
}

module.exports = { validateQuestion };
