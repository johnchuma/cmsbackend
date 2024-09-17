const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const ChurchesRoutes = require("./modules/churches/churches.routes");
const MembersRoutes = require("./modules/members/members.routes");
const UsersRoutes = require("./modules/users/users.routes");
const GroupRoutes = require("./modules/group/group.routes");
const GroupLeadersRoutes = require("./modules/groupLeaders/groupLeaders.routes");
const GroupMembersRoutes = require("./modules/groupMembers/groupMembers.routes");
const MemberReportsRoutes = require("./modules/memberReports/memberReports.routes");
const ServicesRoutes = require("./modules/services/services.routes");
const GuestsRoutes = require("./modules/guests/guests.routes");
const AttendancesRoutes = require("./modules/attendances/attendances.routes");

const app = express();

app.use(express.static("/files"));
app.use(express.json());
app.use(cors());
app.use(bodyParser.text({ type: "text/plain" }));

app.use("/churches", ChurchesRoutes);
app.use("/members", MembersRoutes);
app.use("/users", UsersRoutes);
app.use("/groups", GroupRoutes);
app.use("/services", ServicesRoutes);
app.use("/guests", GuestsRoutes);
app.use("/attendances", AttendancesRoutes);
app.use("/group-leaders", GroupLeadersRoutes);
app.use("/group-members", GroupMembersRoutes);
app.use("/member-reports", MemberReportsRoutes);

app.listen(5000, () => {
  console.log("Server started at port 5000");
});
