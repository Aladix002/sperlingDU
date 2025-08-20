import { useState, useEffect, useRef } from 'react';
import type { EmailTemplate, CreateEmailTemplate } from '../../../types';

declare global {
  interface Window {
    tinymce: any;
  }
}

const AVAILABLE_VARIABLES = [
  { key: 'nazev_akce', displayName: 'Název akce' },
  { key: 'cena_celkem', displayName: 'Cena celkem' },
  { key: 'datum_konani', displayName: 'Datum konání' },
  { key: 'cele_jmeno_lekare', displayName: 'Jméno lékaře' },
  { key: 'registracni_cislo_kvl', displayName: 'Registrační číslo KVL' },
  { key: 'email_uctovni', displayName: 'Email účetnictví' },
  { key: 'rok', displayName: 'Rok' },
  { key: 'datum_vystaveni', displayName: 'Datum vystavení' }
];

  const TEMPLATE_TYPES = {
    NOTIFICATION: 'notification',
    DOCUMENT: 'document'
  } as const;

type TemplateType = typeof TEMPLATE_TYPES[keyof typeof TEMPLATE_TYPES];

interface TemplateEditorProps {
  template: EmailTemplate | null;
  onSave: (template: EmailTemplate | CreateEmailTemplate) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export default function TemplateEditor({ template, onSave, onCancel, isOpen }: TemplateEditorProps) {
  const [name, setName] = useState(template?.name || '');
  const [subject, setSubject] = useState(template?.subject || '');
  const [templateType, setTemplateType] = useState<TemplateType>(template?.templateType as TemplateType || TEMPLATE_TYPES.NOTIFICATION);
  const [editorContent, setEditorContent] = useState('');
  
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [saveNotificationData, setSaveNotificationData] = useState<{ name: string; subject: string; templateType: string } | null>(null);
  const [showCudNotification, setShowCudNotification] = useState(false);
  const [cudNotificationData, setCudNotificationData] = useState<{ filePath: string; fileName: string } | null>(null);
  const [showPdfNotification, setShowPdfNotification] = useState(false);
  const [pdfNotificationData, setPdfNotificationData] = useState<{ fileName: string } | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);
  const [isTinyMCELoaded, setIsTinyMCELoaded] = useState(false);

  useEffect(() => {
    if (template) {
      setName(template.name);
      setSubject(template.subject);
      setTemplateType(template.templateType as TemplateType || TEMPLATE_TYPES.NOTIFICATION);
      
      let decodedBody = template.body || '';
      if (decodedBody) {
        const placeholderRegex = /&lt;([^&]+)&gt;/g;
        const placeholders: string[] = [];
        let match;
        while ((match = placeholderRegex.exec(decodedBody)) !== null) {
          if (!placeholders.includes(match[1])) {
            placeholders.push(match[1]);
          }
        }

        placeholders.forEach(placeholder => {
          const placeholderRegex = new RegExp(`&lt;${placeholder}&gt;`, 'g');
          decodedBody = decodedBody.replace(placeholderRegex, `<${placeholder}>`);
        });
      }
      
      setEditorContent(decodedBody);
    } else {
      setName('');
      setSubject('');
      setTemplateType(TEMPLATE_TYPES.NOTIFICATION);
      setEditorContent('');
    }
  }, [template]);

