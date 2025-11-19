const sharp = require('sharp');
const fs = require('fs');

async function createIcon(size) {
  // Criar um SVG inline
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#2563eb" rx="${size * 0.2}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.6}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">M</text>
    </svg>
  `;

  // Converter SVG para PNG
  await sharp(Buffer.from(svg))
    .png()
    .toFile(`icon${size}.png`);
  
  console.log(`Ícone ${size}x${size} criado: icon${size}.png`);
}

async function generateIcons() {
  try {
    await createIcon(16);
    await createIcon(48);
    await createIcon(128);
    console.log('Todos os ícones foram criados com sucesso!');
  } catch (error) {
    console.error('Erro ao criar ícones:', error);
  }
}

generateIcons();

