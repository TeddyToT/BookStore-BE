const Feedback = require('../models/feedback.model');
const nodemailer = require('nodemailer');

const storeMail = process.env.EMAIL_STORE;
const storeMailPassword = process.env.EMAIL_PASS;

class FeedbackService {
  static addFeedback = async (feedbackData) => {
    try {
      const newFeedback = new Feedback(feedbackData);
      await newFeedback.save();
  
      const { email, name, content } = feedbackData;
  
      if (email) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: storeMail,
            pass: storeMailPassword
          }
        });
  
        const mailoptions = {
          from: storeMail,
          to: email,
          subject: 'Ghi nhận phản hồi - Book Store',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 10px; border: 2px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: rgb(52, 145, 221); text-align: center;">Cảm ơn bạn đã phản hồi!</h2>
                <p style="font-size: 18px; color: #333;">Xin chào ${name},</p>
                <p style="font-size: 16px; color: #333;">
                    Cảm ơn bạn đã dành thời gian để gửi phản hồi quý báu cho chúng tôi. Dưới đây là tóm tắt ý kiến của bạn:
                </p>
                <blockquote style="border-left: 4px solid #ccc; margin: 20px 0; padding-left: 15px; color: #555;">
                    ${content}
                </blockquote>
                <p style="font-size: 16px; color: #333;">
                Chúng tôi rất trân trọng ý kiến của bạn và sẽ sử dụng nó để cải thiện dịch vụ và trải nghiệm mua sắm của bạn.
                </p>
                <p style="font-size: 16px; color: #333;">
                    Trân trọng,<br>
                    The Book Store Team
                </p>
            </div>
          `
        };
  
        transporter.sendMail(mailoptions, function (error, info) {
          if (error) {
            console.error("Gửi email thất bại:", error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }
  
      return {
        success: true,
        message: "Feedback added successfully",
        data: newFeedback
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
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
  static getFeedbackById = async (feedbackId) => {
    try {
      const feedback = await Feedback.findById(feedbackId).lean();
      if (!feedback) {
        return { success: false, message: "Feedback not found" };
      }
  
      return { success: true, data: feedback };
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
