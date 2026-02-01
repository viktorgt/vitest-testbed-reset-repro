/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    setupFiles: ['src/test-setup.ts'],
    fileParallelism: false,
    isolate: true,
    // Issue: Without pool: 'forks', TestBed state leaks between test files
    // Uncommenting the line below fixes the issue but shouldn't be necessary
    // pool: 'forks',
  },
});
