/***
 *
 * This Application:
 *   1. Receives message from HTTP Post,
 *   2. Checks auth key in header 'key' against a secret in scretmanager called 'key'
 *   3. If the Key matches proceed to send a pubsub message to defined topic
 *
 * Required Env variables:
 *   1. PORT              |-> The port used for http service
 *   2. DBHOST            |-> The IP of the postgres host
 *   3. DBPASSWORDSECRET  |-> The password for the DB user
 *   4. DBPORT            |-> The port to connect to DB - default 5432 for postgres
 *   5. DBTABLE           |-> DB Table to connect to
 *   6. DBUSER            |-> DB user
 *   7. DB                |-> Name of the DB
 *
 * You may use the following as the template of envrionment variables
 *   1. export PORT=<replace-me>              #8080
 *   2. export DBHOST=<replace-me>
 *   3. export DBPASSWORDSECRET=<replace-me>
 *   4. export DBPORT=5432
 *   5. export DBTABLE=<replace-me>
 *   6. export DBUSER=<replace-me>
 *.  7. export DB=<replace-me>
 *
 */

const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const { Pool } = require("pg");
var pool;

const app = express();
const ENVVARS = {};

ENVVARS.PORT = process.env.PORT;
ENVVARS.DBHOST = process.env.DBHOST;
ENVVARS.DBPASSWORDSECRET = process.env.DBPASSWORDSECRET;
ENVVARS.DBPORT = process.env.DBPORT;
ENVVARS.DBTABLE = process.env.DBTABLE;
ENVVARS.DBUSER = process.env.DBUSER;
ENVVARS.DB = process.env.DB;
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const connectDb = async () => {
  pool = new Pool({
    user: ENVVARS.DBUSER,
    host: ENVVARS.DBHOST,
    database: ENVVARS.DB,
    password: ENVVARS.DBPASSWORDSECRET,
    port: ENVVARS.DBPORT,
  });
  await pool.connect();
  app.emit("ready");
};

const runQuery = async (q) => {
  if (!pool) return null;
  try {
    const res = await pool.query(q);
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const server = app.listen(ENVVARS.PORT, () => {
  Object.entries(ENVVARS).forEach((entry) => {
    const [key, value] = entry;
    if (!value) {
      console.error(
        `\n\n*** Invalid env variables! ***\nPlease set: \n
          ${Object.keys(ENVVARS)}\n\n`
      );
      process.exit(9);
    }
  });
  console.log(`App running on port ${ENVVARS.PORT}.`);
});

app.post("/senddata", async (request, response) => {
  const message = {};
  console.log(request.body);
  message.status = "success";
  if (
    !request.body.devicetype ||
    !request.body.devicename ||
    !request.body.temperature ||
    !request.body.humidity
  ) {
    response.status(500).json("Error");
    return;
  }
  request.body.temperature = Number(request.body.temperature);
  request.body.humidity = Number(request.body.humidity);

  //console.log(`${JSON.stringify(data)}`);
  const query = `
  INSERT INTO public.${ENVVARS.DBTABLE}(device_type, device_name, temperature, humidity) 
  VALUES ('${request.body.devicetype}', '${request.body.devicename}', ${request.body.temperature}, ${request.body.humidity});`;
  //console.log(query);
  const q = await runQuery(query);
  if (q == null) {
    response.status(404).json("Error");
    return;
  }
  console.log(q);

  console.log(message);
  response.status(200).json(message);
});

app.get("/", async (request, response) => {
  const message = {};
  message.status = "success";

  const temp = await runQuery(`
    select  * from ${ENVVARS.DBTABLE} ORDER BY created_at DESC LIMIT 1;
    `);
  if (temp == null) {
    response.status(500).json("Error");
    return;
  }
  console.log(message);
  if (!temp == null || temp.rows[0])
    response.status(200).send(`
    <html>
    <title>DHT Dashboard</title>
    <head>
    <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
    }
    .dataTitle {
      margin-left: 100px;
      color: #292928;
      font-weight: bolder;
    }
    .data {
      margin-left: 100px;
      color: #F4B400;
    }
    </style>
    </head>
    <body>
    <h1>Last Reported Data</h1>
    <h2 class='data'>
    <br><b class='dataTitle'>Device:</b> ${temp.rows[0].device_type}
    <br><b class='dataTitle'>Time:</b> ${temp.rows[0].created_at}
    <br><b class='dataTitle'>Device_name:</b> ${temp.rows[0].device_name}
    <br><b class='dataTitle'>Temperature:</b> ${temp.rows[0].temperature}
    <br><b class='dataTitle'>Humidity:</b> ${temp.rows[0].humidity}
    </h2>
    </body>
    </html>
    `);
  else
    response.status(404).send(`
    <html>
    <title>DHT Dashboard</title>
    <head>
    <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
    }
    .dataTitle {
      margin-left: 100px;
      color: #292928;
      font-weight: bolder;
    }
    .data {
      margin-left: 100px;
      color: #DB4437;
    }
    </style>
    </head>
    <body>
    <h1>Last Reported Data</h1>
    <h2 class='data'>
    No Data Found!
    </h2>
    </body>
    </html>
    `);
});

function main() {
  console.log("connecting to db before starting the http service");
  connectDb();
}
if (require.main === module) {
  main();
}
