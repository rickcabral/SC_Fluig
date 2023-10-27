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

//função de puxar o CEP automaticamente
$(document).ready(function () {
    $("#CEP").blur(function () {
        $.getJSON("https://viacep.com.br/ws/" + $("#CEP").val() + "/json/", function (dados) {
            $("#Logradouro").val(dados.logradouro);
            $("#Estado").val(dados.uf);
            $("#Cidade").val(dados.localidade);
            $("#Bairro").val(dados.bairro);
        })
    })
});

//Função para adicionar fornecedores na grid 
$(document).ready(function () {

    var fornecedoresAdicionados = [];

    $('#AdicionarFornecedor').on('click', function () {

        var CNPJ = $('#CNPJ').val();
        var RazaoSocial = $('#razao_social').val();
        var Email = $('#Email').val();

        // Função para validar o formato de e-mail
        function validarEmail(email) {
            var regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return regexEmail.test(email);
        }

        // Verificar se todos os campos estão preenchidos
        if (CNPJ && RazaoSocial && Email) {

            // Verificar se o e-mail é válido
            if (validarEmail(Email)) {
                // E-mail válido, adicione as informações à grid
                fornecedoresAdicionados.push({ CNPJ: CNPJ, RazaoSocial: RazaoSocial, Email: Email });

                $('#gradeFornecedores tbody').append('<tr><td>' + CNPJ + '</td><td>' + RazaoSocial + '</td><td>' + Email + '</td>' + '<td><div class="row" style="display: flex; justify-content: center; align-items: center;"><button type="button" class="remove-btn btn btn-danger" style="margin-right: 10px;">Remover</button><button type="button" class="details-btn btn btn-info" style="margin-right: 10px;">Detalhes</button></div></td>' + '</tr>');

                $('#CNPJ').val('');
                $('#razao_social option').remove();
                $('#Email').val('');
                $('#CEP').val('');
                $('#Estado').val('');
                $('#Cidade').val('');
                $('#Bairro').val('');
                $('#Logradouro').val('');
                $('#Complemento').val('');
                $('#Contato').val('');
                $('#Telefone').val('');
            } else {
                // E-mail inválido, exiba uma mensagem de alerta
                alert('O e-mail não está em um formato válido. Por favor, corrija.');
            }
        }
        else {
            alert('Preencha todos os campos antes de adicionar mais um fornecedor');
        }
    });

    $('#gradeFornecedores').on('click', '.btn-danger', function () {
        var rowIndex = $(this).closest('tr').index();
        fornecedoresAdicionados.splice(rowIndex, 1);
        $(this).closest('tr').remove();
    });
});
