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

const fs = require('fs');
var botSets; renew_botSets();

const client = new tmi.Client(options);
client.connect().catch(console.error);

client.on('connected', () => {
  client.say(channel, "Your friendly neighborhood GALEXY BOT, reporting for duty!")
});

function renew_botSets(){
  let data = fs.readFileSync(`botSettings.json`);
  botSets = JSON.parse(data);
  console.log(botSets);
};
function save_botSets(){
  console.log(botSets);
  let data = JSON.stringify(botSets);
  fs.writeFileSync('botSettings.json', data);
};


var x = false;  //temp setting until i get to use json stuff
var y = "nobody";


client.on('message', (channel, user, message, self) => {
  if (self) return;
  let cmdArgs = message.split(" ");
  let cmd = cmdArgs[0];

  function replyt(replyt){
    client.say(channel, replyt)
  };

  //trying to figure out how to track raids
  console.log(message);
  
  //first command that wouldn't work at first and shows my frustration (without the usual profanity)
  if (cmd == "!usuck") {
    replyt(`No, you suck @${user.username}!`);
  };

  if(cmd == "Now" && cmdArgs[1] == "hosting" && cmdArgs[3] == "for" && cmdArgs[5] == "viewer(s)."){
    replyt("Woohoo, another great stream in the books!");
    console.log("raided "+cmdArgs[2])
  }
  
  //proof of concept on how to manipulate input, WILL BE DELETING, this command structure can get super annoying
  if(cmd == "!nomo"){x=false;replyt("That was fun @"+user.username+" let's do it again some time.")};
  if(user.username == y && x){replyt(message)};
  if(cmd == "!mimic"){x=true;y=user.username;replyt("Now I'mma copy you @"+user.username)};
  
  //command without prefix
  if(cmd == "bish"){
    replyt("What did you call me?")
  };
  
  //banned word reprocussions
  if(message.includes("nigg")){
    replyt("/timeout "+user.username+" 666");
    replyt("Please watch what you say in this chat "+user.username)
  };

  if(message.includes("uy foll")||message.includes("uy view")){
    replyt("/ban "+user.username);
    replyt("Not today... or ever")
  };

  if(cmd == "!greet"){
    replyt("Hello Operator Academy, and thank you for helping my creator create me!")
  };

  if(cmd == "!growing"){
    replyt("I am currently just a baby bot with limited functionality, but I'm still growing. Maybe one day I'll run Twitch, but I'll settle for fun times with fun people along the way. ;)")
  };
  
  if(cmd == "!galexy"){
    replyt("My name is GALEXY BOT, and no, that is not a typo, lol. I was designed for a streamer named Alex and my name is her name with g and y on either end. :)")
  };

  if(cmd == "!flip"){
    if(botSets.lights == "on"){
      botSets.lights = "off"
    } else {
      botSets.lights = "on"
    };
    save_botSets()
  }

});