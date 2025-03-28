export const config = {
  MINIO_ENDPOINT:
    process.env.MINIO_ENDPOINT ?? 'minio-staging.bsaffer.iot-ap.be',
  MINIO_ACCESSKEY: process.env.MINIO_ACCESSKEY ?? 'bsaffer',
  MINIO_SECRETKEY: process.env.MINIO_SECRETKEY ?? 'adminadmin',
  MINIO_BUCKET: process.env.MINIO_BUCKET ?? 'b-saffer',
};
