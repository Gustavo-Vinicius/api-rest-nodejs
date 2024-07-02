import { execSync } from 'child_process';

// Obter argumentos passados para o script
const args = process.argv.slice(2).join(' ');

// Executar o comando knex com os argumentos
execSync(`npx knex ${args}`, { stdio: 'inherit' });
