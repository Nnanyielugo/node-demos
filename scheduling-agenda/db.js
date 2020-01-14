import { connect, connection, set } from 'mongoose';

const URI = 'mongodb://localhost:27017/rotation-demo';
connect(URI);
set('debug', true);
connection.on('connected', () => {
  console.log('Connected to', URI)
});
connection.on('error', error => {
  console.log('Connection error:', error)
});
connection.on('disconnected', error => {
  console.log('Disconnected from', URI)
})

require('./model');