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
│       ├── index.html               # Roteiro 03: Brasa & Pão (estrutura + ilustrações SVG)
│       ├── style.css                # Roteiro 03: paleta, cards, cupons, animações
│       └── app.js                   # Roteiro 03: cálculo em tempo real + LocalStorage
├── README.md
└── .gitignore
```

Os dois `app.js` são independentes: o do Roteiro 03 fica dentro da própria subpasta, junto com o `style.css`.

## Roteiro 01 — Bootstrap 5 & Layout Responsivo

`index.html` reúne os Exemplos 1 a 5: grid responsivo, formulários, cards e alertas, tabelas zebradas e o layout completo de cadastro e listagem.

## Roteiro 02 — jQuery, DOM & LocalStorage

`cadastro.html` + `app.js` (Exemplos 6 a 11): captura de formulário, feedback visual, `.css()`, painel retrátil, tabela dinâmica e persistência com `localStorage`. Extra: filtro por nome em tempo real.

## Roteiro 03 — Brasa & Pão (Calculadora de Pedidos)

`roteiro-3/exercicio-roteiro3/index.html` + `style.css` + `app.js`:

- Lanche principal (`select`, também escolhível pelos cards do cardápio), adicionais (switches com badge de preço), quantidade (input group com − / +), tipo de entrega e cupom.
- Leitura segura com `parseFloat()` / `parseInt()` e fallback `|| 0`.
- Eventos: `change` (selects e switches), `input` (quantidade), `click` (botões e cards).
- Subtotal, taxa de entrega, desconto e total em tempo real, formatados em R$ X,XX, com resumo do pedido e prévia do lanche.
- "Finalizar Pedido" salva o rascunho no `localStorage`; ao recarregar (F5) o pedido é restaurado. "Limpar pedido" apaga o rascunho.
- Visual: paleta ketchup, mostarda e brioche; ilustrações dos lanches em SVG montadas por camadas (`data-layers`); layout responsivo com Bootstrap 5.

### Cardápio

| Lanche | Preço |
|---|---|
| Brasa Clássico | R$ 19,90 |
| Praiano Salada | R$ 23,90 |
| Veggie da Horta | R$ 25,90 |
| Crocante de Frango | R$ 26,90 |
| Bacon Defumado | R$ 29,90 |
| Duplo Smash | R$ 32,90 |

### Cupons

| Código | Regra |
|---|---|
| `IFSC10` | 10% no subtotal, sem mínimo |
| `BRASA15` | 15% no subtotal, pedidos a partir de R$ 50,00 |
| `COMBO5` | R$ 5,00 de desconto, pedidos a partir de R$ 30,00 |
| `DOBRADINHA` | 20% no subtotal, levando 2 ou mais lanches |
| `FRETEZERO` | Zera a taxa de entrega |
| `MEGABRASA` | 25% no subtotal, pedidos a partir de R$ 100,00 |

Só um cupom por pedido. Se o pedido deixar de cumprir a regra (por exemplo, ao diminuir a quantidade), o desconto é retirado e a página avisa o motivo.

Dependências (via CDN): Bootstrap 5 CSS/JS, Bootstrap Icons, jQuery 3.7.1 e as fontes Baloo 2 e Nunito (Google Fonts).

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
