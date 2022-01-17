require('dotenv').config();
const url = process.env.CLIENT_URL;
const io = require('socket.io')({
  cors: {
    origin: url,
    methods: ['GET', 'POST'],
  },
}).listen(4000);
io.on('connection', (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);

  socket.on('send-message', ({ recipients, text }) => {
    recipients.forEach((recipient) => {
      const newRecipients = recipients.filter((r) => r !== recipient);
      newRecipients.push(id);
      socket.broadcast.to(recipient).emit('receive-message', {
        recipients: newRecipients,
        sender: id,
        text,
      });
    });
  });
});
