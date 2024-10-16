import QRCode from 'qrcode'

export function generateCode(length = 10) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    code += charset[randomIndex];
  }
  return code;
}

export async function generateQR(code) {
  try {
    // Genera el código QR como un Data URL
    const qrCodeImage = await QRCode.toDataURL(code);
    return qrCodeImage;  // Devuelve la imagen en base64
  } catch (err) {
    console.error('Error al generar el QR:', err);
    throw new Error('Error al generar el código QR');
  }
}


