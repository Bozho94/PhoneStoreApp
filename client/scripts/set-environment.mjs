import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = dirname(currentFilePath);

const apiUrl = process.env.CLIENT_API_URL || 'http://localhost:5232/api/';
const normalizedApiUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;

const environmentFilePath = resolve(currentDirectory, '../src/environments/environment.ts');

const fileContents = `export const environment = {
  production: true,
  apiUrl: '${normalizedApiUrl}'
};
`;

writeFileSync(environmentFilePath, fileContents, 'utf8');
