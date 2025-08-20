import React from 'react';
import type { SystemSettings } from '../../../types';
import ValidatedInput from '../components/ValidatedInput';
import { validationRules } from '../../../shared/validationRules';

interface NotificationSectionProps {
  settings: SystemSettings | null;
  onSettingChange: (key: keyof SystemSettings, value: any) => void;
}

const NotificationSection: React.FC<NotificationSectionProps> = ({
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
        Upozornění a připomenutí
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <ValidatedInput
            type="number"
            value={settings.actionNotificationDays}
            onChange={(value) => handleChange('actionNotificationDays', value)}
            label="Lhůta upozornění na akci"
            placeholder="7"
                          min={0}
              max={365}
              validationRules={validationRules.actionNotificationDays}
            helpText={validationRules.actionNotificationDays.helpText}
          />
        </div>

        <div>
          <ValidatedInput
            type="number"
            value={settings.lastActionNotificationHours}
            onChange={(value) => handleChange('lastActionNotificationHours', value)}
            label="Lhůta posledního upozornění na akci"
            placeholder="24"
                          min={0}
              max={8760}
              validationRules={validationRules.lastActionNotificationHours}
            helpText={validationRules.lastActionNotificationHours.helpText}
          />
        </div>

        <div>
          <ValidatedInput
            type="number"
            value={settings.surveyReminderDays}
            onChange={(value) => handleChange('surveyReminderDays', value)}
            label="Lhůta pro připomenutí dotazníku garanta"
            placeholder="14"
                          min={0}
              max={365}
              validationRules={validationRules.surveyReminderDays}
            helpText={validationRules.surveyReminderDays.helpText}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationSection;
