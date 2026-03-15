import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { num: 1, label: '파일 업로드' },
    { num: 2, label: '분석 확인' },
    { num: 3, label: '글 생성' }
  ];

  return (
    <div className="flex items-center justify-center mb-12 mt-6">
      {steps.map((step, idx) => {
        const isCompleted = currentStep > step.num;
        const isCurrent = currentStep === step.num;
        
        return (
          <div key={step.num} className="flex items-center">
            <div className="flex flex-col items-center relative">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300 z-10
                  ${isCompleted ? 'bg-[var(--color-accent)] text-[var(--color-bg-main)]' : 
                    isCurrent ? 'border-2 border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-bg-main)]' : 
                    'bg-[var(--color-btn-disabled-bg)] text-[var(--color-btn-disabled-text)]'}`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step.num}
              </div>
              <span className={`absolute top-12 text-xs whitespace-nowrap font-medium transition-colors duration-300
                ${isCurrent || isCompleted ? 'text-[var(--color-text-main)]' : 'text-[var(--color-btn-disabled-text)]'}`}>
                {step.label}
              </span>
            </div>
            
            {idx < steps.length - 1 && (
              <div className={`w-24 h-[2px] mx-4 transition-colors duration-300
                ${isCompleted ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-card-border)]'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
