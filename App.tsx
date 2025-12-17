
import React, { useState, useEffect, useMemo } from 'react';
import { ViewType, AppState } from './types';
import { CHAPTERS, TOTAL_QUESTIONS } from './data';
import LikertScale from './components/LikertScale';
import ProgressHeader from './components/ProgressHeader';
import ResultsView from './components/ResultsView';

const QUESTIONS_PER_PAGE = 5;

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentView: 'INTRO',
    currentChapterIndex: 0,
    currentPageInChapter: 0,
    answers: {},
  });

  const totalAnsweredCount = Object.keys(state.answers).length;

  const currentChapter = CHAPTERS[state.currentChapterIndex];
  const questionsOnPage = useMemo(() => {
    if (state.currentView !== 'QUESTIONS' || !currentChapter) return [];
    const start = state.currentPageInChapter * QUESTIONS_PER_PAGE;
    return currentChapter.questions.slice(start, start + QUESTIONS_PER_PAGE);
  }, [state.currentView, state.currentChapterIndex, state.currentPageInChapter, currentChapter]);

  const isPageComplete = useMemo(() => {
    return questionsOnPage.length > 0 && questionsOnPage.every(q => state.answers[q.id] !== undefined);
  }, [questionsOnPage, state.answers]);

  const handleAnswer = (questionId: number, value: number) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value }
    }));
  };

  const handleNext = () => {
    if (state.currentView === 'INTRO') {
      setState(prev => ({ ...prev, currentView: 'CHAPTER_COVER', currentChapterIndex: 0 }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (state.currentView === 'CHAPTER_COVER') {
      setState(prev => ({ ...prev, currentView: 'QUESTIONS', currentPageInChapter: 0 }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (state.currentView === 'QUESTIONS') {
      const totalPagesInChapter = Math.ceil(currentChapter.questions.length / QUESTIONS_PER_PAGE);
      
      if (state.currentPageInChapter < totalPagesInChapter - 1) {
        setState(prev => ({ ...prev, currentPageInChapter: prev.currentPageInChapter + 1 }));
      } else {
        if (state.currentChapterIndex < CHAPTERS.length - 1) {
          setState(prev => ({ 
            ...prev, 
            currentView: 'CHAPTER_COVER', 
            currentChapterIndex: prev.currentChapterIndex + 1,
            currentPageInChapter: 0 
          }));
        } else {
          setState(prev => ({ ...prev, currentView: 'RESULTS' }));
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const reset = () => {
    setState({
      currentView: 'INTRO',
      currentChapterIndex: 0,
      currentPageInChapter: 0,
      answers: {},
    });
  };

  const activeQuestionId = useMemo(() => {
    const unanswered = questionsOnPage.find(q => state.answers[q.id] === undefined);
    return unanswered ? unanswered.id : (questionsOnPage.length > 0 ? questionsOnPage[questionsOnPage.length - 1].id : null);
  }, [questionsOnPage, state.answers]);

  const isLastPageOfLastChapter = useMemo(() => {
    if (!currentChapter) return false;
    const totalPages = Math.ceil(currentChapter.questions.length / QUESTIONS_PER_PAGE);
    return state.currentChapterIndex === CHAPTERS.length - 1 && state.currentPageInChapter === totalPages - 1;
  }, [state.currentChapterIndex, state.currentPageInChapter, currentChapter]);

  if (state.currentView === 'RESULTS') {
    return <ResultsView chapters={CHAPTERS} answers={state.answers} onReset={reset} />;
  }

  return (
    <div className="min-h-screen selection:bg-green-500/30 bg-neutral-900 text-white">
      <ProgressHeader current={totalAnsweredCount} total={TOTAL_QUESTIONS} />

      <main className="pt-20 pb-32 px-4 flex flex-col items-center w-full">
        
        {state.currentView === 'INTRO' && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 px-6">
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-transparent">
              探索你的尝试
            </h1>
            <p className="text-xl text-neutral-400 mb-12 leading-relaxed">
              这是一次深度的感官与心理测绘。通过80个关于亲密关系、欲望与边界的问题，我们将为您描绘出独一无二的欲望地图。
            </p>
            <button 
              onClick={handleNext}
              className="px-12 py-5 bg-white text-black font-bold text-lg rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              即刻开始探索
            </button>
          </div>
        )}

        {state.currentView === 'CHAPTER_COVER' && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-2xl animate-in zoom-in duration-700 px-6">
            <span className="text-green-500 font-bold tracking-widest uppercase mb-4 opacity-75">NEW CHAPTER</span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              {CHAPTERS[state.currentChapterIndex].title}
            </h2>
            <p className="text-lg text-neutral-400 mb-12 leading-relaxed">
              {CHAPTERS[state.currentChapterIndex].description}
            </p>
            <button 
              onClick={handleNext}
              className="px-12 py-4 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white hover:text-black hover:border-white transition-all backdrop-blur-sm"
            >
              进入章节
            </button>
          </div>
        )}

        {state.currentView === 'QUESTIONS' && (
          <div className="w-full max-w-4xl space-y-16 py-10">
            <div className="text-center mb-8">
               <p className="text-neutral-500 uppercase tracking-widest text-xs font-bold mb-2">
                 {CHAPTERS[state.currentChapterIndex].title}
               </p>
               <div className="flex justify-center gap-1">
                  {Array.from({length: Math.ceil(currentChapter.questions.length / QUESTIONS_PER_PAGE)}).map((_, i) => (
                    <div key={i} className={`h-1 w-4 rounded-full ${i === state.currentPageInChapter ? 'bg-green-500' : 'bg-neutral-800'}`} />
                  ))}
               </div>
            </div>

            {questionsOnPage.map((q) => {
              const hasAnswer = state.answers[q.id] !== undefined;
              const isActuallyActive = q.id === activeQuestionId || hasAnswer;
              
              return (
                <div 
                  key={q.id} 
                  className={`transition-all duration-700 ease-in-out ${isActuallyActive ? 'opacity-100 translate-x-0' : 'opacity-10 pointer-events-none blur-sm'}`}
                >
                  <h3 className={`text-2xl md:text-3xl font-bold mb-8 text-center px-4 transition-colors duration-500 ${isActuallyActive ? 'text-white' : 'text-neutral-600'}`}>
                    {q.text}
                  </h3>
                  <LikertScale 
                    questionId={q.id}
                    value={state.answers[q.id]}
                    onChange={(val) => handleAnswer(q.id, val)}
                    isActive={isActuallyActive}
                  />
                </div>
              );
            })}

            <div className={`pt-12 flex justify-center transition-all duration-500 ${isPageComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              <button 
                onClick={handleNext}
                disabled={!isPageComplete}
                className="px-16 py-5 bg-green-500 text-black font-black text-lg rounded-2xl hover:bg-green-400 transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:-translate-y-1 active:translate-y-0 disabled:bg-neutral-700 disabled:text-neutral-500"
              >
                {isLastPageOfLastChapter ? '生成探索报告' : '继续下一组'}
              </button>
            </div>
          </div>
        )}

      </main>

      {state.currentView === 'QUESTIONS' && !isPageComplete && (
        <div className="fixed bottom-0 left-0 w-full p-4 bg-black/40 backdrop-blur-xl border-t border-white/5 text-center animate-in slide-in-from-bottom-full duration-500">
           <span className="text-neutral-400 text-sm font-medium">请选择您对当前选项的接受程度以继续</span>
        </div>
      )}
    </div>
  );
};

export default App;
