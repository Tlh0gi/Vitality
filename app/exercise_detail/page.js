'use client';

import { Suspense } from 'react';
import Navbar from '../../components/Navbar';
import ExerciseDetailContent from './ExerciseDetailContent';
import './exercise_detail.css';

export default function ExerciseDetail() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="detail-container">
          <p>Loading...</p>
        </div>
      }>
        <ExerciseDetailContent />
      </Suspense>
    </>
  );
}