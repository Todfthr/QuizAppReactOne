import React from 'react';
import type { Question as QuestionType } from '../types/quiz.types';

interface QuestionProps {
  question: QuestionType;
  selectedOption: number | null;
  onOptionSelect: (optionIndex: number) => void;
}

const Question: React.FC<QuestionProps> = ({ question, selectedOption, onOptionSelect }) => {
  return (
    <div className="mb-4">
      <h5 className="mb-4 question-text fw-bold">{question.text}</h5>
      <div className="options">
        {question.options.map((option, index) => (
          <div 
            key={index} 
            className={`form-check mb-3 p-3 border rounded cursor-pointer transition-all ${
              selectedOption === index 
                ? 'bg-primary text-white border-primary' 
                : 'option-unselected border-secondary'
            }`}
            onClick={() => onOptionSelect(index)}
          >
            <input
              type="radio"
              className="form-check-input"
              id={`option-${index}`}
              name={`question-${question.id}`}
              checked={selectedOption === index}
              onChange={() => onOptionSelect(index)}
            />
            <label className="form-check-label w-100" htmlFor={`option-${index}`}>
              <span className="fw-medium">{String.fromCharCode(65 + index)}. </span>
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question;