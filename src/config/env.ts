/**
 * Application environment configuration module
 */
export const ENV = {
  appName: import.meta.env.VITE_APP_NAME || 'CampusHub',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  cloudinaryCloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  githubClientId: import.meta.env.VITE_GITHUB_CLIENT_ID || '',
  isDev: import.meta.env.DEV,
} as const;
