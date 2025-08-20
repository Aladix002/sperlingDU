import React, { useState } from 'react';
import type { SystemSettings } from '../../types';
import { X, Save, Settings } from 'lucide-react';

interface InlineSettingsEditorProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SystemSettings | null;
  onSettingChange: (key: keyof SystemSettings, value: any) => void;
  currentSection: string;
}

const InlineSettingsEditor: React.FC<InlineSettingsEditorProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingChange,
  currentSection
}) => {
  const [localSettings, setLocalSettings] = useState<SystemSettings | null>(settings);

  const handleChange = (key: keyof SystemSettings, value: any) => {
    if (localSettings) {
      setLocalSettings({ ...localSettings, [key]: value });
    }
  };

  const handleSave = () => {
    if (localSettings) {
      Object.keys(localSettings).forEach(key => {
        if (localSettings[key as keyof SystemSettings] !== settings?.[key as keyof SystemSettings]) {
          onSettingChange(key as keyof SystemSettings, localSettings[key as keyof SystemSettings]);
        }
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Inline nastavenia</h2>
              <p className="text-sm text-gray-600">Sekcia: {currentSection}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Payment and Invoice Settings */}
          {currentSection === 'payment' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Platební a fakturační parametry</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emailová adresa účetní
                </label>
                <input
                  type="email"
                  value={localSettings?.accountantEmail || ''}
                  onChange={(e) => handleChange('accountantEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poplatek za nastavení CPD (Kč)
                </label>
                <input
                  type="number"
                  min="0"
                  value={localSettings?.cpdFee || 0}
                  onChange={(e) => handleChange('cpdFee', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Splatnost faktur (dny)
                </label>
                <input
                  type="number"
                  min="1"
                  value={localSettings?.invoiceDueDays || 0}
                  onChange={(e) => handleChange('invoiceDueDays', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {currentSection === 'notification' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Upozornění a připomenutí</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lhůta upozornění na akci (dny)
                </label>
                <input
                  type="number"
                  min="1"
                  value={localSettings?.actionNotificationDays || 0}
                  onChange={(e) => handleChange('actionNotificationDays', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lhůta posledního upozornění na akci (hodiny)
                </label>
                <input
                  type="number"
                  min="1"
                  value={localSettings?.lastActionNotificationHours || 0}
                  onChange={(e) => handleChange('lastActionNotificationHours', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          )}

          {/* CPD Settings */}
          {currentSection === 'cpd' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">CPD nastavení</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Počet let součtu CPD
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={localSettings?.cpdYearsCount || 0}
                  onChange={(e) => handleChange('cpdYearsCount', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lhůta urgence uzávěrky CPD (dny)
                </label>
                <input
                  type="number"
                  min="1"
                  value={localSettings?.cpdClosureUrgencyDays || 0}
                  onChange={(e) => handleChange('cpdClosureUrgencyDays', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

          {/* Certification Settings */}
          {currentSection === 'certification' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Certifikace</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Výchozí doba platnosti certifikace (roky)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={localSettings?.defaultCertificationYears || 0}
                  onChange={(e) => handleChange('defaultCertificationYears', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Práh expirace certifikace (dny)
                </label>
                <input
                  type="number"
                  min="1"
                  value={localSettings?.certificationExpiryThresholdDays || 0}
                  onChange={(e) => handleChange('certificationExpiryThresholdDays', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Zrušiť
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Uložit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InlineSettingsEditor;
