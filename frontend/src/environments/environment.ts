export const environment = {
  production: true,
  openaiApiKey: (window as any).__env?.openaiApiKey || '',
  text2signPublicURLroute: (window as any).__env?.text2signPublicURLroute || 'https://echosign-backend.azurewebsites.net/generate-video',
  sign2textPublicURLroute: (window as any).__env?.sign2textPublicURLroute || 'https://echosign-backend.azurewebsites.net/detect-sign-language',
};
