export default () => ({
  database: {
    connectionString: process.env.MONGODB_URI,
  },
  secerts: {
    jwtSecert: process.env.JWT_SECERT,
  },
});
