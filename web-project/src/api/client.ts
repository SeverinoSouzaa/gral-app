const API_URL = 'https://gral-api.onrender.com/api/v1';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('@GRAL:token_admin');
  
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = 'Ocorreu um erro inesperado.';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  get: (endpoint: string) => fetchWithAuth(endpoint, { method: 'GET' }),
  post: (endpoint: string, body?: any) => 
    fetchWithAuth(endpoint, { 
      method: 'POST', 
      body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
  put: (endpoint: string, body?: any) => 
    fetchWithAuth(endpoint, { 
      method: 'PUT', 
      body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
  patch: (endpoint: string, body?: any) => 
    fetchWithAuth(endpoint, { 
      method: 'PATCH', 
      body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
  delete: (endpoint: string) => fetchWithAuth(endpoint, { method: 'DELETE' }),

  turmas: {
    listar: () => fetchWithAuth('/turmas', { method: 'GET' }),
    criar: (data: any) => fetchWithAuth('/turmas', { method: 'POST', body: JSON.stringify(data) })
  },
  
  usuariosAdmin: {
    listar: () => fetchWithAuth('/users', { method: 'GET' }),
    buscarPorId: (id: number) => fetchWithAuth(`/users/${id}`, { method: 'GET' }),
    criarFormando: (data: any) => fetchWithAuth('/users/formando', { method: 'POST', body: JSON.stringify(data) }),
    atualizar: (id: number, data: any) => fetchWithAuth(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    excluir: (id: number) => fetchWithAuth(`/users/${id}`, { method: 'DELETE' })
  },

  eventosAdmin: {
    listarTodos: () => fetchWithAuth('/eventos', { method: 'GET' }),
    listarPorTurma: (turmaId: number) => fetchWithAuth(`/eventos/turma/${turmaId}`, { method: 'GET' }),
    buscarPorId: (eventoId: number) => fetchWithAuth(`/eventos/${eventoId}`, { method: 'GET' }),
    criar: (data: any) => fetchWithAuth('/eventos', { method: 'POST', body: JSON.stringify(data) }),
    atualizar: (eventoId: number, data: any) => fetchWithAuth(`/eventos/${eventoId}`, { method: 'PUT', body: JSON.stringify(data) }),
    remover: (eventoId: number) => fetchWithAuth(`/eventos/${eventoId}`, { method: 'DELETE' })
  },

  midiasAdmin: {
    listarPorEvento: (eventoId: number) => fetchWithAuth(`/midias/evento/${eventoId}`, { method: 'GET' }),
    uploadArquivo: (eventoId: number, file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return fetchWithAuth(`/midias/evento/${eventoId}/upload`, { method: 'POST', body: formData });
    },
    excluir: (id: number) => fetchWithAuth(`/midias/${id}`, { method: 'DELETE' })
  },

  documentosAdmin: {
    listarTodos: () => fetchWithAuth('/documentos', { method: 'GET' }),
    aprovar: (id: number) => fetchWithAuth(`/documentos/${id}/aprovar`, { method: 'PUT' }),
    rejeitar: (id: number, motivo: string) => fetchWithAuth(`/documentos/${id}/rejeitar`, { method: 'PUT', body: JSON.stringify({ motivo }) })
  },

  financeiroAdmin: {
    gerarParcelas: (turmaId: number, data: any) => fetchWithAuth(`/finance/admin/turmas/${turmaId}/gerar-parcelas`, { method: 'POST', body: JSON.stringify(data) }),
    listarInadimplentes: (turmaId: number) => fetchWithAuth(`/finance/admin/turmas/${turmaId}/inadimplentes`, { method: 'GET' }),
    visaoGeral: (turmaId: number) => fetchWithAuth(`/finance/admin/turmas/${turmaId}/visao-geral`, { method: 'GET' }),
    resumoArrecadacao: (turmaId: number) => fetchWithAuth(`/finance/admin/turmas/${turmaId}/resumo`, { method: 'GET' }),
    baixaManual: (formandoId: number, numeroParcela: number, data: any) => fetchWithAuth(`/finance/admin/formandos/${formandoId}/parcelas/${numeroParcela}/baixa-manual`, { method: 'PATCH', body: JSON.stringify(data) })
  }
};
