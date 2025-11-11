import React from "react";

const Badges = ({ score, total }) => {
  const percentage = (score / total) * 100;
  let title = "";
  let emoji = "";

  if (percentage < 50) {
    title = "Quiz Rookie";
    emoji = "🥉";
  } else if (percentage < 100) {
    title = "Smart Learner";
    emoji = "🥈";
  } else {
    title = "Pro Learner";
    emoji = "🏆";
  }

  return (
    <div className="badge">
      <h3>
        {emoji} {title}
      </h3>
    </div>
  );
};

export default Badges;
