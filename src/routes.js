const { Router } = require("express");
const routes = new Router();

const UserController = require("./controllers/user-controller");
const AuthController = require("./controllers/auth-controller");
const ProjectController = require("./controllers/project-controller");
const BugController = require("./controllers/bug-controller");
const InviteController = require("./controllers/invite-controller");
const MemberController = require("./controllers/member-controller");
const NotificationController = require("./controllers/notification-controller");
const AuthMiddleware = require("./middlewares/auth-middleware");

routes.get("/", (req, res) => {
  return res.status(200).json({ running: true });
});
routes.post("/signup", UserController.store);
routes.post("/signin", AuthController.authenticate);
routes.post("/signin/demo", AuthController.authenticateAsDemo);

routes.use(AuthMiddleware);

routes.get("/profile", UserController.getProfile);
routes.put("/profile", UserController.updateProfile);
routes.get("/users", UserController.findByEmail);

routes.get("/projects", ProjectController.list);
routes.get("/projects/:id", ProjectController.findById);
routes.put("/projects/:id", ProjectController.update);
routes.delete("/projects/:id", ProjectController.delete);
routes.post("/projects", ProjectController.store);

routes.get("/projects/:id/bugs", BugController.list);
routes.post("/projects/:id/bugs", BugController.store);

routes.put("/bugs/:id", BugController.update);
routes.delete("/bugs/:id", BugController.delete);

routes.get("/projects/:id/members", MemberController.list);
routes.delete(
  "/projects/:project_id/members/:member_id",
  MemberController.delete
);

routes.post("/invites/", InviteController.send);
routes.get("/invites/sent", InviteController.listInvitationsSent);
routes.get("/invites/received", InviteController.listInvitationsReceived);
routes.post("/invites/:id/accept", InviteController.acceptInvitation);
routes.post("/invites/:id/decline", InviteController.declineInvitation);

routes.get("/notifications", NotificationController.list);

module.exports = routes;
