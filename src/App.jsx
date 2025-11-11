import React from "react";
import { motion } from "framer-motion";
import Quiz from "./components/QuizTemp/Quiz.jsx";
import "./index.css"; // or App.css if you create one



const App = () => {
  return (
    <div className="app-container">
      {/* Fade-in animation when the app loads */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
   

        {/* Main Quiz Component */}
        <Quiz />

        
      </motion.div>
    </div>
  );
};

export default App;
