//Habilitar os campos de documentos de empresa a partir da seleção
$(document).ready(function () {
    $('#Documentos_Empresa').prop('readonly', true);

    $('#Docs_Empresa').on('change', function () {
        var selectedOption = $(this).val();

        if (selectedOption !== '') {
            $('#Documentos_Empresa').prop('readonly', false);
        } else {
            $('#Documentos_Empresa').prop('readonly', true);
        }
    });
});

//Habilitar os campos de documentos de negociação a partir da seleção
$(document).ready(function () {
    $('#Documentos_Negociacao').prop('readonly', true);

    $('#Docs_Negociacao').on('change', function () {
        var selectedOption = $(this).val();

        if (selectedOption !== '') {
            $('#Documentos_Negociacao').prop('readonly', false);
        } else {
            $('#Documentos_Negociacao').prop('readonly', true);
        }
    });
});

//Habilitar alteração de dados a partir do botão clicado
$(document).ready(function () {
    $('#Alterar_dados').click(function () {
        var buttonText = $('#Alterar_dados').text();
        var fieldsToToggle = [
            'Nome_Aprovador', 'CPF_Aprovador', 'Email_Aprovador',
            'Nome_Aprovador_E', 'CPF_Aprovador_E', 'Email_Aprovador_E',
            'Nome_Testemunha_E', 'CPF_Testemunha_E', 'Email_Testemunha_E'
        ];
        if (buttonText === 'Alterar dados de Contratante') {
            fieldsToToggle.forEach(function (field) {
                $('#' + field).prop('readonly', false);
            });
            $('#Alterar_dados').text('Salvar dados');
        }
        if (buttonText === 'Salvar dados') {
            fieldsToToggle.forEach(function (field) {
                $('#' + field).prop('readonly', true);
            });
            $('#Alterar_dados').text('Alterar dados de Contratante');
        }
    });
});

//Inclusão de representante (Contratante) na tabela
$(document).ready(function () {

    var RepresentanteContratante = [];

    $('#Adicionar_Representante_E').on('click', function () {

        var NomeRC = $('#Nome_Representante_E').val();
        var CpfRC = $('#CPF_Representante_E').val();
        var EmailRC = $('#Email_Representante_E').val();

        if (NomeRC && CpfRC && EmailRC) {

            RepresentanteContratante.push({ NomeRepresentanteContratante: NomeRC, CpfRepresentanteContratante: CpfRC, EmailRepresentanteContratante: EmailRC });

            $('#div_tabela_ADC_Representante_E').show();

            $('#gradeRepresentanteContratante tbody').append('<tr><td>' + NomeRC + '</td><td>' + CpfRC + '</td><td>' + EmailRC + '</td>' + '<td><button class="btn-remover btn-primary">Remover</button></td></tr>');

            $('#Nome_Representante_E').val('');
            $('#CPF_Representante_E').val('');
            $('#Email_Representante_E').val('');

        }
        else {

            alert('Preencha todos os campos antes de adicionar mais um Representante (Contratante)');

        }

    });

    $('#gradeRepresentanteContratante').on('click', '.btn-remover', function () {
        var rowIndex = $(this).closest('tr').index();
        RepresentanteContratante.splice(rowIndex, 1);
        $(this).closest('tr').remove();
    });

});

