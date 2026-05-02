"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle2, XCircle, RefreshCw, ArrowLeft } from "lucide-react";

// Mock questions for the prototype
const mockQuestions = [
  {
    id: 1,
    question: "What is the general speed limit in an urban area in South Africa?",
    options: ["40 km/h", "60 km/h", "80 km/h", "100 km/h"],
    correct: 1,
    explanation: "The general speed limit for urban roads in South Africa is 60 km/h unless otherwise indicated."
  },
  {
    id: 2,
    question: "When are you allowed to pass another vehicle on the left side?",
    options: [
      "When the vehicle ahead is turning right.",
      "Anytime on a three-lane road.",
      "Only when driving on a highway.",
      "Never."
    ],
    correct: 0,
    explanation: "You may pass on the left if the vehicle ahead is turning right or has indicated to turn right."
  },
  {
    id: 3,
    question: "What does a solid white line in the middle of the road mean?",
    options: [
      "You may cross it to overtake.",
      "It marks the edge of the road.",
      "You may not cross it to overtake.",
      "It's for parking only."
    ],
    correct: 2,
    explanation: "A solid white line indicates that you may not cross it to overtake other vehicles."
  }
];

export default function LearnersQuizPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = mockQuestions[currentIdx];
  const progress = ((currentIdx) / mockQuestions.length) * 100;

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === currentQuestion.correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < mockQuestions.length) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-zinc-500 hover:text-[#f5d800] flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <Badge variant="outline" className="border-[#f5d800] text-[#f5d800]">
            AI STUDY MODULE
          </Badge>
        </div>

        {!showResult ? (
          <Card className="bg-[#111] border-[#1a1a1a] shadow-2xl">
            <CardHeader>
              <div className="flex justify-between items-center mb-4">
                <p className="text-xs font-bold tracking-widest text-zinc-500">
                  QUESTION {currentIdx + 1} OF {mockQuestions.length}
                </p>
                <div className="flex items-center gap-2 text-[#f5d800]">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm font-bold">{score} Points</span>
                </div>
              </div>
              <Progress value={progress} className="h-1 bg-[#1a1a1a]" />
              <CardTitle className="text-2xl font-headline mt-6 text-white leading-tight">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 mt-4">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correct;
                
                let buttonStyle = "border-[#2a2a2a] bg-[#141414] hover:bg-[#1a1a1a] text-zinc-300";
                if (isAnswered) {
                  if (isCorrect) buttonStyle = "border-green-500 bg-green-500/10 text-green-400";
                  else if (isSelected) buttonStyle = "border-red-500 bg-red-500/10 text-red-400";
                  else buttonStyle = "border-[#2a2a2a] bg-[#141414] opacity-50 text-zinc-500";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-xl text-left border-2 transition-all duration-200 flex items-center justify-between ${buttonStyle}`}
                  >
                    <span className="text-sm font-medium">{option}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                  </button>
                );
              })}

              {isAnswered && (
                <div className="mt-8 p-4 bg-[#1a1a1a] border-l-4 border-[#f5d800] rounded-r-xl animate-in fade-in slide-in-from-left-4">
                  <p className="text-xs font-bold text-[#f5d800] mb-1">EXPLANATION</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                  <Button 
                    onClick={handleNext}
                    className="mt-4 w-full bg-[#f5d800] text-black hover:bg-[#e5c800] font-bold"
                  >
                    {currentIdx + 1 < mockQuestions.length ? "Next Question" : "See Results"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-[#111] border-[#1a1a1a] text-center p-8 shadow-2xl">
            <div className="w-20 h-20 bg-[#f5d800] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-black" />
            </div>
            <h2 className="text-3xl font-headline font-bold mb-2">Quiz Complete!</h2>
            <p className="text-zinc-500 mb-8">
              You scored <span className="text-[#f5d800] font-bold">{score}</span> out of {mockQuestions.length}.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={resetQuiz} variant="outline" className="border-[#2a2a2a] text-white hover:bg-[#1a1a1a]">
                <RefreshCw className="w-4 h-4 mr-2" /> Try Again
              </Button>
              <Button asChild className="bg-[#f5d800] text-black hover:bg-[#e5c800] font-bold">
                <Link href="/booking">Book a Lesson</Link>
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
