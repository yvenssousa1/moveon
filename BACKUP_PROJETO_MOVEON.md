# Backup do Projeto MoveOn

## 1. Objetivo do Projeto
Transformar requisitos em um PWA Next.js para avaliação fisioterapêutica, com onboarding realista, dashboard modular, avaliação inicial obrigatória, upload de exames, questionário de dor e corpo humano interativo.

## 2. Funcionalidades Implementadas
- Autenticação, cadastro, recuperação/redefinição de senha com Supabase Auth.
- Campo de telefone internacional (react-phone-input-2).
- Dashboard do paciente com avaliação inicial obrigatória.
- Upload de exames/documentos.
- Questionário: “Você tem dor?” (Sim/Não).
- Corpo humano interativo para marcação de dor, com silhueta anterior e posterior.
- Campo de texto alternativo para dor.
- Menu lateral moderno com ícones (react-icons).
- Header do dashboard com nome dinâmico do usuário.
- Modularização dos componentes.
- Responsividade e visual limpo.

## 3. Alterações Recentes no Corpo Humano Interativo
- Regiões detalhadas para marcação (anterior e posterior) com nomes anatômicos claros.
- Diferenciação visual entre frente e costas.
- Delimitações mais visíveis (contorno escuro, maior opacidade).
- Teste de paths orgânicos para maior realismo (revertido a pedido).
- Manutenção das formas geométricas para clareza e usabilidade.

## 4. Componentes e Páginas Envolvidas
- components/CorpoHumanoInterativo.js: SVG interativo, regiões clicáveis, silhueta anterior/posterior.
- pages/marcar-dor.js: Integração do componente interativo.
- components/CardAvaliacaoInicial.js: Formulário de avaliação inicial.
- components/SidebarMenu.js, components/DashboardHeader.js: Navegação e header.
- Integração com Supabase e variáveis de ambiente.

## 5. Decisões e Ajustes Importantes
- Labels e textos removidos para foco total na silhueta.
- Contraste e visibilidade aprimorados nas regiões.
- Testes e reversões rápidas conforme feedback.
- Estrutura modular para fácil manutenção e expansão.

## 6. Próximos Passos Sugeridos
- Tela de confirmação após marcação de dor.
- Integração do envio das marcações para o backend.
- Ajustes finos de UX/UI conforme feedback.

---

Este arquivo serve como backup rápido do progresso e decisões do projeto até o momento. Para detalhes de código, consulte os componentes citados.