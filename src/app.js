const express = require("express");
const app = express();
const flipsRouter = require("./flips/flips.router");
const countsRouter = require("./counts/counts.router");

// TODO: Follow instructions in the checkpoint to implement ths API.

app.use(express.json());
app.use("/counts", countsRouter);
app.use("/flips", flipsRouter);

// Not found handler
app.use((request, response, next) => {
  next({ status: 404, message: `Not found: ${request.originalUrl}` });
});

// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  const { status = 500, message = "Something went wrong!" } = error;
  response.status(status).json({ error : message });
});

module.exports = app;
