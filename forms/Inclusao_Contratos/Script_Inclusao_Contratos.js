//Inclusão de contratante na tabela
$(document).ready(function () {

    var ContratantesAdicionados = [];

    $('#Adicionar_Contratante').on('click', function () {

        var RazaoSocial = $('#razao').val();
        var CNPJ = $('#CNPJ').val();
        var Comprador = $('#comprador').val();
        var Email = $('#email').val();
        var endereco = $('#endEntrega').val();

        if (RazaoSocial && CNPJ && Comprador && Email && endereco) {

            ContratantesAdicionados.push({ razao: RazaoSocial, cnpj: CNPJ, comprador: Comprador, email: Email, Endereco: endereco });

            $('#div_tabela_ADC_Contratante').show();

            $('#gradeContratantes tbody').append('<tr><td>' + RazaoSocial + '</td><td>' + CNPJ + '</td><td>' + Comprador + '</td><td>' + Email + '</td><td>' + endereco + '</td>' + '<td><button class="btn-remover btn-primary">Remover</button></td></tr>');

            $('#razao').val('');
            $('#CNPJ').val('');
            $('#comprador').val('');
            $('#email').val('');
            $('#endEntrega').val('');

        }
        else {

            alert('Preencha todos os campos antes de adicionar mais um Contratante');

        }

    });

    $('#gradeContratantes').on('click', '.btn-remover', function () {
        var rowIndex = $(this).closest('tr').index();
        ContratantesAdicionados.splice(rowIndex, 1);
        $(this).closest('tr').remove();
    });

});

//Inclusão de Contratado na tabela
$(document).ready(function () {

    var ContratadosAdicionados = [];

    $('#Adicionar_Contratado').on('click', function () {

        var RazaoFornec = $('#razaoForn').val();
        var CNPJFornec = $('#CNPJForn').val();
        var Estado = $('#estado').val();
        var Cidade = $('#cidade').val();
        var Contato = $('#contato').val();
        var EmailFornec = $('#emailForn').val();
        var Numero = $('#numero').val();

        if (RazaoFornec && CNPJFornec && Estado && Cidade && Contato && EmailFornec && Numero) {

            ContratadosAdicionados.push({ RazaoFornec: RazaoFornec, CNPJFornec: CNPJFornec, estado: Estado, cidade: Cidade, contato: Contato, emailFornec: EmailFornec, numero: Numero });

            $('#div_tabela_ADC_Contratado').show();

            $('#gradeContratado tbody').append('<tr><td>' + RazaoFornec + '</td><td>' + CNPJFornec + '</td><td>' + Estado + '</td><td>' + Cidade + '</td><td>' + Contato + '</td><td>' + EmailFornec + '</td><td>' + Numero + '</td>' + '<td><button class="btn-remover btn-primary">Remover</button></td></tr>');

            $('#razaoForn').val('');
            $('#CNPJForn').val('');
            $('#estado').val('');
            $('#cidade').val('');
            $('#contato').val('');
            $('#emailForn').val('');
            $('#numero').val('');

        }
        else {

            alert('Preencha todos os campos antes de adicionar mais um Contratado');

        }

    });

    $('#gradeContratado').on('click', '.btn-remover', function () {
        var rowIndex = $(this).closest('tr').index();
        ContratadosAdicionados.splice(rowIndex, 1);
        $(this).closest('tr').remove();
    });

});

function mostrarPainelDadosFaltantes() {
    var painel = document.getElementById('painelDadosFaltantes');
    painel.style.display = 'block';
}

function enviarDadosFaltantes() {
    // Aqui você pode adicionar a lógica para enviar os dados faltantes, se necessário
    alert('Dados enviados com sucesso!');
}
