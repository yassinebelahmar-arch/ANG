import React from 'react';
import { Smartphone, Download, CheckCircle2, X, Share, MoreVertical, ShieldCheck, WifiOff, Volume2 } from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
  const [installFeedback, setInstallFeedback] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleDirectInstall = async () => {
    const result = await promptInstall();
    if (result === 'accepted') {
      setInstallFeedback('Application installée avec succès sur votre appareil !');
    } else if (result === 'manual') {
      setInstallFeedback(
        'Suivez les 2 étapes ci-dessous dans le menu de votre navigateur pour ajouter l’application sur votre écran d’accueil Android ou iOS.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden my-8">
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-inner shrink-0">
              90J
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Application Mobile · Android & iOS
                </span>
              </div>
              <h2 className="text-lg font-bold tracking-tight mt-1">
                Installer « ProEnglish 90J » sur Téléphone ou Tablette
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* App Benefits Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200 flex items-start gap-2.5">
              <WifiOff className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-900">100% Hors-Ligne</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Les 95 sessions (2 850 mots & phrases) restent accessibles dans le métro ou en avion.
                </p>
              </div>
            </div>
            <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200 flex items-start gap-2.5">
              <Volume2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-900">Audio Anglais Natif</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Écoutez chaque mot et chaque phrase en anglais (vitesse normale ou lente) d’un simple clic.
                </p>
              </div>
            </div>
            <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-900">Progression Sauvegardée</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Votre avancement jour par jour (Jour 1 à Jour 95) et vos certificats sont mémorisés.
                </p>
              </div>
            </div>
          </div>

          {/* Direct Install CTA if browser supports beforeinstallprompt */}
          <div className="p-4 rounded-xl bg-teal-50/80 border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-teal-700" />
                {isInstalled
                  ? 'Application déjà installée sur cet appareil'
                  : 'Téléchargement & Installation Directe (PWA Mobile & Bureau)'}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Fonctionne comme une application native Android / iOS en plein écran, sans barre d’adresse et avec icône dédiée sur votre écran d’accueil.
              </p>
            </div>
            {!isInstalled && (
              <button
                onClick={handleDirectInstall}
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {isInstallable ? 'Installer l’Application' : 'Installer maintenant'}
              </button>
            )}
          </div>

          {installFeedback && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{installFeedback}</span>
            </div>
          )}

          {/* Step-by-Step Android & iOS Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Android Card */}
            <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                  Sur Android (Prioritaire)
                </span>
                <span className="text-[11px] font-mono text-slate-500">Chrome / Samsung Internet</span>
              </div>
              <ol className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    Ouvrez ce site dans <strong>Google Chrome</strong> sur votre smartphone Android et appuyez sur le menu{' '}
                    <span className="inline-flex items-center px-1.5 py-0.5 bg-stone-100 rounded border border-stone-300 font-mono text-[10px]">
                      <MoreVertical className="w-3 h-3 inline" /> 3 points
                    </span>{' '}
                    en haut à droite.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    Sélectionnez <strong>« Installer l’application »</strong> ou <strong>« Ajouter à l’écran d’accueil »</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-teal-700 text-white font-mono text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    L’icône <strong>ProEng 90J</strong> apparaît sur votre téléphone Android comme une application Play Store classique !
                  </span>
                </li>
              </ol>
            </div>

            {/* iOS Card */}
            <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 bg-stone-100 px-2.5 py-1 rounded border border-stone-300">
                  Sur iPhone / iPad (iOS)
                </span>
                <span className="text-[11px] font-mono text-slate-500">Safari Mobile</span>
              </div>
              <ol className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    Ouvrez ce site dans <strong>Safari</strong> sur votre iPhone, puis appuyez sur le bouton{' '}
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-stone-100 rounded border border-stone-300 font-mono text-[10px]">
                      <Share className="w-3 h-3 inline" /> Partager
                    </span>{' '}
                    en bas de l’écran.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    Faites défiler vers le bas et appuyez sur <strong>« Sur l’écran d’accueil »</strong> (Add to Home Screen).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-teal-700 text-white font-mono text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    Validez en appuyant sur <strong>« Ajouter »</strong> en haut à droite pour lancer l’application en plein écran.
                  </span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 border-t border-stone-200 px-6 py-3.5 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            Compatible Android APK/WebAPK · iOS WebApp · Windows & Mac
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
