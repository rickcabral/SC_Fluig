//Habilitar comentários em autoavaliação
$(document).ready(function () {
    $('#Comentarios_Autocuidado').prop('readonly', true);

    $('#Avaliacao_Autocuidado').on('change', function () {
        var selectedOption = $(this).val();

        if (selectedOption === 'Gaps_Autocuidado' || selectedOption === 'Desenvolvimento_Autocuidado') {
            $('#Comentarios_Autocuidado').prop('readonly', false);
        }
        else {
            $('#Comentarios_Autocuidado').prop('readonly', true);
        }
    });
});

//Habilitar comentários em comunicação
$(document).ready(function () {
    $('#Comentarios_Comunicacao').prop('readonly', true);

    $('#Avaliacao_comunicacao').on('change', function () {
        var selectedOption = $(this).val();

        if (selectedOption === 'Gaps_Comunicacao' || selectedOption === 'Desenvolvimento_Comunicacao') {
            $('#Comentarios_Comunicacao').prop('readonly', false);
        }
        else {
            $('#Comentarios_Comunicacao').prop('readonly', true);
        }
    });
});

//Habilitar comentários em AutoDesenvolvimento
$(document).ready(function () {
    $('#Coments_AutoDesenvolvimento').prop('readonly', true);

    $('#Avaliacao_AutoDesenvolvimento').on('change', function () {
        var selectedOption = $(this).val();

        if (selectedOption === 'Gaps_AutoDesenvolvimento' || selectedOption === 'Desenvolvimento_AutoDesenvolvimento') {
            $('#Coments_AutoDesenvolvimento').prop('readonly', false);
        }
        else {
            $('#Coments_AutoDesenvolvimento').prop('readonly', true);
        }
    });
});

//Habilitar comentários em Trabalho em Equipe
$(document).ready(function () {
    $('#Coments_TrabalhoEquipe').prop('readonly', true);

    $('#Avaliacao_TrabalhoEquipe').on('change', function () {
        var selectedOption = $(this).val();

        if (selectedOption === 'Gaps_TrabalhoEquipe' || selectedOption === 'Desenvolvimento_TrabalhoEquipe') {
            $('#Coments_TrabalhoEquipe').prop('readonly', false);
        }
        else {
            $('#Coments_TrabalhoEquipe').prop('readonly', true);
        }
    });
});

//Habilitar comentários em Criatividade
$(document).ready(function () {
    $('#Coments_Criatividade').prop('readonly', true);

    $('#Avaliacao_Criatividade').on('change', function () {
        var selectedOption = $(this).val();

        if (selectedOption === 'Gaps_Criatividade' || selectedOption === 'Desenvolvimento_Criatividade') {
            $('#Coments_Criatividade').prop('readonly', false);
        }
        else {
            $('#Coments_Criatividade').prop('readonly', true);
        }
    });
});

//Habilitar comentários em Postura de Lider
$(document).ready(function () {
    $('#Coments_PosturaLider').prop('readonly', true);

    $('#Avaliacao_PosturaLider').on('change', function () {
        var selectedOption = $(this).val();

        if (selectedOption === 'Gaps_PosturaLider' || selectedOption === 'Desenvolvimento_PosturaLider') {
            $('#Coments_PosturaLider').prop('readonly', false);
        }
        else {
            $('#Coments_PosturaLider').prop('readonly', true);
        }
    });
});

//Habilitar comentários em Gestão de Pessoas
$(document).ready(function () {
    $('#Coments_GestaoPessoa').prop('readonly', true);

    $('#Avaliacao_GestaoPessoa').on('change', function () {
        var selectedOption = $(this).val();

        if (selectedOption === 'Gaps_GestaoPessoa' || selectedOption === 'Desenvolvimento_GestaoPessoa') {
            $('#Coments_GestaoPessoa').prop('readonly', false);
        }
        else {
            $('#Coments_GestaoPessoa').prop('readonly', true);
        }
    });
});




