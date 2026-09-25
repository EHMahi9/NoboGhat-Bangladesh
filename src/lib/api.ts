import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function fetchApi(endpoint: string, options: FetchOptions = {}) {
  const { requireAuth = true, headers, ...customConfig } = options;
  
  const token = Cookies.get('token');

  const config: RequestInit = {
    ...customConfig,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (requireAuth && token) {
    (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  let data: any = {};
  try {
    const text = await response.text();
    if (text) data = JSON.parse(text);
  } catch (e) {
    // text wasn't valid json
  }

  if (!response.ok) {
    // Handle unauthorized globally
    if (response.status === 401) {
      Cookies.remove('token');
      Cookies.remove('role');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    throw new Error(data.message || data.error || `API Error: ${response.status}`);
  }
  
  return data;
}
