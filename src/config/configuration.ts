export default () => ({
  port: parseInt(process.env.PORT) || 5000,
  mongo: {
    uri: process.env.MONGO_URI,
  },
  minio: {
    endpoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT) || 9000,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    useSSL: process.env.MINIO_USE_SSL.toLowerCase() === 'true',
    bucket: process.env.MINIO_BUCKET_NAME,
  },
  oauth: {
    id: process.env.GOOGLE_CLIENT_ID,
    secret: process.env.GOOGLE_CLIENT_SECRET,
  },
  credential: {
    jwt_secret: process.env.JWT_SECRET,
    bcrypt_salt_round: parseInt(process.env.BCRYPT_SALT_ROUND),
  },
});
