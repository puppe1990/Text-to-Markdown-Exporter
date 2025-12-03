document.addEventListener('DOMContentLoaded', () => {
  const filenameInput = document.getElementById('filenameInput');
  const filenamePreview = document.getElementById('filenamePreview');
  const exportBtn = document.getElementById('exportBtn');
  const clearBtn = document.getElementById('clearBtn');
  const statusMessage = document.getElementById('statusMessage');

  // Inicializar Quill editor
  const quill = new Quill('#textInput', {
    theme: 'snow',
    placeholder: 'Cole ou digite o texto que deseja exportar...',
    modules: {
      toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['blockquote', 'code-block'],
        ['link'],
        [{ 'color': [] }, { 'background': [] }],
        ['clean']
      ]
    }
  });

  // Inicializar Turndown para converter HTML para Markdown
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
  });

  // Função para converter HTML do Quill para markdown
  function htmlToMarkdown(html) {
    if (!html || html.trim() === '' || html === '<p><br></p>') {
      return '';
    }
    return turndownService.turndown(html);
  }

  // Função para gerar nome do arquivo
  function generateFilename(customName = '') {
    const timestamp = new Date().toISOString().slice(0, 10);
    const baseName = customName.trim() || 'export';
    // Remove caracteres inválidos para nome de arquivo
    const sanitizedName = baseName.replace(/[<>:"/\\|?*]/g, '');
    return `${sanitizedName}-${timestamp}.md`;
  }

  // Função para atualizar preview do nome do arquivo
  function updateFilenamePreview() {
    const customName = filenameInput.value.trim();
    const preview = generateFilename(customName);
    filenamePreview.textContent = preview;
  }

  // Funções para salvar e carregar do localStorage
  function saveToStorage() {
    const html = quill.root.innerHTML;
    localStorage.setItem('textExport_text', html);
    localStorage.setItem('textExport_filename', filenameInput.value);
  }

  function loadFromStorage() {
    const savedText = localStorage.getItem('textExport_text');
    const savedFilename = localStorage.getItem('textExport_filename');
    
    if (savedText !== null) {
      quill.root.innerHTML = savedText;
    }
    
    if (savedFilename !== null) {
      filenameInput.value = savedFilename;
    }
    
    updateFilenamePreview();
  }

  function clearStorage() {
    localStorage.removeItem('textExport_text');
    localStorage.removeItem('textExport_filename');
  }

  // Função para baixar arquivo
  function downloadMarkdown(content, filename = 'export.md') {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Função para mostrar mensagem de status
  function showStatus(message, isSuccess = true) {
    statusMessage.textContent = message;
    statusMessage.className = isSuccess
      ? 'text-sm text-center text-green-600 font-medium'
      : 'text-sm text-center text-red-600 font-medium';
    statusMessage.classList.remove('hidden');

    setTimeout(() => {
      statusMessage.classList.add('hidden');
    }, 3000);
  }

  // Event listener para exportar
  exportBtn.addEventListener('click', () => {
    const html = quill.root.innerHTML;
    const text = quill.getText();

    if (!text || text.trim() === '' || html === '<p><br></p>') {
      showStatus('Por favor, cole ou digite algum texto antes de exportar.', false);
      return;
    }

    const markdown = htmlToMarkdown(html);
    const customName = filenameInput.value.trim();
    const filename = generateFilename(customName);

    downloadMarkdown(markdown, filename);
    showStatus('Arquivo Markdown exportado com sucesso!', true);
    
    // Limpar dados após salvar com sucesso
    clearStorage();
    quill.setContents([]);
    filenameInput.value = '';
    updateFilenamePreview();
  });

  // Event listener para limpar
  clearBtn.addEventListener('click', () => {
    quill.setContents([]);
    filenameInput.value = '';
    clearStorage();
    updateFilenamePreview();
    quill.focus();
    showStatus('Campo limpo.', true);
  });

  // Event listeners para salvar automaticamente
  quill.on('text-change', saveToStorage);
  filenameInput.addEventListener('input', () => {
    updateFilenamePreview();
    saveToStorage();
  });

  // Carregar dados salvos ao abrir o popup
  loadFromStorage();

  // Focar no editor ao abrir o popup
  quill.focus();
});

