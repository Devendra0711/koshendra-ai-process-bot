const fs = require("fs");
const path = require("path");

const LOG_DIR = path.join(__dirname, "../../logs");

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function getTimestamp() {
  return new Date().toISOString();
}

function writeToFile(level, message, data = {}) {
  const logEntry = {
    timestamp: getTimestamp(),
    level,
    message,
    ...data,
  };

  const logFile = path.join(LOG_DIR, `${new Date().toISOString().split("T")[0]}.log`);
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + "\n");
}

function log(message, data = {}) {
  console.log(`[${getTimestamp()}] ${message}`, data);
  writeToFile("INFO", message, data);
}

function info(message, data = {}) {
  console.log(`ℹ️  [${getTimestamp()}] ${message}`, data);
  writeToFile("INFO", message, data);
}

function success(message, data = {}) {
  console.log(`✅ [${getTimestamp()}] ${message}`, data);
  writeToFile("SUCCESS", message, data);
}

function warn(message, data = {}) {
  console.log(`⚠️  [${getTimestamp()}] ${message}`, data);
  writeToFile("WARN", message, data);
}

function logError(error, context = {}) {
  const message = error.message || error;
  console.error(`❌ [${getTimestamp()}] Error: ${message}`, context);
  writeToFile("ERROR", message, { ...context, stack: error.stack });
}

module.exports = {
  log,
  info,
  success,
  warn,
  logError,
  LOG_DIR,
};
