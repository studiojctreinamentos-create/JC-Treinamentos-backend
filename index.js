const express = require('express')
const cors = require('cors')
const path=require('path')

const app = express()
const port = 8000

const syncDatabase = require('./connection/sync');
const routes = require('./routes')
const publicRoute = require('./routes/public')

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json())
app.use('/api', routes)
app.use('/', publicRoute)

require('./jobs/scheduler');

async function startServer() {
    try {
      // Sincroniza o banco de dados
      await syncDatabase()
      
      // Inicia o servidor após a sincronização
      app.listen(port, () => {
        console.log("Servidor rodando")
      });
    } catch (error) {
      console.error('Erro ao iniciar o servidor:', error)
    }
  }

  startServer()