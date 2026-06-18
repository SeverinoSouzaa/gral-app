export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

async function fetchWithTimeout(resource: string, options: RequestInit & { timeout?: number } = {}) {
  const { timeout = 25000 } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export const api = {
  auth: {
    loginAdmin: async (email: string, senha: string) => {
      const res = await fetchWithTimeout(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha, isEquipe: true }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || 'Falha ao autenticar.');
      }
      return res.json();
    },
  },
  // Mais módulos serão implementados aqui na Fase 3 e 4
};
