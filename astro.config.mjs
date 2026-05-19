import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://gongideas.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
