const flips = require("../data/flips-data");
const counts = require("../data/counts-data");

const validId = (req, res, next) => {
  const { flipId } = req.params;
  const foundFlip = flips.find((flip) => flip.id === Number(flipId));
  if (!foundFlip) next({ status: 404, message: `Flip id not found: ${flipId}` });
  next();
}

const bodyHasResultProperty = (req, res, next) => {
  const { data: { result } = {} } = req.body;
  if (!result) return next({status: 400, message: "A 'result' property is required."});
  next();
}

const validResult = (req, res, next) => {
  const { data: { result } = {} } = req.body;
  const validResults = Object.keys(counts);
  if (!validResults.includes(result)) next({status: 400, message: `result must have one of these valid values: ${validResults.join(", ")}`});
  next();
}

let lastFlipId = flips.reduce((maxId, flip) => Math.max(maxId, flip.id), 0);
function create (req, res, next) {
  const { data: { result } = {} } = req.body;
  const newFlip = {
    id: ++lastFlipId,
    result,
  };
  flips.push(newFlip);
  counts[result] = counts[result] + 1;
  res.status(201).json({ data: newFlip });
}

function list(req, res) {
  res.json({ data: flips });
}

function findId(req, res, next) {
  const { flipId } = req.params;
  const foundFlip = flips.find((flip) => flip.id === Number(flipId));
  res.json({ data: foundFlip });
}

const update = (req, res) => {
  const { flipId } = req.params;
  const foundFlip = flips.find(flip => flip.id == Number(flipId));
  const originalResult = foundFlip.result;
  const { data: { result } = {} } = req.body;

  if (originalResult !== result) {
    foundFlip.result = result;
    counts[originalResult]--
    counts[result]++
  }

  res.json({ data: foundFlip });
}

const destroy = (req, res) => {
  const { flipId } = req.params;
  let deletedResultIndex = flips.findIndex(flip => flip.id === Number(flipId));
  const  { result }  = flips.splice(deletedResultIndex, 1)[0]
  console.log(result)
  counts[result]--;
  res.sendStatus(204)
}

module.exports = {
  list,
  read: [validId, findId],
  create: [bodyHasResultProperty, validResult, create],
  update: [validId, bodyHasResultProperty, validResult, update],
  delete: [validId, destroy]
};