import axios from 'axios';
import type { SystemSettings, UpdateSystemSettings, FileAttachment, EmailTemplate, CreateEmailTemplate, UpdateEmailTemplate } from '../types';

const API_BASE_URL = 'http://localhost:5027/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const systemSettingsApi = {
  getSystemSettings: async (): Promise<SystemSettings> => {
    const response = await api.get('/SystemSettings');
    return response.data;
  },

  updateSystemSettings: async (settings: UpdateSystemSettings): Promise<SystemSettings> => {
    const response = await api.put('/SystemSettings', settings);
    return response.data;
  },

  validateSettings: async (settings: SystemSettings): Promise<string[]> => {
    const response = await api.post('/SystemSettings/validate', settings);
    return response.data;
  },


};



export const fileAttachmentsApi = {
  getAllFiles: async (): Promise<FileAttachment[]> => {
    const response = await api.get('/FileAttachment');
    return response.data;
  },

  getFile: async (id: number): Promise<FileAttachment> => {
    const response = await api.get(`/FileAttachment/${id}`);
    return response.data;
  },

  uploadFile: async (file: File, description?: string): Promise<FileAttachment> => {
    const formData = new FormData();
    formData.append('file', file);
    if (description) {
      formData.append('description', description);
    }
    
    const response = await api.post('/FileAttachment/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateFile: async (id: number, updateData: any): Promise<FileAttachment> => {
    const response = await api.put(`/FileAttachment/${id}`, updateData);
    return response.data;
  },

  deleteFile: async (id: number): Promise<boolean> => {
    const response = await api.delete(`/FileAttachment/${id}`);
    return response.status === 204;
  },

  downloadFile: async (id: number): Promise<Blob> => {
    const response = await api.get(`/FileAttachment/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  searchFiles: async (query: string): Promise<FileAttachment[]> => {
    const response = await api.get(`/FileAttachment/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  getFilesByType: async (fileType: string): Promise<FileAttachment[]> => {
    const response = await api.get(`/FileAttachment/by-type?fileType=${encodeURIComponent(fileType)}`);
    return response.data;
  },

  getFileExtension: (cudPath: string): string => {
    return cudPath.split('.').pop()?.toLowerCase() || '';
  },

  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
};

export const emailTemplatesApi = {
  getAllTemplates: async (): Promise<EmailTemplate[]> => {
    const response = await api.get('/EmailTemplate');
    return response.data;
  },

  getTemplate: async (id: number): Promise<EmailTemplate> => {
    const response = await api.get(`/EmailTemplate/${id}`);
    return response.data;
  },

  createTemplate: async (template: CreateEmailTemplate): Promise<EmailTemplate> => {
    const response = await api.post('/EmailTemplate', template);
    return response.data;
  },

  updateTemplate: async (id: number, template: UpdateEmailTemplate): Promise<EmailTemplate> => {
    const response = await api.put(`/EmailTemplate/${id}`, template);
    return response.data;
  },

  deleteTemplate: async (id: number): Promise<boolean> => {
    const response = await api.delete(`/EmailTemplate/${id}`);
    return response.status === 204;
  },

  searchTemplates: async (query: string): Promise<EmailTemplate[]> => {
    const response = await api.get(`/EmailTemplate/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  exportAsDocx: async (id: number): Promise<Blob> => {
    const response = await api.get(`/EmailTemplate/${id}/export/docx`, {
      responseType: 'blob',
    });
    return response.data;
  },

  saveToCud: async (id: number): Promise<{ message: string; filePath: string; fileName: string }> => {
    const response = await api.post(`/EmailTemplate/${id}/save-to-cud`);
    return response.data;
  },

  exportAsPdf: async (id: number): Promise<Blob> => {
    const response = await api.get(`/EmailTemplate/${id}/export/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  }
};

export default api;
