# Active Learn Hub

Uma aplicação React para assistente de Aprendizagem Baseada em Desafios (CBL).

## Configuração

### Pré-requisitos
- Node.js instalado (versão 14 ou superior)
- npm (vem com o Node.js)

### Instalação

1. **Instalar dependências:**
```bash
npm install
```

2. **Iniciar o servidor de desenvolvimento:**
```bash
npm start
```

3. **Abrir no navegador:**
Acesse [http://localhost:3000](http://localhost:3000) para ver a aplicação.

## Funcionalidades

- **Fase Engage**: Definir Grandes Ideias e Questões Essenciais
- **Fase Investigate**: Pesquisar e responder perguntas orientadoras
- **Fase Act**: Desenvolver e testar protótipos
- **Smart Nudges**: Orientação passo-a-passo para cada fase
- **Autenticação de Usuário**: Gerenciamento baseado em armazenamento local
- **Acompanhamento de Progresso**: Indicadores visuais e listas de verificação

## Tecnologias Utilizadas

- **React 18** - Framework principal
- **Framer Motion** - Animações fluidas
- **Tailwind CSS** - Estilização moderna
- **Local Storage** - Persistência de dados

## Estrutura do Projeto

```
src/
├── components/
│   └── ActiveLearnHub.js    # Componente principal da aplicação
├── App.js                   # Wrapper da aplicação
├── index.js                 # Ponto de entrada
└── index.css               # Estilos globais com Tailwind
```

## Como Usar

1. **Criar conta**: Use a opção de demo ou cadastro rápido
2. **Navegar pelas fases**: Use a barra lateral para acessar as fases do CBL
3. **Obter orientação**: Clique em "Obter Nudge" para orientação passo-a-passo
4. **Completar tarefas**: Marque itens das listas de verificação
5. **Acompanhar progresso**: Visualize seu avanço e ganhe badges e XP

## Comandos Disponíveis

- `npm start` - Iniciar servidor de desenvolvimento
- `npm run build` - Construir para produção
- `npm test` - Executar testes
- `npm run eject` - Ejetar do Create React App (avançado)

## Solução de Problemas

### Erro de Porta em Uso
Se a porta 3000 estiver ocupada, o React automaticamente tentará a próxima porta disponível.

### Problemas de Dependências
Se houver problemas com dependências, tente:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Acesso

- **Desenvolvimento**: http://localhost:3000
- **Produção**: Após build, os arquivos estarão na pasta `build/`

---
