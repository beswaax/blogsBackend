const http = require("http");
const app = require("./app");
const configs = require("./utils/configs");
const logger = require("./utils/logger");

const server = http.createServer(app);

server.listen(configs.PORT);
