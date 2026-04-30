import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'packages/core/vitest.config.ts',
  'packages/charts/vitest.config.ts',
  'packages/themes/vitest.config.ts',
  'packages/animations/vitest.config.ts',
]);
