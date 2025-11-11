import React from "react";

const FeedbackBox = ({ feedback }) => {
  if (!feedback) return null;

  return (
    <div className={`feedback-box ${feedback.type}`}>
      <p>{feedback.message}</p>
    </div>
  );
};

export default FeedbackBox;
