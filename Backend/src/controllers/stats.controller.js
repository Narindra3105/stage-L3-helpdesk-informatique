const statsModel = require('../models/stats.model');

const getDashboard = async (req, res) => {
  const data = await statsModel.getDashboard();
  res.json(data);
};

module.exports = { getDashboard };