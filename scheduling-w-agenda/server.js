import express from 'express';
import bodyParser from 'body-parser';
import Agenda from 'agenda';
import logger from 'morgan';
import { URI } from './api/db';
import './api/db';
import routes from './api/routes';
import { switchActiveTeam } from './api/controller';

const app = express();
const port = 2005;
const agenda = new Agenda();
agenda.database(URI)
agenda.define('update active team on rotation', async (job, done) => {
  switchActiveTeam();
  if (done) done();
});

(async function() {
  await agenda.start();
  await agenda.every('5 minutes', 'update active team on rotation')
})();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', routes);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = '404';
  next(error);
});

app.use((err, req, res, next) =>{
  console.log(err.stack);
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

app.set('port', port)

const server = app.listen(app.get('port'), function() {
  console.log(`Server started...\nListening at ${server.address().port}`)
});

export default app;
