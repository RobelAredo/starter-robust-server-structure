const counts = require("../data/counts-data");

const list = (req, res) => {
  res.json({ data: counts });
}

const findId = (req, res, next) => {
  const { countId } = req.params;
  const foundCount = counts[countId];
  res.json({ data: foundCount });
}

const validId = (req, res, next) => {
  const { countId } = req.params;
  const foundCount = counts[countId];
  if (foundCount === undefined) next ({ status: 404, message: `Count id not found: ${countId}` });
  next();
}

module.exports = {
  list,
  read: [validId, findId],
}