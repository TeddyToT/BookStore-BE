const FeedbackService = require('../services/feedback.service');

class FeedbackController {
  addFeedback = async (req, res, next) => {
    try {
        return res.status(201).json(await FeedbackService.addFeedback(req.body))

    } catch (error) {
      next(error);
    }
  };

  getAllFeedback = async (req, res, next) => {
    try {
        return res.status(201).json(await FeedbackService.getAllFeedback())

    } catch (error) {
      next(error);
    }
  };

  getFeedbackById = async (req, res, next) => {
    try {
        return res.status(201).json(await FeedbackService.getFeedbackById())

    } catch (error) {
      next(error);
    }
  };

  updateFeedbackStatus = async (req, res, next) => {
    try {
      const { feedbackId, isHandle } = req.body;
      const response = await FeedbackService.updateFeedbackStatus(feedbackId, isHandle);
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new FeedbackController();
