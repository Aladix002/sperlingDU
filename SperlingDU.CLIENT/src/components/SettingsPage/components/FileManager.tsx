import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { FileAttachment } from '../../../types';
import { fileAttachmentsApi } from '../../../services/api';

interface FileManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const FileManager: React.FC<FileManagerProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<FileAttachment | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingDescription, setEditingDescription] = useState<{ [key: number]: string }>({});
  const queryClient = useQueryClient();

  const { data: files = [], isLoading, error } = useQuery({
    queryKey: ['fileAttachments'],
    queryFn: fileAttachmentsApi.getAllFiles,
    enabled: isOpen,
  });

  const { data: searchResults = [] } = useQuery({
    queryKey: ['fileAttachments', 'search', searchQuery],
    queryFn: () => fileAttachmentsApi.searchFiles(searchQuery),
    enabled: isOpen && searchQuery.length > 0,
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => fileAttachmentsApi.uploadFile(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fileAttachments'] });
      setUploadProgress(0);
      setIsUploading(false);
    },
    onError: (error) => {
      console.error('Upload failed:', error);
      setUploadProgress(0);
      setIsUploading(false);
      alert('Nahravani souboru selhalo');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: fileAttachmentsApi.deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fileAttachments'] });
      if (selectedFile) setSelectedFile(null);
    },
    onError: (error) => {
      console.error('Delete failed:', error);
      alert('Mazani souboru selhalo');
    }
  });

  const filteredFiles = searchQuery.length > 0 ? searchResults : files;
  const displayFiles = filteredFiles.filter(file => file.fileType.includes('pdf'));

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Povolene jsou pouze PDF soubory');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await uploadMutation.mutateAsync(file);
      
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
      
      event.target.value = '';
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleFileDownload = async (file: FileAttachment) => {
    try {
      const blob = await fileAttachmentsApi.downloadFile(file.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Stazeni souboru selhalo');
    }
  };

  const handleFileDelete = async (file: FileAttachment) => {
    if (confirm(`Naozaj chcete vymazat subor "${file.fileName}"?`)) {
      try {
        await deleteMutation.mutateAsync(file.id);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleDescriptionEdit = (fileId: number, value: string) => {
    setEditingDescription(prev => ({
      ...prev,
      [fileId]: value
    }));
  };

  const handleDescriptionSave = async (fileId: number) => {
    const newDescription = editingDescription[fileId];
    if (newDescription === undefined) return;

    try {
      await fileAttachmentsApi.updateFile(fileId, { description: newDescription });
      
      setSelectedFile(prev => prev ? { ...prev, description: newDescription } : null);
      setEditingDescription(prev => {
        const newState = { ...prev };
        delete newState[fileId];
        return newState;
      });
      
      queryClient.invalidateQueries({ queryKey: ['fileAttachments'] });
    } catch (error) {
      console.error('Failed to update description:', error);
      alert('Nepodarilo se ulozit popis souboru');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string): string => {
    if (fileType.includes('pdf')) return '📄';
    return '📁';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-5/6 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Sprava priloh - CUD uloziste
          </h2>
          <div className="flex space-x-3">
            <div className="relative group">
              <button
                onClick={() => {
                  document.getElementById('file-upload')?.click();
                }}
                disabled={isUploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400"
              >
                {isUploading ? 'Nahravam...' : 'Nahrat PDF soubor'}
              </button>
              
              {isUploading && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  Nahravam subor, pockajte prosim...
                </div>
              )}
            </div>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf"
            />
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Zavrit
            </button>
          </div>
        </div>

        {isUploading && (
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="text-sm text-blue-800">{uploadProgress}%</span>
            </div>
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Dostupne PDF soubory</h3>
              
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Hledat PDF soubory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {isLoading && (
              <div className="text-center py-16 text-gray-500">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4">Nacitam soubory...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-16 text-red-500">
                <p className="text-lg">Chyba nacitani souboru</p>
                <p className="text-sm">Zkuste to prosim znovu</p>
              </div>
            )}

            {!isLoading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayFiles.map(file => (
                  <div 
                    key={file.id} 
                    className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                      selectedFile?.id === file.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedFile(file)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getFileIcon(file.fileType)}</span>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm truncate max-w-32">
                            {file.fileName}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.fileSize)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {file.description}
                      </p>
                      
                      <div className="text-xs text-gray-500">
                        <span>Nahrano: {new Date(file.uploadDate).toLocaleDateString('cs-CZ')}</span>
                      </div>
                      
                      <div className="text-xs text-gray-400">
                        Cesta: {file.cudPath}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && !error && displayFiles.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                <p className="text-lg">Zadne PDF soubory nebyly nalezeny</p>
                <p className="text-sm">
                  {searchQuery ? 'Zkuste zmenit vyhledavaci dotaz' : 'Nahrajte prvni PDF soubor pomoci tlacitla "Nahrat PDF soubor"'}
                </p>
              </div>
            )}
          </div>

          {selectedFile && (
            <div className="w-80 border-l border-gray-200 bg-gray-50 p-6 overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Detail souboru</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nazev souboru</label>
                  <p className="text-sm text-gray-900">{selectedFile.fileName}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Popis</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editingDescription[selectedFile.id] !== undefined ? editingDescription[selectedFile.id] : (selectedFile.description || '')}
                      onChange={(e) => handleDescriptionEdit(selectedFile.id, e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Bez popisu"
                    />
                    <button
                      onClick={() => handleDescriptionSave(selectedFile.id)}
                      className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      Ulozit
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Velikost</label>
                  <p className="text-sm text-gray-900">{formatFileSize(selectedFile.fileSize)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Typ souboru</label>
                  <p className="text-sm text-gray-900">{selectedFile.fileType}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cesta v ulozisti</label>
                  <p className="text-sm text-gray-900 font-mono">{selectedFile.cudPath}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Datum nahrani</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedFile.uploadDate).toLocaleString('cs-CZ')}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Posledni uprava</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedFile.lastModified || selectedFile.uploadDate).toLocaleString('cs-CZ')}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
                <button
                  onClick={() => handleFileDownload(selectedFile)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Stahnout soubor
                </button>
                <button
                  onClick={() => handleFileDelete(selectedFile)}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Smazat soubor
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileManager;
