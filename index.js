const sdk = require("matrix-bot-sdk");
const config = require('dotenv').config().parsed;

const MatrixClient = sdk.MatrixClient;
const SimpleFsStorageProvider = sdk.SimpleFsStorageProvider;
const AutojoinRoomsMixin = sdk.AutojoinRoomsMixin;
const RichReply = sdk.RichReply;

// where you would point a client to talk to a homeserver
const homeserverUrl = "https://m.navgurukul.org"; // make sure to update this with your url
// see https://t2bot.io/docs/access_tokens
const accessToken = config.ACCESS_TOKEN;

// We'll want to make sure the bot doesn't have to do an initial sync every
// time it restarts, so we need to prepare a storage provider. Here we use
// a simple JSON database.
const storage = new SimpleFsStorageProvider("bot.json");

// Now we can create the client and set it up to automatically join rooms.
const client = new MatrixClient(homeserverUrl, accessToken, storage);
AutojoinRoomsMixin.setupOnClient(client);

// We also want to make sure we can receive events - this is where we will
// handle our command.
client.on("room.message", handleCommand);

// Now that the client is all set up and the event handler is registered, start the
// client up. This will start it syncing.
client.start().then(() => console.log("Client started!"));

// This is our event handler for dealing with the `!hello` command.
async function handleCommand(roomId, event) {
  // Don't handle events that don't have contents (they were probably redacted)
  if (!event["content"]) return;

  // Don't handle non-text events
  if (event["content"]["msgtype"] !== "m.text") return;

  // We never send `m.text` messages so this isn't required, however this is
  // how you would filter out events sent by the bot itself.
  if (event["sender"] === await client.getUserId()) return;

  // Make sure that the event looks like a command we're expecting
  const body = event["content"]["body"];

  // If we've reached this point, we can safely execute the command. We'll
  // send a reply to the user's command saying "Hello World!".
  const replyBody = "Thank you for sharing your message"; // we don't have any special styling to do.
  const reply = RichReply.createFor(roomId, event, replyBody, replyBody);
  reply["msgtype"] = "m.notice";
  client.sendMessage(roomId, reply);
}

