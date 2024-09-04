import React, { useState } from 'react';

const QuestionComponent = ({ question }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleOptionClick = (option) => {
    setSelectedAnswer(option);
    setIsAnswered(true);
  };

  const isCorrect = selectedAnswer === question.correctOption;

  return (
    <div className="p-4 border rounded-md mb-4 w-full">
      <h3 className="text-lg font-semibold">{question.questionText}</h3>
      <div className="my-2">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`block p-2 mt-1 rounded ${selectedAnswer === option ? (isCorrect ? 'bg-green-200' : 'bg-red-200') : 'bg-gray-100'} hover:bg-gray-200`}
          >
            {option}
          </button>
        ))}
      </div>
      {isAnswered && (
        <div className="mt-2 p-2 border rounded-md">
          <p className={`font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? 'Correct!' : 'Incorrect!'}
          </p>
          <p className="mt-1"><strong>Explanation:</strong> {question.explanation}</p>
        </div>
      )}
    </div>
  );
};

const ModuleDetail = ({ module }) => {
  return (
    <div className="flex flex-col w-full p-6 mt-4">
      <h2 className="text-xl font-bold mb-4">{module.moduleName}</h2>
      {module.questions.map(question => (
        <QuestionComponent key={question.questionId} question={question} />
      ))}
    </div>
  );
};

export default ModuleDetail;
