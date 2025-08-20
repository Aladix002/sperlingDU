import React from 'react';
import type { SystemSettings } from '../../../types';
import ValidatedInput from '../components/ValidatedInput';
import { validationRules } from '../../../shared/validationRules';

interface TermsSectionProps {
  settings: SystemSettings | null;
  onSettingChange: (key: keyof SystemSettings, value: any) => void;
}

const TermsSection: React.FC<TermsSectionProps> = ({
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
        Obchodní podmínky a slevy
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ValidatedInput
          type="number"
          value={settings.defaultStudentDiscount}
          onChange={(value) => handleChange('defaultStudentDiscount', value)}
          label="Výchozí sleva pro studenty"
          placeholder="30"
                        min={0}
              max={100}
              validationRules={validationRules.defaultStudentDiscount}
          helpText={validationRules.defaultStudentDiscount.helpText}
        />

        <ValidatedInput
          type="number"
          value={settings.defaultNonMemberSurcharge}
          onChange={(value) => handleChange('defaultNonMemberSurcharge', value)}
          label="Výchozí přirážka pro nečleny"
          placeholder="30"
                        min={0}
              max={100}
              validationRules={validationRules.defaultNonMemberSurcharge}
          helpText={validationRules.defaultNonMemberSurcharge.helpText}
        />
      </div>
    </div>
  );
};

export default TermsSection;
