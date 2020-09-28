const app = require("./app");
const port = process.env.port || 3001;

require("./database");

app.listen(port, () => {
  console.log(`Server is running at http//localhost:${port}`);
});
