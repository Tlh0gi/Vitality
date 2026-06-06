'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { NUTRITION_DATA, getSectionKeys } from '../../utils/nutritionData';

import {
  BoltIcon,
  TrophyIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  FireIcon,
  HeartIcon,
  LightBulbIcon,
  BeakerIcon,
  ClockIcon,
  SparklesIcon,
  CheckCircleIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';

// Map section keys to Heroicons
const SECTION_ICONS = {
  general: TrophyIcon,
  upper_body: ArrowUpIcon,
  lower_body: ArrowDownIcon,
  core: FireIcon,
  cardio: HeartIcon,
};

// Nav labels without emojis
const SECTION_LABELS = {
  general: 'General Fitness',
  upper_body: 'Upper Body',
  lower_body: 'Lower Body',
  core: 'Core',
  cardio: 'Cardio',
};

const quickFacts = [
  { number: '60%', label: 'of your body is water', icon: BeakerIcon },
  { number: '2–3L', label: 'of water daily', icon: SparklesIcon },
  { number: '30 min', label: 'post-workout protein window', icon: ClockIcon },
  { number: '5–6', label: 'small meals per day', icon: ListBulletIcon },
];

export default function Health() {
  const [activeSection, setActiveSection] = useState('general');
  const sectionKeys = getSectionKeys();

  const showSection = (sectionKey) => {
    setActiveSection(sectionKey);
    setTimeout(() => {
      const element = document.getElementById(sectionKey + '-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <>
      <Navbar />

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-r from-teal-500 to-green-600 text-white py-16 text-center mb-10">
          <div className="max-w-2xl mx-auto px-5">
            <div className="flex justify-center mb-4">
              <HeartIcon className="w-12 h-12 opacity-90" />
            </div>
            <h1 className="text-4xl font-bold mb-3">Health &amp; Nutrition</h1>
            <p className="text-lg opacity-85">
              Fuel your body with the right nutrition for optimal performance and results
            </p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-5">

          {/* Quick Facts */}
          <section className="bg-gradient-to-r from-teal-500 to-green-600 rounded-2xl p-7 mb-8 text-white">
            <h3 className="text-center font-semibold text-lg mb-6 flex items-center justify-center gap-2">
              <LightBulbIcon className="w-5 h-5" />
              Quick Nutrition Facts
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickFacts.map(({ number, label, icon: Icon }) => (
                <div
                  key={label}
                  className="bg-white/15 rounded-xl p-4 text-center backdrop-blur-sm"
                >
                  <Icon className="w-5 h-5 mx-auto mb-2 opacity-80" />
                  <span className="block text-2xl font-bold">{number}</span>
                  <span className="text-sm opacity-85 leading-tight block mt-1">{label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Sticky Nav */}
          <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 mb-8 sticky top-[80px] z-10">
            <div className="flex flex-wrap gap-2 justify-center">
              {sectionKeys.map((key) => {
                const Icon = SECTION_ICONS[key] || BoltIcon;
                const isActive = activeSection === key;
                return (
                  <button
                    key={key}
                    onClick={() => showSection(key)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-teal-500 text-white shadow-sm'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {SECTION_LABELS[key] || key}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Nutrition Sections */}
          {sectionKeys.map((sectionKey) => {
            const section = NUTRITION_DATA[sectionKey];
            const SectionIcon = SECTION_ICONS[sectionKey] || BoltIcon;

            if (activeSection !== sectionKey) return null;

            return (
              <section
                key={sectionKey}
                id={`${sectionKey}-section`}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 mb-8 animate-fadeIn"
              >
                {/* Section Header */}
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-teal-50 rounded-2xl mb-4">
                    <SectionIcon className="w-7 h-7 text-teal-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{section.title}</h2>
                  <p className="text-gray-500 text-sm max-w-lg mx-auto">{section.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Tips */}
                  <div className="bg-gray-50 border-l-4 border-teal-500 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-800 text-base mb-5 flex items-center gap-2">
                      <LightBulbIcon className="w-5 h-5 text-teal-500" />
                      Nutrition Tips
                    </h3>
                    <div className="space-y-3">
                      {section.tips.map((tip, index) => (
                        <div
                          key={index}
                          className="bg-white border border-gray-100 rounded-xl p-4 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200"
                        >
                          <div className="flex items-center gap-3 mb-1.5">
                            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center shrink-0">
                              <SparklesIcon className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-semibold text-gray-800 text-sm">{tip.title}</span>
                          </div>
                          <p className="text-gray-500 text-sm leading-relaxed pl-11">{tip.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Foods */}
                  <div className="bg-gray-50 border-l-4 border-green-500 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-800 text-base mb-5 flex items-center gap-2">
                      <ListBulletIcon className="w-5 h-5 text-green-600" />
                      Recommended Foods
                    </h3>
                    <ul className="space-y-2">
                      {section.foods.map((food, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-3 bg-white border-l-[3px] border-green-400 rounded-xl px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:translate-x-1 transition-all duration-200 cursor-default"
                        >
                          <CheckCircleIcon className="w-4 h-4 text-green-500 shrink-0" />
                          {food}
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </section>
            );
          })}

        </div>
      </main>
    </>
  );
}