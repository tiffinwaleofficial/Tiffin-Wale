module.exports = {
  // Input: OpenAPI spec URL or file
  url: 'http://localhost:3001/api-docs-json',
  
  // Output configuration
  output: './api/generated',
  
  // Generate React Query hooks
  httpClientType: 'axios',
  
  // Use custom axios instance
  customFetchRequestHandler: './api/custom-instance.ts',
  
  // Generate React Query hooks
  hooks: true,
  
  // Additional options
  cleanOutput: false,
  enumNamesAsValues: false,
  generateClient: true,
  generateRouteTypes: true,
  generateResponses: true,
  toJS: false,
  extractRequestParams: true,
  extractRequestBody: true,
  extractEnums: true,
  unwrapResponseData: true,
  prettier: {
    printWidth: 120,
    tabWidth: 2,
    trailingComma: 'es5',
    arrowParens: 'always',
    singleQuote: true,
  },
  
  // Module name
  modular: true,
  moduleNameFirstTag: true,
  
  // Type names
  typePrefix: '',
  typeSuffix: '',
  
  // Enum names
  enumKeyPrefix: '',
  enumKeySuffix: '',
  
  // Add custom templates if needed
  templates: undefined,
  
  // Silent mode
  silent: false,
  
  // Default response as success
  defaultResponseAsSuccess: false,
  
  // Generate Union enums
  generateUnionEnums: false,
  
  // Extract response error type
  extractResponseError: true,
  
  // Request and response types
  extraTemplates: [],
};


