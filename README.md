# TaxSped Frontend

Frontend React independente do Sistema Z, organizado por funcionalidades e baseado nos protótipos do TaxSped.

## Executar

```bash
npm install
npm run dev
```

O projeto será aberto em `http://localhost:5173`.

## Build

```bash
npm run build
npm test
```

O resultado de produção será criado na pasta `dist`.

## Telas disponíveis

- Login e criação de conta;
- Dashboard;
- Nova conversão;
- Pedidos;
- Arquivos;
- Planos;
- Configurações.

## Arquitetura

```text
src/
├── app/                    # Entrada, rotas, navegação e estado compartilhado
├── components/
│   ├── layout/             # Sidebar, header e estrutura das páginas
│   └── ui/                 # Campos, modal, paginação e componentes comuns
├── features/
│   ├── auth/               # Login, cadastro e arte de acesso
│   ├── dashboard/          # Indicadores, gráficos e ações rápidas
│   ├── conversion/         # Configurações, upload e solicitações
│   ├── orders/             # Pedidos, resultados, detalhes e exportação CSV
│   ├── files/              # Tabelas, filtros, detalhes, downloads e lixeira
│   ├── plans/              # Planos, comparação e seleção local
│   └── settings/           # Perfil e preferências
├── data/                   # Dados de demonstração
├── styles/                 # Estilos globais, layout, elementos comuns e responsividade
├── utils/                  # Datas, armazenamento e downloads
└── test/                   # Preparação dos testes
```

Cada funcionalidade contém sua página `*Page.jsx`, seu `styles.css` e componentes próprios. Hooks concentram estado e regras de interação; services encapsulam acesso a arquivos. Componentes comuns ficam em `components/ui`. As URLs ficam em `app/routes.jsx`.

As rotas usam `HashRouter`, permitindo abrir URLs como `/#/pedidos` sem configurar redirecionamento no servidor e facilitando o futuro empacotamento como aplicativo. A URL antiga `/#/historico` redireciona para Pedidos.

## Funcionamento atual

- Sessão de demonstração em `sessionStorage`, com entrada e saída; perfil salvo em `localStorage`.
- Busca, filtros de tipo/status/período, paginação e exportação CSV.
- Upload múltiplo com validação de extensão e modo, remoção e deduplicação. Nenhum período é solicitado para converter.
- Solicitações registradas como pendentes; nenhum arquivo fiscal é gerado no frontend.
- Download do original enviado durante a sessão. Conteúdo dos arquivos não é persistido em `localStorage`.
- Detalhes dos arquivos, seleção múltipla, lixeira e restauração.
- Perfil, plano de demonstração e preferências persistidos localmente. Seleção de plano não realiza cobrança.
- Nenhum cadastro, seleção ou agrupamento por empresa.
- Logo original em `public/assets/logoTaxSped.png`; banner com proporção preservada.
- Fonte Manrope variável hospedada no próprio projeto; temas claro e escuro com cores compartilhadas em `styles/theme.css`.
- Dropdowns próprios com teclado e rolagem restrita à lista. Pedidos não solicita mês/ano; a data de envio continua registrada automaticamente.
- Ações no início das tabelas, fixas durante a rolagem horizontal. Detalhes do pedido com arquivos enviados e arquivos gerados separados.

Os metadados de um pedido aceitam `outputs: [{ id, name, size, downloadUrl }]` e, opcionalmente, `inputs` com vários originais. Resultados são exibidos somente quando anexados ao pedido. Para conteúdo local, `registerOutput(id, file)` associa um Blob/File ao resultado; para o backend, `downloadUrl` aponta para o arquivo real. Nunca são fabricados arquivos convertidos. `updateFile(protocol, { status, outputs })` atualiza os detalhes abertos quando os resultados chegarem.

## Integração futura

O acesso atual demonstra o fluxo visual e não autentica usuários em um servidor. Autenticação real, Google, recuperação de senha, duas etapas, e-mails, cobrança e conversões fiscais dependem do backend. Controles dependentes desses serviços ficam desabilitados ou explicam a indisponibilidade. Não são armazenadas senhas no navegador.

`features/conversion/hooks/useConversion.js` concentra o registro de solicitações; `features/files/services/files.js` concentra o acesso aos arquivos; `app/AppContext.jsx` mantém o estado compartilhado. Esses são os pontos de integração com o futuro backend Spring ou FastAPI.
