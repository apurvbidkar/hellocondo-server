import * as dotenv from "dotenv";
dotenv.config();

const _config = {
  port: parseInt(process.env.PORT) || 3000,
  host: process.env.HOST || "localhost",
  env: process.env.NODE_ENV || "development",
  cognito: {
    userPoolId: process.env.COGNITO_USER_POOL_ID || "",
    region: process.env.AWS_REGION || "",
    clientId: process.env.COGNITO_CLIENT_ID || "",
    clientSecret: process.env.COGNITO_CLIENT_SECRET || "",
    domain: process.env.COGNITO_DOMAIN || "",
  },
  awsRegion: process.env.AWS_REGION || "",
  awsAccount: process.env.AWS_ACCOUNT_ID || "",
  s3: {
    pb: process.env.PRIMARY_S3_BUCKET || "",
    region: process.env.AWS_REGION || "",
  },
  email: {
    pSender: process.env.PRIMARY_EMAIL_FROM || "",
  },
  domains: {
    admin: process.env.ADMIN_DOMAIN || "",
  },
  realGeek: {
    apiUrl:process.env.REALGEEK_API_URL,
    username:process.env.REALGEEK_USERNAME,
    password:process.env.REALGEEK_PASSWORD,
  },
  galleryImage: {
    url: process.env.GALLERY_IMAGES_URL,
    bucket: process.env.GALERY_IMAGES_BUCKET
  }
};

const config = Object.freeze(_config);

export default config;
