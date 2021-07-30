const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (socket, next) => {
  try {
    const { token } = socket.handshake.headers;

    if (!token) {
        const err = new Error('Not authorized');
        next(err);
    }

    const decoded = jwt.verify(token, config.get('jwtSecret'));
    socket.handshake.headers.user = decoded;
    next();

  } catch (e) {
    next(err);
  }
}