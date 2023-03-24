const { toError, sendResponse } = require("../utils");
const fs = require("fs/promises");
const path = require("path");

async function getUser(token, onResponse) {
  if (null != token && "" !== token && !/\//.test(token)) {
    const configPath = path.join(process.env.FUNHOUSE_USER_CONFIG_DIR, token);
    return JSON.parse(await fs.readFile(configPath, { encoding: "utf8" }));
  }

  throw new Error("Bad Token");
}

module.exports = async (req, res, next) => {
  try {
    const user = await getUser(req.headers["x-api-token"]);
    if (user) {
      req.hasAccess = n => user.access.includes("*") || user.access.includes(n);
      return next();
    }
  } catch (err) {
    sendResponse(res, 500, toError("unauthorized"));
  }
};
