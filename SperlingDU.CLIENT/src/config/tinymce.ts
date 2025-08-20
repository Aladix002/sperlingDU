// TinyMCE Configuration - Self-hosted version without API key

declare global {
  interface Window {
    tinymce: any;
  }
}

export const TINYMCE_CONFIG = {
  selfHosted: true,
  
  init: {
    height: 400,
    menubar: false,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | formatselect | ' +
      'bold italic backcolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'removeformat | variables quickvariables | help',
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
    // Self-hosted specific settings
    skin: 'oxide',
    content_css: 'default',
    cloud_channel: false,
    external_plugins: {},
    auto_save: true,
    auto_save_interval: '30s',
    paste_as_text: false,
    paste_enable_default_filters: true,
    entity_encoding: 'raw',
    encoding: 'html'
  }
};

export const loadTinyMCEScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.tinymce) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.3/tinymce.min.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load TinyMCE'));
    document.head.appendChild(script);
  });
};
