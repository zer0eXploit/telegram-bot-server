const Airtable = require("airtable");

const apiKey = process.env.AIR_TABLE_API_KEY;
const base = new Airtable({ apiKey }).base("appRCF5ZGpwgJVzd6");

/**
 * @desc    Checks if a user exists inside the air table view
 * @param   {string} username - The username required to check
 * @return  {boolean} If the user exists or not
 */
const userExists = async (username) => {
  const filterByFormula = `{username} = '${username}'`;
  const records = await base("AllowedUsers")
    .select({ filterByFormula })
    .firstPage();
  return !!records.length;
};

module.exports = userExists;
