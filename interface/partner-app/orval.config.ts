import { defineConfig } from 'orval';

export default defineConfig({
  tiffinApi: {
    input: {
      target: './api-docs.json',
      validation: false,
    },
    output: {
      mode: 'single',
      target: './api/generated/api.ts',
      client: 'react-query',
      prettier: false,
      override: {
        mutator: {
          path: './api/custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
});


