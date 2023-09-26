import express from 'express'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
app.use(express.static(path.join(__dirname, '..', 'www' )))

const port = 3000
app.listen(port, () => console.log(`Listening on port ${port}!`))
