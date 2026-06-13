import { Platform } from 'react-native';

// Detecta automaticamente se o app está rodando no ambiente de desenvolvimento (Expo Go local)
// ou se foi compilado como APK (Produção).
const LOCAL_URL = 'http://192.168.80.106:3000/api/v1'; // Sua máquina
const PROD_URL = 'https://gral-api.onrender.com/api/v1'; // API na nuvem oficial

const BASE_URL = __DEV__ ? LOCAL_URL : PROD_URL;

export const api = {
  login: async (cpf: string, codigoTurma: string) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login/formando`, {
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
      const response = await fetch(`${BASE_URL}/documentos/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Erro ao buscar documentos');
      return response.json();
    },
    uploadText: async (token: string, tipoDocumento: string, valorConteudo: string) => {
      const formData = new FormData();
      formData.append('tipoDocumento', tipoDocumento);
      formData.append('valorConteudo', valorConteudo);

      const response = await fetch(`${BASE_URL}/documentos`, {
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

      const response = await fetch(`${BASE_URL}/documentos`, {
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
      const response = await fetch(`${BASE_URL}/eventos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Erro ao buscar eventos');
      return response.json();
    },
    setPresenca: async (token: string, eventoId: number, status: 'CONFIRMADO' | 'RECUSADO') => {
      const response = await fetch(`${BASE_URL}/eventos/${eventoId}/presenca`, {
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
      const response = await fetch(`${BASE_URL}/midias`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Erro ao buscar mídias');
      return response.json();
    }
  }
};
