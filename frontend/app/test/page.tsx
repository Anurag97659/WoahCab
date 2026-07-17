"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { apiFetch } from "../../utils/api";

interface Question {
  question: string;
  level: string;
  options: string[];
  correctAnswer: string; // "A", "B", "C", or "D"
}

export default function TestPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({}); // { questionIndex: selectedLetter }
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTest = async () => {
    setLoading(true);
    setError("");
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
    try {
      const res = await apiFetch("/WoahCab/words/generatetest");
      if (res?.data && Array.isArray(res.data)) {
        setQuestions(res.data);
      } else {
        setError("Failed to fetch questions. Please make sure you have added words to the database first.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate test. Make sure you have words in your database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTest();
  }, []);

  const handleSelectOption = (qIdx: number, optionLetter: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [qIdx]: optionLetter,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitted) return;

    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setIsSubmitted(true);
  };

  const getOptionLetter = (optionText: string): string => {
    // Standardize letter extraction (e.g. "A. Option 1" -> "A")
    const match = optionText.match(/^([A-D])\./i);
    return match ? match[1].toUpperCase() : "";
  };

  return (
    <div className="min-h-screen bg-background text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-8">
        <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Competitive Vocabulary Test</h1>
            <p className="text-slate-650 dark:text-slate-400 text-sm mt-1 font-medium">
              AFCAT, CDS, and Competitive Level MCQs generated from your vocabulary bank.
            </p>
          </div>
          {!loading && questions.length > 0 && (
            <button
              onClick={loadTest}
              type="button"
              className="py-2.5 px-5 bg-violet-600/10 hover:bg-violet-600/20 text-violet-600 dark:text-violet-400 border border-violet-500/20 hover:border-violet-500/30 font-semibold rounded-2xl transition-all text-sm cursor-pointer self-center sm:self-auto"
            >
              Reset / Fresh Test
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-6 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-center font-medium max-w-lg mx-auto">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-base font-bold mb-2">Error Generating Test</p>
            <p className="text-sm opacity-90 mb-4">{error}</p>
            <button
              onClick={loadTest}
              className="py-2 px-4 bg-red-500 text-white font-semibold rounded-xl text-xs hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {loading ? (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full border-4 border-t-violet-600 border-indigo-500/20 animate-spin mx-auto mb-4" />
              <p className="text-slate-655 dark:text-slate-400 font-semibold animate-pulse">
                AI is generating 20 AFCAT/CDS level questions from your vocabulary...
              </p>
            </div>
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-card border border-border rounded-3xl p-6 space-y-4 animate-pulse">
                <div className="h-5 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                <div className="space-y-2">
                  <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                  <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                  <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                  <div className="h-4 w-2/5 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          !error && questions.length > 0 && (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto pb-12">
              {isSubmitted && (
                <div className="p-6 rounded-3xl bg-violet-600/10 border border-violet-500/20 text-center mb-8">
                  <h2 className="text-2xl font-extrabold text-violet-650 dark:text-violet-400 mb-1">
                    Test Completed!
                  </h2>
                  <p className="text-slate-700 dark:text-slate-350 font-bold text-lg">
                    Your Score: <span className="text-2xl text-violet-600 dark:text-violet-400">{score}</span> / {questions.length}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Review your answers below. Correct choices are highlighted in green, incorrect ones in red.
                  </p>
                  <button
                    type="button"
                    onClick={loadTest}
                    className="mt-4 py-2.5 px-6 bg-violet-650 text-white font-bold rounded-2xl hover:bg-violet-600 transition-colors shadow-lg shadow-violet-600/20 text-sm cursor-pointer"
                  >
                    Take Another Test
                  </button>
                </div>
              )}

              <div className="space-y-6">
                {questions.map((q, idx) => {
                  const selectedAnswer = answers[idx];
                  const isCorrect = selectedAnswer === q.correctAnswer;

                  return (
                    <div
                      key={idx}
                      className={`bg-card border rounded-3xl p-6 shadow-md transition-all duration-300 ${
                        isSubmitted
                          ? isCorrect
                            ? "border-emerald-500/40 bg-emerald-500/5"
                            : "border-rose-500/40 bg-rose-500/5"
                          : "border-border hover:shadow-lg"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <h3 className="text-base font-bold leading-relaxed text-slate-850 dark:text-slate-100">
                          {idx + 1}. {q.question}
                        </h3>
                        <span className="text-[10px] bg-background border border-border px-2 py-0.5 rounded-lg text-slate-500 font-bold shrink-0 uppercase tracking-wider">
                          {q.level}
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {q.options.map((option, optIdx) => {
                          const optionLetter = getOptionLetter(option) || String.fromCharCode(65 + optIdx); // fallback A, B, C, D
                          const isSelected = selectedAnswer === optionLetter;
                          
                          // Style states for submitted review:
                          // 1. Correct option: Always highlighted green
                          // 2. Selected wrong option: Highlighted red
                          let optionStyle = "border-border bg-background/50 hover:bg-card-hover";
                          if (isSubmitted) {
                            if (optionLetter === q.correctAnswer) {
                              optionStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 font-semibold";
                            } else if (isSelected && !isCorrect) {
                              optionStyle = "border-rose-500 bg-rose-500/20 text-rose-900 dark:text-rose-300 font-semibold";
                            } else {
                              optionStyle = "border-border bg-background/20 opacity-60";
                            }
                          } else if (isSelected) {
                            optionStyle = "border-violet-650 bg-violet-600/5 text-violet-650 dark:text-violet-400";
                          }

                          return (
                            <div
                              key={optIdx}
                              onClick={() => handleSelectOption(idx, optionLetter)}
                              className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm font-medium transition-all cursor-pointer ${
                                !isSubmitted && "active:scale-[0.99]"
                              } ${optionStyle}`}
                            >
                              <div className="flex items-center justify-center shrink-0">
                                <input
                                  type="radio"
                                  name={`question-${idx}`}
                                  checked={isSelected}
                                  disabled={isSubmitted}
                                  onChange={() => handleSelectOption(idx, optionLetter)}
                                  className="w-4 h-4 text-violet-600 border-slate-300 focus:ring-violet-500 accent-violet-650 dark:accent-violet-400"
                                />
                              </div>
                              <span className="leading-relaxed">{option}</span>
                            </div>
                          );
                        })}
                      </div>

                      {isSubmitted && !isCorrect && (
                        <div className="mt-4 pt-3 border-t border-rose-500/10 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Incorrect. Correct answer is option {q.correctAnswer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!isSubmitted && (
                <div className="pt-4 flex justify-center">
                  <button
                    type="submit"
                    className="w-full sm:w-auto py-3.5 px-10 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-violet-600/20 active:scale-95 text-base cursor-pointer"
                  >
                    Submit Test
                  </button>
                </div>
              )}
            </form>
          )
        )}
      </main>
    </div>
  );
}
