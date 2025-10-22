const net = require('net');

// Config
const PORT = process.env.PORT || 5432; 
const REMOTE_HOST = 'db.cpyzwzhcvcjbboxparlh.supabase.co'; // Supabase IPv6
const REMOTE_PORT = 5432;

const server = net.createServer((clientSocket) => {
  console.log(`Nouvelle connexion depuis ${clientSocket.remoteAddress}:${clientSocket.remotePort}`);

  const remoteSocket = net.connect(REMOTE_PORT, REMOTE_HOST, () => {
    console.log('Connecté à Supabase');
  });

  clientSocket.on('data', (data) => remoteSocket.write(data));
  remoteSocket.on('data', (data) => clientSocket.write(data));

  clientSocket.on('close', () => {
    console.log('Client déconnecté');
    remoteSocket.end();
  });

  remoteSocket.on('close', () => {
    console.log('Connexion Supabase fermée');
    clientSocket.end();
  });

  clientSocket.on('error', (err) => {
    console.error('Erreur client :', err);
    remoteSocket.end();
  });

  remoteSocket.on('error', (err) => {
    console.error('Erreur Supabase :', err);
    clientSocket.end();
  });
});

server.listen(PORT, () => {
  console.log(`Proxy IPv4 → IPv6 lancé sur le port ${PORT}`);
});
