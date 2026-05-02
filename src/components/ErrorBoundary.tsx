import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  constructor(props: Props) {
    super(props);
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-red-50 rounded-[3rem] border-2 border-red-100">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl font-black">!</span>
          </div>
          <h2 className="text-2xl font-black text-red-600 uppercase italic tracking-tighter mb-4">Sistem Hatası</h2>
          <p className="text-xs font-bold text-red-500/80 max-w-md uppercase tracking-widest leading-relaxed mb-8">
            Bu modül yüklenirken geçici bir hata oluştu. Lütfen sayfayı yenileyiniz veya sistem yöneticisine başvurunuz.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-red-600 text-app-on-primary font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
          >
            Sistemi Yeniden Başlat
          </button>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
