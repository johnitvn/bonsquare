import fs from 'node:fs';

export const convertImageToBase64URL = (filePath: string, mimeType: string): string => {
  try {
    const buffer = fs.readFileSync(filePath);
    const base64String = Buffer.from(buffer).toString('base64');
    return `data:image/${mimeType};base64,${base64String}`;
  } catch (error) {
    throw new Error(`file ${filePath} no exist`);
  }
};
