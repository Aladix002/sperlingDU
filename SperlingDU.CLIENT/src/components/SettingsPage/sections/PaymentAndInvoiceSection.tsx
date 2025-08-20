import React from 'react';
import type { SystemSettings } from '../../../types';
import ValidatedInput from '../components/ValidatedInput';
import { validationRules } from '../../../shared/validationRules';

interface PaymentAndInvoiceSectionProps {
  settings: SystemSettings | null;
  onSettingChange: (key: keyof SystemSettings, value: any) => void;
}

const PaymentAndInvoiceSection: React.FC<PaymentAndInvoiceSectionProps> = ({
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
        Platební a fakturační parametry
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="flex flex-col">
          <div className="mb-6">
                         <ValidatedInput
               type="email"
               value={settings.accountantEmail}
               onChange={(value) => handleChange('accountantEmail', value)}
               label="Emailová adresa účetní"
               placeholder="ekonom@vetkom.cz"
               validationRules={validationRules.accountantEmail}
               helpText={validationRules.accountantEmail.helpText}
             />
          </div>

          <div>
            <ValidatedInput
              type="number"
              value={settings.cpdFee}
              onChange={(value) => handleChange('cpdFee', value)}
                             label="Poplatek za nastavení CPD"
               placeholder="500"
               min={1}
               validationRules={validationRules.cpdFee}
              helpText={validationRules.cpdFee.helpText}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-6">
            <ValidatedInput
              type="number"
              value={settings.invoiceDueDays}
              onChange={(value) => handleChange('invoiceDueDays', value)}
                             label="Splatnost faktur"
               placeholder="14"
               min={1}
               max={365}
               validationRules={validationRules.invoiceDueDays}
              helpText={validationRules.invoiceDueDays.helpText}
            />
          </div>

          <div>
            <ValidatedInput
              type="number"
              value={settings.paymentUrgencyDays}
              onChange={(value) => handleChange('paymentUrgencyDays', value)}
                             label="Lhůta pro urgenci platby"
               placeholder="30"
               min={1}
               max={365}
               validationRules={validationRules.paymentUrgencyDays}
              helpText={validationRules.paymentUrgencyDays.helpText}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-6">
            <ValidatedInput
              type="number"
              value={settings.paymentUrgencyPeriodDays}
              onChange={(value) => handleChange('paymentUrgencyPeriodDays', value)}
                             label="Perioda urgence platby"
               placeholder="3"
               min={1}
               max={30}
               validationRules={validationRules.paymentUrgencyPeriodDays}
              helpText={validationRules.paymentUrgencyPeriodDays.helpText}
            />
          </div>

          <div>
            <ValidatedInput
              type="text"
              value={settings.invoiceSeriesIssued}
              onChange={(value) => handleChange('invoiceSeriesIssued', value)}
              label="Číselná řada faktur vydaných"
              placeholder="324123"
              validationRules={validationRules.invoiceSeriesIssued}
              helpText={validationRules.invoiceSeriesIssued.helpText}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-6">
            <ValidatedInput
              type="text"
              value={settings.invoiceSeriesReceived}
              onChange={(value) => handleChange('invoiceSeriesReceived', value)}
              label="Číselná řada daňových dokladů"
              placeholder="124456"
              validationRules={validationRules.invoiceSeriesReceived}
              helpText={validationRules.invoiceSeriesReceived.helpText}
            />
          </div>

          <div>
            <ValidatedInput
              type="text"
              value={settings.invoiceSeriesSettlement}
              onChange={(value) => handleChange('invoiceSeriesSettlement', value)}
              label="Číselná řada faktur zúčtovacích"
              placeholder="224789"
              validationRules={validationRules.invoiceSeriesSettlement}
              helpText={validationRules.invoiceSeriesSettlement.helpText}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentAndInvoiceSection;
