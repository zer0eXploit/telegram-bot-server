// @desc    Handles index route
// @route   GET /
// @access  Public
exports.homeController = (req, res) => {
  res.status(200).sendFile(`${process.cwd()}/views/index.html`);
};
