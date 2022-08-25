// Import express and the file containing our route definitions
const express = require("express");
const app = express();
const routes = require("./src/routes");

// Import Twilio and initialize the client.
// IMPORTANT: Remember to set environment variables for your Account SID and Auth Token.
const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client2 = twilio(accountSid, authToken);

// Configure the express application
const port = 3003;
app.use(express.urlencoded({ extended: false }));
app.use("/", routes);

// Start the server
app.listen(port, () => {
  /*
  This is an example of string interpolation via Template Literals.
  This is an easier way of building strings than we've seen in the JS Test Lab. Read more: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
  */
  console.log(`Your Express application is running on port ${port}`);
});


//Twitch bot stuff starts here

const tmi = require('tmi.js'), {
  channel, username, password} = {
    "channel": process.env.TWITCH_CHANNEL,
    "username": process.env.TWITCH_BOT_NAME,
    "password": process.env.TWITCH_BOT_OAUTH
  };

const options = {
  options: {debug: true},
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username,
    password
  },
  channels: [channel]
};

const client = new tmi.Client(options);
client.connect().catch(console.error);

client.on('connected', () => {
  client.say(channel, "Your friendly neighborhood GALEXY BOT, reporting for duty!")
});


var x = false;  //temp setting until i get to use json stuff
var y = "nobody";


client.on('message', (channel, user, message, self) => {
  if (self) return;
  let cmdArgs = message.split(" ");
  let cmd = cmdArgs[0];
  
  //first command that wouldn't work at first and shows my frustration (without the usual profanity)
  if (cmd == "!usuck") {
    client.say(channel, `No, you suck @${user.username}!`);
  };
  
  //proof of concept on how to manipulate input, WILL BE DELETING, this command structure can get super annoying
  if(cmd == "!nomo"){x=false;client.say(channel, "That was fun @"+user.username+" let's do it again some time.")};
  if(user.username==y&&x){client.say(channel, message)};
  if(cmd == "!mimic"){x=true;y=user.username;client.say(channel, "Now I'mma copy you @"+user.username)};
  
  //command without prefix
  if(cmd == "bish"){
    client.say(channel, "What did you call me?")
  };
  
  //banned word reprocussions
  if(message.includes("nigg")){
    client.say(channel, "/timeout "+user.username+" 666");
    client.say(channel, "Please watch what you say in this chat "+user.username)
  };

});