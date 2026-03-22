export type E2EProjectConfig = {
  name: string;
  customerId: string;
  modelId: string;
  requiredEnv: string[];
};

export const ga630Project: E2EProjectConfig = {
  name: 'ga630',
  customerId: '0001',
  modelId: 'GA630',
  requiredEnv: ['PLAYWRIGHT_PASSWORD']
};
