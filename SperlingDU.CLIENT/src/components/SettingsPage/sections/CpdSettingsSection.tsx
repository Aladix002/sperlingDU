import React from 'react';
import type { SystemSettings } from '../../../types';
import ValidatedInput from '../components/ValidatedInput';
import { validationRules } from '../../../shared/validationRules';

interface CpdSettingsSectionProps {
  settings: SystemSettings | null;
  onSettingChange: (key: keyof SystemSettings, value: any) => void;
}

const CpdSettingsSection: React.FC<CpdSettingsSectionProps> = ({
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
        CPD nastavení
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <ValidatedInput
                          type="number"
              value={settings.cpdYearsCount}
              onChange={(value) => handleChange('cpdYearsCount', value)}
              label="Počet let součtu CPD"
              placeholder="3"
              min={1}
              max={10}
              validationRules={validationRules.cpdYearsCount}
              helpText={validationRules.cpdYearsCount.helpText}
            />
        </div>

        <div>
          <ValidatedInput
            type="number"
            value={settings.cpdClosureUrgencyDays}
            onChange={(value) => handleChange('cpdClosureUrgencyDays', value)}
            label="Lhůta urgence uzávěrky CPD "
            placeholder="30"
            min={1}
            max={365}
            validationRules={validationRules.cpdClosureUrgencyDays}
            helpText={validationRules.cpdClosureUrgencyDays.helpText}
          />
        </div>

        <div>
          <ValidatedInput
            type="number"
            value={settings.cpdClosureUrgencyPeriodDays}
            onChange={(value) => handleChange('cpdClosureUrgencyPeriodDays', value)}
            label="Perioda urgence uzávěrky CPD"
            placeholder="5"
            min={1}
            max={30}
            validationRules={validationRules.cpdClosureUrgencyPeriodDays}
            helpText={validationRules.cpdClosureUrgencyPeriodDays.helpText}
          />
        </div>
      </div>
    </div>
  );
};

export default CpdSettingsSection;
