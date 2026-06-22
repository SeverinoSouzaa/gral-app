# ADMIN_PANEL_MASTER_GUIDE

Este documento é a regra principal e permanente do projeto.
NENHUMA instrução deste documento pode ser ignorada.
Toda implementação futura deve consultar este documento antes de qualquer alteração.
Se existir qualquer conflito entre decisões técnicas e este documento, ESTE DOCUMENTO TEM PRIORIDADE ABSOLUTA.

## OBJETIVO PRINCIPAL
Construir um painel administrativo web completo, moderno, elegante, minimalista e altamente organizado para a equipe interna da GRAL.
O sistema administrativo será basicamente uma versão visual, organizada e muito mais amigável de todo o Swagger existente.
O Swagger será a fonte oficial de verdade das funcionalidades.
Todo módulo existente no Swagger deve existir no painel administrativo.
A diferença é que o Swagger será transformado em uma interface moderna, elegante e intuitiva.
O painel administrativo será utilizado pela equipe interna.
A prioridade máxima é proporcionar uma excelente experiência de uso.

## ESTRUTURA OBRIGATÓRIA DO PROJETO
Criar uma nova pasta na raiz do repositório chamada:
web-project
Toda a aplicação web será construída dentro desta pasta.
Cada responsabilidade deve permanecer em sua própria camada.
A estrutura deve ser extremamente organizada.
Seguir a estrutura base oficial do framework escolhido.

## TECNOLOGIAS

**Frontend:**
- Utilizar TypeScript.
- Escolher um framework moderno.
- Priorizar React + Vite ou Next.js.
- Utilizar boas práticas.
- Componentização obrigatória.

**Backend:**
- NÃO criar um backend novo.
- O painel administrativo deve utilizar o backend já existente.
- Conectar diretamente ao backend hospedado.
- Conectar diretamente ao banco hospedado.
- Não utilizar mais o ambiente local.
- Trabalhar exclusivamente com:
  - Banco de dados: Supabase hospedado.
  - Backend: Render hospedado.
  - API oficial: https://gral-api.onrender.com/api/v1/docs

Toda funcionalidade deverá ser construída consultando essa API.

## FONTE OFICIAL DAS FUNCIONALIDADES
O Swagger é a única fonte oficial.
Tudo que existe no Swagger deve existir no painel administrativo.
Isso inclui:
- todos os módulos
- todas as seções
- todas as funcionalidades
- todos os formulários
- todos os campos
- todos os relacionamentos
- todas as operações

Não omitir nenhuma funcionalidade.

## DESIGN OBRIGATÓRIO
Extrair integralmente o design existente no projeto: frontend-app
Também consultar: docs/extratec media
O painel administrativo deve seguir exatamente a mesma identidade visual.
Não criar uma identidade nova.
Não alterar cores.
Não alterar conceitos.
Não alterar a experiência visual.

**Manter:**
- mesmas cores
- mesmos degradês
- mesmos desfocados
- mesmas sombras
- mesmo estilo visual
- mesma linguagem visual
- mesma identidade

O objetivo é que o usuário perceba que está usando o mesmo ecossistema.
Apenas adaptar para web.

## ESTILO VISUAL
O design deve possuir aparência Apple.
Características:
- elegante
- suave
- minimalista
- moderno
- limpo
- sofisticado

**Evitar:**
- excesso de informação
- poluição visual
- elementos apertados
- botões sobrepostos
- textos sobrepostos

## RESPONSIVIDADE OBRIGATÓRIA
Todo o sistema deve funcionar perfeitamente em:
- celular
- tablet
- notebook
- desktop
- monitores ultrawide

Nenhuma tela pode quebrar. Nenhum componente pode sair da tela.

## LOGO
NÃO utilizar GRAL redondo.
Utilizar o ícone oficial real da GRAL.
Buscar exatamente o mesmo ícone utilizado na tela de login do aplicativo mobile.

Também replicar:
- sombras
- efeitos de fundo
- bordas translúcidas
- efeito glassmorphism

## TELA DE LOGIN
Replicar a tela do aplicativo.
Ao clicar em Entrar:
Solicitar: email, senha
A autenticação deve ocorrer utilizando o backend real hospedado.
Não exibir erros técnicos.
Não exibir: POST /...
Exibir mensagens amigáveis.

## COMPONENTES GLOBAIS OBRIGATÓRIOS
Criar um Design System reutilizável.
Criar componentes únicos para reutilização (ex: `components/`).
Criar:
- AppButton
- AppModal
- AppAlert
- AppCard
- AppInput
- AppSelect
- AppSearch
- AppBadge
- AppTable
- AppHeader
- AppSidebar
- AppPageTitle
- AppPagination
- AppFilter
- AppTooltip

Todo o sistema deve reutilizar esses componentes.
Nunca utilizar: `alert()`, `confirm()`, `prompt()`. Substituir por modais próprios.

## BIBLIOTECA DE ÍCONES
Obrigatório.
Nunca utilizar emojis.
Nunca inventar ícones.
Utilizar bibliotecas reais (ex: Lucide, Heroicons, Tabler Icons).
Manter aparência Apple.

## ORGANIZAÇÃO DOS MÓDULOS
Cada módulo deve possuir responsabilidade clara.
Criar um dashboard elegante. Exibir: estatísticas, resumos, indicadores, cartões informativos.

**MÓDULO TURMAS + FORMANDOS**
- Unificar ambos.
- Tela inicial: resumo das turmas, indicadores, estatísticas.
- Ao clicar em uma turma:
  - Topo: Todos os dados da turma.
  - Parte inferior: Lista completa dos formandos pertencentes à turma.
  - Adicionar botão: "Cadastrar novo formando" (associado diretamente à turma, sem utilizar ID visualmente).
- Pesquisa inteligente de formandos: por CPF, nome.
- Dados dos formandos: exibir nome, telefone, email, CPF e demais informações.
- Validação de turmas: bloquear código e nome duplicados.

**DOCUMENTOS**
- Consultar integralmente o Swagger. Implementar tudo.
- Melhorar a experiência: não utilizar nomes técnicos (ex: cap_name, val).
- Pesquisa: turma, tipo de documento (foto, nome do canudo).
- Visualização: botão Visualizar Imagem, permitir aceitar/rejeitar.
- Rejeição: abrir modal elegante.

**MÓDULO EVENTOS + MÍDIAS**
- Unificar ambos.
- Tela principal: Resumo, agrupado por Turma -> Eventos da turma.
- Novo evento: selecionar turma sem utilizar ID.
- Pesquisa dos eventos: filtros por turma.
- Página de evento: Topo com informações, Parte inferior com lista de mídias e botão "Subir mídia". As mídias devem ser associadas ao evento e à turma.

**MÓDULO FINANCEIRO**
- Consultar integralmente o Swagger e implementar todas as funcionalidades.
- Permitir selecionar turma, definir valor por aluno, quantidade de parcelas, data de vencimento, etc.

## MODAIS
Todos os modais devem seguir o design GRAL.
Características: limpos, minimalistas, suaves, elegantes.

## EXPERIÊNCIA DO USUÁRIO
Prioridades: Clareza, Organização, Rapidez, Elegância, Consistência.
A equipe interna nunca deve se sentir perdida. Tudo deve ser intuitivo.

## REGRA FINAL OBRIGATÓRIA
Não implementar tudo de uma vez. Implementar funcionalidade por funcionalidade.
Ao finalizar cada módulo:
- Validar o Swagger
- Validar o banco hospedado
- Validar o backend hospedado
- Validar a responsividade
- Validar a experiência do usuário
- Validar a consistência visual

Somente então prosseguir para o próximo módulo.
