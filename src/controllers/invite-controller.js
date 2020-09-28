const inviteService = require("../services/invite-service");
const Invite = require("../models/invite");
const Yup = require("yup");
const projectService = require("../services/project-service");
const Notification = require("../schemas/notification");

class InviteController {
  // project owner send invites to one or more users
  async send(req, res, next) {
    const { project_id, users } = req.body;

    /* Validate request properties */
    const schema = Yup.object().shape({
      users: Yup.array().of(Yup.string().required()),
      project_id: Yup.string().required(),
    });

    if (!(await schema.isValid({ users, project_id }))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    try {
      await projectService.sendInvitations(req.userId, project_id, users);
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async listInvitationsSent(req, res, next) {
    const { userId } = req;

    try {
      const invitations = await Invite.findAll({
        where: { by: userId, status: "PENDING" },
        include: [
          { association: "to_user" },
          { association: "by_user" },
          { association: "project" },
        ],
      });
      return res.status(200).json(invitations);
    } catch (err) {
      next(err);
    }
  }

  async listInvitationsReceived(req, res, next) {
    const { userId } = req;

    try {
      const invitations = await Invite.findAll({
        where: { to: userId, status: "PENDING" },
        include: [
          { association: "to_user" },
          { association: "by_user" },
          { association: "project" },
        ],
      });
      return res.status(200).json(invitations);
    } catch (err) {
      next(err);
    }
  }

  async acceptInvitation(req, res, next) {
    const { userId } = req;
    const { id } = req.params;

    try {
      const invitation = await inviteService.acceptInvitation(userId, id, true);

      Notification.create({
        user_id: userId,
        text: `You joined the project with id **${invitation.project_id}**`,
      });

      Notification.create({
        user_id: invitation.by,
        text: `User with id **${userId}** accepted your invite for project with id **${invitation.project_id}**`,
      });

      return res.status(200).json(invitation);
    } catch (err) {
      next(err);
    }
  }

  async declineInvitation(req, res, next) {
    const { userId } = req;
    const { id } = req.params;

    try {
      const invitation = await inviteService.acceptInvitation(
        userId,
        id,
        false
      );

      Notification.create({
        user_id: invitation.by,
        text: `User with id **${userId}** declined your invite for project with id **${invitation.project_id}**`,
      });

      return res.status(200).json(invitation);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new InviteController();
