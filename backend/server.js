// server.js
const app = require("./app");
const sequelize = require("../backend/src/config/db");
const PORT = 5000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`); 
});
