"use strict";

const util = require("util");
const { SNS } = require("aws-sdk");

const ORIGIN = process.env.ORIGIN || "http://localhost";

const buildHeaders = (origin) => {
  const headers = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type, X-Api-Key, X-Amz-Date, X-Amz-Security-Token, X-Amz-User-Agent",
  };

  if (ORIGIN === origin){
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
};

exports.handler = (event, context, callback) => {
  const incoming = JSON.parse(event.body);

  console.info("Received following content: %j", incoming);

  const sns = new SNS();

  const snsPublishParameters = {
    Message: JSON.stringify(incoming),
    Subject: util.format("Contact page entry from '%s'", incoming.from),
    TopicArn: process.env.SNS_TOPIC_ARN
  };

  sns.publish(snsPublishParameters, function (error, response) {
    if (error) {
      callback(null, {
        statusCode: 500,
        headers: buildHeaders(incoming.from),
        body: JSON.stringify({ message: error.message }),
      });

      return;
    }

    console.info("SNS topic publish response: %j", response);

    callback(null, {
      statusCode: 200,
      headers: buildHeaders(incoming.from),
      body: JSON.stringify(response),
    });
  });
};
