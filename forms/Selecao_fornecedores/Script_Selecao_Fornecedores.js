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

    $('#gradeFornecedores').on('click', '.btn-info', function () {
        var rowIndex = $(this).closest('tr').index();
        var detalhesRow = $('#gradeFornecedores tbody tr.detalhes-row-' + rowIndex);
        if (detalhesRow.length > 0) {
            detalhesRow.remove();
            $(this).text('Visualizar');
        } else {
            $('#gradeFornecedores tbody tr[class^="detalhes-row-"]').remove();
            var detalhesContent = '<div class="form-group"><div class="col-md-12"><div class = "form-group col-md-12" style="display: flex; justify-content: center; align-items: center;"><h1>Área de Cotação</h1></div></div><div class="panel col-md-6"><div class = "form-group col-md-12" style="display: flex; justify-content: center; align-items: center;"><h2>Dados da Empresa</h2></div><div class="form-group col-md-6"><label for="razao">Razão Social</label><input type="text" name="razao" id="razao" class="form-control"></div><div class="form-group col-md-6"><label for="CNPJ">CNPJ</label><input type="number" name="CNPJ" id="CNPJ" class="form-control"></div><div class="form-group col-md-6"><label for="comprador">Comprador</label><input type="text" name="comprador" id="comprador" class="form-control"></div><div class="form-group col-md-6"><label for="email">E-mail</label><input type="email" name="email" id="email" class="form-control"></div><div class="form-group col-md-12"><label for="endEntrega">Endereço para entrega</label><input type="text" name="endEntrega" id="endEntrega" class="form-control"></div></div><div class="panel col-md-6"><div class = "form-group col-md-12" style="display: flex; justify-content: center; align-items: center;"><h2>Dados do Fornecedor</h2></div><div class="form-group col-md-6"><label for="razaoForn">Razão Social</label><input type="text" name="razaoForn" id="razaoForn" class="form-control"></div><div class="form-group col-md-6"><label for="CNPJForn">CNPJ</label><input type="number" name="CNPJForn" id="CNPJForn" class="form-control"></div><div class="form-group col-md-4"><label for="estado">Estado</label><input type="text" name="estado" id="estado" class="form-control"></div><div class="form-group col-md-4"><label for="cidade">Cidade</label><input type="text" name="cidade" id="cidade" class="form-control"></div><div class="form-group col-md-4"><label for="contato">Contato</label><input type="text" name="contato" id="contato" class="form-control"></div>' +
                '<div class="form-group col-md-6"><label for="emailForn">E-mail</label><input type="email" name="emailForn" id="emailForn" class="form-control"></div><div class="form-group col-md-6"><label for="numero">Telefone</label><input type="number" name="numero" id="numero" class="form-control"></div></div><div class="panel col-md-12"><div class = "form-group col-md-12" style="display: flex; justify-content: center; align-items: center;"><h2>Itens da Cotação</h2></div><div class="form-group col-md-6"><label for="item">Item</label><input type="text" name="Item" id="Item" class="form-control" readonly></div><div class="form-group col-md-6"><label for="qnt_solicitada">Quantidade Solicitada</label><input type="text" name="qnt_solicitada" id="qnt_solicitada" class="form-control" readonly></div><div id="teste"><div class="form-group col-md-6"><label for="item">Itens</label><input type="text" name="item" id="item" class="form-control"></div><div class="form-group col-md-2"><label for="qtd">Quantidade</label><input type="number" name="qtd" id="qtd" class="form-control"></div><div class="form-group col-md-2"><label for="valorUnit">Valor Unitário</label><input type="number" name="valorUnit" id="valorUnit" class="form-control"></div>' +
                '<div class="form-group col-md-2"><label for="frete">Frete</label><input type="number" name="frete" id="frete" class="form-control"></div><div class="form-group col-md-2"><label for="desconto">Desconto</label><input type="number" name="desconto" id="desconto" class="form-control"></div><div class="form-group col-md-1"><label for="icms">ICMS</label><input type="number" name="icms" id="icms" class="form-control"></div><div class="form-group col-md-1"><label for="ipi">IPI</label><input type="number" name="ipi" id="ipi" class="form-control"></div><div class="form-group col-md-1"><label for="pis">PIS</label><input type="number" name="pis" id="pis" class="form-control"></div><div class="form-group col-md-1"><label for="cofins">COFINS</label><input type="number" name="cofins" id="cofins" class="form-control"></div><div class="form-group col-md-2"><label for="valorTotal">Valor Total</label><input type="number" name="valorTotal" id="valorTotal" class="form-control"></div><div class="form-group col-md-2"><label for="prazoEntrega">Prazo de Entrega (dias)</label><input type="number" name="prazoEntrega" id="prazoEntrega" class="form-control"></div>' +
                '<div class="form-group col-md-2"><label for="prevEntrega">Prev Entrega</label><input type="number" name="prevEntrega" id="prevEntrega" class="form-control"></div></div></div><div class="panel form-group col-md-6"><div class = "form-group col-md-12" style="display: flex; justify-content: center; align-items: center;"><h2>Resumo da Cotação</h2></div><div class="form-group col-md-6"><label for="totalItens">Total dos Itens</label><input type="number" name="totalItens" id="totalItens" class="form-control"></div><div class="form-group col-md-6"><label for="totalDesc">Descontos</label><input type="number" name="totalDesc" id="totalDesc" class="form-control"></div><div class="form-group col-md-6"><label for="totalImposto">Impostos</label><input type="number" name="totalImposto" id="totalImposto" class="form-control"></div><div class="form-group col-md-6"><label for="totalFrete">Frete</label><input type="number" name="totalFrete" id="totalFrete" class="form-control"></div><div class="form-group col-md-6"><label for="totalCotacao">Total da Cotação</label><input type="number" name="totalCotacao" id="totalCotacao" class="form-control"></div><div class = "form-group col-md-6"><label for="formPag">Forma de Pagamento</label><select name="forma_pgm" id="forma_pgm" class="form-control"><option value="">-------</option><option value="boleto">Boleto</option><option value="deposito_conta">Depósito em Conta</option><option value="pix">Pix</option></select></div></div><div class = "panel form-group col-md-6" id="teste2"><div class = "form-group col-md-12" id="testeMinimizar" style="display: flex; justify-content: center; align-items: center;"><h2>Anexos do Fornecedor</h2></div>';
            $(this).closest('tr').after('<tr class="detalhes-row-' + rowIndex + '"><td colspan="4">' + detalhesContent + '</td></tr>');
            $(this).text('Ocultar');
            $(this).closest('tr').siblings().find('.btn-info').text('Visualizar');
        $('#gradeFornecedores tbody tr[class^="detalhes-row-"]').not('.detalhes-row-' + rowIndex).remove();
        }
    });

});



