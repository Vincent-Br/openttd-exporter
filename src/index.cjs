const dotenv = require("dotenv").config();
const express = require("express");
const prom = require("prom-client");

const server = express();
const register = prom.register;
const metrics = require("./metrics.cjs");
const { registerEventHandlers } = require("./update.cjs");

prom.collectDefaultMetrics({ gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5] }); // Collect default metrics

server.get("/metrics", async (req, res) => {
    try {
        res.set("Content-Type", register.contentType);
        res.end(await register.metrics());
    } catch (ex) {
        res.status(500).end(ex);
    }
});

server.listen(process.env.EXPORTER_PORT || 3990, () => {
    console.log(
        `Server listening on port ${process.env.EXPORTER_PORT}, metrics exposed on /metrics endpoint`
    );
});

module.exports = {
    metrics,
};
