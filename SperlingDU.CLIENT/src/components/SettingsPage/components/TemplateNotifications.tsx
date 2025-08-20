interface SaveNotificationData {
  name: string;
  subject: string;
  templateType: string;
}

interface CudNotificationData {
  filePath: string;
  fileName: string;
}

interface PdfNotificationData {
  fileName: string;
}

interface TemplateNotificationsProps {
  showSaveNotification: boolean;
  saveNotificationData: SaveNotificationData | null;
  showCudNotification: boolean;
  cudNotificationData: CudNotificationData | null;
  showPdfNotification: boolean;
  pdfNotificationData: PdfNotificationData | null;
  onCloseSave: () => void;
  onCloseCud: () => void;
  onClosePdf: () => void;
}

export default function TemplateNotifications({
  showSaveNotification,
  saveNotificationData,
  showCudNotification,
  cudNotificationData,
  showPdfNotification,
  pdfNotificationData,
  onCloseSave,
  onCloseCud,
  onClosePdf
}: TemplateNotificationsProps) {
  return (
    <>
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
            <button onClick={onCloseSave} className="text-white hover:text-gray-200 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      )}

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
            <button onClick={onCloseCud} className="text-white hover:text-gray-200 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      )}

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
            <button onClick={onClosePdf} className="text-white hover:text-gray-200 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
