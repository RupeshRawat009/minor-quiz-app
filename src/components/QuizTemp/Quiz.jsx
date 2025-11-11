import React, { useRef, useState, useEffect } from "react";
import "./Quiz.css";
import DifficultySelector from "./DifficultySelector";
import FeedbackBox from "./FeedbackBox";
import ProgressBar from "./ProgressBar";
import Badges from "./Badges";
import MotionWrapper from "./animations/MotionWrapper";

export const professions = ["Teacher", "Doctor", "IT", "Sports", "Actor"];

const apiKey = "AIzaSyAWWwPIyBSF4vrlQMVWEVE-oEhN1AJSId0";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

const getProfessionEmoji = (professionName) => {
  switch (professionName) {
    case "Actor":
      return "🎭";
    case "Doctor":
      return "⚕️";
    case "IT":
      return "💻";
    case "Sports":
      return "⚽";
    case "Teacher":
      return "📚";
    default:
      return "❓";
  }
};

const Quiz = () => {
  const [selectedProfession, setSelectedProfession] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(null);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [timer, setTimer] = useState(15);

  const option1 = useRef(null);
  const option2 = useRef(null);
  const option3 = useRef(null);
  const option4 = useRef(null);
  const option_array = [option1, option2, option3, option4];

  // --- when quizQuestions are loaded ---
  useEffect(() => {
    if (quizQuestions.length > 0) {
      setQuestion(quizQuestions[0]);
      setTimer(15);
    }
  }, [quizQuestions]);

  // --- timer effect ---
  useEffect(() => {
    if (!question || result || loading) return;
    if (timer === 0) {
      handleTimeUp();
      return;
    }
    const countdown = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(countdown);
  }, [timer, question, result, loading]);

  const handleTimeUp = () => {
    if (!question) return;
    setLock(true);
    option_array[question.ans - 1]?.current?.classList.add("correct");
    setFeedback({ type: "wrong", message: "⏰ Time’s up!" });
    setTimeout(() => next(), 1000);
  };

  const startQuiz = async (professionName, level) => {
    setLoading(true);
    setSelectedProfession(professionName);
    setDifficulty(level);

    try {
      const prompt = `
Generate 5 ${level} multiple choice questions for a quiz about the profession "${professionName}".
Include an "explanation" field for each question.
Return only a valid JSON array like this:
[
  {
    "profession": "${professionName}",
    "question": "...",
    "option1": "...",
    "option2": "...",
    "option3": "...",
    "option4": "...",
    "ans": 2,
    "explanation": "..."
  }
]
`;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      });

      const data = await response.json();
      const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Try to parse safely
      let parsed = [];
      try {
        // Clean up markdown fences if necessary (common output from generative models)
        const cleanedText = textResponse.replace(/```json\s*|```/g, '').trim();
        parsed = JSON.parse(cleanedText);
      } catch (e) {
        console.error("Invalid JSON:", textResponse);
      }

      if (Array.isArray(parsed) && parsed.length > 0) {
        setQuizQuestions(parsed);
      } else {
        throw new Error("Invalid quiz format received.");
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      alert("Failed to fetch quiz data. Try again!");
      setSelectedProfession(null);
    } finally {
      setLoading(false);
      setIndex(0);
      setScore(0);
      setLock(false);
      setResult(false);
    }
  };

  const checkAns = (e, ans) => {
    if (!lock && question) {
      const correct = question.ans === ans;
      if (correct) {
        e.target.classList.add("correct");
        setScore((prev) => prev + 1);
        setFeedback({ type: "correct", message: question.explanation || "✅ Correct!" });
      } else {
        e.target.classList.add("wrong");
        option_array[question.ans - 1]?.current?.classList.add("correct");
        setFeedback({ type: "wrong", message: question.explanation || "❌ Incorrect." });
      }
      setLock(true);
    }
  };

  const next = () => {
    if (index >= quizQuestions.length - 1) {
      setResult(true);
      return;
    }
    const nextIndex = index + 1;
    setIndex(nextIndex);
    setQuestion(quizQuestions[nextIndex]);
    setLock(false);
    setFeedback(null);
    setTimer(15);
    option_array.forEach((option) =>
      option.current?.classList.remove("wrong", "correct")
    );
  };

  const reset = () => {
    setSelectedProfession(null);
    setQuizQuestions([]);
    setIndex(0);
    setScore(0);
    setLock(false);
    setResult(false);
    setDifficulty(null);
    setTimer(15);
  };

  // --- Render section ---

  // --- 1. Landing Page: Select Profession ---
  if (!selectedProfession)
    return (
      <div className="container">
        {/* Aesthetic Improvement: New header structure */}
        <div className="app-header">
            <h1 >Smart Profession Quiz</h1>
            <p>Test your knowledge – learn, play, and grow!</p>
        </div>
        
        <div className="quiz-separator"></div> {/* Styled line */}
        
        <h2>Select a Profession</h2>
        <ul>
          {professions.map((prof) => (
            <li key={prof} onClick={() => setSelectedProfession(prof)}>
              {getProfessionEmoji(prof)} {prof}
            </li>
          ))}
        </ul>
      </div>
    );

  // --- 2. Select Difficulty ---
  if (selectedProfession && !difficulty)
    return <DifficultySelector onSelect={(level) => startQuiz(selectedProfession, level)} />;

  // --- 3. Loading State ---
  if (loading) return (
    <div className="container">
        <h2>Generating questions... 🔄</h2>
    </div>
  );

  // --- 4. Result Screen ---
  if (result)
    return (
      <div className="container result-box">
        {/* Aesthetic Improvement: Bold score for impact */}
        <h2>
          You Scored <b style={{color: '#3b82f6', fontSize: '2.5rem'}}>{score}</b> out of {quizQuestions.length}
        </h2>
        <Badges score={score} total={quizQuestions.length} />
        <button onClick={reset}>Try Another Profession</button>
      </div>
    );

  // 🧠 Safe rendering for null question
  if (!question) return <div className="container"><h2>Loading question...</h2></div>;

  // --- 5. Quiz Question Screen ---
  return (
    <div className="container">
      <MotionWrapper keyVal={index}>
        {/* Displaying Profession + Difficulty on the quiz screen */}
        <h2 style={{color: '#6366f1', marginBottom: '10px'}}>{selectedProfession} ({difficulty})</h2>
        <div className="quiz-separator"></div>

        <h2>
          {index + 1}. {question.question}
        </h2>
        
        <ProgressBar current={index} total={quizQuestions.length} />
        <div className="timer">⏱️ {timer}s left</div>

        <ul>
          <li ref={option1} onClick={(e) => checkAns(e, 1)}>
            {question.option1}
          </li>
          <li ref={option2} onClick={(e) => checkAns(e, 2)}>
            {question.option2}
          </li>
          <li ref={option3} onClick={(e) => checkAns(e, 3)}>
            {question.option3}
          </li>
          <li ref={option4} onClick={(e) => checkAns(e, 4)}>
            {question.option4}
          </li>
        </ul>

        <FeedbackBox feedback={feedback} />
        {/* Conditional rendering for Next button - only show after an answer is selected/locked */}
        {lock && (
            <button onClick={next}>
                {index === quizQuestions.length - 1 ? 'View Results' : 'Next Question'}
            </button>
        )}
      </MotionWrapper>
    </div>
  );
};

export default Quiz;