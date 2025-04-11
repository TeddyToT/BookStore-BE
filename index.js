const app = require("./src/app")

const PORT = process.env.PORT || 8000

const server = app.listen(PORT, () => {
  console.log(`Server is running on server ${PORT}`)
})

process.on('SIGINT', () => {
  server.close(() => {
      console.log('Exit Server Express')
      process.exit(0)
  })
})