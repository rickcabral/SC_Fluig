//Function para validar formulário de solicitação de compras
function validateForm(form) {

    if (form.getValue("Select_SC") == "") {
        throw "Campo selecionar não foi preenchido.";
    }

    if (form.getValue("Select_SC") == "produto") {
        if (form.getValue("pdt_escolhas") == "") {
            throw "Campo selecionar não foi preenchido.";
        }
    }

    if (form.getValue("Select_SC") == "Servico") {
        if (form.getValue("svc_escolhas") == "") {
            throw "Campo selecionar não foi preenchido.";
        }
    }

    //Faixa completa de área observações sendo validada

    if (form.getValue("obs") == "") {
        throw "Campo observações não foi preenchido.";
    }

}