const Invite = require("../models/invite");
const projectService = require("../services/project-service");
const Project = require("../models/project");
const User = require("../models/user");

class InviteService {
  async acceptInvitation(userId, invitationId, accept) {
    // change invitaion status to either "ACCEPTED" OR "DECLINED"
    // ADD USER TO THE PROJECT
    const invitation = await Invite.findByPk(invitationId);

    if (!invitation) {
      throw new Error("invitation not found");
    }

    // Invitation is not for the user
    if (invitation.to !== userId) {
      throw new Error("invitation is not for the user");
    }

    if (invitation.status !== "PENDING") {
      throw new Error("invitation is not pending");
    }

    const projectId = invitation.project_id;
    //const project = await projectService.findById(projectId);
    const project = await Project.findByPk(projectId, {
      include: { association: "users" },
    });

    if (!project) {
      throw new Error("project not found");
    }

    if (project.users.find((u) => u.id === userId)) {
      throw new Error("project alredy includes this user");
    }

    if (accept) {
      invitation.status = "ACCEPTED";
      const user = await User.findByPk(userId);
      await project.addUser(user);
    } else {
      invitation.status = "DECLINED";
    }

    return invitation.save();
  }
}

module.exports = new InviteService();
