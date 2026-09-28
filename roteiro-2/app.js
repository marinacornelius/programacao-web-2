/* ProgWeb 2 — Roteiro Prático 02 (Parte 2)
   jQuery, Manipulação do DOM & LocalStorage
   Exemplos 6 a 11 + desafio do filtro dinâmico */

$(document).ready(function () {

  const CHAVE_STORAGE = 'lista_clientes';

  // Exemplo 11: recupera os dados salvos (ou começa com lista vazia)
  let clientes = JSON.parse(localStorage.getItem(CHAVE_STORAGE)) || [];

  // Evita que texto digitado seja interpretado como HTML ao usar .append()
  function escaparHtml(texto) {
    return $('<div>').text(texto).html();
  }

  // Exemplo 10: monta a linha <tr> e insere no corpo da tabela com .append()
  function adicionarLinha(cliente) {
    const linha = `
      <tr data-id="${cliente.id}">
        <td>${escaparHtml(cliente.nome)}</td>
        <td>${escaparHtml(cliente.email)}</td>
        <td>
          <button type="button" class="btn btn-sm btn-outline-danger btn-remover">
            <i class="bi bi-trash"></i> Remover
          </button>
        </td>
      </tr>`;
    $('#tabela-corpo').append(linha);
  }

  // Exemplo 11: grava o array inteiro como texto JSON
  function salvarStorage() {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(clientes));
  }

  // Exemplo 11: ao abrir/recarregar a página (F5), reconstrói a tabela
  clientes.forEach(adicionarLinha);

  // Exemplos 6 a 9: exibe a mensagem de feedback
  function mostrarMensagem(html, tipo) {
    const $caixa = $('#caixa-mensagem');

    $caixa
      .html(html)                                            // Ex. 6: escreve com .html()
      .removeClass('d-none alert-info alert-success alert-danger') // Ex. 7: remove .d-none
      .addClass(tipo === 'erro' ? 'alert-danger' : 'alert-success') // Ex. 7: .addClass()
      .hide()
      .slideDown(400)                                        // Ex. 9: mensagem surge deslizando
      .fadeOut(150).fadeIn(150).fadeOut(150).fadeIn(150);    // Ex. 7: pisca 2x

    // Exemplo 8: troca dinâmica de cores via .css()
    $caixa.css({
      'border': '2px solid ' + (tipo === 'erro' ? '#dc3545' : '#198754'),
      'font-weight': 'bold'
    });
  }

  // Exemplo 6: captura a submissão, impede o recarregamento e lê os campos
  $('#form-cadastro').on('submit', function (e) {
    e.preventDefault();

    const nome = $('#input-nome').val().trim();     // .val() lê o campo
    const email = $('#input-email').val().trim();

    if (nome === '' || email === '') {
      mostrarMensagem('Preencha o <strong>nome</strong> e o <strong>e-mail</strong>.', 'erro');
      return;
    }

    const cliente = { id: Date.now(), nome: nome, email: email };
    clientes.push(cliente);

    adicionarLinha(cliente);   // Ex. 10: tabela atualiza sem recarregar
    salvarStorage();           // Ex. 11: persiste no LocalStorage

    mostrarMensagem('Cliente <strong>' + escaparHtml(nome) + '</strong> (' +
                    escaparHtml(email) + ') salvo com sucesso!', 'sucesso');

    // Exemplo 8: muda a cor de fundo do formulário por um instante
    $('#form-cadastro').css('background-color', '#d1e7dd');
    setTimeout(function () {
      $('#form-cadastro').css('background-color', '');
    }, 1200);

    $('#form-cadastro')[0].reset();   // limpa os campos
    $('#input-nome').trigger('focus');
    $('#filtro-nome').trigger('input'); // reaplica o filtro, se houver texto
  });

  // Exemplo 10: remoção da linha pai com animação
  // (delegação de eventos, pois as linhas são criadas dinamicamente)
  $('#tabela-corpo').on('click', '.btn-remover', function () {
    const $linha = $(this).closest('tr');
    const id = Number($linha.data('id'));

    clientes = clientes.filter(function (c) { return c.id !== id; });
    salvarStorage();

    $linha.fadeOut(300, function () {
      $(this).remove();
    });
  });

  // Exemplo 9: painel de ajuda retrátil
  $('#btn-toggle-ajuda').on('click', function () {
    $('#painel-ajuda').slideToggle(300);
  });

  // Desafio extra: filtro por nome em tempo real (evento input)
  $('#filtro-nome').on('input', function () {
    const termo = $(this).val().toLowerCase().trim();

    $('#tabela-corpo tr').each(function () {
      const nome = $(this).find('td:first').text().toLowerCase();
      $(this).toggle(nome.indexOf(termo) !== -1);
    });
  });

});
