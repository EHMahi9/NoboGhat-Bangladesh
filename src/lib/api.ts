import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function fetchApi(endpoint: string, options: FetchOptions = {}) {
  const { requireAuth = true, headers, ...customConfig } = options;
  
  const token = Cookies.get('token');

  const isFormData = typeof FormData !== 'undefined' && customConfig.body instanceof FormData;
  const configHeaders: Record<string, string> = {
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...(headers as Record<string, string>),
  };

  const config: RequestInit = {
    ...customConfig,
    headers: configHeaders,
  };

  if (requireAuth && token) {
    configHeaders['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  } catch (netErr: any) {
    const error = new Error(netErr?.message || 'Network connection error. Please check your connection.');
    error.name = 'NetworkError';
    throw error;
  }
  
  let data: any = null;
  try {
    const text = await response.text();
    if (text && text.trim().length > 0) {
      data = JSON.parse(text);
    }
  } catch (e) {
    // text wasn't valid json
    data = null;
  }

  if (!response.ok) {
    // Handle unauthorized globally
    if (response.status === 401) {
      Cookies.remove('token');
      Cookies.remove('role');
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname + window.location.search;
        if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        } else {
          window.location.href = '/login';
        }
      }
    }
    
    const message = (data && (data.message || data.error)) || `API Error: ${response.status}`;
    throw new Error(message);
  }
  
  return data;
}
