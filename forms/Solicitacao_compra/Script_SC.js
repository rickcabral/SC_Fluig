//Função para minimizar e maximizar painel
function minimizarPainel(botao) {
    const painel = botao.closest('.panel');
    const conteudo = painel.querySelector('.panel-body');

    if (conteudo.style.display === 'none') {
        // Maximizar o painel
        conteudo.style.display = 'block';
        botao.textContent = '-';
    } else {
        // Minimizar o painel
        conteudo.style.display = 'none';
        botao.textContent = '+';
    }
}

//Função para habilitar o select produto ou serviço
$(document).ready(function () {
    $('#div_escolhas > div').hide();

    $('#Select_SC').on('change', function () {
        $('#div_escolhas > div').hide();
        $('#' + $(this).val() + 'Div').show();
    });
});

//Função para habilitar paineis ou de produto ou de serviço
$(document).ready(function () {

    $('#div_pdt_svc').children('div').hide();

    $('#Select_SC').on('change', function () {

        var selectValor = '#' + $(this).val();


        $('#div_pdt_svc').children('div').hide();
        $('#div_pdt_svc').children(selectValor).show();

    });

});

//Função para trazer o calendário na necessidade
$(document).ready(function () {
    var calendario_dt_Necessidade = FLUIGC.calendar('#dt_Necessidade');
});

//Função para deixar os campos readonly até o select sem ativado (PRODUTO)
$(document).ready(function () {
    $('#qtd, #dt_Necessidade, #dsc_pdt').prop('readonly', true);

    $('#pdt_escolhas').on('change', function () {
        var selectedOption = $(this).val();

        if (selectedOption !== '') {

            $('#qtd, #dt_Necessidade, #dsc_pdt').prop('readonly', false);

        } else {

            $('#qtd, #dt_Necessidade, #dsc_pdt').prop('readonly', true);
        }
    });
});

//Função para deixar os campos readonly até o select sem ativado (SERVIÇO)
$(document).ready(function () {
    $('#details').prop('readonly', true);

    $('#svc_escolhas,#aditivo_escolhas').on('change', function () {
        var svcSelected = $('#svc_escolhas').val();
        var aditivoSelected = $('#aditivo_escolhas').val();

        if (svcSelected !== '' && aditivoSelected !== '') {
            $('#details').prop('readonly', false);
        } else {
            $('#details').prop('readonly', true);
        }
    });
});

//Função adicionar produtos na grid
$(document).ready(function () {

    var produtosAdicionados = [];

    $('#AdicionarProduto').on('click', function () {

        var nomeproduto = $('#pdt option').val();
        var quantidade = $('#qtd').val();
        var necessidade = $('#dt_Necessidade').val();
        var centro_custos = $('#ct_custo option').val();
        var descricao = $('#dsc_pdt').val();

        if (nomeproduto && quantidade && necessidade && centro_custos && descricao) {

            produtosAdicionados.push({ nome: nomeproduto, quantidade: quantidade, necessidade: necessidade, centro_de_custos: centro_custos, descricao: descricao });

            $('#div_tabela_pdt').show();

            $('#gradeProdutos tbody').append('<tr><td>' + nomeproduto + '</td><td>' + quantidade + '</td><td>' + necessidade + '</td><td>' + centro_custos + '</td><td>' + descricao + '</td>' + '<td><button class="btn-remover btn-primary">Remover</button></td></tr>');

            $('#pdt option').remove();
            $('#qtd').val('');
            $('#dt_Necessidade').val('');
            $('#ct_custo option').remove();
            $('#dsc_pdt').val('');

        }
        else {

            alert('Preencha todos os campos antes de adicionar mais um produto');

        }
    });

    $('#gradeProdutos').on('click', '.btn-remover', function () {
        var rowIndex = $(this).closest('tr').index();
        produtosAdicionados.splice(rowIndex, 1);
        $(this).closest('tr').remove();
    });

});

//Função adicionar serviços na grid
$(document).ready(function () {

    var servicosAdicionados = [];

    $('#AdicionarServico').on('click', function () {

        var detalhessvc = $('#details').val();

        if (detalhessvc) {

            servicosAdicionados.push({ detalhes: detalhessvc });

            $('#div_tabela_svc').show();

            $('#gradeServico tbody').append('<tr><td><div class="td-content">' + detalhessvc + '</div></td>' + '<td><button class="btn-remover btn-primary">Remover</button></td></tr>');


            $('#details').val('');

        }
        else {

            alert('Preencha o campo antes de adicionar mais um serviço');

        }
    });

    $('#gradeServico').on('click', '.btn-remover', function () {
        var rowIndex = $(this).closest('tr').index();
        servicosAdicionados.splice(rowIndex, 1);
        $(this).closest('tr').remove();
    });

});
