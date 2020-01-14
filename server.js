import express from 'express';
import './db';
const app = express();

const port = 2005;

app.set('port', port)

const server = app.listen(app.get('port'), function() {
  console.log(`Server started...\nListening at ${server.address().port}`)
})
