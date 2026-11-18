import './build.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';

// The application is served by Edge Functions after authentication.
mkdirSync('edgeone-output', { recursive: true });
writeFileSync('edgeone-output/.gitkeep', '');
