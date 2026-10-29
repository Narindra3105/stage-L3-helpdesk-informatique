const statsModel = require('../models/stats.model');

const getDashboard = async (req, res) => {
  const data = await statsModel.getDashboard();
  res.json(data);
};
const getTechniciens = async (req, res) => {
  const data = await statsModel.getTechniciens();
  res.json(data);
};
const getRapportSla = async (req, res) => {
  const data = await statsModel.getRapportSla();
  res.json(data);
};
module.exports = { getDashboard, getTechniciens,getRapportSla};