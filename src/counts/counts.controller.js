const counts = require("../data/counts-data");

const list = (req, res) => {
  res.json({ data: counts });
}

const read = (req, res, next) => {
  const foundCount = res.locals.count;
  res.json({ data: foundCount });
}

const validId = (req, res, next) => {
  const { countId } = req.params;
  const foundCount = counts[countId];
  res.locals.count = foundCount;
  if (foundCount === undefined) next ({ status: 404, message: `Count id not found: ${countId}` });
  next();
}

module.exports = {
  list,
  read: [validId, read],
  validId,
}