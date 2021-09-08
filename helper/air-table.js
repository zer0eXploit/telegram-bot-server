const Airtable = require("airtable");

const apiKey = process.env.AIR_TABLE_API_KEY;
const base = new Airtable({ apiKey }).base("appRCF5ZGpwgJVzd6");

/**
 * @desc    Search for a user by username inside airtable view.
 * @param   {String} username - The username required to filter.
 * @return  {Array} Record found that is found or empty array if not.
 */
const userExists = async (username) => {
  const filterByFormula = `{username} = '${username}'`;
  const records = await base("AllowedUsers")
    .select({ filterByFormula })
    .firstPage();
  return records;
};

module.exports = userExists;
