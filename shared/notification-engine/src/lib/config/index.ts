import * as dotenv from "dotenv";
dotenv.config();

const _config = {
  port: process.env["PORT"] ? parseInt(process.env["PORT"]) : 3000,
  awsRegion: process.env["AWS_REGION"] || "",
  awsAccount: process.env["AWS_ACCOUNT_ID"] || "",
  s3: {
    pb: process.env["PRIMARY_S3_BUCKET"] || "",
    region: process.env["AWS_REGION"] || "",
  },
  email: {
    pSender: process.env["PRIMARY_EMAIL_FROM"] || "",
  },
  domains: {
    admin: process.env["ADMIN_DOMAIN"] || "",
  },
};

const config = Object.freeze(_config);

export default config;
