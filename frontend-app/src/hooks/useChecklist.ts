import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '../services/api';

export interface ChecklistItem {
  id: string;
  title: string;
  done: boolean;
  type: 'EVENT' | 'DOCUMENT' | 'FINANCE';
  actionRoute: string; // Rota para onde navegar caso o usuário clique
}

export function useChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0); // de 0 a 100

  const loadChecklist = useCallback(async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) throw new Error('Sem token');

      // Faz as requisições em paralelo
      const [eventos, documentos, finance] = await Promise.all([
        api.eventos.getEventos(token),
        api.documentos.me(token),
        api.finance.getResumo(token).catch(() => null), // Evita falha se finance não tiver plano
      ]);

      const newItems: ChecklistItem[] = [];

      // 1. Verificar Documentos
      // Tipos esperados que precisam ser preenchidos
      const requiredDocs = [
        { type: 'IDENTITY_DOC', title: 'Enviar documento de identidade' },
        { type: 'FRAME_PHOTO', title: 'Enviar foto para o quadro' },
        { type: 'CAP_NAME', title: 'Preencher nome para o canudo' }
      ];

      requiredDocs.forEach(reqDoc => {
        const docEnviado = documentos.find((d: any) => d.tipoDocumento === reqDoc.type);
        const isDone = !!docEnviado; // Se enviou (independente de estar pendente de aprovação ou aprovado) a tarefa está feita
        newItems.push({
          id: `doc_${reqDoc.type}`,
          title: reqDoc.title,
          done: isDone,
          type: 'DOCUMENT',
          actionRoute: 'Documentos'
        });
      });

      // 2. Verificar Eventos
      eventos.forEach((ev: any) => {
        newItems.push({
          id: `evento_${ev.id}`,
          title: `Confirmar presença: ${ev.nomeEvento}`,
          done: ev.statusPresencaUsuario !== 'PENDENTE',
          type: 'EVENT',
          actionRoute: 'Calendario'
        });
      });

      // 3. Verificar Finanças
      if (finance) {
        newItems.push({
          id: 'finance_pendente',
          title: 'Manter parcelas em dia',
          done: finance.pendente === 0,
          type: 'FINANCE',
          actionRoute: 'Pagamentos'
        });
      }

      setItems(newItems);
      
      const doneCount = newItems.filter(i => i.done).length;
      const totalCount = newItems.length;
      setProgress(totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100));

    } catch (error) {
      console.error("Erro ao carregar checklist:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChecklist();
  }, [loadChecklist]);

  return { items, loading, progress, refresh: loadChecklist };
}
