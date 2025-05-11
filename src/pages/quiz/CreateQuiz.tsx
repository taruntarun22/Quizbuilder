import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, CheckCircle, Save, X, HelpCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useQuiz, Question } from '../../contexts/QuizContext';

const CreateQuiz: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { createQuiz } = useQuiz();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Omit<Question, 'id'>[]>([
    {
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    }
  ]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showTip, setShowTip] = useState(true);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    let hasQuestionErrors = false;
    
    questions.forEach((question, qIndex) => {
      if (!question.text.trim()) {
        newErrors[`question_${qIndex}`] = 'Question text is required';
        hasQuestionErrors = true;
      }
      
      question.options.forEach((option, oIndex) => {
        if (!option.trim()) {
          newErrors[`question_${qIndex}_option_${oIndex}`] = 'Option cannot be empty';
          hasQuestionErrors = true;
        }
      });
    });
    
    if (questions.length === 0) {
      newErrors.questions = 'At least one question is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent, isPublished: boolean) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const newQuiz = {
      title,
      description,
      createdBy: currentUser?.id || '',
      questions: questions.map((q, index) => ({
        ...q,
        id: `q-${index}-${Date.now()}`
      })),
      published: isPublished
    };
    
    createQuiz(newQuiz);
    navigate('/');
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      }
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQuestions = [...questions];
      newQuestions.splice(index, 1);
      setQuestions(newQuestions);
    }
  };

  const updateQuestionText = (index: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[index].text = text;
    setQuestions(newQuestions);
    
    if (errors[`question_${index}`]) {
      const newErrors = { ...errors };
      delete newErrors[`question_${index}`];
      setErrors(newErrors);
    }
  };

  const updateOption = (questionIndex: number, optionIndex: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = text;
    setQuestions(newQuestions);
    
    if (errors[`question_${questionIndex}_option_${optionIndex}`]) {
      const newErrors = { ...errors };
      delete newErrors[`question_${questionIndex}_option_${optionIndex}`];
      setErrors(newErrors);
    }
  };

  const setCorrectAnswer = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correctAnswer = optionIndex;
    setQuestions(newQuestions);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <h1 className="text-2xl font-bold">Create a New Quiz</h1>
          <p className="opacity-90">Design your questions and set the correct answers</p>
        </div>
        
        {showTip && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 flex items-start">
            <HelpCircle className="text-blue-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div className="flex-grow">
              <p className="text-sm text-blue-700">
                <strong>Tip:</strong> A good quiz has clear questions and distinct answer choices. 
                Mark the correct answer for each question. You can save as draft or publish directly.
              </p>
            </div>
            <button 
              onClick={() => setShowTip(false)}
              className="text-blue-500 hover:text-blue-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        
        <form className="p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Quiz Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) {
                    const newErrors = { ...errors };
                    delete newErrors.title;
                    setErrors(newErrors);
                  }
                }}
                className={`block w-full px-3 py-2 border ${
                  errors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                } rounded-md shadow-sm focus:outline-none focus:ring-2`}
                placeholder="Enter quiz title"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) {
                    const newErrors = { ...errors };
                    delete newErrors.description;
                    setErrors(newErrors);
                  }
                }}
                rows={3}
                className={`block w-full px-3 py-2 border ${
                  errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                } rounded-md shadow-sm focus:outline-none focus:ring-2`}
                placeholder="Describe your quiz"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-800">Questions</h2>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Question
                </button>
              </div>
              
              {errors.questions && <p className="mt-1 text-sm text-red-600 mb-4">{errors.questions}</p>}
              
              {questions.map((question, questionIndex) => (
                <div 
                  key={questionIndex}
                  className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-md font-medium text-gray-700">Question {questionIndex + 1}</h3>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(questionIndex)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <input
                      type="text"
                      value={question.text}
                      onChange={(e) => updateQuestionText(questionIndex, e.target.value)}
                      className={`block w-full px-3 py-2 border ${
                        errors[`question_${questionIndex}`] ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                      } rounded-md shadow-sm focus:outline-none focus:ring-2`}
                      placeholder="Enter question"
                    />
                    {errors[`question_${questionIndex}`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`question_${questionIndex}`]}</p>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => setCorrectAnswer(questionIndex, optionIndex)}
                          className={`flex-shrink-0 h-6 w-6 rounded-full border ${
                            question.correctAnswer === optionIndex
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300 bg-white'
                          } flex items-center justify-center`}
                        >
                          {question.correctAnswer === optionIndex && <CheckCircle className="h-5 w-5" />}
                        </button>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                          className={`flex-grow px-3 py-2 border ${
                            errors[`question_${questionIndex}_option_${optionIndex}`]
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                          } rounded-md shadow-sm focus:outline-none focus:ring-2`}
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition"
              >
                <Save className="h-4 w-4 mr-1" />
                Save as Draft
              </button>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Publish Quiz
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;