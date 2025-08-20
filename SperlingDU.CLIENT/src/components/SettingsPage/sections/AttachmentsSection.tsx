import React, { useState } from 'react';
import type { SystemSettings } from '../../../types';
import FileManager from '../components/FileManager';

interface AttachmentsSectionProps {
  settings: SystemSettings | null;
  onSettingChange: (key: keyof SystemSettings, value: any) => void;
}

const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({
  settings
}) => {
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);

  if (!settings) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Přílohy - PDF dokumenty
      </h3>
      
      <div>
        <button
          onClick={() => setIsFileManagerOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Spravovat PDF přílohy
        </button>
      </div>

      <FileManager
        isOpen={isFileManagerOpen}
        onClose={() => setIsFileManagerOpen(false)}
      />
    </div>
  );
};

export default AttachmentsSection;
