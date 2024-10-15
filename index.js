const express = require('express')
const path=require('path')

const app = express()
const port = 8000

const syncDatabase = require('./connection/sync')
const routes = require('./routes')
const publicRoute = require('./routes/public')

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json())
app.use('/api', routes)
app.use('/', publicRoute)

async function startServer() {
    try {
      // Sincroniza o banco de dados
      await syncDatabase()
      
      // Inicia o servidor após a sincronização
      app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`)
      });
    } catch (error) {
      console.error('Erro ao iniciar o servidor:', error)
    }
  }

  startServer()