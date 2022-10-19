// Import express and the file containing our route definitions
const express = require("express");
const app = express();
const routes = require("./src/routes");

//import env
const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
  throw result.error
};
console.log(result.parsed);

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
  channel, username, password } = {
  "channel": process.env.TWITCH_CHANNEL,
  "username": process.env.TWITCH_BOT_NAME,
  "password": process.env.TWITCH_BOT_OAUTH
};

//add more channels to the roster from the .env list
let userchans = ["#"+channel];
let allChannels = [channel];
let moreChannels = process.env.TWITCH_OTHER_CHANNELS.split(", ");console.log(allChannels+" boop "+moreChannels);
moreChannels.forEach((x) => allChannels.push("#"+x));
userchans.push.apply(userchans, allChannels.slice(1))

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
  channels: allChannels
};

const fs = require('fs');
var botSets; renew_botSets();

console.log("User channels: "+userchans)

const client = new tmi.Client(options);
client.connect().catch(console.error);

client.on('connected', () => {
  if(botSets.lights == "on"){
    client.say(channel, "Your friendly neighborhood GALEXY BOT, reporting for duty!");
    client.say('#iamalexmoore', "Your friendly neighborhood GALEXY BOT, reporting for duty!");
    client.say('#darthcentauri', "Your friendly neighborhood GALEXY BOT, reporting for duty!");
    client.say('#nyanpuggles', "Your friendly neighborhood GALEXY BOT, reporting for duty!");
    client.say('#corncobgirl', "Your friendly neighborhood GALEXY BOT, reporting for duty!")
  }  
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


client.on('message', (channel, user, message, self) => {
  if (self) return;
  let cmdArgs = message.split(" ");
  let cmd = cmdArgs[0];
  user.sub = user.subscriber;
  if("#"+user.username == channel){
    user.own = true;
  } else {
    user.own = false;
  };
  if(botSets.devs.some((x) => user['display-name'].includes(x))){
    user.dev = true;
  } else {
    user.dev = false;
  };
  let whichChannel = userchans.indexOf(channel);console.log("Channel Number: "+whichChannel);

  //setting up user levels
  let lvls = ["Viewer","Initiate","Follower","Regular","Subscriber","Moderator","boop","Owner","boop","Developer"];
  user.lvl = 0;
  if(user['first-msg']){user.lvl = 1};
  if(user.fol){user.lvl = 2};
  if(user.sub){user.lvl = 4};
  if(user.mod){user.lvl = 5};
  if(user.own){user.lvl = 7};
  if(user.dev){user.lvl = 9};
  console.log(`Level: ${user.lvl}.${lvls[user.lvl]} ${user.fol}`);

  //simplify response messages (replyt = reply on twitch)
  function replyt(replyt){
    client.say(channel, replyt)
  };  
  
  //first command that wouldn't work at first and shows my frustration (without the usual profanity)
  if (cmd == "!usuck") {
    replyt(`No, you suck @${user.username}!`);
  };

  if(cmd == "Now" && cmdArgs[1] == "hosting" && cmdArgs[3] == "for" && cmdArgs[5] == "viewer(s)."){
    replyt("Woohoo, another great stream in the books!");
    console.log("raided "+cmdArgs[2])
  };

  if(cmd == "||>" && cmdArgs[1] == "iamalexmoore"){
    client.say('#galexy_bot', "/host iamalexmoore")
  }
  
    //command without prefix
  if(cmd == "bish"){
    replyt("What did you call me?")
  };

  if(cmd == "brb"){
    replyt("B.R.B. = Booze Run Break!")
  };
  
  //banned word reprocussions
  if(botSets.channel[whichChannel].bWords.some((x) => message.toLowerCase().includes(x))){
    if(user.lvl<5){
      replyt("/timeout "+user.username+" 666");
    }
    replyt("Please watch what you say in this chat "+user.username)
  };
  //add banned word
  if(cmd == "!bwords" && cmdArgs[1] == "add" && user.lvl > 4){
    let bword = message.toLowerCase().split(" ").splice(2).join(" ");console.log(bword)
    if(botSets.channel[whichChannel].bWords.some((x) => bword.includes(x))){
      replyt("''"+bword+"'' is already in the banned words list.")
    } else {
      botSets.channel[whichChannel].bWords.push(bword);
      replyt("''"+bword+"'' has been added to the banned words list.");
      save_botSets()
    }
  }

  if(message.includes("uy foll")||message.includes("uy view")){
    if(user.lvl<5){
      replyt("/ban "+user.username);
    };
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

  if(cmd == "!flip" && user.dev){
    if(botSets.lights == "on"){
      botSets.lights = "off"
    } else {
      botSets.lights = "on"
    };
    save_botSets();
    replyt("The lights are now "+botSets.lights+"!")
  };

  if(cmd == "boop"){
    botSets.boops.push(Date.now());if(botSets.boops.length>5){
      botSets.boops.shift()
    };save_botSets();
    if(user.mod){
      reply = "OW, you mods boop too hard!";
    } else {
      reply = "beep!";
    };
    if(botSets.boops[4] - botSets.boops[0] < 20*60*1000){
      reply = "Wow, lotsa boops today.";
    };
    replyt(reply);
  };

});