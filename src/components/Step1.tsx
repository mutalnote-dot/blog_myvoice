import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X, File, FileCode, FileType } from 'lucide-react';
import { AppState } from '../App';
import { extractTextFromFile } from '../utils/fileParser';
import { analyzeStyle } from '../utils/geminiApi';

interface Step1Props {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function Step1({ state, updateState }: Step1Props) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const validExtensions = ['txt', 'md', 'pdf', 'docx', 'doc'];
    const validFiles = newFiles.filter(file => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      return validExtensions.includes(ext);
    });

    if (validFiles.length !== newFiles.length) {
      updateState({ error: '지원하지 않는 파일 형식이 포함되어 있습니다. (.txt, .md, .pdf, .docx, .doc 만 지원)' });
      setTimeout(() => updateState({ error: '' }), 3000);
    }

    const uniqueFiles = validFiles.filter(newFile => 
      !state.files.some(existingFile => existingFile.name === newFile.name)
    );

    if (uniqueFiles.length > 0) {
      updateState({ files: [...state.files, ...uniqueFiles], error: '' });
    }
  };

  const removeFile = (fileName: string) => {
    updateState({ files: state.files.filter(f => f.name !== fileName) });
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'txt': return <FileText className="w-5 h-5 text-gray-400" />;
      case 'md': return <FileCode className="w-5 h-5 text-blue-400" />;
      case 'pdf': return <FileType className="w-5 h-5 text-red-400" />;
      case 'docx':
      case 'doc': return <File className="w-5 h-5 text-blue-600" />;
      default: return <File className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleAnalyze = async () => {
    updateState({ loading: true, error: '' });

    try {
      updateState({ loadingMsg: '파일에서 텍스트 추출 중...' });
      
      let combinedText = '';
      for (const file of state.files) {
        const text = await extractTextFromFile(file);
        combinedText += `\n--- 파일: ${file.name} ---\n${text}\n`;
      }

      updateState({ allText: combinedText, loadingMsg: '말투 & 문체 분석 중...' });
      
      const analysisResult = await analyzeStyle(combinedText);
      
      updateState({ 
        analysis: analysisResult, 
        step: 2, 
        loading: false 
      });

    } catch (err: any) {
      updateState({ 
        error: err.message || '분석 중 오류가 발생했습니다.', 
        loading: false 
      });
    }
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
    <div className="animate-fade-up max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-semibold mb-3 text-white">블로그 글 샘플 업로드</h2>
        <p className="text-gray-400">본인이 작성한 글을 업로드하면 AI가 말투와 문체를 분석합니다.</p>
      </div>

      <div 
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer
          ${isDragging ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5' : 'border-[var(--color-card-border)] bg-[var(--color-card-bg)] hover:border-gray-600'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          multiple 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".txt,.md,.pdf,.doc,.docx"
        />
        <UploadCloud className="w-12 h-12 mx-auto mb-4 text-gray-500" />
        <p className="text-lg font-medium text-gray-300 mb-2">클릭하거나 파일을 이곳으로 드래그</p>
        <p className="text-sm text-gray-500">지원 형식: .txt, .md, .pdf, .docx, .doc</p>
      </div>

      {state.files.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-400 mb-3 px-2">업로드된 파일 ({state.files.length})</h3>
          <ul className="space-y-2">
            {state.files.map((file, idx) => (
              <li key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-card-bg)] border border-[var(--color-card-border)]">
                <div className="flex items-center gap-3 overflow-hidden">
                  {getFileIcon(file.name)}
                  <span className="truncate text-sm text-gray-300 max-w-[300px]">{file.name}</span>
                  <span className="text-xs text-gray-600">{formatBytes(file.size)}</span>
                </div>
                <button 
                  onClick={() => removeFile(file.name)}
                  className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <button
          onClick={handleAnalyze}
          disabled={state.files.length === 0}
          className={`px-8 py-3.5 rounded-full font-medium text-lg transition-all duration-300
            ${state.files.length > 0 
              ? 'bg-[var(--color-accent)] text-[var(--color-bg-main)] hover:bg-yellow-600 hover:shadow-[0_0_20px_rgba(200,160,80,0.3)]' 
              : 'bg-[var(--color-btn-disabled-bg)] text-[var(--color-btn-disabled-text)] cursor-not-allowed'}`}
        >
          말투 분석 시작하기
        </button>
      </div>
    </div>
  );
}
