import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://gongideas.example',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
