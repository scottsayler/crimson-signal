"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  calculateAssessmentResults,
  clearAssessmentState,
  loadAssessmentState,
  saveAssessmentState,
  type AssessmentAnswers,
  type AssessmentDefinition,
  type PersistedAssessmentState,
} from "@/lib/assessments";

const choiceClassName =
  "w-full rounded-lg border border-border bg-surface px-4 py-3.5 text-left text-sm leading-relaxed text-foreground transition-colors hover:border-crimson/30 hover:bg-crimson/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson/20";

const selectedChoiceClassName =
  "border-crimson/40 bg-crimson/10 ring-1 ring-crimson/20";

interface AssessmentRendererProps {
  definition: AssessmentDefinition;
}

function ScoreBar({ score, label }: { score: number; label: string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
        <span className="text-foreground">{label}</span>
        <span className="font-medium text-foreground">{score}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-crimson transition-all duration-300"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function InsightList({
  title,
  items,
  tone,
}: {
  title: string;
  items: { label: string; score: number; category: string }[];
  tone: "positive" | "negative";
}) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-surface px-5 py-4">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li key={item.label} className="text-sm leading-relaxed">
            <div className="flex items-start justify-between gap-3">
              <span className="text-muted">{item.label}</span>
              <span
                className={`shrink-0 font-medium ${
                  tone === "positive" ? "text-emerald-700" : "text-crimson"
                }`}
              >
                {item.score}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-light">{item.category}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AssessmentRenderer({ definition }: AssessmentRendererProps) {
  const { questions, categories, id: assessmentId } = definition;
  const totalQuestions = questions.length;

  const [hydrated, setHydrated] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const saved = loadAssessmentState(assessmentId);
    if (saved) {
      setCurrentIndex(saved.currentIndex);
      setAnswers(saved.answers);
      setShowResults(saved.showResults);
    }
    setHydrated(true);
  }, [assessmentId]);

  const persist = useCallback(
    (state: PersistedAssessmentState) => {
      saveAssessmentState(assessmentId, state);
    },
    [assessmentId]
  );

  const results = useMemo(
    () => calculateAssessmentResults(definition, answers),
    [definition, answers]
  );

  const currentQuestion = questions[currentIndex];
  const currentCategory = categories.find(
    (category) => category.id === currentQuestion?.category
  );
  const progressPct = Math.round((results.answeredCount / totalQuestions) * 100);
  const allAnswered = results.answeredCount === totalQuestions;

  function updateAnswer(questionId: string, score: number) {
    const nextAnswers = { ...answers, [questionId]: score };
    setAnswers(nextAnswers);

    const nextIndex = currentIndex < totalQuestions - 1 ? currentIndex + 1 : currentIndex;

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(nextIndex);
    }

    const nextShowResults =
      Object.keys(nextAnswers).length === totalQuestions ? true : showResults;

    if (Object.keys(nextAnswers).length === totalQuestions) {
      setShowResults(true);
    }

    persist({
      currentIndex: nextIndex,
      answers: nextAnswers,
      showResults: nextShowResults,
    });
  }

  function goToQuestion(index: number) {
    setCurrentIndex(index);
    persist({ currentIndex: index, answers, showResults });
  }

  function handleReset() {
    setCurrentIndex(0);
    setAnswers({});
    setShowResults(false);
    clearAssessmentState(assessmentId);
  }

  function handleReviewResults() {
    setShowResults(true);
    persist({ currentIndex, answers, showResults: true });
  }

  if (!hydrated) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 text-sm text-muted">
        Loading assessment…
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  if (showResults) {
    return (
      <div className="space-y-6">
        <div
          aria-live="polite"
          className="rounded-xl border border-crimson/20 bg-crimson/5 p-5 sm:p-6"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            {definition.scoreLabel}
          </p>
          <div className="mt-2 flex flex-wrap items-end gap-3">
            <p className="font-serif text-4xl font-medium tracking-tight text-foreground">
              {results.overallScore}
              <span className="text-2xl text-muted">/100</span>
            </p>
            <p className="rounded-full border border-crimson/30 bg-surface px-3 py-1 text-sm font-medium text-foreground">
              {results.maturityLevel}
            </p>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            {results.maturitySummary}
          </p>
          <p className="mt-4 text-xs text-muted-light">
            {results.answeredCount} of {results.totalQuestions} questions answered.
            {definition.resultsDisclaimer ? ` ${definition.resultsDisclaimer}` : ""}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-muted">
            Category scores
          </h3>
          <div className="space-y-4">
            {results.categoryScores.map((category) => (
              <ScoreBar key={category.id} label={category.label} score={category.score} />
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <InsightList title="Biggest strengths" items={results.strengths} tone="positive" />
          <InsightList title="Highest risks" items={results.risks} tone="negative" />
        </div>

        {results.priorities.length > 0 && (
          <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
              Recommended priorities
            </h3>
            <ul className="space-y-4">
              {results.priorities.map((priority) => (
                <li key={priority.href} className="rounded-lg border border-border px-4 py-4">
                  <Link
                    href={priority.href}
                    className="text-[15px] font-semibold text-crimson hover:underline"
                  >
                    {priority.title}
                  </Link>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{priority.reason}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setShowResults(false);
              persist({ currentIndex, answers, showResults: false });
            }}
            className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted/10"
          >
            Review answers
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-muted hover:text-foreground"
          >
            Start over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Question {currentIndex + 1} of {totalQuestions}
            </p>
            <p className="mt-1 text-sm text-muted">
              {currentCategory?.label} · {results.answeredCount} answered
            </p>
          </div>
          {allAnswered && (
            <button
              type="button"
              onClick={handleReviewResults}
              className="rounded-lg bg-crimson px-4 py-2 text-sm font-medium text-white hover:bg-crimson/90"
            >
              View results
            </button>
          )}
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs text-muted">
            <span>Progress</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-crimson transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <h3 className="font-serif text-xl font-medium tracking-tight text-foreground">
          {currentQuestion.prompt}
        </h3>
        {currentCategory && (
          <p className="mt-2 text-sm leading-relaxed text-muted">{currentCategory.description}</p>
        )}

        <div className="mt-6 space-y-3" role="radiogroup" aria-label={currentQuestion.prompt}>
          {currentQuestion.choices.map((choice) => {
            const selected = answers[currentQuestion.id] === choice.score;

            return (
              <button
                key={`${currentQuestion.id}-${choice.score}`}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => updateAnswer(currentQuestion.id, choice.score)}
                className={`${choiceClassName} ${selected ? selectedChoiceClassName : ""}`}
              >
                {choice.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => goToQuestion(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted enabled:hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => goToQuestion(Math.min(totalQuestions - 1, currentIndex + 1))}
            disabled={currentIndex === totalQuestions - 1}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted enabled:hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
          Jump to question
        </h3>
        <div className="flex flex-wrap gap-2">
          {questions.map((question, index) => {
            const answered = answers[question.id] !== undefined;
            const active = index === currentIndex;

            return (
              <button
                key={question.id}
                type="button"
                onClick={() => goToQuestion(index)}
                aria-label={`Question ${index + 1}${answered ? ", answered" : ""}`}
                className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                  active
                    ? "border-crimson bg-crimson text-white"
                    : answered
                      ? "border-crimson/30 bg-crimson/10 text-foreground"
                      : "border-border bg-surface text-muted hover:border-crimson/20"
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
