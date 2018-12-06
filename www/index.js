#!/usr/bin/env node

const http = require('http')
const app = require('..')

const server = http.createServer(app)

server.listen(process.env.PORT || 3000, () => {
  const { address, port } = server.address()
  console.log(`listening on http://${address}:${port} ...`)
})
