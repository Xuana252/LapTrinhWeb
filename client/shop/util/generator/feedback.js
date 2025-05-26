import { generateDummyCustomerData } from "./customer";
import { generateDummyProductDetailData } from "./product";

export const generateDummyFeedback = () => {
  const feedbacks = [];
  const feedbackCount = Math.floor(Math.random() * 10) + 1; // Random number of feedbacks between 1 and 10


  for (let i = 0; i < feedbackCount; i++) {
    const rating = Math.floor(Math.random() * 5) + 1; // Random rating between 1 and 5
    const feedback = {
      _id: i,
      product_id: 1,
      user_id: generateDummyCustomerData(),
      feedback: "Good product",
      rating: rating,
      createdAt: "2025-05-02T10:38:04.511Z",
      updatedAt: "2025-05-02T10:38:04.511Z",
    };
    feedbacks.push(feedback);
  }

  return feedbacks;
};

export const generateDummyCustomerFeedbacks = () => {
  const feedbacks = generateDummyFeedback()

  feedbacks.forEach(fb => ({
    ...fb,product_id: generateDummyProductDetailData()
  }))
  return feedbacks;
}
