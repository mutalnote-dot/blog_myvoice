import { AppState } from '../App';
import { RefreshCw, ArrowRight } from 'lucide-react';

interface Step2Props {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function Step2({ state, updateState }: Step2Props) {
  const handleBack = () => {
    updateState({ step: 1, analysis: '', files: [], allText: '' });
  };

  const handleNext = () => {
    updateState({ step: 3 });
  };

  return (
    <div className="animate-fade-up max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-semibold mb-3 text-white">말투 분석 결과</h2>
        <p className="text-gray-400">AI가 파악한 당신의 글쓰기 스타일입니다.</p>
      </div>

      <div className="bg-[var(--color-card-bg)] border border-[var(--color-card-border)] rounded-2xl p-8 mb-10 shadow-xl">
        <div className="prose prose-invert max-w-none text-[var(--color-text-main)] whitespace-pre-wrap leading-relaxed">
          {state.analysis}
        </div>
      </div>

      <div className="flex justify-between items-center mt-12">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          다시 업로드
        </button>
        
        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-8 py-3.5 rounded-full font-medium text-lg bg-[var(--color-accent)] text-[var(--color-bg-main)] hover:bg-yellow-600 hover:shadow-[0_0_20px_rgba(200,160,80,0.3)] transition-all duration-300"
        >
          이 스타일로 글 생성하기
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
