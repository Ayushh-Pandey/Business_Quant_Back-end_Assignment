const cluster = require("node:cluster");
const os = require("node:os");
const express = require('express');
const compression = require('compression');
var cacheService = require("express-api-cache");
var cache = cacheService.cache;

const dotenv = require("dotenv");
dotenv.config();


const totalCPUs = os.cpus().length;
if (cluster.isPrimary) {
    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork();
    }
}
else {
    const app = express();
    const PORT = process.env.PORT;
    
    app.use(compression({
        level: 6
    }));
    const analysisRouter = require("./routes/analysisRoute")
    app.use("/Api",cache('10 minutes'), analysisRouter)
    app.listen(PORT, () => {
        console.log(`server is listening on http://localhost:${PORT}`)
    })
}