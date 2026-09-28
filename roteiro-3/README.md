# ProgWeb 2 — Roteiros Práticos 01, 02 e 03

CST em Sistemas para a Internet — IFSC Câmpus Garopaba

## Estrutura do projeto

```
exercicio-retomada/
├── index.html                       # Roteiro 01: Bootstrap 5 (Exemplos 1 a 5)
├── cadastro.html                    # Roteiro 02: cadastro com jQuery
├── app.js                           # Roteiro 02: jQuery + LocalStorage (Exemplos 6 a 11)
├── roteiro-3/
│   └── exercicio-roteiro3/
│       ├── index.html               # Roteiro 03: Lanchonete Express
│       └── app.js                   # Roteiro 03: cálculo em tempo real + LocalStorage
├── README.md
└── .gitignore
```

Os dois `app.js` são independentes: o do Roteiro 03 fica dentro da própria subpasta.

## Roteiro 01 — Bootstrap 5 & Layout Responsivo

`index.html` reúne os Exemplos 1 a 5: grid responsivo, formulários, cards e alertas, tabelas zebradas e o layout completo de cadastro e listagem.

## Roteiro 02 — jQuery, DOM & LocalStorage

`cadastro.html` + `app.js` (Exemplos 6 a 11): captura de formulário, feedback visual, `.css()`, painel retrátil, tabela dinâmica e persistência com `localStorage`. Extra: filtro por nome em tempo real.

## Roteiro 03 — Lanchonete Express (Calculadora de Pedidos)

`roteiro-3/exercicio-roteiro3/index.html` + `app.js`:

- Lanche principal (`select`), adicionais (switches com badge de preço), quantidade (input group com − / +), tipo de entrega e cupom.
- Leitura segura com `parseFloat()` / `parseInt()` e fallback `|| 0`.
- Eventos: `change` (selects e switches), `input` (quantidade), `click` (botões).
- Subtotal, taxa de entrega, desconto e total em tempo real, formatados em R$ X,XX.
- Cupons de teste: `IFSC10` (10% no subtotal) e `FRETEGRATIS` (zera a taxa de entrega).
- "Finalizar Pedido" salva o rascunho no `localStorage`; ao recarregar (F5) o pedido é restaurado. "Limpar pedido" apaga o rascunho.

Dependências (via CDN): Bootstrap 5 CSS/JS, Bootstrap Icons e jQuery 3.7.1.

## Como executar

Abra a pasta no VS Code e abra o HTML desejado no navegador (ou use a extensão Live Server).

## Conectar ao GitHub (primeira vez)

1. Crie um repositório vazio no GitHub (sem README nem .gitignore), por exemplo `progweb2-roteiros`.
2. No terminal do VS Code, dentro da pasta do projeto:

```bash
git init
git add .
git commit -m "Roteiros 01, 02 e 03"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/progweb2-roteiros.git
git push -u origin main
```

Se for a primeira vez usando Git na máquina, configure antes:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"
```

Se você já publicou os Roteiros 01 e 02, basta usar:

```bash
git add .
git commit -m "Roteiro 03: calculadora de pedidos com jQuery e LocalStorage"
git push
```

## Publicar no GitHub Pages

1. No repositório, abra **Settings → Pages**.
2. Em **Build and deployment**, escolha **Deploy from a branch**, branch `main` e pasta `/ (root)`. Salve.
3. Após alguns minutos, as páginas ficam em:

```
https://SEU-USUARIO.github.io/progweb2-roteiros/
https://SEU-USUARIO.github.io/progweb2-roteiros/cadastro.html
https://SEU-USUARIO.github.io/progweb2-roteiros/roteiro-3/exercicio-roteiro3/
```
