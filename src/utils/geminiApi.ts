import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeStyle(text: string): Promise<string> {
  const systemInstruction = `글쓰기 스타일 분석 전문가 역할. 위 5개 항목을 한국어로 구체적으로 분석.
1. 전반적인 어조 (격식체/구어체, 따뜻함/중립, 주관 표현 방식)
2. 문장 구조 (평균 문장 길이, 접속어 패턴, 단락 구성)
3. 자주 쓰는 표현 (특징적 어휘, 반복 패턴, 문장 시작·마무리 방식)
4. 글 전개 방식 (주제 접근법, 예시 활용, 논리 흐름)
5. 독자와의 관계 (친근함 수준, 설득 방식, 감정 표현)`;

  const userPrompt = `블로그 글 샘플 전문:\n${text.slice(0, 14000)}\n\n위 샘플을 바탕으로 작성자의 말투와 문체를 분석해주세요.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: userPrompt,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
    }
  });

  return response.text || '';
}

export async function generateText(topic: string, styleAnalysis: string, length: string): Promise<string> {
  const lengthInstruction = length === '짧게' ? '공백 포함 500자 내외' : length === '보통' ? '공백 포함 1000자 내외' : '공백 포함 2000자 내외';
  
  const systemInstruction = `당신은 분석된 말투를 완벽하게 재현하면서, '네이버 홈판 리트리버(Retriever) 로직'에 최적화된 매력적인 블로그 글을 작성하는 전문가입니다.

[네이버 홈판 리트리버 로직 기반 글쓰기 핵심 지침]
1. 클릭을 유도하는 매력적인 제목: 글의 가장 첫 줄에는 호기심을 자극하고 핵심 가치를 담은 제목을 작성하세요.
2. 체류시간(Dwell Time) 극대화: 첫 2~3문장(훅, Hook)에서 독자의 공감을 이끌어내거나 흥미로운 질문을 던져 이탈률을 방지하세요.
3. 모바일 최적화 가독성: 네이버 메인(모바일)에서 읽기 편하도록 2~3문장마다 줄바꿈을 하고, 글이 답답해 보이지 않게 여백을 충분히 활용하세요.
4. 독창적 경험과 정보의 깊이 (DIA+ 모델): 단순 정보 나열이 아닌, 고유한 인사이트, 생생한 후기, 구체적인 꿀팁을 반드시 포함하세요.
5. 완독률 상승 전개: 문단 간의 논리적 연결을 매끄럽게 하여 끝까지 읽히도록 전개하세요.
6. 소통 유도(Engagement): 글 마무리에는 독자의 댓글이나 반응을 자연스럽게 유도하는 질문이나 멘트를 넣으세요.

[형식 지침]
- 마크다운 기호(*, # 등)는 최소화하고, 일반 텍스트 기호(■, -, • 등)를 활용해 깔끔하게 구조화하세요.
- 선택된 길이 지침: ${lengthInstruction}

[분석된 작성자 고유의 말투 및 문체 (가장 중요)]
${styleAnalysis}

위 말투와 문체를 100% 반영하여, 마치 본인이 직접 쓴 것처럼 자연스럽게 작성하세요.`;

  const userPrompt = `주제: ${topic}\n\n위 주제로 네이버 홈판에 노출될 만한 퀄리티의 글을 작성해주세요.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: userPrompt,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.75,
    }
  });

  return response.text || '';
}

