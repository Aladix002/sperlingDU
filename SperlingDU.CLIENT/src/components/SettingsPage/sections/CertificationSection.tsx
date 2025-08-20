import React from 'react';
import type { SystemSettings } from '../../../types';
import ValidatedInput from '../components/ValidatedInput';
import { validationRules } from '../../../shared/validationRules';

interface CertificationSectionProps {
  settings: SystemSettings | null;
  onSettingChange: (key: keyof SystemSettings, value: any) => void;
}

const CertificationSection: React.FC<CertificationSectionProps> = ({
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
        Certifikace
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ValidatedInput
          type="number"
          value={settings.defaultCertificationYears}
          onChange={(value) => handleChange('defaultCertificationYears', value)}
          label="Výchozí doba platnosti certifikace"
          placeholder="5"
                        min={1}
              max={10}
              validationRules={validationRules.defaultCertificationYears}
          helpText={validationRules.defaultCertificationYears.helpText}
        />

        <ValidatedInput
          type="number"
          value={settings.certificationExpiryThresholdDays}
          onChange={(value) => handleChange('certificationExpiryThresholdDays', value)}
          label="Práh expirace certifikace"
          placeholder="30"
                        min={1}
              max={365}
              validationRules={validationRules.certificationExpiryThresholdDays}
          helpText={validationRules.certificationExpiryThresholdDays.helpText}
        />
      </div>
    </div>
  );
};

export default CertificationSection;
