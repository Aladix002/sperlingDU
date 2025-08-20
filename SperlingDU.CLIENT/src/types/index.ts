export interface SystemSettings {
  id: number;
  accountantEmail: string;
  cpdFee: number;
  invoiceDueDays: number;
  paymentUrgencyDays: number;
  paymentUrgencyPeriodDays: number;
  actionNotificationDays: number;
  lastActionNotificationHours: number;
  surveyReminderDays: number;
  cpdYearsCount: number;
  cpdClosureUrgencyDays: number;
  cpdClosureUrgencyPeriodDays: number;
  invoiceSeriesIssued: string;
  invoiceSeriesReceived: string;
  invoiceSeriesSettlement: string;
  defaultCertificationYears: number;
  certificationExpiryThresholdDays: number;
  infoBox: string;
  defaultStudentDiscount: number;
  defaultNonMemberSurcharge: number;
}

export interface UpdateSystemSettings {
  accountantEmail?: string;
  cpdFee?: number;
  invoiceDueDays?: number;
  paymentUrgencyDays?: number;
  paymentUrgencyPeriodDays?: number;
  actionNotificationDays?: number;
  lastActionNotificationHours?: number;
  surveyReminderDays?: number;
  cpdYearsCount?: number;
  cpdClosureUrgencyDays?: number;
  cpdClosureUrgencyPeriodDays?: number;
  invoiceSeriesIssued?: string;
  invoiceSeriesReceived?: string;
  invoiceSeriesSettlement?: string;
  defaultCertificationYears?: number;
  certificationExpiryThresholdDays?: number;
  infoBox?: string;
  defaultStudentDiscount?: number;
  defaultNonMemberSurcharge?: number;
}

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  placeholders: string;
  templateType: 'notification' | 'document';
  createdAt: string;
  lastModified?: string;
}

export interface CreateEmailTemplate {
  name: string;
  subject: string;
  body: string;
  placeholders: string;
  templateType: 'notification' | 'document';
}

export interface UpdateEmailTemplate {
  name: string;
  subject: string;
  body: string;
  placeholders: string;
  templateType: 'notification' | 'document';
}





export interface FileAttachment {
  id: number;
  fileName: string;
  cudPath: string;
  fileType: string;
  description: string;
  fileSize: number;
  uploadDate: string;
  lastModified?: string;
}

export interface CreateFileAttachment {
  fileName: string;
  cudPath: string;
  fileType: string;
  description: string;
  fileSize: number;
}

export interface GeneratedDocument {
  id: number;
  fileName: string;
  contentType: string;
  cudPath: string;
  fileSize: number;
  generatedAt: string;
  templateName: string;
  pageCount: number;
  format: string;
  content: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
