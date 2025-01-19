const mqtt = require('mqtt');
const token = '33kj566-499c-4797-80a8-29557695ki71'; // Replace with actual token
const client = mqtt.connect('mqtt://localhost');

client.on('connect', () => {
  console.log('Voter connected to the system.');

  // Join the session
  const joinMessage = {
    voterId: 'voter55',
    token: token,
    status: 'joined',
  };
  client.publish(`session/${token}/voters`, JSON.stringify(joinMessage));
  console.log('Joined session:', token);

  // Subscribe to vote updates
  client.subscribe(`session/${token}/vote`, (err) => {
    if (!err) {
      console.log('Subscribed to vote updates.');
    }
  });
});

client.on('message', (topic, message) => {
  console.log(`Message received on ${topic}: ${message.toString()}`);

  // Vote response
  const voteResponse = {
    voterId: 'voter55',
    voteId: 'vote55',
    selectedOption: 'No', // Choose 'Yes' or 'No'
  };
  client.publish(`session/${token}/results`, JSON.stringify(voteResponse));
  console.log('Vote response sent:', voteResponse);
});
