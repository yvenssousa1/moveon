# Backup de Código - Projeto MoveOn

Este arquivo serve como referência para o código-fonte dos principais componentes e páginas customizados ou alterados até o momento. Para cada arquivo, consulte o repositório para o código completo e atualizado.

---

## components/CorpoHumanoInterativo.js
- SVG interativo com regiões anatômicas detalhadas (anterior/posterior)
- Regiões clicáveis, formas geométricas, contraste aprimorado
- Alternância de seleção, integração com formulário

## pages/marcar-dor.js
- Integração do componente CorpoHumanoInterativo
- Recebe e processa marcações do usuário
- Campo de texto alternativo para descrição da dor

## components/CardAvaliacaoInicial.js
- Formulário de avaliação inicial obrigatória
- Upload de exames/documentos
- Pergunta de dor (Sim/Não)
- Redirecionamento para marcação de dor

## components/SidebarMenu.js
- Menu lateral moderno com ícones (react-icons)
- Navegação entre páginas do dashboard

## components/DashboardHeader.js
- Header do dashboard com nome dinâmico do usuário
- Logo ajustada/oculta conforme feedback

## Integração Supabase
- Autenticação, cadastro, recuperação/redefinição de senha
- E-mails personalizados
- Uso de variáveis de ambiente (.env.local)

## Outras Decisões
- Modularização dos componentes
- Responsividade e visual limpo
- Estrutura pronta para internacionalização

---

Para obter o código completo de cada componente, acesse os arquivos diretamente no projeto. Caso queira exportar o conteúdo de um arquivo específico, solicite o nome do arquivo desejado.