document.addEventListener('DOMContentLoaded', () => {
  const textInput = document.getElementById('textInput');
  const filenameInput = document.getElementById('filenameInput');
  const filenamePreview = document.getElementById('filenamePreview');
  const exportBtn = document.getElementById('exportBtn');
  const clearBtn = document.getElementById('clearBtn');
  const statusMessage = document.getElementById('statusMessage');

  // Função para converter texto para markdown
  function textToMarkdown(text) {
    if (!text || text.trim() === '') {
      return '';
    }

    // Preserva quebras de linha e converte para markdown
    let markdown = text
      // Converte múltiplas quebras de linha em parágrafos
      .replace(/\n{3,}/g, '\n\n')
      // Preserva quebras de linha simples
      .split('\n')
      .map(line => line.trim() === '' ? '' : line)
      .join('\n');

    return markdown;
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
    const text = textInput.value;

    if (!text || text.trim() === '') {
      showStatus('Por favor, cole ou digite algum texto antes de exportar.', false);
      return;
    }

    const markdown = textToMarkdown(text);
    const customName = filenameInput.value.trim();
    const filename = generateFilename(customName);

    downloadMarkdown(markdown, filename);
    showStatus('Arquivo Markdown exportado com sucesso!', true);
  });

  // Event listener para limpar
  clearBtn.addEventListener('click', () => {
    textInput.value = '';
    filenameInput.value = '';
    updateFilenamePreview();
    textInput.focus();
    showStatus('Campo limpo.', true);
  });

  // Event listener para atualizar preview do nome do arquivo
  filenameInput.addEventListener('input', updateFilenamePreview);

  // Inicializar preview do nome do arquivo
  updateFilenamePreview();

  // Focar no textarea ao abrir o popup
  textInput.focus();
});

