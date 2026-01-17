/**
 * Quiz Flow
 * Tab in right drawer; multi-step quiz UI, grading logic, mastery score display
 * Feature #7
 */

'use client'

import React, { useState, memo } from 'react'
import { ResponseMetadata } from '@/types/api-contract'
import { useLearningSession } from '@/contexts/LearningSessionContext'

interface QuizFlowProps {
  metadata: ResponseMetadata | null
  onGenerateQuiz: () => void
}

export const QuizFlow = memo(function QuizFlow({ metadata, onGenerateQuiz }: QuizFlowProps) {
  const { state, addMasteryRecord } = useLearningSession()
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [quizComplete, setQuizComplete] = useState(false)
  const [masteryScore, setMasteryScore] = useState<number | null>(null)

  if (!metadata) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <div className="text-4xl mb-2">🎓</div>
        <p className="text-sm">No quiz available</p>
        <p className="text-xs mt-1">Submit a query first</p>
      </div>
    )
  }

  if (!metadata.quiz || !metadata.quiz.questions || metadata.quiz.questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-4xl mb-2">🎓</div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Test your understanding
        </p>
        <button
          onClick={onGenerateQuiz}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
        >
          Generate Quiz
        </button>
      </div>
    )
  }

  const questions = metadata.quiz.questions

  const handleStartQuiz = () => {
    setQuizStarted(true)
    setCurrentQuestion(0)
    setAnswers([])
    setCurrentAnswer('')
    setQuizComplete(false)
    setMasteryScore(null)
  }

  const handleNextQuestion = () => {
    setAnswers([...answers, currentAnswer])

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setCurrentAnswer('')
    } else {
      // Quiz complete - grade it
      gradeQuiz([...answers, currentAnswer])
    }
  }

  const gradeQuiz = (allAnswers: string[]) => {
    try {
      // Validate quiz data
      if (!questions || questions.length === 0) {
        console.error('No questions available for grading')
        return
      }

      let totalScore = 0
      let questionsGraded = 0

      questions.forEach((q, i) => {
        try {
          const answer = allAnswers[i]?.toLowerCase() || ''
          
          // Safety check for expectedKeywords
          const keywords = Array.isArray(q.expectedKeywords) ? q.expectedKeywords : []
          if (keywords.length === 0) {
            console.warn(`Question ${i} has no keywords, defaulting to 50%`)
            totalScore += 50
          } else {
            const keywordMatches = keywords.filter(kw =>
              answer.includes(kw.toLowerCase())
            ).length

            const questionScore = (keywordMatches / keywords.length) * 100
            totalScore += questionScore
          }
          questionsGraded++
        } catch (qError) {
          console.error(`Error grading question ${i}:`, qError)
          totalScore += 50 // Default score on error
        }
      })

      const avgScore = questionsGraded > 0 ? Math.round(totalScore / questionsGraded) : 0
      setMasteryScore(Math.max(0, Math.min(100, avgScore))) // Clamp 0-100
      setQuizComplete(true)

      // Save to mastery history with error handling
      try {
        addMasteryRecord({
          topic: metadata.topic || 'Unknown Topic',
          score: avgScore,
          date: new Date().toISOString(),
          sessionId: metadata.responseId || `session_${Date.now()}`,
        })
      } catch (saveError) {
        console.error('Failed to save mastery record:', saveError)
      }
    } catch (error) {
      console.error('Error during quiz grading:', error)
      setMasteryScore(0)
      setQuizComplete(true)
    }
  }

  if (!quizStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-4xl mb-2">🎓</div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {questions.length} questions ready
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-500">
          Topic: {metadata.topic}
        </p>
        <button
          onClick={handleStartQuiz}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
        >
          Start Quiz
        </button>
      </div>
    )
  }

  if (quizComplete && masteryScore !== null) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">
            {masteryScore >= 80 ? '🏆' : masteryScore >= 60 ? '✅' : '📚'}
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Quiz Complete!
          </h3>
          <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            {masteryScore}%
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {masteryScore >= 80
              ? 'Excellent! You mastered this topic.'
              : masteryScore >= 60
              ? 'Good job! Keep practicing.'
              : 'Review the material and try again.'}
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Your Answers
          </h4>
          {questions.map((q, i) => {
            const answer = answers[i]?.toLowerCase() || ''
            const matchedKeywords = q.expectedKeywords.filter(kw =>
              answer.includes(kw.toLowerCase())
            )
            const score = (matchedKeywords.length / q.expectedKeywords.length) * 100
            
            return (
              <div
                key={i}
                className="border border-slate-200 dark:border-slate-700 rounded-lg p-3"
              >
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {i + 1}. {q.q}
                </p>
                <div className="bg-slate-50 dark:bg-slate-800 rounded p-2 mb-2">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Your answer: {answers[i]}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`text-xs font-medium ${
                      score >= 70
                        ? 'text-green-600 dark:text-green-400'
                        : score >= 40
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {Math.round(score)}% {score >= 70 ? '✓' : '✗'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Key terms: {matchedKeywords.join(', ') || 'none'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <button
          onClick={handleStartQuiz}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Retry Quiz
        </button>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Question {currentQuestion + 1} of {questions.length}
        </h3>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Progress: {Math.round(((currentQuestion) / questions.length) * 100)}%
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <p className="text-base text-slate-900 dark:text-slate-100 font-medium">
          {currentQ.q}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Your Answer
        </label>
        <textarea
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
        />
      </div>

      <button
        onClick={handleNextQuestion}
        disabled={!currentAnswer.trim()}
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {currentQuestion < questions.length - 1 ? 'Next Question →' : 'Finish Quiz ✓'}
      </button>
    </div>
  )
})
