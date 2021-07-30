const express = require('express');
const config = require('config');
const path = require('path');
const mongoose = require('mongoose');
const wsAuth = require('./middleware/websocket-auth.middleware');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
app.io = io;

app.use(express.json({ extended: true }));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/poll', require('./routes/poll.routes'));

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}


const PORT = config.get('port') || 5000;

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    io.use(wsAuth);

    io.on('connection', function(socket) {
      console.log(`A user ${socket.handshake.headers.user.userId} connected.`);

      socket.on('disconnect', function () {
        console.log('A user disconnected');
      });
    });

    server.listen(PORT, () => console.log(`App has been started on port ${PORT}...`));
  } catch (e) {
    console.log('Server Error', e);
    process.exit(1);
  }
}

start();