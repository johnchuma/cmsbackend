const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const ChurchesRoutes = require("./modules/churches/churches.routes");
const MembersRoutes = require("./modules/members/members.routes");
const UsersRoutes = require("./modules/users/users.routes");

const app = express();

app.use(express.static("/files"));
app.use(express.json());
app.use(cors());
app.use(bodyParser.text({ type: "text/plain" }));

app.use("/churches", ChurchesRoutes);
app.use("/members", MembersRoutes);
app.use("/users", UsersRoutes);

app.listen(5000, () => {
  console.log("Server started at port 5000");
});
