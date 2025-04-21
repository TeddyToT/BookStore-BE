const Feedback = require('../models/feedback.model');

class FeedbackService {
  static addFeedback = async (feedbackData) => {
    try {
      const newFeedback = new Feedback(feedbackData);
      await newFeedback.save();
      return { success: true, message: "Feedback added successfully", data: newFeedback };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  static getAllFeedback = async () => {
    try {
      const feedbacks = await Feedback.find().lean();
      return { success: true, data: feedbacks };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  static updateFeedbackStatus = async (feedbackId, isHandle) => {
    try {
      const feedback = await Feedback.findOne({ feedbackId });
      if (!feedback) return { success: false, message: "Feedback not found" };

      feedback.isHandle = isHandle;
      await feedback.save();
      return { success: true, message: "Feedback status updated", data: feedback };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };
}

module.exports = FeedbackService;
