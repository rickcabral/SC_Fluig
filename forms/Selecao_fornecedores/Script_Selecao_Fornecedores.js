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

//função para validar CNPJ
function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj.length !== 14) {
        return false;
    }

    // Verifica se todos os dígitos são iguais; ex: 00000000000000
    if (/^(\d)\1+$/.test(cnpj)) {
        return false;
    }

    // Calcula o primeiro dígito verificador
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) {
            pos = 9;
        }
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    if (resultado != digitos.charAt(0)) {
        return false;
    }

    // Calcula o segundo dígito verificador
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) {
            pos = 9;
        }
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    if (resultado != digitos.charAt(1)) {
        return false;
    }

    return true;
}

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

        // Verificar se o CNPJ é válido
        if (!validarCNPJ(CNPJ)) {
            alert('CNPJ inválido. Por favor, corrija.');
            return;
        }

        // Verificar se todos os campos estão preenchidos
        if (CNPJ && RazaoSocial && Email) {

            // Verificar se o e-mail é válido
            if (validarEmail(Email)) {
                // E-mail válido, adicione as informações à grid
                fornecedoresAdicionados.push({ CNPJ: CNPJ, RazaoSocial: RazaoSocial, Email: Email });

                $('#gradeFornecedores tbody').append('<tr><td>' + CNPJ + '</td><td>' + RazaoSocial + '</td><td>' + Email + '</td>' + '<td><div class="row" style="display: flex; justify-content: center; align-items: center;"><button type="button" class="remove-btn btn btn-danger" style="margin-right: 10px;">Remover</button><button type="button" class="btn btn-info" style="margin-right: 10px;">Visualizar</button></div></td>' + '</tr>');

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

    // Adiciona um modal ao botão detalhes
    $('#gradeFornecedores').on('click', '.btn-info', function () {
        var myModal = FLUIGC.modal({
            title: 'Detalhes do Fornecedor',
            content: '<h1>Cotação</h1>',
            id: 'fluig-modal',
            actions: [{
                'label': 'Continuar',
                'bind': 'data-open-modal',
            }, {
                'label': 'Fechar',
                'autoClose': true
            }]
        }, function (err, data) {
            if (err) {
                
            } else {
                
            }
        });
        // Abra o modal
        myModal.show();
    });

});