//Inclusão de representante (Contratado) na tabela
$(document).ready(function () {

    var RepresentanteContratado = [];

    $('#Adicionar_Representante_C').on('click', function () {

        var NomeRContratado = $('#Nome_Representante_C').val();
        var CpfRContratado = $('#CPF_Representante_C').val();
        var EmailRContratado = $('#Email_Representante_C').val();

        if (NomeRContratado && CpfRContratado && EmailRContratado) {

            RepresentanteContratado.push({ NomeRepresentanteContratado: NomeRContratado, CpfRepresentanteContratado: CpfRContratado, EmailRepresentanteContratado: EmailRContratado });

            $('#div_tabela_ADC_Representante_C').show();

            $('#gradeRepresentanteContratado tbody').append('<tr><td>' + NomeRContratado + '</td><td>' + CpfRContratado + '</td><td>' + EmailRContratado + '</td>' + '<td><button class="btn-remover btn-primary">Remover</button></td></tr>');

            $('#Nome_Representante_C').val('');
            $('#CPF_Representante_C').val('');
            $('#Email_Representante_C').val('');

        }
        else {

            alert('Preencha todos os campos antes de adicionar mais um Representante (Contratante)');

        }

    });

    $('#gradeRepresentanteContratado').on('click', '.btn-remover', function () {
        var rowIndex = $(this).closest('tr').index();
        RepresentanteContratado.splice(rowIndex, 1);
        $(this).closest('tr').remove();
    });

});

//Inclusão de testemunha (Contratado) na tabela
$(document).ready(function () {

    var TestemunhaContratado = [];

    $('#Adicionar_Testemunha_C').on('click', function () {

        var NomeTC = $('#Nome_Testemunha_C').val();
        var CpfTC = $('#CPF_Testemunha_C').val();
        var EmailTC = $('#Email_Testemunha_C').val();

        if (NomeTC && CpfTC && EmailTC) {

            TestemunhaContratado.push({ NomeTestemunhaContratado: NomeTC, CpfTestemunhaContratado: CpfTC, EmailTestemunhaContratado: EmailTC });

            $('#div_tabela_ADC_Testemunha_C').show();

            $('#gradeTestemunhaContratado tbody').append('<tr><td>' + NomeTC + '</td><td>' + CpfTC + '</td><td>' + EmailTC + '</td>' + '<td><button class="btn-remover btn-primary">Remover</button></td></tr>');

            $('#Nome_Testemunha_C').val('');
            $('#CPF_Testemunha_C').val('');
            $('#Email_Testemunha_C').val('');

        }
        else {

            alert('Preencha todos os campos antes de adicionar mais um Representante (Contratante)');

        }

    });

    $('#gradeTestemunhaContratado').on('click', '.btn-remover', function () {
        var rowIndex = $(this).closest('tr').index();
        TestemunhaContratado.splice(rowIndex, 1);
        $(this).closest('tr').remove();
    });

});

//Inclusão de Aprovador (Gestor de Contratos) na tabela
$(document).ready(function () {

    var AprovadorContratos = [];

    $('#Adicionar_Aprovador_C').on('click', function () {

        var NomeAprovadorC = $('#Nome_Aprovador_C').val();
        var CpfAprovadorC = $('#CPF_Aprovador_C').val();
        var EmailAprovadorC = $('#Email_Aprovador_C').val();

        if (NomeAprovadorC && CpfAprovadorC && EmailAprovadorC) {

            AprovadorContratos.push({ NomeAprovadorContratos: NomeAprovadorC, CpfAprovadorContratos: CpfAprovadorC, EmailAprovadorContratos: EmailAprovadorC });

            $('#div_tabela_ADC_Aprovador_C').show();

            $('#gradeAprovadorC tbody').append('<tr><td>' + NomeAprovadorC + '</td><td>' + CpfAprovadorC + '</td><td>' + EmailAprovadorC + '</td>' + '<td><button class="btn-remover btn-primary">Remover</button></td></tr>');

            $('#Nome_Aprovador_C').val('');
            $('#CPF_Aprovador_C').val('');
            $('#Email_Aprovador_C').val('');

        }
        else {

            alert('Preencha todos os campos antes de adicionar mais um Representante (Contratante)');

        }

    });

    $('#gradeAprovadorC').on('click', '.btn-remover', function () {
        var rowIndex = $(this).closest('tr').index();
        AprovadorContratos.splice(rowIndex, 1);
        $(this).closest('tr').remove();
    });

});
