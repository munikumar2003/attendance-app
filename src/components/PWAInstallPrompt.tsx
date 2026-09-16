import React, { useState } from 'react';
import { Smartphone, Download, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // If running in standalone mode (already installed), do not show
  if (isInstalled || dismissed) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <div
        id="pwa-install-banner"
        className="mx-4 mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top duration-200"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-stone-900 block truncate">
              Install App on Phone
            </span>
            <span className="text-[10px] text-stone-600 block truncate">
              100% Offline • No internet required
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={install}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <div
          id="pwa-install-ios-banner"
          className="mx-4 mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-stone-900 block truncate">
                Install as Mobile App
              </span>
              <span className="text-[10px] text-stone-600 block truncate">
                Works offline on your device
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setShowIOSGuide(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              How to Install
            </button>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss banner"
              className="p-1 text-stone-400 hover:text-stone-700 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-stone-900">Install on iPhone / iPad</h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed mb-4">
                1. Tap the <strong className="text-stone-900">Share</strong> button in the Safari bottom bar.<br />
                2. Scroll down and choose <strong className="text-stone-900">Add to Home Screen</strong>.<br />
                3. The app will install directly to your device and run 100% offline without needing internet.
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
