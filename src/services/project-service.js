const Project = require("../models/project");
const Invite = require("../models/invite");
const User = require("../models/user");

class ProjectService {
  /**
   * A - One user invites many other users for a project
   * B - Need user(owner); Users that are gonna receive the invitation(users); Project that owner is inviting(projectId)
   * C - Validate
   *  C1 - Project has to exist
   *  C2 - User(owner) must be the the project owner
   *  C3 - Each user has to exist
   *  C4 - Each user cannot be already in the project
   *  C5 - Each user cannot have a invitation pending
   */
  async sendInvitations(ownerId, projectId, users) {
    const project = await Project.findByPk(projectId, {
      include: { association: "users" },
    });

    if (!project) {
      throw new Error("project not found");
    }

    /* User who is adding must be the project owner */
    if (project.owner_id !== ownerId) {
      throw new Error("user is not the project owner");
    }

    const invitesResponse = [];
    /* Validate each user before update */
    for (let userId of users) {
      const userFound = await User.findByPk(userId);
      if (!userFound) {
        throw new Error("User not found with id " + userId);
      }

      // check if user is already in the project
      if (project.users.find((u) => u.id === userId)) {
        continue;
      }

      // each user cannot have a invitation pending
      const userInvitations = await Invite.findAll({ where: { to: userId } });
      if (
        userInvitations.find(
          (inv) => inv.project_id === projectId && inv.status === "PENDING"
        )
      ) {
        continue;
      }

      await Invite.create({
        to: userId,
        by: ownerId,
        project_id: projectId,
      });
    }
  }
}

module.exports = new ProjectService();
