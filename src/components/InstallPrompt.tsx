'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'stocklingo-install-dismissed';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, '1');
    setDeferredPrompt(null);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-lg">
      <div className="card flex items-center gap-3 bg-white p-4">
        <div className="flex-1">
          <p className="font-bold text-duo-gray-500">安装 StockLingo</p>
          <p className="text-sm text-duo-gray-300">
            添加到主屏幕，随时随地学炒股
          </p>
        </div>
        <button
          onClick={handleInstall}
          className="btn-primary shrink-0 px-4 py-2 text-sm"
        >
          安装
        </button>
        <button
          onClick={handleDismiss}
          className="shrink-0 p-2 text-duo-gray-300 hover:text-duo-gray-400"
          aria-label="关闭"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
