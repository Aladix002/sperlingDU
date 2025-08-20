import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { EmailTemplate, CreateEmailTemplate, UpdateEmailTemplate } from '../../../types';
import TemplateEditor from '../components/TemplateEditor';
import { emailTemplatesApi } from '../../../services/api';

const TemplatesSection: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading, error } = useQuery({
    queryKey: ['emailTemplates'],
    queryFn: emailTemplatesApi.getAllTemplates,
  });

  const createMutation = useMutation({
    mutationFn: emailTemplatesApi.createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
      setIsEditorOpen(false);
      setSelectedTemplate(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, template }: { id: number; template: UpdateEmailTemplate }) => 
      emailTemplatesApi.updateTemplate(id, template),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
      setIsEditorOpen(false);
      setSelectedTemplate(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: emailTemplatesApi.deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
    },
  });

  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsEditorOpen(true);
  };

  const handleSaveTemplate = (updatedTemplate: EmailTemplate | CreateEmailTemplate) => {
    if ('id' in updatedTemplate && updatedTemplate.id) {
      const { id, ...updateData } = updatedTemplate;
      updateMutation.mutate({ id, template: updateData as UpdateEmailTemplate });
    } else {
      createMutation.mutate(updatedTemplate as CreateEmailTemplate);
    }
  };

  const handleDeleteTemplate = (id: number) => {
    if (window.confirm('Opravdu chcete smazat tuto šablonu?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancelEdit = () => {
    setIsEditorOpen(false);
    setSelectedTemplate(null);
  };

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setIsEditorOpen(true);
  };

  const getTemplateTypeInfo = (templateType: string) => {
    switch (templateType) {
      case 'notification':
        return {
          label: 'Notifikace',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          description: 'Ukládá se do databáze, používá se na odesílání emailů'
        };
      case 'document':
        return {
          label: 'Dokument',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          description: 'Může být exportován jako PDF nebo uložen do CUD jako DOCX'
        };
      default:
        return {
          label: 'Neznámý typ',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          description: 'Neznámý typ šablony'
        };
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-red-600">
          Chyba při načítání šablon: {error.message}
        </div>
      </div>
    );
  }

  const notificationTemplates = templates.filter(t => t.templateType === 'notification');
  const documentTemplates = templates.filter(t => t.templateType === 'document');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Editor šablón textů</h3>
            <p className="text-sm text-gray-600 mt-1">
              Editor šablón notifikací a Editor šablón dokumentů
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleCreateNew()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              Nová šablona
            </button>
          </div>
        </div>
      </div>

      {/* Templates List */}
      <div className="p-6">
        {templates.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Žádné šablony</h3>
            <p className="text-gray-600 mb-4">Začněte vytvořením první šablony</p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleCreateNew()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Vytvořit šablonu
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Notification Templates Section */}
            {notificationTemplates.length > 0 && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">
                  Editor šablón notifikací
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {notificationTemplates.map(template => {
                    const typeInfo = getTemplateTypeInfo(template.templateType);
                    return (
                      <div
                        key={template.id}
                        className="border rounded-lg p-4 transition-colors border-gray-200 bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <h5 className="font-medium text-gray-900">{template.name}</h5>
                            <span className={`px-2 py-1 text-xs rounded-full ${typeInfo.bgColor} ${typeInfo.textColor}`}>
                              {typeInfo.label}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{template.subject}</p>
                        
                        <div className="flex space-x-2 mb-3">
                          <button
                            onClick={() => handleEditTemplate(template)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Upravit
                          </button>
                          <button
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                          >
                            Smazat
                          </button>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          Vytvořené: {new Date(template.createdAt).toLocaleDateString('cs-CZ')}
                          {template.lastModified && (
                            <span className="ml-4">
                              Upravené: {new Date(template.lastModified).toLocaleDateString('cs-CZ')}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Document Templates Section */}
            {documentTemplates.length > 0 && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">
                  Editor šablón dokumentů
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documentTemplates.map(template => {
                    const typeInfo = getTemplateTypeInfo(template.templateType);
                    return (
                      <div
                        key={template.id}
                        className="border rounded-lg p-4 transition-colors border-gray-200 bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <h5 className="font-medium text-gray-900">{template.name}</h5>
                            <span className={`px-2 py-1 text-xs rounded-full ${typeInfo.bgColor} ${typeInfo.textColor}`}>
                              {typeInfo.label}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{template.subject}</p>
                        
                        <div className="flex space-x-2 mb-3">
                          <button
                            onClick={() => handleEditTemplate(template)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Upravit
                          </button>
                          <button
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                          >
                            Smazat
                          </button>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          Vytvořené: {new Date(template.createdAt).toLocaleDateString('cs-CZ')}
                          {template.lastModified && (
                            <span className="ml-4">
                              Upravené: {new Date(template.lastModified).toLocaleDateString('cs-CZ')}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Template Editor Modal */}
      {isEditorOpen && (
        <TemplateEditor
          template={selectedTemplate}
          onSave={handleSaveTemplate}
          onCancel={handleCancelEdit}
          isOpen={isEditorOpen}
        />
      )}
    </div>
  );
};

export default TemplatesSection;
