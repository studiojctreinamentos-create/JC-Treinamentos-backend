const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT;

const syncDatabase = require("./connection/sync");
const routes = require("./routes");

app.use(cors());

app.use(express.json());
app.use("/api", routes);

require("./jobs/scheduler");

async function startServer() {
  try {
    await syncDatabase();

    app.listen(port, () => {
      console.log("Servidor rodando");
    });
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
  }
}

startServer();