  useEffect(() => {
    const loadTinyMCE = async () => {
      try {
        if (window.tinymce) {
          setIsTinyMCELoaded(true);
          return;
        }

        const script = document.createElement('script');
        script.src = '/tinymce/js/tinymce/tinymce.min.js';
        script.onload = () => setIsTinyMCELoaded(true);
        script.onerror = () => {
          console.error('Failed to load TinyMCE from local path');
          const cdnScript = document.createElement('script');
          cdnScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.3/tinymce.min.js';
          cdnScript.onload = () => setIsTinyMCELoaded(true);
          cdnScript.onerror = () => console.error('Failed to load TinyMCE from CDN');
          document.head.appendChild(cdnScript);
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error('Error loading TinyMCE:', error);
      }
    };

    loadTinyMCE();
  }, []);

  useEffect(() => {
    if (!isTinyMCELoaded || !editorRef.current) return;

    const initEditor = () => {
      if (window.tinymce && editorRef.current) {
        window.tinymce.init({
          selector: '#template-editor',
          height: '100%',
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | formatselect | ' +
            'bold italic underline | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: `
            body { 
              font-family: Georgia, serif; 
              font-size: 16px; 
              line-height: 1.8; 
              color: #374151; 
              padding: 20px; 
            }
            .mce-content-body { 
              max-width: 800px; 
              margin: 0 auto; 
            }
          `,
          skin: 'oxide',
          content_css: 'default',
          auto_save: true,
          auto_save_interval: '30s',
          paste_as_text: false,
          paste_enable_default_filters: true,
          entity_encoding: 'raw',
          encoding: 'html',
          setup: (editor: any) => {
            editor.on('change', () => {
              setEditorContent(editor.getContent());
            });
            
            editor.on('init', () => {
              if (editorContent) {
                editor.setContent(editorContent);
              }
            });
          }
        });
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initEditor, 100);
    
    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (window.tinymce) {
        const editor = window.tinymce.get('template-editor');
        if (editor) {
          editor.remove();
        }
      }
    };
  }, [isTinyMCELoaded]);


  const insertVariable = (variableKey: string) => {
    if (window.tinymce) {
      const editor = window.tinymce.get('template-editor');
      if (editor) {
        const variableText = `<${variableKey}>`;
        editor.focus();
        editor.insertContent(variableText);
        setEditorContent(editor.getContent());
      }
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Název šablony je povinný');
      return;
    }

    if (!subject.trim()) {
      alert('Předmět je povinný');
      return;
    }

    let htmlContent = '';
    if (window.tinymce) {
      const editor = window.tinymce.get('template-editor');
      if (editor) {
        htmlContent = editor.getContent();
      }
    }

    if (!htmlContent.trim()) {
      alert('Obsah šablony je povinný');
      return;
    }

    const placeholderRegex = /<([^>]+)>/g;
    const placeholders: string[] = [];
    let match;
    while ((match = placeholderRegex.exec(htmlContent)) !== null) {
      if (!placeholders.includes(match[1])) {
        placeholders.push(match[1]);
      }
    }

    let encodedContent = htmlContent;
    placeholders.forEach(placeholder => {
      const placeholderRegex = new RegExp(`<${placeholder}>`, 'g');
      encodedContent = encodedContent.replace(placeholderRegex, `&lt;${placeholder}&gt;`);
    });

    const templateData: EmailTemplate | CreateEmailTemplate = {
      name: name.trim(),
      subject: subject.trim(),
      body: encodedContent,
      placeholders: placeholders.join(','),
      templateType: templateType,
      lastModified: new Date().toISOString()
    };

    if (template) {
      const updatedTemplate: EmailTemplate = {
        ...template,
        ...templateData
      };
      onSave(updatedTemplate);
    } else {
      const newTemplate: CreateEmailTemplate = {
        ...templateData
      };
      onSave(newTemplate);
    }

    setSaveNotificationData({ 
      name: name.trim(), 
      subject: subject.trim(), 
      templateType: templateType === TEMPLATE_TYPES.NOTIFICATION ? 'Notifikace' : 'Dokument' 
    });
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 5000);
  };

  const handleSaveAsDocx = async () => {
    if (templateType !== TEMPLATE_TYPES.DOCUMENT) {
      alert('Tato funkce je dostupná pouze pro dokumenty');
      return;
    }

    if (!template?.id) {
      alert('Nejprve uložte šablonu');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5027/api/EmailTemplate/${template.id}/save-to-cud`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Uložení do CUD selhalo');
      }
      
      const result = await response.json();
      setCudNotificationData({ filePath: result.filePath, fileName: result.fileName });
      setShowCudNotification(true);
      setTimeout(() => setShowCudNotification(false), 5000);
    } catch (error) {
      console.error('Save to CUD failed:', error);
      alert('Uložení do CUD selhalo');
    }
  };

  const handleExportPdf = async () => {
    if (templateType !== TEMPLATE_TYPES.DOCUMENT) {
      alert('Tato funkce je dostupná pouze pro dokumenty');
      return;
    }

    if (!template?.id) {
      alert('Nejprve uložte šablonu');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5027/api/EmailTemplate/${template.id}/export/pdf`);
      if (!response.ok) {
        throw new Error('Export selhal');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setPdfNotificationData({ fileName: `${template.name}.pdf` });
      setShowPdfNotification(true);
      setTimeout(() => setShowPdfNotification(false), 5000);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Export do PDF selhal');
    }
  };

  const getTemplateTypeDescription = () => {
    switch (templateType) {
      case TEMPLATE_TYPES.NOTIFICATION:
        return 'RTF editor s možností vkládat kontextové údaje pomocí zástupných symbolů (proměnných)';
      case TEMPLATE_TYPES.DOCUMENT:
        return 'Výsledkem je vygenerované PDF velikosti A4, vhodné pro šablony faktur, certifikátů zkoušek apod.';
      default:
        return '';
    }
  };

  const getEditorTitle = () => {
    switch (templateType) {
      case TEMPLATE_TYPES.NOTIFICATION:
        return 'Editor šablon notifikací';
      case TEMPLATE_TYPES.DOCUMENT:
        return 'Editor šablon dokumentů';
      default:
        return 'Editor šablon';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-7xl h-5/6 flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {template ? 'Upravit šablonu' : 'Vytvořit novou šablonu'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {getEditorTitle()}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            >
              Zrušit
            </button>
            {templateType === TEMPLATE_TYPES.DOCUMENT && (
              <>
                                 <button
                   onClick={handleSaveAsDocx}
                   className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                 >
                   Uložit do CUD
                 </button>
                <button
                  onClick={handleExportPdf}
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Exportovat PDF
                </button>
              </>
            )}
            <button
              onClick={handleSave}
              className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Uložit
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/3 border-r border-gray-200 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Název šablony *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Zadejte název šablony"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Předmět *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Zadejte předmět"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Typ šablony *
              </label>
              <select
                value={templateType}
                onChange={(e) => setTemplateType(e.target.value as TemplateType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value={TEMPLATE_TYPES.NOTIFICATION}>Notifikace</option>
                <option value={TEMPLATE_TYPES.DOCUMENT}>Dokument</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {getTemplateTypeDescription()}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Dostupné proměnné</h3>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                {AVAILABLE_VARIABLES.map((variable) => (
                  <button
                    key={variable.key}
                    onClick={() => {
                      insertVariable(variable.key);
                    }}
                    className="w-full text-left p-2 text-xs bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors"
                    title={`Vložit ${variable.displayName}`}
                  >
                    <div className="font-medium text-blue-700">{variable.key}</div>
                    <div className="text-gray-600">{variable.displayName}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="p-6 pb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Obsah šablony
              </label>
            </div>


          
            <div className="flex-1 px-6 pb-6">
              <div
                id="template-editor"
                ref={editorRef}
                className="w-full h-full border border-gray-300 rounded-md"
                style={{ minHeight: '400px' }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Save notification */}
      {showSaveNotification && saveNotificationData && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out max-w-md">
          <div className="flex items-start space-x-3">
            <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            <div className="flex-1">
              <div className="font-medium mb-2">Šablona byla úspěšně uložena!</div>
              <div className="text-sm opacity-90">
                <div className="mb-1"><span className="font-medium">Název:</span> {saveNotificationData.name}</div>
                <div className="mb-1"><span className="font-medium">Předmět:</span> {saveNotificationData.subject}</div>
                <div><span className="font-medium">Typ:</span> {saveNotificationData.templateType}</div>
              </div>
            </div>
            <button
              onClick={() => setShowSaveNotification(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* CUD notification */}
      {showCudNotification && cudNotificationData && (
        <div className="fixed top-4 left-4 bg-blue-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out max-w-md">
          <div className="flex items-start space-x-3">
            <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            <div className="flex-1">
              <div className="font-medium mb-2">Dokument byl úspěšně uložen do CUD!</div>
              <div className="text-sm opacity-90">
                <div className="mb-1"><span className="font-medium">Cesta:</span> {cudNotificationData.filePath}</div>
                <div><span className="font-medium">Název:</span> {cudNotificationData.fileName}</div>
              </div>
            </div>
            <button
              onClick={() => setShowCudNotification(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* PDF export notification */}
      {showPdfNotification && pdfNotificationData && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out max-w-md">
          <div className="flex items-start space-x-3">
            <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            <div className="flex-1">
              <div className="font-medium mb-2">PDF byl úspěšně exportován!</div>
              <div className="text-sm opacity-90">
                <div><span className="font-medium">Soubor:</span> {pdfNotificationData.fileName}</div>
              </div>
            </div>
            <button
              onClick={() => setShowPdfNotification(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
