import { Platform } from 'react-native';

// ============================================================================
// IMPORTANTE: Para a demonstração oficial, o app está travado na Nuvem (Render).
// Não é necessário configurar IPv4.
// ============================================================================
export const BASE_URL = 'https://gral-api.onrender.com/api/v1';

/**
 * Função utilitária para evitar que o app fique em "Carregando" infinitamente.
 * Ela estipula um tempo máximo de espera (Timeout) para a nuvem acordar (Render)
 * ou para detectar rapidamente se o IP local está errado.
 */
async function fetchWithTimeout(resource: string, options: RequestInit & { timeout?: number } = {}) {
  const { timeout = 25000 } = options; // 25 segundos (dá tempo do Render acordar)

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error: any) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error('TIMEOUT_ERROR');
    }
    throw error;
  }
}

export const api = {
  login: async (cpf: string, codigoTurma: string) => {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/auth/login/formando`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpf, codigoTurma }),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      return await response.json();
    } catch (error) {
      console.error("Erro na API Login:", error);
      throw error;
    }
  },
  documentos: {
    me: async (token: string) => {
      const response = await fetchWithTimeout(`${BASE_URL}/documentos/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Erro ao buscar documentos');
      return response.json();
    },
    uploadText: async (token: string, tipoDocumento: string, valorConteudo: string) => {
      const formData = new FormData();
      formData.append('tipoDocumento', tipoDocumento);
      formData.append('valorConteudo', valorConteudo);

      const response = await fetchWithTimeout(`${BASE_URL}/documentos`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }, // fetch lida com o multipart boundary sozinho
        body: formData,
      });
      if (!response.ok) throw new Error('Erro ao enviar documento');
      return response.json();
    },
    uploadFile: async (token: string, tipoDocumento: string, fileUri: string) => {
      const formData = new FormData();
      formData.append('tipoDocumento', tipoDocumento);

      const filename = fileUri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('file', {
        uri: Platform.OS === 'ios' ? fileUri.replace('file://', '') : fileUri,
        name: filename,
        type,
      } as any);

      const response = await fetchWithTimeout(`${BASE_URL}/documentos`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) throw new Error('Erro ao fazer upload da imagem');
      return response.json();
    }
  },
  eventos: {
    getEventos: async (token: string) => {
      const response = await fetchWithTimeout(`${BASE_URL}/eventos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Erro ao buscar eventos');
      return response.json();
    },
    setPresenca: async (token: string, eventoId: number, status: 'CONFIRMADO' | 'RECUSADO') => {
      const response = await fetchWithTimeout(`${BASE_URL}/eventos/${eventoId}/presenca`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Erro ao confirmar presença');
      return response.json();
    }
  },
  midias: {
    getMidias: async (token: string) => {
      const response = await fetchWithTimeout(`${BASE_URL}/midias`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Erro ao buscar mídias');
      return response.json();
    }
  },
  finance: {
    getResumo: async (token: string) => {
      const response = await fetchWithTimeout(`${BASE_URL}/finance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Erro ao carregar resumo financeiro');
      return response.json();
    },
    payParcela: async (token: string, parcelaId: number, formaPagamento: 'PIX' | 'CREDIT_CARD', valor: number) => {
      const response = await fetchWithTimeout(`${BASE_URL}/finance/${parcelaId}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ formaPagamento, valor })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao processar pagamento');
      }
      return response.json();
    }
  }
};
