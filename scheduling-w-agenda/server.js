import express from 'express';
import bodyParser from 'body-parser';
import Agenda from 'agenda';
import logger from 'morgan';
import { URI } from './db';
import './db';
import routes from './routes';
import { switchActiveTeam } from './controller';

const app = express();
const port = 2005;
const agenda = new Agenda();
agenda.database(URI)
agenda.define('update active team on rotation', async (job) => {
  // console.log('trigger rotation update', job)
  switchActiveTeam();
});

(async function() {
  await agenda.start();
  await agenda.every('30 seconds', 'update active team on rotation')
})()

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', routes)

app.set('port', port)

const server = app.listen(app.get('port'), function() {
  console.log(`Server started...\nListening at ${server.address().port}`)
});

export default app;
