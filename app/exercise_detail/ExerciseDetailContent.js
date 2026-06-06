'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getExercise, getCategory } from '../../utils/exerciseProvider';
import {
  getCompletedExercises,
  toggleExerciseCompletion,
} from '../../utils/exerciseStorage';

import {
  ArrowLeftIcon,
  CheckCircleIcon,
  BoltIcon,
  WrenchScrewdriverIcon,
  UserIcon,
  CubeIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

export default function ExerciseDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const exerciseId = searchParams.get('id');

  const [exercise, setExercise] = useState(null);
  const [category, setCategory] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [dataSource, setDataSource] = useState('loading');

  useEffect(() => {
    loadExercise();
  }, [exerciseId, router]);

  async function loadExercise() {
    if (!exerciseId) {
      router.push('/exercises');
      return;
    }
    const response = await getExercise(exerciseId);
    if (!response.success || !response.data) {
      router.push('/exercises');
      return;
    }
    setExercise(response.data);
    setDataSource(response.source);
    const cat = getCategory(response.data.categoryId);
    setCategory(cat);
    const completedExercises = getCompletedExercises();
    setIsCompleted(completedExercises.includes(exerciseId));
  }

  function handleToggle() {
    const result = toggleExerciseCompletion(exerciseId);
    if (result.success) setIsCompleted(result.completed);
    else console.error('Failed to toggle completion');
  }

  if (!exercise) {
    return (
      <div className="max-w-5xl mx-auto px-5 py-10 text-gray-500 text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Green Header ── */}
      <div className="bg-gradient-to-r from-teal-500 to-green-600 text-white px-6 md:px-10 py-8">
        <div className="max-w-7xl mx-auto">

          {/* Back link */}
          <Link
            href="/exercises"
            className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium mb-6 transition-colors duration-200 group"
          >
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
            Back to Exercises
          </Link>

          {/* Title row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
                {exercise.name}
              </h1>
              {category && (
                <span className="inline-block bg-white/20 border border-white/30 text-white text-sm font-medium px-4 py-1 rounded-full">
                  {category.name}
                </span>
              )}
            </div>

            {/* Completion toggle */}
            <button
              onClick={handleToggle}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl border-2 font-medium text-sm transition-all duration-200 whitespace-nowrap self-start ${
                isCompleted
                  ? 'bg-white text-green-700 border-white shadow-md'
                  : 'bg-white/15 hover:bg-white/25 border-white/30 hover:border-white/50 text-white'
              }`}
            >
              {isCompleted ? (
                <CheckCircleSolid className="w-5 h-5 text-green-600" />
              ) : (
                <CheckCircleIcon className="w-5 h-5" />
              )}
              {isCompleted ? 'Completed Today' : 'Mark as Complete'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Offline notice ── */}
      {dataSource === 'local' && (
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-5">
          <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium px-4 py-3 rounded-xl">
            <InformationCircleIcon className="w-5 h-5 text-amber-500 shrink-0" />
            This exercise is from offline data. API quota may be exceeded.
          </div>
        </div>
      )}

      {/* ── Two-column body ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">

        {/* Status banner */}
        <div
          className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border mb-8 text-sm font-medium ${
            isCompleted
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          {isCompleted ? (
            <CheckCircleSolid className="w-5 h-5 text-green-600 shrink-0" />
          ) : (
            <BoltIcon className="w-5 h-5 text-amber-500 shrink-0" />
          )}
          {isCompleted
            ? 'Great job! You completed this exercise today.'
            : 'Ready to crush this workout?'}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* ── LEFT: GIF ── */}
          <div className="lg:sticky lg:top-24">
            {exercise.gifUrl ? (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <img
                  src={exercise.gifUrl}
                  alt={exercise.name}
                  className="w-full object-contain max-h-[480px]"
                />
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-center h-64 text-gray-300 text-sm">
                No preview available
              </div>
            )}

            {/* Metadata tiles below GIF */}
            {(exercise.target || exercise.equipment || exercise.bodyPart) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                {exercise.target && (
                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-start gap-3">
                    <div className="bg-teal-50 p-2 rounded-lg shrink-0">
                      <UserIcon className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Target</p>
                      <p className="text-sm font-semibold text-gray-800 capitalize">{exercise.target}</p>
                    </div>
                  </div>
                )}
                {exercise.equipment && (
                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-start gap-3">
                    <div className="bg-teal-50 p-2 rounded-lg shrink-0">
                      <WrenchScrewdriverIcon className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Equipment</p>
                      <p className="text-sm font-semibold text-gray-800 capitalize">{exercise.equipment}</p>
                    </div>
                  </div>
                )}
                {exercise.bodyPart && (
                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-start gap-3">
                    <div className="bg-teal-50 p-2 rounded-lg shrink-0">
                      <CubeIcon className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Body Part</p>
                      <p className="text-sm font-semibold text-gray-800 capitalize">{exercise.bodyPart}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── RIGHT: Text content ── */}
          <div className="flex flex-col gap-6">

            {/* Description */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-3">
                <DocumentTextIcon className="w-5 h-5 text-teal-500" />
                Description
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">{exercise.description}</p>
            </div>

            {/* Instructions */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-4">
                <ListBulletIcon className="w-5 h-5 text-teal-500" />
                Instructions
              </h2>
              <div className="bg-gray-50 border-l-4 border-teal-500 rounded-xl px-5 py-4 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {exercise.instructions}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleToggle}
                className={`flex-1 inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                  isCompleted
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-teal-500 hover:bg-teal-600 text-white'
                }`}
              >
                {isCompleted ? (
                  <CheckCircleSolid className="w-4 h-4" />
                ) : (
                  <CheckCircleIcon className="w-4 h-4" />
                )}
                {isCompleted ? 'Completed' : 'Mark as Complete'}
              </button>

              <Link
                href="/exercises"
                className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Back to Exercises
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}