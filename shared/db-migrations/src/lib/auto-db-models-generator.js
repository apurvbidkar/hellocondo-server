/* eslint-disable no-console */
const SequelizeAuto = require("sequelize-auto");

const dbName = "hellocondo-server";
const dbUser = "postgres";
const dbPassword = "postgres";
const dbHost = "localhost";
const dbPort = 5432;
const dbDialect = "postgres";
const outputFolder = "./models";
const language = "ts";

const auto = new SequelizeAuto(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDialect,
  directory: outputFolder, // where to write files
  port: dbPort,
  caseModel: "c", // convert snake_case column names to camelCase field names: user_id -> userId
  caseFile: "c", // file names created for each model use camelCase.js not snake_case.js
  singularize: false, // convert plural table names to singular model names
  lang: language,
  // tables: ["table1", "table2"], // use all tables, if omitted
  additional: { timestamps: false },
});

auto.run().then((data) => {
  console.log(data.tables); // table list
});
