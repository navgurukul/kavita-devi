const sdk = require("matrix-bot-sdk");
const config = require("dotenv").config().parsed;

const MatrixClient = sdk.MatrixClient;
const SimpleFsStorageProvider = sdk.SimpleFsStorageProvider;
const AutojoinRoomsMixin = sdk.AutojoinRoomsMixin;

const homeserverUrl = "https://m.navgurukul.org"; // make sure to update this with your url
const accessToken = config.ACCESS_TOKEN;

const storage = new SimpleFsStorageProvider("bot.json");

const client = new MatrixClient(homeserverUrl, accessToken, storage);
AutojoinRoomsMixin.setupOnClient(client);

client.on("room.message", handleCommand);

client.start().then(() => console.log("Client started!"));

async function handleCommand(roomId, event) {
  const sender = event["sender"];

  if (sender === (await client.getUserId())) return;

  const body = event["content"]["body"];
  if (!body.startsWith("format")) return;

  const content = {
    msgtype: "org.matrix.options",
    type: "org.matrix.buttons",
    body: "I am a deeplink",
    label: "I am a deeplink",
    options: [
      {
        label: "Answer 1",
        value: "merakilearn.org/chat?autosend=false&text=answer1",
      },
      {
        label: "Answer 2",
        value: "merakilearn.org/chat?autosend=true&text=answer2",
      },
    ],
  };

  client.sendEvent(roomId, "m.room.message", content, "", (err, res) => {
    if (err) {
      console.log(err);
    }
    console.log("SUCCESSFULLY SENT");
    console.log(res);
  });
}
