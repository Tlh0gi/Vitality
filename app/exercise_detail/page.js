'use client';

import { Suspense } from 'react';
import Navbar from '../../components/Navbar';
import ExerciseDetailContent from './ExerciseDetailContent';


export default function ExerciseDetail() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
       <div className="max-w-5xl mx-auto px-5 py-10 text-gray-500 text-sm">
        Loading...
      </div>
      }>
        <ExerciseDetailContent />
      </Suspense>
    </>
  );
}