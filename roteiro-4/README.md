# ProgWeb 2 — Roteiro Prático 04

Arquitetura Frontend Modular: ES6 Modules & Padrão em Camadas
CST em Sistemas para a Internet — IFSC Câmpus Garopaba

## Vitrine Comunitária de Empreendedores

Aplicação para cadastrar, listar, filtrar, editar e excluir serviços e comércios locais de Garopaba (SC). Os dados ficam salvos no `localStorage` do navegador.

## Estrutura do projeto

```
roteiro-4/
├── index.html                    # Vitrine, filtro, modal de cadastro e toast (Bootstrap 5)
├── styles.css                    # Cores, fontes, gradiente do topo e efeito nos cards
├── README.md
└── js/
    ├── main.js                   # Orquestrador: eventos, filtro, submit, editar e excluir
    ├── services/
    │   └── vitrineService.js     # CRUD no localStorage (não mexe no DOM)
    ├── views/
    │   └── vitrineView.js        # Monta os cards e mostra os toasts
    └── utils/
        └── formatters.js         # Moeda (R$), telefone e escape de HTML
```

## Fases do roteiro

1. **Fase 1.1:** estrutura HTML base, filtro de categoria, `#vitrineContainer`, toast e `<script type="module" src="js/main.js">`.
2. **Fase 1.2:** modal `#modalCadastro` com campo oculto `#servicoId` e validação visual do Bootstrap (`required`, `.invalid-feedback`).
3. **Fase 1.3:** `styles.css` com as cores do IFSC, fontes Outfit e Plus Jakarta Sans e elevação dos cards.
4. **Fase 2:** `formatters.js` com `formatarMoeda`, `formatarTelefone` e `escapeHtml`.
5. **Fase 3:** `vitrineService.js` com `obterServicos`, `salvarServico`, `atualizarServico` e `removerServico` (chave `garopaba_vitrine_servicos`).
6. **Fase 4:** `vitrineView.js` com `criarCardHtml`, `renderizarCards` e `exibirToast`.
7. **Fase 5:** `main.js` ligando tudo: filtro, Create/Update pelo formulário e Edit/Delete por delegação de eventos.

Dependências (via CDN): Bootstrap 5 CSS/JS, Bootstrap Icons e Google Fonts.

## Como executar

Como o projeto usa ES6 Modules, ele **não funciona abrindo o arquivo direto** (`file://`): o navegador bloqueia os `import`. Use a extensão **Live Server** do VS Code (botão direito no `index.html` → *Open with Live Server*) ou acesse pelo GitHub Pages.

## Como testar

- **Create:** clique em "Divulgar Serviço", preencha e salve. O card aparece na hora e o contador soma +1.
- **Validação:** tente salvar com campos vazios. Os campos ficam vermelhos com a mensagem de erro.
- **Filtro:** troque a categoria no select. Só os serviços daquela categoria continuam na tela.
- **Update:** clique no lápis de um card, altere algum dado e salve.
- **Delete:** clique na lixeira e confirme. O card some da vitrine.
- **Persistência:** recarregue a página (F5) e confira que as alterações continuam lá.

## GitHub Pages

```
https://marinacornelius.github.io/programacao-web-2/roteiro-4/
```

Se a página publicada parecer desatualizada, pressione **Ctrl + F5**.
