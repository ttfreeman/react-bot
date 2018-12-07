const express = require("express");
const structjson = require("./structjson");
const bodyParser = require("body-parser");

const config = require("./config/keys");

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send({ message: "johnny" });
});

app.post("/api/df_text_query", async (req, res) => {
  // You can find your project ID in your Dialogflow agent settings
  const projectId = config.projectID; //https://dialogflow.com/docs/agents#settings
  const sessionId = config.sessionID;
  const credentials = {
    private_key: config.private_key,
    client_email: config.client_email
  };

  const languageCode = "en-US";

  // Instantiate a DialogFlow client.
  const dialogflow = require("dialogflow");
  const sessionClient = new dialogflow.SessionsClient({
    projectId,
    credentials
  });

  // Define session path
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: req.body.text,
        languageCode: languageCode
      }
    },
    queryParams: {
      payload: {
        data: req.body.parameters
      }
    }
  };

  // Send request and log result
  let responses = await sessionClient.detectIntent(request);
  res.send(responses[0].queryResult);
});

app.post("/api/df_event_query", async (req, res) => {
  process.env.GOOGLE_APPLICATION_CREDENTIALS =
    "./../../../Keys/react-chatbot-fb45c8f8db9c.json";
  const projectId = "react-chatbot-6d094";
  const sessionId = "react-bot-session";

  const languageCode = "en-US";

  const dialogflow = require("dialogflow");
  const sessionClient = new dialogflow.SessionsClient();

  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      event: {
        name: req.body.event,
        parameters: structjson.jsonToStructProto(req.body.parameters),
        languageCode: languageCode
      }
    }
  };

  let responses = await sessionClient.detectIntent(request);
  res.send(responses[0].queryResult);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
