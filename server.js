const express = require('express')
const next = require('next')
const WebSocket = require('ws')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()
  const http = require('http').createServer(server)
  const io = require('socket.io')(http)

  // Manage Socket.io connections
  io.on('connection', (socket) => {
    // Get current user's socket id
    // This is important in order to subscribe to different products/currencies on each tab/browser per user
    const socketId = socket.id
    socket.join(socketId)

    // Create subscription to COINBASE
    // !IMPORTNAT: DIDN'T USE "coinbase/coinbase-pro-node" because is archived a not maintained
    const wsClient = new WebSocket('wss://ws-feed.pro.coinbase.com')

    // Manage WebSocket erros
    wsClient.on('error', (err) => {
      console.log('Error: connection to WS COINBASE', err)

      // Update cient subscription status
      io.to(socketId).emit('subscription_update', false)
    })

    // Subscribe to default channel on open
    wsClient.on('open', () => {
      wsClient.send(
        JSON.stringify({
          type: 'subscribe',
          product_ids: ['BTC-USD'], // 'ETH-USD', 'XRP-USD', 'LTC-USD'
          channels: ['matches', 'level2']
        })
      )

      // Update cient subscription status
      io.to(socketId).emit('subscription_update', true)
    })

    // Handle on close websocket
    wsClient.on('close', () => {
      // Update cient subscription status
      io.to(socketId).emit('subscription_update', false)
    })

    // Emit data to the client on data received from "COINBASE"
    wsClient.on('message', (msg) => {
      try {
        const objMsg = JSON.parse(msg)
        // console.log('-> msg obj: ', objMsg)

        // Emit event to the client, could be: match, level2
        io.to(socketId).emit(objMsg.type, objMsg)
        // io.emit(objMsg.type, objMsg)
      } catch (errJ) {
        console.log('Error: parsing JSON', errJ)
      }
    })

    /**
     * [Liten to socket to change the currency id subscription from "COINBASE"]
     *
     * @param   {[String]}  currency_change  ['currency_change']
     * @param   {[String]}  data             [New currency name to subscribe to "COINBASE"]
     *
     */
    socket.on('currency_change', (data) => {
      if (wsClient.readyState === WebSocket.OPEN) {
        // Unsubscribe for all channels from "COINBASE"
        wsClient.send(
          JSON.stringify({
            type: 'unsubscribe',
            channels: ['matches', 'level2']
          })
        )

        // Subscribe to new currency
        wsClient.send(
          JSON.stringify({
            type: 'subscribe',
            product_ids: [data], // 'ETH-USD', 'XRP-USD', 'LTC-USD'
            channels: ['matches', 'level2']
          })
        )
      }
    })

    socket.on('disconnect', () => {
      // Close websocket connection
      if (wsClient.readyState === WebSocket.OPEN) {
        wsClient.close()
      }
    })
    // console.log('a user connected')
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  http.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
