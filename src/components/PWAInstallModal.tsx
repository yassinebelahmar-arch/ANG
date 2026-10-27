import React from 'react';
import { Smartphone, Download, CheckCircle2, X, Share, MoreVertical } from 'lucide-react';
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
      setInstallFeedback('Application installée avec succès sur votre appareil.');
    } else if (result === 'manual') {
      setInstallFeedback(
        'Suivez les instructions ci-dessous dans le menu de votre navigateur pour ajouter l’application sur votre écran d’accueil Android ou iOS.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4 overflow-y-auto">
      <div className="bg-[#F6F3EC] border-2 border-stone-900 max-w-2xl w-full shadow-2xl overflow-hidden my-8">
        <div className="bg-stone-900 text-[#F6F3EC] px-6 py-5 flex items-start justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono-tabular uppercase tracking-widest text-stone-400 block">
              Édition Mobile · Android & iOS (Fonctionne Hors-Ligne)
            </span>
            <h2 className="font-serif-editorial text-xl mt-1">
              Installer « L’Anglais Pro en 90 Jours » sur Téléphone
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="p-4 bg-white border border-stone-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#9A3412]" />
                {isInstalled
                  ? 'Application déjà installée sur cet appareil'
                  : 'Installation directe sur l’écran d’accueil'}
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Accédez aux 95 sessions (2 850 mots et phrases) en plein écran sur Android et iOS.
              </p>
            </div>
            {!isInstalled && (
              <button
                onClick={handleDirectInstall}
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#9A3412] hover:bg-[#7C2D12] text-white text-xs font-semibold cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {isInstallable ? 'Installer l’Application' : 'Installer maintenant'}
              </button>
            )}
          </div>

          {installFeedback && (
            <div className="p-3 bg-white border border-stone-400 text-xs text-stone-900 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#14532D] shrink-0" />
              <span>{installFeedback}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-stone-300 bg-white space-y-3">
              <div className="text-xs font-mono-tabular uppercase tracking-wider text-[#9A3412] font-bold">
                I. Sur Android (Chrome)
              </div>
              <ol className="space-y-2 text-xs text-stone-700">
                <li>
                  1. Appuyez sur le menu <MoreVertical className="w-3.5 h-3.5 inline" /> en haut à droite de Chrome.
                </li>
                <li>
                  2. Sélectionnez <strong>« Installer l’application »</strong> ou <strong>« Ajouter à l’écran d’accueil »</strong>.
                </li>
                <li>
                  3. L’application apparaît directement sur votre téléphone Android.
                </li>
              </ol>
            </div>

            <div className="p-4 border border-stone-300 bg-white space-y-3">
              <div className="text-xs font-mono-tabular uppercase tracking-wider text-stone-900 font-bold">
                II. Sur iPhone / iPad (Safari)
              </div>
              <ol className="space-y-2 text-xs text-stone-700">
                <li>
                  1. Appuyez sur le bouton <Share className="w-3.5 h-3.5 inline" /> <strong>Partager</strong> en bas de Safari.
                </li>
                <li>
                  2. Choisissez <strong>« Sur l’écran d’accueil »</strong>.
                </li>
                <li>
                  3. Appuyez sur <strong>« Ajouter »</strong> en haut à droite.
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div className="bg-[#EFECE4] border-t border-stone-300 px-6 py-3.5 flex items-center justify-between">
          <span className="text-xs text-stone-600 font-mono-tabular">
            Android · iOS · Mode Hors-Ligne
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
