/* ProgWeb 2 — Roteiro Prático 03 (Atividade Autônoma)
   Brasa & Pão — Calculadora de Pedidos & Carrinho
   Bootstrap 5, jQuery & LocalStorage */

$(document).ready(function () {

  const CHAVE_STORAGE = 'rascunho_pedido';
  const QTD_MIN = 1;
  const QTD_MAX = 20;

  /* ---------------------------------------------------------
     CUPONS
     tipo: 'percentual' (sobre o subtotal), 'fixo' (valor em R$)
           ou 'frete' (zera a taxa de entrega)
     minimo: subtotal mínimo em R$ | qtdMinima: nº mínimo de lanches
     --------------------------------------------------------- */
  const CUPONS = {
    'IFSC10':     { tipo: 'percentual', valor: 0.10, descricao: '10% de desconto no subtotal' },
    'BRASA15':    { tipo: 'percentual', valor: 0.15, minimo: 50,  descricao: '15% de desconto no subtotal' },
    'COMBO5':     { tipo: 'fixo',       valor: 5,    minimo: 30,  descricao: 'R$ 5,00 de desconto' },
    'DOBRADINHA': { tipo: 'percentual', valor: 0.20, qtdMinima: 2, descricao: '20% de desconto levando 2 ou mais lanches' },
    'FRETEZERO':  { tipo: 'frete',                                 descricao: 'entrega grátis' },
    'MEGABRASA':  { tipo: 'percentual', valor: 0.25, minimo: 100, descricao: '25% de desconto no subtotal' }
  };

  let cupomAplicado = '';   // código do cupom em vigor ('' = nenhum)
  let ultimoTotal = '';     // para animar o total apenas quando muda

  /* ---------------------------------------------------------
     ILUSTRAÇÕES: empilha as camadas do sprite SVG (index.html)
     data-layers="pao-topo,alface:#6FCB4B,queijo,patty,pao-base"
     (da camada de cima para a de baixo; ":#cor" é opcional)
     --------------------------------------------------------- */
  const ALTURA_CAMADA = {
    'pao-topo': 62, 'pao-base': 26, 'patty': 34, 'queijo': 26, 'alface': 26,
    'tomate': 20, 'bacon': 22, 'cebola': 16, 'picles': 14, 'frango': 38, 'veggie': 34
  };
  const SOBREPOSICAO = 6;

  function desenharBurger(svg, camadasTexto) {
    const camadas = String(camadasTexto || '')
      .split(',')
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s; })
      .map(function (s) {
        const partes = s.split(':');
        return { nome: partes[0], cor: partes[1] };
      })
      .filter(function (c) { return ALTURA_CAMADA[c.nome]; });

    let y = 0;
    const posicoes = camadas.map(function (c) {
      const atual = y;
      y += ALTURA_CAMADA[c.nome] - SOBREPOSICAO;
      return atual;
    });
    const altura = y + SOBREPOSICAO;
    const total = altura + 12;   // espaço para a sombra

    let html = '<ellipse cx="100" cy="' + (total - 7) + '" rx="92" ry="6" fill="#2A1A12" opacity=".18"/>';
    for (let i = camadas.length - 1; i >= 0; i--) {      // de baixo para cima
      const c = camadas[i];
      html += '<use href="#l-' + c.nome + '" x="0" y="' + posicoes[i] + '" width="200" height="' + ALTURA_CAMADA[c.nome] + '"' +
              (c.cor ? ' style="color:' + c.cor + '"' : '') + '/>';
    }

    // setAttribute nativo: o jQuery .attr() converteria "viewBox" para minúsculas
    svg.setAttribute('viewBox', '0 0 200 ' + total);
    svg.innerHTML = html;
  }

  $('svg.burger').each(function () {
    desenharBurger(this, $(this).attr('data-layers'));
  });

  /* ---------------------------------------------------------
     FUNÇÕES AUXILIARES
     --------------------------------------------------------- */
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

  // Avisos rápidos (toast do Bootstrap)
  function mostrarToast(texto, tipo) {
    const $toast = $('#toast-app');
    $toast.removeClass('text-bg-success text-bg-warning text-bg-danger').addClass('text-bg-' + tipo);
    $('#toast-texto').text(texto);
    if (window.bootstrap) {
      bootstrap.Toast.getOrCreateInstance($toast[0], { delay: 3500 }).show();
    }
  }

  function mostrarMsgCupom(tipo, texto) {
    $('#msg-cupom')
      .removeClass('text-success text-danger text-warning')
      .addClass(tipo ? 'text-' + tipo : '')
      .text(texto);
  }

  // Confere as regras do cupom e calcula o desconto em R$
  function avaliarCupom(codigo, subtotal, qtd, taxa) {
    const cupom = CUPONS[codigo];
    if (!cupom) return { ok: false, desconto: 0, aviso: '' };

    if (subtotal <= 0) {
      return { ok: false, desconto: 0, aviso: 'Escolha um lanche para usar o cupom ' + codigo + '.' };
    }
    if (cupom.minimo && subtotal < cupom.minimo) {
      return { ok: false, desconto: 0, aviso: codigo + ' vale para pedidos a partir de ' + formatarMoeda(cupom.minimo) + '. Faltam ' + formatarMoeda(cupom.minimo - subtotal) + '.' };
    }
    if (cupom.qtdMinima && qtd < cupom.qtdMinima) {
      return { ok: false, desconto: 0, aviso: codigo + ' vale para ' + cupom.qtdMinima + ' ou mais lanches.' };
    }

    let desconto = 0;
    // Arredonda o desconto para centavos (evita diferença de 1 centavo entre a linha e o total)
    if (cupom.tipo === 'percentual') desconto = Math.round(Math.round(subtotal * 100) * cupom.valor) / 100;
    if (cupom.tipo === 'fixo')       desconto = Math.min(cupom.valor, subtotal);
    if (cupom.tipo === 'frete') {
      if (taxa === 0) {
        return { ok: true, desconto: 0, aviso: 'Cupom ' + codigo + ' aplicado, mas a retirada no balcão já é grátis.' };
      }
      desconto = taxa;
    }
    return { ok: true, desconto: desconto, aviso: '' };
  }

  /* ---------------------------------------------------------
     INTERFACE: cards, prévia, lista de itens e cupons
     --------------------------------------------------------- */
  function sincronizarCards(valorLanche) {
    let $escolhido = $();
    $('.menu-card').each(function () {
      const marcado = valorLanche !== '0' && $(this).attr('data-preco') === valorLanche;
      $(this).toggleClass('selecionado', marcado).attr('aria-pressed', marcado);
      if (marcado) $escolhido = $(this);
    });

    const $prato = $('.preview-prato');
    if ($escolhido.length) {
      desenharBurger($('#preview-burger')[0], $escolhido.attr('data-layers'));
      $('#preview-nome').text($escolhido.attr('data-nome'));
      $prato.removeClass('vazio');
    } else {
      desenharBurger($('#preview-burger')[0], 'pao-topo,pao-base');
      $('#preview-nome').text('Nenhum lanche ainda');
      $prato.addClass('vazio');
    }
    return $escolhido.attr('data-nome') || '';
  }

  function montarListaItens(nomeLanche, precoLanche, qtd) {
    const $lista = $('#lista-itens').empty();

    if (!nomeLanche) {
      $lista.append($('<li class="list-group-item text-muted">').text('Escolha um lanche para começar.'));
      return;
    }

    function linha(texto, valor, classe) {
      return $('<li class="list-group-item">').addClass(classe || '')
        .append($('<span>').text(texto))
        .append($('<span class="fw-bold">').text(formatarMoeda(valor)));
    }

    $lista.append(linha(qtd + '× ' + nomeLanche, precoLanche * qtd));
    $('.check-adicional:checked').each(function () {
      const preco = parseFloat($(this).val()) || 0;
      $lista.append(linha('+ ' + $(this).attr('data-nome'), preco * qtd, 'item-extra'));
    });
  }

  /* ---------------------------------------------------------
     FUNÇÃO PRINCIPAL: recalcula tudo e atualiza a interface
     --------------------------------------------------------- */
  function calcularTotal() {
    const valorLanche = $('#select-lanche').val() || '0';
    const precoLanche = parseFloat(valorLanche) || 0;

    let somaAdicionais = 0;
    $('.check-adicional:checked').each(function () {
      somaAdicionais += parseFloat($(this).val()) || 0;
    });

    const qtd = lerQuantidade();
    const subtotal = Math.round((precoLanche + somaAdicionais) * qtd * 100) / 100;
    const taxaEntrega = parseFloat($('#select-entrega').val()) || 0;

    const cupom = avaliarCupom(cupomAplicado, subtotal, qtd, taxaEntrega);
    const desconto = cupom.desconto;
    const totalGeral = subtotal + taxaEntrega - desconto;

    // Textos financeiros
    $('#subtotal').text(formatarMoeda(subtotal));
    $('#taxa-entrega').text(formatarMoeda(taxaEntrega));
    $('#desconto').text('- ' + formatarMoeda(desconto));
    const textoTotal = formatarMoeda(totalGeral);
    $('#total-geral').text(textoTotal);
    $('#total-mini').text(textoTotal);

    // Animação do total quando o valor muda
    if (textoTotal !== ultimoTotal) {
      const el = $('#total-geral').removeClass('pulso')[0];
      void el.offsetWidth;   // reinicia a animação
      $(el).addClass('pulso');
      ultimoTotal = textoTotal;
    }

    // Mensagem do cupom (só mexe nela se houver cupom aplicado)
    if (cupomAplicado) {
      if (cupom.ok && !cupom.aviso) {
        mostrarMsgCupom('success', 'Cupom ' + cupomAplicado + ' aplicado: ' + CUPONS[cupomAplicado].descricao + '.');
      } else if (cupom.ok) {
        mostrarMsgCupom('warning', cupom.aviso);
      } else {
        mostrarMsgCupom('warning', cupom.aviso);
      }
    }
    $('.cupom-ticket').each(function () {
      $(this).toggleClass('ativo', cupomAplicado !== '' && $(this).attr('data-codigo') === cupomAplicado && cupom.ok);
    });

    // Cards, prévia e lista de itens
    const nomeLanche = sincronizarCards(valorLanche);
    montarListaItens(nomeLanche, precoLanche, qtd);

    return totalGeral;
  }

  /* ---------------------------------------------------------
     EVENTOS EM TEMPO REAL
     change: selects e switches | input: campo numérico | click: botões
     --------------------------------------------------------- */
  $('#select-lanche, #select-entrega, .check-adicional').on('change', calcularTotal);
  $('#input-qtd').on('input change', calcularTotal);

  // Clique no card do cardápio escolhe o lanche no select
  $('.menu-card').on('click', function () {
    $('#select-lanche').val($(this).attr('data-preco')).trigger('change');
  });

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

  /* ---------------------------------------------------------
     CUPOM DE DESCONTO
     --------------------------------------------------------- */
  $('#btn-cupom').on('click', function () {
    const codigo = $('#input-cupom').val().trim().toUpperCase();

    if (codigo === '') {
      cupomAplicado = '';
      mostrarMsgCupom('danger', 'Digite um cupom.');
    } else if (CUPONS[codigo]) {
      cupomAplicado = codigo;
      $('#input-cupom').val(codigo);
    } else {
      cupomAplicado = '';
      mostrarMsgCupom('danger', 'Cupom inválido. Confira o código e tente de novo.');
    }
    calcularTotal();
  });

  $('#input-cupom').on('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      $('#btn-cupom').trigger('click');
    }
  });

  // Clique em um ticket preenche o campo e aplica o cupom
  $('.cupom-ticket').on('click', function () {
    $('#input-cupom').val($(this).attr('data-codigo'));
    $('#btn-cupom').trigger('click');
  });

  /* ---------------------------------------------------------
     LOCALSTORAGE: salvar o rascunho
     --------------------------------------------------------- */
  $('#btn-finalizar').on('click', function () {
    if ((parseFloat($('#select-lanche').val()) || 0) === 0) {
      mostrarToast('Escolha um lanche antes de finalizar o pedido.', 'warning');
      return;
    }

    const pedido = {
      lanche: $('#select-lanche').val(),
      qtd: lerQuantidade(),
      entrega: $('#select-entrega').val(),
      adicionais: $('.check-adicional:checked').map(function () { return this.id; }).get(),
      cupom: cupomAplicado
    };
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(pedido));
    mostrarToast('Pedido salvo no navegador! Total: ' + $('#total-geral').text(), 'success');
  });

  /* ---------------------------------------------------------
     LOCALSTORAGE: restaurar o rascunho (F5)
     --------------------------------------------------------- */
  function restaurarPedido() {
    let pedido = null;
    try {
      pedido = JSON.parse(localStorage.getItem(CHAVE_STORAGE));
    } catch (e) {
      pedido = null;   // JSON corrompido: ignora
    }
    if (!pedido) return;

    $('#select-lanche').val(pedido.lanche);
    if ($('#select-lanche').val() === null) $('#select-lanche').prop('selectedIndex', 0);   // lanche que não existe mais

    $('#input-qtd').val(pedido.qtd);

    $('#select-entrega').val(pedido.entrega);
    if ($('#select-entrega').val() === null) $('#select-entrega').prop('selectedIndex', 0);

    (pedido.adicionais || []).forEach(function (id) {
      $('#' + id).filter('.check-adicional').prop('checked', true);
    });

    if (pedido.cupom && CUPONS[pedido.cupom]) {
      cupomAplicado = pedido.cupom;
      $('#input-cupom').val(pedido.cupom);
    }
  }

  /* ---------------------------------------------------------
     LIMPAR PEDIDO
     --------------------------------------------------------- */
  $('#btn-limpar').on('click', function () {
    localStorage.removeItem(CHAVE_STORAGE);
    $('#select-lanche, #select-entrega').prop('selectedIndex', 0);
    $('.check-adicional').prop('checked', false);
    $('#input-qtd').val(1);
    $('#input-cupom').val('');
    mostrarMsgCupom('', '');
    cupomAplicado = '';
    calcularTotal();
    mostrarToast('Pedido limpo. Bora montar outro?', 'success');
  });

  // Inicialização: restaura o rascunho e calcula o total inicial
  restaurarPedido();
  calcularTotal();

});
