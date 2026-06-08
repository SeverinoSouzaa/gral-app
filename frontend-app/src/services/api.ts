import { Platform } from 'react-native';

// Detecta o IP correto dependendo se é Emulador Android ou iOS/Web
// Em um app de produção, isso viria de variáveis de ambiente.
// Atualizado para o IP local da sua máquina para testes em celular físico:
const BASE_URL = 'http://192.168.80.106:3000/api/v1';

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
  }
};
