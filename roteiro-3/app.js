/* ProgWeb 2 — Roteiro Prático 03 (Atividade Autônoma)
   Lanchonete Express — Calculadora de Pedidos & Carrinho
   Bootstrap 5, jQuery & LocalStorage */

$(document).ready(function () {

  const CHAVE_STORAGE = 'rascunho_pedido';
  const QTD_MIN = 1;
  const QTD_MAX = 20;

  // Cupons válidos: percentual sobre o subtotal e/ou frete grátis
  const CUPONS = {
    'IFSC10':      { descricao: '10% de desconto no subtotal', percentual: 0.10, freteGratis: false },
    'FRETEGRATIS': { descricao: 'Frete grátis',                percentual: 0,    freteGratis: true  }
  };

  let cupomAplicado = '';   // código do cupom em vigor ('' = nenhum)

  // Formatação monetária no padrão brasileiro: R$ X,XX
  function formatarMoeda(valor) {
    return 'R$ ' + valor.toFixed(2).replace('.', ',');
  }

  // Lê a quantidade com fallback e limites (1 a 20)
  function lerQuantidade() {
    let qtd = parseInt($('#input-qtd').val()) || 1;
    if (qtd < QTD_MIN) qtd = QTD_MIN;
    if (qtd > QTD_MAX) qtd = QTD_MAX;
    return qtd;
  }

  // Função principal: recalcula tudo e atualiza a interface
  function calcularTotal() {
    const precoLanche = parseFloat($('#select-lanche').val()) || 0;

    let somaAdicionais = 0;
    $('.check-adicional:checked').each(function () {
      somaAdicionais += parseFloat($(this).val()) || 0;
    });

    const qtd = lerQuantidade();
    const subtotal = (precoLanche + somaAdicionais) * qtd;

    let taxaEntrega = parseFloat($('#select-entrega').val()) || 0;
    let desconto = 0;

    const cupom = CUPONS[cupomAplicado];
    if (cupom) {
      desconto = subtotal * cupom.percentual;
      if (cupom.freteGratis) taxaEntrega = 0;
    }

    const totalGeral = subtotal + taxaEntrega - desconto;

    $('#subtotal').text(formatarMoeda(subtotal));
    $('#taxa-entrega').text(formatarMoeda(taxaEntrega));
    $('#desconto').text('- ' + formatarMoeda(desconto));
    $('#total-geral').text(formatarMoeda(totalGeral));
  }

  // ---------- Escutadores em tempo real ----------
  // change: selects e switches
  $('#select-lanche, #select-entrega, .check-adicional').on('change', calcularTotal);
  // input + change: campo numérico (digitação e setinhas)
  $('#input-qtd').on('input change', calcularTotal);

  // click: botões de incremento e decremento
  $('#btn-menos').on('click', function () {
    $('#input-qtd').val(Math.max(QTD_MIN, lerQuantidade() - 1));
    calcularTotal();
  });
  $('#btn-mais').on('click', function () {
    $('#input-qtd').val(Math.min(QTD_MAX, lerQuantidade() + 1));
    calcularTotal();
  });

  // Ao sair do campo, corrige valores vazios ou fora do limite
  $('#input-qtd').on('blur', function () {
    $(this).val(lerQuantidade());
    calcularTotal();
  });

  // ---------- Cupom de desconto ----------
  $('#btn-cupom').on('click', function () {
    const codigo = $('#input-cupom').val().trim().toUpperCase();
    const $msg = $('#msg-cupom');

    if (codigo === '') {
      cupomAplicado = '';
      $msg.removeClass('text-success').addClass('text-danger').text('Digite um cupom.');
    } else if (CUPONS[codigo]) {
      cupomAplicado = codigo;
      $msg.removeClass('text-danger').addClass('text-success')
          .text('Cupom ' + codigo + ' aplicado: ' + CUPONS[codigo].descricao + '.');
    } else {
      cupomAplicado = '';
      $msg.removeClass('text-success').addClass('text-danger').text('Cupom inválido.');
    }
    calcularTotal();
  });

  // ---------- LocalStorage: salvar rascunho ----------
  $('#btn-finalizar').on('click', function () {
    const pedido = {
      lanche: $('#select-lanche').val(),
      qtd: lerQuantidade(),
      entrega: $('#select-entrega').val(),
      adicionais: $('.check-adicional:checked').map(function () { return this.id; }).get(),
      cupom: cupomAplicado
    };
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(pedido));
    alert('Pedido salvo no navegador!');
  });

  // ---------- LocalStorage: restaurar rascunho (F5) ----------
  function restaurarPedido() {
    let pedido = null;
    try {
      pedido = JSON.parse(localStorage.getItem(CHAVE_STORAGE));
    } catch (e) {
      pedido = null;   // JSON corrompido: ignora
    }
    if (!pedido) return;

    $('#select-lanche').val(pedido.lanche);
    $('#input-qtd').val(pedido.qtd);
    $('#select-entrega').val(pedido.entrega);

    (pedido.adicionais || []).forEach(function (id) {
      $('#' + id).prop('checked', true);
    });

    if (pedido.cupom && CUPONS[pedido.cupom]) {
      cupomAplicado = pedido.cupom;
      $('#input-cupom').val(pedido.cupom);
      $('#msg-cupom').addClass('text-success')
        .text('Cupom ' + pedido.cupom + ' aplicado: ' + CUPONS[pedido.cupom].descricao + '.');
    }
  }

  // ---------- Limpar pedido ----------
  $('#btn-limpar').on('click', function () {
    localStorage.removeItem(CHAVE_STORAGE);
    $('#select-lanche, #select-entrega').prop('selectedIndex', 0);
    $('.check-adicional').prop('checked', false);
    $('#input-qtd').val(1);
    $('#input-cupom').val('');
    $('#msg-cupom').removeClass('text-success text-danger').text('');
    cupomAplicado = '';
    calcularTotal();
  });

  // Inicialização: restaura o rascunho e calcula o total inicial
  restaurarPedido();
  calcularTotal();

});
