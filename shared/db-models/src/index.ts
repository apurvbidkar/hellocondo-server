import * as sq from "sequelize";
import * as models from "./lib/models/init-models.js";
import * as modelsAttom from "./lib/models/attom/init-models.js";

interface dbConfig {
  database: string;
  user: string;
  password: string;
  host: string;
  dialect: string;
  port: number;

  databaseAttom: string;
  userAttom: string;
  passwordAttom: string;
  hostAttom: string;
  dialectAttom: string;
  portAttom: number;
}

const config: dbConfig = {
  database: process.env["DB_NAME"] ?? "",
  user: process.env["DB_USER"] ?? "",
  password: process.env["DB_PASSWORD"] ?? "",
  host: process.env["DB_HOST"] ?? "",
  dialect: process.env["DB_DIALECT"] ?? "postgres",
  port: process.env["DB_PORT"] ? parseInt(process.env["DB_PORT"]) : 5432,

  databaseAttom: process.env["DB_NAME_ATTOM"] ?? "",
  userAttom: process.env["DB_USER_ATTOM"] ?? "",
  passwordAttom: process.env["DB_PASSWORD_ATTOM"] ?? "",
  hostAttom: process.env["DB_HOST_ATTOM"] ?? "",
  dialectAttom: process.env["DB_DIALECT_ATTOM"] ?? "postgres",
  portAttom: process.env["DB_PORT_ATTOM"] ? parseInt(process.env["DB_PORT_ATTOM"]) : 5432,
};

const sequelize = new sq.Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: config.dialect as sq.Dialect,
  port: config.port as number,
});

const sequelizeAttom = new sq.Sequelize(config.databaseAttom, config.userAttom, config.passwordAttom, {
  host: config.hostAttom,
  dialect: config.dialectAttom as sq.Dialect,
  port: config.portAttom as number,
});

const db = models.initModels(sequelize);
const dbAttom = modelsAttom.initModels(sequelizeAttom);

sequelize
  .authenticate()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Connection has been established successfully.");
  })
  .catch((error: unknown) => {
    // eslint-disable-next-line no-console
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  });

// console.log(sequelizeAttom);
sequelizeAttom
  .authenticate()
  .then(async () => {
    // eslint-disable-next-line no-console
    console.log("Connection has been established with attomData successfully.");
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Unable to connect to the attom database:", error.message);
  });

export { db, models, sq, sequelize, dbAttom, sequelizeAttom };
