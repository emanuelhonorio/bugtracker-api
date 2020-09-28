const Notification = require("../schemas/notification");

class NotificationController {
  async list(req, res, next) {
    try {
      const notifications = await Notification.find({
        user_id: req.userId,
      }).sort([["createdAt", -1]]);
      return res.status(200).json(notifications);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new NotificationController();
