import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import './db';
import routes from './routes';

const app = express();
const port = 2005;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', routes)

app.set('port', port)

const server = app.listen(app.get('port'), function() {
  console.log(`Server started...\nListening at ${server.address().port}`)
});

export default app;
