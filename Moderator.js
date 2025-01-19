const mqtt = require('mqtt');
const uuid = require('uuid');

const client = mqtt.connect('mqtt://localhost');
const token = uuid.v4();
let voteResults = { Yes: 0, No: 0 }; // Initialize vote counts

client.on('connect', () => {
  console.log('The moderator is connected.');

  // Create session
  const sessionMessage = { token: token, moderatorId: 'mod1', status: 'session_created' };
  client.publish(`session/${token}/info`, JSON.stringify(sessionMessage));
  console.log(`Session created with token: ${token}`);

  // Create vote
  const voteMessage = { voteId: 'vote55', question: 'Do you agree with the proposal?', options: ['Yes', 'No'], status: 'open' };
  client.publish(`session/${token}/vote`, JSON.stringify(voteMessage));
  console.log('Vote created:', voteMessage);

  // Subscribe to results
  client.subscribe(`session/${token}/results`, (err) => { if (!err) { console.log('Subscribed to results.'); } });

  // Close vote after 2 minutes
  setTimeout(() => {
    const closeVoteMessage = { voteId: 'vote55', status: 'closed' };
    client.publish(`session/${token}/vote`, JSON.stringify(closeVoteMessage));
    console.log('Vote closed.');
  }, 120000);

  // Close session after 2 minutes and show results
  setTimeout(() => {
    const closeSessionMessage = { token: token, status: 'session_closed' };
    client.publish(`session/${token}/info`, JSON.stringify(closeSessionMessage));
    console.log('Session closed.');
    client.end();

    console.log('Final vote results:', voteResults);
  }, 140000);
});

client.on('message', (topic, message) => {
  const result = JSON.parse(message.toString());
  console.log(`Vote response received: ${JSON.stringify(result)}`);
  if (result.voteId === 'vote55') {
    if (result.selectedOption === 'Yes') {
      voteResults.Yes += 1;
    } else if (result.selectedOption === 'No') {
      voteResults.No += 1;
    }
  }
});

client.publish(`session/${token}/vote/results`, JSON.stringify(voteResults));
