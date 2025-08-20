import React from 'react';
import type { SystemSettings } from '../../../types';

interface FormEditorsSectionProps {
  settings: SystemSettings | null;
}

const FormEditorsSection: React.FC<FormEditorsSectionProps> = ({
  settings
}) => {
  if (!settings) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Editor šablon formulářů
      </h3>
      
      <div className="text-center py-12">
        <h4 className="text-xl font-medium text-gray-700">
          Funkce zatím nedostupná
        </h4>
      </div>
    </div>
  );
};

export default FormEditorsSection;
