// API Configuration
// Automatically uses environment variable or falls back to localhost

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default API_URL;

// Helper function to build API endpoints
export const buildApiUrl = (endpoint) => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_URL}/${cleanEndpoint}`;
};

// Export for easy use
export const API_ENDPOINTS = {
  // Input & Recommendations
  input: `${API_URL}/input`,
  recommend: `${API_URL}/recommend`,
  generatePlan: `${API_URL}/generate-plan`,
  
  // Weather
  weather: `${API_URL}/weather`,
  alerts: `${API_URL}/alerts`,
  registerEmail: `${API_URL}/register-email`,
  registerPhone: `${API_URL}/register-phone`,
  
  // Disease Detection
  diseaseDetect: `${API_URL}/disease-detect`,
  
  // Fertilizer
  fertilizerRecommend: `${API_URL}/fertilizer-recommend`,
  
  // Chat
  chat: `${API_URL}/chat`,
  
  // News
  news: `${API_URL}/news`,
  newsTrending: `${API_URL}/news/trending`,
  
  // Tasks
  tasks: `${API_URL}/tasks`,
};

console.log('🌐 API Configuration:', {
  baseUrl: API_URL,
  environment: import.meta.env.MODE
});
