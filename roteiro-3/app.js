/* ProgWeb 2 — Roteiro Prático 03 (Atividade Autônoma)
   Brasa & Pão — Calculadora de Pedidos & Carrinho
   Bootstrap 5, jQuery & LocalStorage */

$(document).ready(function () {

  // Cupons que existem na lanchonete
  const CUPONS = ['IFSC10', 'BRASA15', 'DOBRADINHA', 'FRETEZERO'];
  let cupomAplicado = '';   // guarda o cupom em uso ('' = nenhum)

  // Formata um número no padrão brasileiro: R$ X,XX
  function formatarMoeda(valor) {
    return 'R$ ' + valor.toFixed(2).replace('.', ',');
  }

  // Lê a quantidade com segurança (mínimo 1)
  function lerQuantidade() {
    let qtd = parseInt($('#input-qtd').val()) || 1;
    if (qtd < 1) qtd = 1;
    return qtd;
  }

  // Função principal: lê os campos, calcula e atualiza a tela
  function calcularTotal() {

    // 1. Lê os valores dos campos (texto -> número)
    const precoLanche = parseFloat($('#select-lanche').val()) || 0;

    let somaAdicionais = 0;
    $('.check-adicional:checked').each(function () {
      somaAdicionais += parseFloat($(this).val()) || 0;
    });

    const qtd = lerQuantidade();
    const taxaEntrega = parseFloat($('#select-entrega').val()) || 0;

    // 2. Calcula
    const subtotal = (precoLanche + somaAdicionais) * qtd;

    let desconto = 0;
    if (cupomAplicado === 'IFSC10') {
      desconto = subtotal * 0.10;
    } else if (cupomAplicado === 'BRASA15' && subtotal >= 50) {
      desconto = subtotal * 0.15;
    } else if (cupomAplicado === 'DOBRADINHA' && qtd >= 2) {
      desconto = subtotal * 0.20;
    } else if (cupomAplicado === 'FRETEZERO') {
      desconto = taxaEntrega;
    }
    desconto = Math.round(desconto * 100) / 100;   // arredonda para centavos

    const totalGeral = subtotal + taxaEntrega - desconto;

    // 3. Mostra na tela
    $('#subtotal').text(formatarMoeda(subtotal));
    $('#taxa-entrega').text(formatarMoeda(taxaEntrega));
    $('#desconto').text('- ' + formatarMoeda(desconto));
    $('#total-geral').text(formatarMoeda(totalGeral));
    $('#total-mini').text(formatarMoeda(totalGeral));

    // Nome do lanche no resumo
    if (precoLanche === 0) {
      $('#nome-lanche').text('Nenhum lanche escolhido');
    } else {
      $('#nome-lanche').text(qtd + '× ' + $('#select-lanche option:selected').text());
    }

    // Destaca o card do lanche escolhido
    $('.menu-card').removeClass('selecionado');
    $('.menu-card[data-preco="' + $('#select-lanche').val() + '"]').addClass('selecionado');

    // Mensagem do cupom
    if (cupomAplicado !== '') {
      if (desconto > 0) {
        $('#msg-cupom').text('Cupom ' + cupomAplicado + ' aplicado!')
          .removeClass('text-danger').addClass('text-success');
      } else {
        $('#msg-cupom').text('O cupom ' + cupomAplicado + ' não vale para este pedido. Veja a regra na lista.')
          .removeClass('text-success').addClass('text-danger');
      }
    }
  }

  // ---------- Eventos em tempo real ----------
  // change: selects e switches
  $('#select-lanche, #select-entrega, .check-adicional').on('change', calcularTotal);

  // input: digitação no campo de quantidade
  $('#input-qtd').on('input change', calcularTotal);
  $('#input-qtd').on('blur', function () {
    $(this).val(lerQuantidade());   // corrige campo vazio ou negativo
  });

  // click: botões + e -
  $('#btn-mais').on('click', function () {
    $('#input-qtd').val(lerQuantidade() + 1);
    calcularTotal();
  });
  $('#btn-menos').on('click', function () {
    $('#input-qtd').val(Math.max(1, lerQuantidade() - 1));
    calcularTotal();
  });

  // click: card do cardápio escolhe o lanche no select
  $('.menu-card').on('click', function () {
    $('#select-lanche').val($(this).attr('data-preco'));
    calcularTotal();
  });

  // ---------- Cupom ----------
  $('#btn-cupom').on('click', function () {
    const codigo = $('#input-cupom').val().trim().toUpperCase();

    if (CUPONS.includes(codigo)) {
      cupomAplicado = codigo;
    } else {
      cupomAplicado = '';
      $('#msg-cupom').text('Cupom inválido.').removeClass('text-success').addClass('text-danger');
    }
    calcularTotal();
  });

  // Clicar em um cupom da lista preenche o campo e aplica
  $('.btn-cupom-chip').on('click', function () {
    $('#input-cupom').val($(this).attr('data-codigo'));
    $('#btn-cupom').trigger('click');
  });

  // ---------- LocalStorage: salvar ----------
  $('#btn-finalizar').on('click', function () {
    if ((parseFloat($('#select-lanche').val()) || 0) === 0) {
      alert('Escolha um lanche antes de finalizar!');
      return;
    }

    // guarda o id de cada adicional marcado
    let adicionais = [];
    $('.check-adicional:checked').each(function () {
      adicionais.push(this.id);
    });

    const pedido = {
      lanche: $('#select-lanche').val(),
      qtd: lerQuantidade(),
      entrega: $('#select-entrega').val(),
      adicionais: adicionais,
      cupom: cupomAplicado
    };
    localStorage.setItem('rascunho_pedido', JSON.stringify(pedido));
    alert('Pedido salvo no navegador!');
  });

  // ---------- LocalStorage: restaurar (F5) ----------
  const salvo = localStorage.getItem('rascunho_pedido');
  if (salvo) {
    let pedido = {};
    try { pedido = JSON.parse(salvo); } catch (e) { pedido = {}; }

    $('#select-lanche').val(pedido.lanche || '0');
    // se o rascunho é de uma versão antiga (lanche que não existe mais), volta ao início
    if ($('#select-lanche').val() === null) {
      $('#select-lanche').val('0');
    }

    $('#input-qtd').val(pedido.qtd);
    $('#select-entrega').val(pedido.entrega);

    (pedido.adicionais || []).forEach(function (id) {
      $('#' + id).prop('checked', true);
    });

    if (CUPONS.includes(pedido.cupom)) {
      cupomAplicado = pedido.cupom;
      $('#input-cupom').val(pedido.cupom);
    }
  }

  // ---------- Limpar pedido ----------
  $('#btn-limpar').on('click', function () {
    localStorage.removeItem('rascunho_pedido');
    location.reload();   // recarrega a página já sem rascunho
  });

  // Calcula ao abrir a página
  calcularTotal();

});
