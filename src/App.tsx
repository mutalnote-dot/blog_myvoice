import { useState } from 'react';
import { TopBar } from './components/TopBar';
import { StepIndicator } from './components/StepIndicator';
import { Step1 } from './components/Step1';
import { Step2 } from './components/Step2';
import { Step3 } from './components/Step3';

export interface AppState {
  step: number;
  files: File[];
  allText: string;
  analysis: string;
  topic: string;
  length: string;
  generated: string;
  loading: boolean;
  loadingMsg: string;
  error: string;
}

export default function App() {
  const [state, setState] = useState<AppState>({
    step: 1,
    files: [],
    allText: '',
    analysis: '',
    topic: '',
    length: '보통',
    generated: '',
    loading: false,
    loadingMsg: '',
    error: ''
  });

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col">
        <StepIndicator currentStep={state.step} />
        
        {state.error && (
          <div className="mb-6 p-4 rounded-lg bg-[var(--color-error-bg)] text-[var(--color-error-text)] border border-[var(--color-error-text)]/20 animate-fade-up">
            {state.error}
          </div>
        )}

        <div className="flex-1 relative">
          {state.step === 1 && <Step1 state={state} updateState={updateState} />}
          {state.step === 2 && <Step2 state={state} updateState={updateState} />}
          {state.step === 3 && <Step3 state={state} updateState={updateState} />}
        </div>
      </main>
    </div>
  );
}
