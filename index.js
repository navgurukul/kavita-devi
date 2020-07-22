const sdk = require("matrix-bot-sdk");
const config = require('dotenv').config()

const MatrixClient = sdk.MatrixClient;
const SimpleFsStorageProvider = sdk.SimpleFsStorageProvider;
const AutojoinRoomsMixin = sdk.AutojoinRoomsMixin;

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