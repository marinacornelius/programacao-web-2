# ProgWeb 2 — Roteiros Práticos 01 e 02

CST em Sistemas para a Internet — IFSC Câmpus Garopaba

## Estrutura do projeto

```
programacao-web-2/
├── roteiro-1/
│   └── index.html       # Roteiro 01: Bootstrap 5 (Exemplos 1 a 5)
└── roteiro-2/
    ├── cadastro.html    # Roteiro 02: página de cadastro com jQuery
    ├── app.js           # Roteiro 02: lógica jQuery + LocalStorage (Exemplos 6 a 11)
    └── README.md
```

## Roteiro 01 — Bootstrap 5 & Layout Responsivo

`roteiro-1/index.html` reúne os Exemplos 1 a 5:

1. Grid responsivo e containers
2. Formulários e inputs estilizados
3. Cards, botões e alertas
4. Tabelas zebradas, hover e badges
5. Layout estático completo (cadastro `col-md-4` + tabela `col-md-8`)

## Roteiro 02 — jQuery, DOM & LocalStorage

`cadastro.html` + `app.js` reúnem os Exemplos 6 a 11:

6. Captura do formulário e leitura de campos (`.on('submit')`, `.val()`, `.html()`)
7. Feedback visual (`.removeClass()`, `.addClass()`, `.fadeOut()`, `.fadeIn()`)
8. Estilos dinâmicos com `.css()`
9. Painel de ajuda retrátil (`.slideToggle()`, `.slideDown()`)
10. Tabela dinâmica (`.append()`, `.closest('tr')`, `.remove()`)
11. Persistência com `localStorage` + `JSON.stringify` / `JSON.parse`

Desafio extra: campo de busca que filtra a tabela por nome em tempo real.

Como testar: cadastre um cliente, recarregue a página (F5) e confira que ele continua na tabela.

Dependências (via CDN): Bootstrap 5 CSS/JS, Bootstrap Icons e jQuery 3.7.1.

## Como executar

Abra a pasta no VS Code e abra o `roteiro-2/cadastro.html` no navegador (ou use a extensão Live Server). O layout estático do Roteiro 01 está em `roteiro-1/index.html`.

## Conectar ao GitHub (primeira vez)

1. Crie um repositório vazio no GitHub (sem README nem .gitignore), por exemplo `progweb2-roteiros`.
2. No terminal do VS Code, dentro da pasta do projeto:

```bash
git init
git add .
git commit -m "Roteiro 01: layout estático com Bootstrap 5"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/progweb2-roteiros.git
git push -u origin main
```

Se for a primeira vez usando Git na máquina, configure antes:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"
```

## Commit do Roteiro 02

Depois de adicionar `cadastro.html` e `app.js`:

```bash
git add .
git commit -m "Roteiro 02: cadastro dinâmico com jQuery e LocalStorage"
git push
```
