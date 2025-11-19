# Text to Markdown Exporter

Extensão do Chrome para exportar texto para formato Markdown.

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Compile o CSS do Tailwind:
```bash
npm run build:css
```

3. Carregue a extensão no Chrome:
   - Abra `chrome://extensions/`
   - Ative o "Modo do desenvolvedor"
   - Clique em "Carregar sem compactação"
   - Selecione a pasta do projeto

## Desenvolvimento

Para assistir mudanças no CSS durante o desenvolvimento:
```bash
npm run watch:css
```

## Uso

1. Clique no ícone da extensão
2. Cole ou digite o texto no campo
3. Clique em "Exportar Markdown"
4. O arquivo será baixado automaticamente

## Estrutura

- `manifest.json` - Configuração da extensão
- `popup.html` - Interface do popup
- `popup.js` - Lógica da aplicação
- `popup.css` - Estilos compilados do Tailwind (gerado)
- `src/input.css` - Arquivo fonte do Tailwind

