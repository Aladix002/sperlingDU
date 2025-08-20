import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { systemSettingsApi } from '../../services/api';
import type { SystemSettings, UpdateSystemSettings } from '../../types';
import { validateAllFields, areAllFieldsFilled } from '../../shared/validationRules';

import PaymentAndInvoiceSection from './sections/PaymentAndInvoiceSection';
import NotificationSection from './sections/NotificationSection';
import CpdSettingsSection from './sections/CpdSettingsSection';
import CertificationSection from './sections/CertificationSection';
import InfoBoxSection from './sections/InfoBoxSection';
import TermsSection from './sections/TermsSection';
import AttachmentsSection from './sections/AttachmentsSection';
import TemplatesSection from './sections/TemplatesSection';
import FormEditorsSection from './sections/FormEditorsSection';

type UserRole = 'Administrator' | 'EventManager';

interface SettingsPageProps {
  userRole: UserRole;
  onLogout: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ userRole, onLogout }) => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const queryClient = useQueryClient();

  const { data: fetchedSettings, isLoading, error } = useQuery({
    queryKey: ['systemSettings'],
    queryFn: systemSettingsApi.getSystemSettings,
  });

  useEffect(() => {
    if (fetchedSettings) {
      setSettings(fetchedSettings);
    } else if (!isLoading && !error) {
      setSettings({
        id: 1,
        accountantEmail: "ekonom@vetkom.cz",
        cpdFee: 500,
        invoiceDueDays: 14,
        paymentUrgencyDays: 30,
        paymentUrgencyPeriodDays: 3,
        actionNotificationDays: 7,
        lastActionNotificationHours: 24,
        surveyReminderDays: 14,
        cpdYearsCount: 3,
        cpdClosureUrgencyDays: 30,
        cpdClosureUrgencyPeriodDays: 5,
        invoiceSeriesIssued: "324123",
        invoiceSeriesReceived: "124456",
        invoiceSeriesSettlement: "224789",
        defaultCertificationYears: 5,
        certificationExpiryThresholdDays: 30,
        infoBox: "Vítejte v systému nastavení",
        defaultStudentDiscount: 30,
        defaultNonMemberSurcharge: 30
      });
    }
  }, [fetchedSettings, isLoading, error]);

  const updateMutation = useMutation({
    mutationFn: systemSettingsApi.updateSystemSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemSettings'] });
      setUpdateStatus('success');
      setTimeout(() => setUpdateStatus('idle'), 3000);
    },
    onError: () => {
      setUpdateStatus('error');
      setTimeout(() => setUpdateStatus('idle'), 3000);
    }
  });

  const handleUpdate = async () => {
    if (!settings) return;
    
    const validationErrors = validateAllFields(settings);
    if (Object.keys(validationErrors).length > 0) {
      setUpdateStatus('error');
      const errorMessages = Object.values(validationErrors).join('\n');
      alert(`Validace selhala:\n${errorMessages}`);
      return;
    }
    
    const updateData: UpdateSystemSettings = {
      accountantEmail: settings.accountantEmail,
      cpdFee: settings.cpdFee,
      invoiceDueDays: settings.invoiceDueDays,
      paymentUrgencyDays: settings.paymentUrgencyDays,
      paymentUrgencyPeriodDays: settings.paymentUrgencyPeriodDays,
      actionNotificationDays: settings.actionNotificationDays,
      lastActionNotificationHours: settings.lastActionNotificationHours,
      surveyReminderDays: settings.surveyReminderDays,
      cpdYearsCount: settings.cpdYearsCount,
      cpdClosureUrgencyDays: settings.cpdClosureUrgencyDays,
      cpdClosureUrgencyPeriodDays: settings.cpdClosureUrgencyPeriodDays,
      invoiceSeriesIssued: settings.invoiceSeriesIssued,
      invoiceSeriesReceived: settings.invoiceSeriesReceived,
      invoiceSeriesSettlement: settings.invoiceSeriesSettlement,
      defaultCertificationYears: settings.defaultCertificationYears,
      certificationExpiryThresholdDays: settings.certificationExpiryThresholdDays,
      infoBox: settings.infoBox,
      defaultStudentDiscount: settings.defaultStudentDiscount,
      defaultNonMemberSurcharge: settings.defaultNonMemberSurcharge
    };
    
    setIsUpdating(true);
    try {
      await updateMutation.mutateAsync(updateData);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSettingChange = (key: keyof SystemSettings, value: any) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  };

  const areAllFieldsFilledLocal = (): boolean => {
    if (!settings) return false;
    return areAllFieldsFilled(settings);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Načítám nastavení...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Chyba načítání</h2>
          <p className="mt-2 text-gray-600">Nepodařilo se načíst nastavení systému.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Obnovit stránku
          </button>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Žádná nastavení</h2>
          <p className="mt-2 text-gray-600">Nastavení se nenačetla.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Obnovit stránku
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Nastavení systému</h2>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Role:</span> {userRole === 'Administrator' ? 'Administrátor' : 'Správce akcí'}
              </div>
              <button
                onClick={onLogout}
                className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
              >
                Odhlásit
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8">
            <PaymentAndInvoiceSection 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />

            <NotificationSection 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />

            <CpdSettingsSection 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />

            <CertificationSection 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />

            <InfoBoxSection 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />

            <TermsSection 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />

            <AttachmentsSection 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />

                          <TemplatesSection />

            <FormEditorsSection 
              settings={settings} 
            />

            <div className="flex justify-center pt-6 border-t border-gray-200">
              <div className="relative group">
                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={isUpdating || !areAllFieldsFilledLocal()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {isUpdating ? 'Aktualizuji...' : 'Aktualizovat'}
                </button>
                
                {(!areAllFieldsFilledLocal() || isUpdating) && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    {isUpdating ? 'Aktualizuji nastavení...' : 'Nejsou vyplněna všechna povinná pole'}
                  </div>
                )}
              </div>
            </div>

            {updateStatus === 'success' && (
              <div className="text-green-600 bg-green-50 px-4 py-3 rounded-lg">
                Nastavení byla úspěšně aktualizována v databázi!
              </div>
            )}

            {updateStatus === 'error' && (
              <div className="text-red-600 bg-red-50 px-4 py-3 rounded-lg">
                Nastala chyba při aktualizaci nastavení v databázi.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-100 text-blue-900 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            © 2025 Domáca úloha Sperling
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
