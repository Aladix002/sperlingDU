import React from 'react';
import type { SystemSettings } from '../../../types';

interface InfoBoxSectionProps {
  settings: SystemSettings | null;
  onSettingChange: (key: keyof SystemSettings, value: any) => void;
}

const InfoBoxSection: React.FC<InfoBoxSectionProps> = ({
  settings,
  onSettingChange
}) => {
  const handleChange = (key: keyof SystemSettings, value: any) => {
    onSettingChange(key, value);
  };

  if (!settings) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Informační box
      </h3>
      
      <textarea
        value={settings.infoBox || ''}
        onChange={(e) => handleChange('infoBox', e.target.value)}
        placeholder="Zde můžete napsat důležité informace..."
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
    </div>
  );
};

export default InfoBoxSection;
