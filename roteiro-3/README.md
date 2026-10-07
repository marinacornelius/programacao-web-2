# ProgWeb 2 — Roteiros Práticos 01, 02 e 03

CST em Sistemas para a Internet — IFSC Câmpus Garopaba

## Estrutura do projeto

```
programacao-web-2/
├── roteiro-1/
│   └── index.html       # Roteiro 01: Bootstrap 5 (Exemplos 1 a 5)
├── roteiro-2/
│   ├── cadastro.html    # Roteiro 02: cadastro com jQuery
│   └── app.js           # Roteiro 02: jQuery + LocalStorage (Exemplos 6 a 11)
└── roteiro-3/
    ├── index.html       # Roteiro 03: Brasa & Pão
    ├── style.css        # Roteiro 03: cores e ajustes visuais
    ├── app.js           # Roteiro 03: cálculo em tempo real + LocalStorage
    └── README.md
```

Cada roteiro fica na sua própria pasta, então o `app.js` do Roteiro 02 e o do Roteiro 03 são independentes.

## Roteiro 01 — Bootstrap 5 & Layout Responsivo

`roteiro-1/index.html` reúne os Exemplos 1 a 5: grid responsivo, formulários, cards e alertas, tabelas zebradas e o layout completo de cadastro e listagem.

## Roteiro 02 — jQuery, DOM & LocalStorage

`roteiro-2/cadastro.html` + `roteiro-2/app.js` (Exemplos 6 a 11): captura de formulário, feedback visual, `.css()`, painel retrátil, tabela dinâmica e persistência com `localStorage`. Extra: filtro por nome em tempo real.

## Roteiro 03 — Brasa & Pão (Calculadora de Pedidos)

`roteiro-3/index.html` + `style.css` + `app.js`:

- Lanche principal (`select`, também escolhível pelos cards do cardápio), adicionais (switches com badge de preço), quantidade (input group com − / +), tipo de entrega e cupom.
- Leitura segura com `parseFloat()` / `parseInt()` e fallback `|| 0`; soma dos adicionais com `.each()` e `:checked`.
- Eventos: `change` (selects e switches), `input` (quantidade), `click` (botões, cards e cupons).
- Subtotal, taxa de entrega, desconto e total em tempo real, formatados em R$ X,XX.
- "Finalizar Pedido" salva o rascunho no `localStorage`; ao recarregar (F5) o pedido é restaurado. "Limpar pedido" apaga o rascunho.

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
| `IFSC10` | 10% de desconto no subtotal |
| `BRASA15` | 15% no subtotal, pedidos a partir de R$ 50,00 |
| `DOBRADINHA` | 20% no subtotal, levando 2 ou mais lanches |
| `FRETEZERO` | Zera a taxa de entrega |

Só um cupom por pedido. Se o pedido não cumprir a regra, o desconto fica em zero e a página avisa.

Dependências (via CDN): Bootstrap 5 CSS/JS, Bootstrap Icons, jQuery 3.7.1 e as fontes Baloo 2 e Nunito (Google Fonts).

### Fotos

As fotos são carregadas direto do Unsplash e do Pexels (bancos de fotos gratuitos), pelo endereço da imagem no `src` de cada `<img>`. Não precisa baixar nada nem criar pasta `images/`, mas a página precisa de internet para mostrar as fotos.

| Onde aparece | Fotógrafo | Origem |
|---|---|---|
| Topo da página | sehoon ye | [Unsplash](https://unsplash.com/photos/a-hamburger-and-some-french-fries-on-a-plate-nGJ6ZAIkMNY) |
| Brasa Clássico | amirali mirhashemian | [Unsplash](https://unsplash.com/photos/burger-with-lettuce-and-tomatoes-sc5sTPMrVfk) |
| Praiano Salada | Jonathan Borba | [Pexels](https://www.pexels.com/photo/cheeseburger-with-red-onion-tomato-and-lettuce-19247575/) |
| Veggie da Horta | Nadine Primeau | [Unsplash](https://unsplash.com/photos/yE9Rq_KGrLI) |
| Crocante de Frango | Qamar Rehman | [Pexels](https://www.pexels.com/photo/close-up-photo-of-delicious-chicken-burger-11354334/) |
| Bacon Defumado | Manu Ros | [Unsplash](https://unsplash.com/photos/a-cheeseburger-with-bacon-and-melted-cheese-IjvC-RA5Nvo) |
| Duplo Smash | sina piryae | [Unsplash](https://unsplash.com/photos/6XmQV6GccYU) |

Os créditos também aparecem no rodapé da página. Se quiser trocar uma foto, copie o endereço da nova imagem (no Unsplash, clique com o botão direito na foto e escolha "Copiar endereço da imagem") e cole no `src` do `<img>` correspondente no `index.html`.

Se uma foto não carregar, o card mostra uma caixa bege no lugar e o resto da página continua funcionando.

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
https://marinacornelius.github.io/programacao-web-2/roteiro-1/
https://marinacornelius.github.io/programacao-web-2/roteiro-2/cadastro.html
https://marinacornelius.github.io/programacao-web-2/roteiro-3/
```

Se a página publicada parecer desatualizada, pressione **Ctrl + F5** para ignorar o cache do navegador.
