import { useState } from 'react';
import { AppState } from '../App';
import { Copy, Check, RefreshCcw, FilePlus, ArrowLeft, Sparkles } from 'lucide-react';
import { generateText } from '../utils/geminiApi';

interface Step3Props {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function Step3({ state, updateState }: Step3Props) {
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!state.topic.trim()) return;
    
    updateState({ loading: true, error: '', loadingMsg: '글 생성 중...' });
    
    try {
      const result = await generateText(state.topic, state.analysis, state.length);
      updateState({ generated: result, loading: false });
    } catch (err: any) {
      updateState({ error: err.message || '글 생성 중 오류가 발생했습니다.', loading: false });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(state.generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    updateState({ topic: '', generated: '' });
  };

  if (state.loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 animate-fade-up">
        <div className="spinner mb-6 w-12 h-12 border-4"></div>
        <p className="text-xl font-medium text-[var(--color-accent)] animate-pulse-custom">
          {state.loadingMsg}
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-up max-w-3xl mx-auto pb-20">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-semibold mb-3 text-white">새로운 글 작성</h2>
        <p className="text-gray-400 mb-4">분석된 스타일을 바탕으로 새로운 글을 생성합니다.</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          네이버 홈판 리트리버 로직 적용 중
        </div>
      </div>

      {!state.generated ? (
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-card-border)] rounded-2xl p-8 shadow-xl">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">주제 입력</label>
            <textarea
              value={state.topic}
              onChange={(e) => updateState({ topic: e.target.value })}
              placeholder="예: 최근 읽은 책 리뷰, 주말 캠핑 후기 등"
              className="w-full min-h-[88px] bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-accent)] resize-y transition-colors"
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-400 mb-3">글 길이</label>
            <div className="flex gap-3">
              {['짧게', '보통', '길게'].map((len) => (
                <button
                  key={len}
                  onClick={() => updateState({ length: len })}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors border
                    ${state.length === len 
                      ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)] text-[var(--color-accent)]' 
                      : 'bg-[#1a1a1a] border-[#2a2a2a] text-gray-400 hover:bg-[#222]'}`}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!state.topic.trim()}
            className={`w-full py-4 rounded-xl font-medium text-lg transition-all duration-300
              ${state.topic.trim() 
                ? 'bg-[var(--color-accent)] text-[var(--color-bg-main)] hover:bg-yellow-600 shadow-lg' 
                : 'bg-[var(--color-btn-disabled-bg)] text-[var(--color-btn-disabled-text)] cursor-not-allowed'}`}
          >
            글 생성하기
          </button>
        </div>
      ) : (
        <div className="animate-fade-up">
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-card-border)] rounded-2xl p-8 mb-8 relative shadow-xl">
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300 hover:text-white hover:bg-[#222] transition-colors text-sm"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? '복사됨' : '복사'}
            </button>
            
            <div className="prose prose-invert max-w-none text-[var(--color-text-main)] whitespace-pre-wrap leading-relaxed mt-4">
              {state.generated}
            </div>
          </div>

          <div className="flex gap-4 mb-12">
            <button
              onClick={handleGenerate}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300 hover:text-white hover:bg-[#222] transition-colors font-medium"
            >
              <RefreshCcw className="w-4 h-4" />
              같은 주제로 재생성
            </button>
            <button
              onClick={handleReset}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[var(--color-accent)] text-[var(--color-bg-main)] hover:bg-yellow-600 transition-colors font-medium"
            >
              <FilePlus className="w-4 h-4" />
              새 주제로 작성
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-center mt-12">
        <button
          onClick={() => updateState({ step: 2 })}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          분석 결과 다시 보기
        </button>
      </div>
    </div>
  );
}
