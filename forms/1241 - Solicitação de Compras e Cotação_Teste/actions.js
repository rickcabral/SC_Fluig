$(document).ready(function (e) {

	var dataLogTemp = new Date();

	var diaLog = dataLogTemp.getDate();
	if (parseInt(diaLog) < 10) {
		diaLog = "0" + diaLog;
	}
	var mesLog = dataLogTemp.getMonth();

	anoLog = dataLogTemp.getFullYear();

	var mes2Log = parseInt(mesLog) + 1;
	if (parseInt(mes2Log) < 10) {
		mes2Log = "0" + mes2Log;
	}
	
	itensEscolhido = new Array();
	cnpjsEscolhidos = new Array();
	cnpjOBJ = new Array();
	unicosCNPJ = new Array();

	dataCompletaLog = diaLog + '/' + mes2Log + '/' + anoLog;
	
	$("#produtoTemp").select2();
	$("#empresa").select2();

	$("#valUnitarioCT").maskMoney();
	$("#freteItemCT").maskMoney();
	$("#descontoItemCT").maskMoney();
	$("#icmsItemCT").maskMoney();
	$("#ipiItemCT").maskMoney();
	$("#pisItemCT").maskMoney();
	$("#cofinsItemCT").maskMoney();
	
	$("#issItemCT").maskMoney();
	$("#inssItemCT").maskMoney();
	$("#irItemCT").maskMoney();
	$("#csllItemCT").maskMoney();
	$("#outroImpostoVlrCT").maskMoney();
	
	
	
	//$("#qtdDisponibilizadaCT").inputmask('Regex', {regex: "^[0-9]{1,6}(\\.\\d{1,2})?$"});
	
	
	
	//=================================================================
	//						VARIÁVEIS HOMOLOGAÇÃO
	//=================================================================
	URL_FLUIG = "https://abainfraestrutura136692.fluig.cloudtotvs.com.br:2350";
	URL_TOTVS = "http://abainfraestrutura144398.protheus.cloudtotvs.com.br:1116/api-rest";
	ID_PASTA_PAI = '1459';
	ID_PASTA_UPLOAD = '';
	
	//getProduto();
	FLUIGC.switcher.init('#checkPossuiItemCT');

    $( "#tipoSC" ).change(function() {
        var selectValor = $( "#tipoSC" ).val();
		//console.log("selectValor: "+selectValor);
		
		var strProduto = '<i class="flaticon flaticon-product icon-md" aria-hidden="true"></i>&nbsp;&nbsp;Produtos';
		var strServico = '<i class="flaticon flaticon-system-tools icon-md" aria-hidden="true"></i>&nbsp;&nbsp;Serviço';
		
		$("#title_pn-produto").html("");
		
		if(selectValor == "PRODUTO"){
			$("#pn-produto").show();
			$("#divBtnGeraSolCompras").show();
			$("#pn-servico").hide();
			$("#divTipoMaterial").show();
			
			$(".servicoDiv").hide();
			$("#possuiContrato").val("");
			$("#aditivo").val("");
			
			$("#title_pn-produto").append(strProduto);
			
		}else if(selectValor == "SERVICO"){
			$(".servicoDiv").show();
			//$("#divBtnGeraSolCompras").hide();
			$("#pn-produto").show();
			$("#divTipoMaterial").hide();
			$("#pn-servico").hide();
			$("#tipoMaterial").val("");
			
			$("#title_pn-produto").append(strServico);
			
		}else{
			$(".servicoDiv").hide();
			$("#pn-produto").show();
			$("#pn-servico").hide();
			$("#divTipoMaterial").hide();
			//$("#divBtnGeraSolCompras").hide();
			
			//$("#title_pn-produto").append(strProduto);
		}
    });
	
	
	$("#empresa").change(function () { 
	
		$("#empresaTXT").val($('#empresa option:selected').text());
		console.log("VALOR EMPRESA: "+$('#empresa').val());
		console.log("TEXTO EMPRESA: "+ $('#empresa option:selected').text());
		
		if($('#empresa').val() != "null" && $('#empresa').val() != null){
			var empresa = new Array();
			empresa.push({
				"selecionado":$('#empresa').val(),
				"text": $('#empresa option:selected').text()
			});
			var obj = JSON.stringify(empresa);
			console.log("objEmpresa stringify: "+obj);
			$("#empresaOBJ").val(obj);
			
			getFiliais($('#empresa').val());

		}else{
			$("#empresaOBJ").val("");
		}
		
	});
	
	$("#filial").change(function () {    
		$("#filialTXT").val($('#filial option:selected').text());
		
		var filial = new Array();
		filial.push({
			'selecionado':$('#filial').val(),
			'text': $('#filial option:selected').text()
		});
		var obj = JSON.stringify(filial);
		$("#filialOBJ").val(obj);
		
	});
	
	$('#qtd, #dt_Necessidade, #dsc_pdt').prop('readonly', true);

	//Função para deixar os campos readonly até o select sem ativado (PRODUTO)
    $('#pdt_escolhas').on('change', function () {
        var selectedOption = $(this).val();

        if (selectedOption !== '') {
            $('#qtd, #dt_Necessidade, #dsc_pdt').prop('readonly', false);
        } else {
            $('#qtd, #dt_Necessidade, #dsc_pdt').prop('readonly', true);
        }
    });
	
	var calendario_dt_Necessidade = FLUIGC.calendar('#dataNecessidade');
	var calendar_dataPrevItemCT = FLUIGC.calendar('#dataPrevItemCT');

	controller();


}); // FIM DOCUMENT READY

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


function mostrarDiv(tipo) {
		var divProduto = document.getElementById("divProduto");
		var divServico = document.getElementById("divServico");

		if (tipo === "produto") {
			divProduto.style.display = "block";
			divServico.style.display = "none";
		} else if (tipo === "servico") {
			divProduto.style.display = "none";
			divServico.style.display = "block";
		}
	}

function convertDtTxt(idCampo) {
	const data = $("#"+idCampo).val();
	$("#"+idCampo+"TXT").val($("#"+idCampo).val());
	if(data != "") {
		$("#dataNecessidadeFormatada").val(data.split("/").reverse().join(""));
	}
}

function alteraTXT(campo) {
	console.log("alteraTXT campo id: "+"#" + campo + "TXT"+" - "+campo);
	
	$("#" + campo + "TXT").val($("#" + campo).val());
	
	console.log("após alteraTXT campo: "+$("#" + campo + "TXT").val());

}

//##################################################################################
//	FUNÇÃO QUE CAPTURA OS Nº FINAL DO ID DA TABELA E RETORNA EM UM ARRAY
//##################################################################################		
function varreTabela(idTabela) {

	var id = new Array();
	var campo = "";
	var pos = 0;

	$("#" + idTabela + " tbody tr .exclude").each(function () { //captura os id de inputs somente da tabela selecionada		
		campo = $(this).attr("id"); //pega o id inteiro do campo
		pos = campo.lastIndexOf("___");
		if (pos > 0) {
			var res = campo.split("___");
			id.push(res[1]);
		}

	});
	//alert("array id: "+id);
	return id;
}

function setCampoTXT(id) {

	var str = id.split("___");
	$("#" + id + "TXT").val($("#" + id).val());

}

function addElemento(tabela) {
	//console.log("entrou addElemento");
	var qtd = 0;
	var linha = wdkAddChild(tabela);
	var inputs = new Array();
	var campo = "";
	var ultimoCampo = "";
	var str = "";
	var inicioCampo = "";

	$("#" + tabela + " tbody tr .exclude").each(function () { //captura os id de inputs somente da tabela selecionada	
		campo = $(this).attr("id"); //pega o id inteiro do campo
		inicioCampo = campo.split('___');
		str = inicioCampo[0] + '___';
		if (str.toUpperCase() == ("exclude" + tabela + "___").toUpperCase()) { // verifica se o resultado Ã© igual Ã  condiÃ§Ã£o.
			inputs.push(campo); // caso seja armazena o id inteiro no array inputs
		}
	});

	ultimoCampo = inputs.pop();
	qtd = campo.substr(str.length);
	if (ultimoCampo != "") {
		$("#divexclude" + tabela + "___" + qtd).append("<i class='fluigicon fluigicon-trash icon-md' onclick='Javascript:fnWdkRemoveChild(this)' id='btnExclude" + tabela + "___" + qtd + "'></i>");
	}


}

function addTbGradeProdutos(){
	//console.log("entrou addTbGradeProdutos");
	var contErro = validaTbGradeProdutos();
	
	if(contErro > 0){
		$("#msgErrotbGradeProdutos").show();
		
		setTimeout(function() {
			$("#msgErrotbGradeProdutos").hide();
		}, 5000);

	}else{
		var linha = wdkAddChild("tbGradeProdutos");
	
		$("#codProdutoSC___"+linha).val($("#produtoTemp").val());
		$("#descrProdutoSC___"+linha).val($("#produtoTemp  option:selected").text());
		$("#quantidadeSC___"+linha).val($("#quantidadeTemp").val());
		$("#codCentroCustoSC___"+linha).val($("#centroCustoTemp").val());
		$("#codCategoriaItemSC___"+linha).val($("#categoriaSC").val());
		$("#descCategoriaItemSC___"+linha).val($("#categoriaSC  option:selected").text());
		$("#descrCentroCustoSC___"+linha).val($("#centroCustoTemp  option:selected").text());
		$("#observacaoSC___"+linha).val($("#obsPedidoTemp").val());
		$("#infoComplProdutoSC___"+linha).val($("#infoComplProdutoTemp").val());
		
		limpaTbProdutoSCTemp();
		btnTbProdutosTempSC();
		$("#msgErrotbGradeProdutos").hide();
		
		verificaPrimeiroProd();
	}
}

function addTbServicos(){
	//console.log("entrou addTbServicos");
	var contErro = validaTbServicos();
	
	if(contErro > 0){
		$("#msgErrotbServicos").show();
		
		setTimeout(function() {
			$("#msgErrotbServicos").hide();
		}, 5000);

	}else{
		var linha = wdkAddChild("tbServicos");
		$("#descricaoServico___"+linha).val($("#descricaoServicoTemp").val());
		$("#descricaoServicoTemp").val("");
		
		btnTbServicos();
		$("#msgErrotbServicos").hide();
	}
}

function limpaSelect2(idCampo){
	$("#"+idCampo).val(null).trigger('change');
	
}

function limpaDate(idCampo){
	$("#"+idCampo).val("");
}

function verificaPrimeiroProd(){
	
	var tbGradeProdutos = varreTabela("tbGradeProdutos");
	
	$("#primeiroProdutoCod").val("");
	$("#primeiroProdutoTXT").val("");
	
	if(tbGradeProdutos.length > 0){
		var codProduto = $("#codProdutoSC___"+tbGradeProdutos[0]).val();
		var descricao = $("#descrProdutoSC___"+tbGradeProdutos[0]).val();

		$("#primeiroProdutoCod").val(codProduto);
		$("#primeiroProdutoTXT").val(descricao);
		
	}
	
	
	
	
}

function limpaTbProdutoSCTemp(){
	//console.log("entrou limpaTbProdutoSCTemp");
	$("#produtoTemp").val("");
	$("#quantidadeTemp").val("");
	$("#centroCustoTemp").val("");
	$("#categoriaSC").val("");
	$("#categoriaSCTXT").val("");
	$("#infoComplProdutoTemp").val("");
	$("#obsPedidoTemp").val("");
	
	$("#produtoTemp option").remove();
	$("#centroCustoTemp option").remove();
}

function btnTbProdutosTempSC(acao){
	//console.log("entrou btnTbProdutosTempSC");
	var tbGradeProdutos = varreTabela("tbGradeProdutos");
	var numAtividade = $("#numAtividade").val();

	for (var i = 0; i < tbGradeProdutos.length; i++) {
		var elemento = $("#acoesSC___" + tbGradeProdutos[i]).prev();
		var dados = "<div class='btn-group'>" +
						"<i class='flaticon flaticon-edit-square icon-md' onclick='editaProdutoSC(this.id)' id='btnEdita___" + tbGradeProdutos[i]+"' style='color:#4273d1'></i>&nbsp;&nbsp;&nbsp;&nbsp;"+
						"<i class='fluigicon fluigicon-trash icon-md' onclick='Javascript:fnWdkRemoveChild(this),verificaPrimeiroProd()' style='color:#cf007a' id='btnExclude" + tbGradeProdutos[i] + " '></i>"+
					"</div>";
		
		var somenteLeitura = "<div class='btn-group'>" +
						"<button type='button' class='btn btn-info' onclick='visualizaProdutoSC(this.id)' id='btnDetalhesSC___" + tbGradeProdutos[i]+"' >Detalhes</button>"+
					"</div>";
		
		$(elemento).html("");
		//console.log("acao: "+acao);
		if(numAtividade == "" || numAtividade == "0" || numAtividade == "4" && acao != "SOMENTE_LEITURA") {
			//console.log("entrou primeiro if");
			$(elemento).html("");
			$(elemento).append(dados);
		}if( (numAtividade == "" || numAtividade == "0" || numAtividade == "4") && acao == "SOMENTE_LEITURA") {
			//console.log("entrou segundo if");
			blockDadosSol();
			$(elemento).html("");
			$(elemento).append(somenteLeitura);
		}else if(numAtividade != "" && numAtividade != "0" && numAtividade != "4" ){
			//console.log("entrou terceiro if");
			$(elemento).html("");
			$(elemento).append(somenteLeitura);
		}
		
	}
}

function btnTbServicos(){
	//console.log("entrou btnTbServicos");
	var tbServicos = varreTabela("tbServicos");

	for (var i = 0; i < tbServicos.length; i++) {
		var elemento = $("#acoesServico___" + tbServicos[i]).prev();
		var dados = "<div class='btn-group'>" +
						"<i class='flaticon flaticon-edit-square icon-md' onclick='editaServico(this.id)' id='btnEdita___" + tbServicos[i]+"' style='color:#4273d1'></i>&nbsp;&nbsp;&nbsp;&nbsp;"+
						"<i class='fluigicon fluigicon-trash icon-md' onclick='Javascript:fnWdkRemoveChild(this)' style='color:#cf007a' id='btnExclude" + tbServicos[i] + " '></i>"+
					"</div>";
		
		$(elemento).html("");
		$(elemento).append(dados);
	}
}


function recarregaProdutoTemp(){
	
	$("#produtoTemp").select2();
	
	getProduto();
	
	$("#limpar_produtoTemp").show();
	$("#trocar_produtoTemp").hide();
	
}

function recarregaCentroCustoTemp(){
	
	$("#centroCustoTemp").select2();
	
	getCentroCusto();
	
	$("#limpar_centroCustoTemp").show();
	$("#trocar_centroCustoTemp").hide();
	
}

function editaProdutoSC(idCampo){
	//console.log("entrou editaProdutoSC");
	var temp = idCampo.split("___");
	var numLinha = temp[1];
	
	$("#produtoTemp").select2("destroy");
	$("#centroCustoTemp").select2("destroy");
	
	$("#produtoTemp option").remove();
	$("#produtoTemp").append($('<option>', {
		value: $("#codProdutoSC___"+numLinha).val(),
		text: $("#descrProdutoSC___"+numLinha).val()
	}));
		
	$("#centroCustoTemp option").remove();
	$("#centroCustoTemp").append($('<option>', {
		value: $("#codCentroCustoSC___"+numLinha).val(),
		text: $("#descrCentroCustoSC___"+numLinha).val()
	}));
	
	$("#quantidadeTemp").val( $("#quantidadeSC___"+numLinha).val() );
	$("#categoriaSC").val( $("#codCategoriaItemSC___"+numLinha).val() );
	$("#obsPedidoTemp").val( $("#observacaoSC___"+numLinha).val() );
	$("#infoComplProdutoTemp").val( $("#infoComplProdutoSC___"+numLinha).val() );
	$("#numLinhaProdutoSC").val( numLinha );
	
	$("#adicionaProdutoSC").hide();
	$("#salvaProdutoSC").show();
	
	$("#limpar_produtoTemp").hide();
	$("#trocar_produtoTemp").show();
	
	$("#limpar_centroCustoTemp").hide();
	$("#trocar_centroCustoTemp").show();
	
}

function visualizaProdutoSC(idCampo){
	//console.log("entrou visualizaProdutoSC");
	var temp = idCampo.split("___");
	var numLinha = temp[1];
	var numAtividade = $("#numAtividade").val();
	
	$(".divTempProdutos").show();
	if( (numAtividade == "" || numAtividade == "0" || numAtividade == "4") &&  $("#numSC").val() == ""){
		$("#produtoTemp").select2("destroy");
		$("#centroCustoTemp").select2("destroy");	
	}
	
	
	$("#produtoTemp option").remove();
	$("#produtoTemp").append($('<option>', {
		value: $("#codProdutoSC___"+numLinha).val(),
		text: $("#descrProdutoSC___"+numLinha).val()
	}));
		
	$("#centroCustoTemp option").remove();
	$("#centroCustoTemp").append($('<option>', {
		value: $("#codCentroCustoSC___"+numLinha).val(),
		text: $("#descrCentroCustoSC___"+numLinha).val()
	}));
	
	$("#quantidadeTemp").val( $("#quantidadeSC___"+numLinha).val() );
	$("#categoriaSC").val( $("#codCategoriaItemSC___"+numLinha).val() );
	$("#obsPedidoTemp").val( $("#observacaoSC___"+numLinha).val() );
	$("#infoComplProdutoTemp").val( $("#infoComplProdutoSC___"+numLinha).val() );
	$("#numLinhaProdutoSC").val( numLinha );
	
	$("#adicionaProdutoSC").hide();
	$("#salvaProdutoSC").hide();
	
	$("#limpar_produtoTemp").hide();
	$("#trocar_produtoTemp").hide();
	
	$("#limpar_centroCustoTemp").hide();
	$("#trocar_centroCustoTemp").hide();
	
	$("#produtoTemp").attr("disabled", "disabled");
	$("#centroCustoTemp").attr("disabled", "disabled");
	$("#quantidadeTemp").attr("readonly", "readonly");
	$("#categoriaSC").attr("disabled", "disabled");
	$("#obsPedidoTemp").attr("readonly", "readonly");
	$("#infoComplProdutoTemp").attr("readonly", "readonly");
	$("#ocultaProdutoSC").show();
	
}

function saveTbGradeProdutos(){
	
	var contErro = validaTbGradeProdutos();
	var linha = $("#numLinhaProdutoSC").val();
	
	if(contErro == 0){
		$("#adicionaProdutoSC").show();
		$("#salvaProdutoSC").hide();
		
		$("#limpar_produtoTemp").show();
		$("#trocar_produtoTemp").hide();
		
		$("#limpar_centroCustoTemp").show();
		$("#trocar_centroCustoTemp").hide();
		
		$("#codProdutoSC___"+linha).val($("#produtoTemp").val());
		$("#descrProdutoSC___"+linha).val($("#produtoTemp  option:selected").text());
		$("#quantidadeSC___"+linha).val($("#quantidadeTemp").val());
		$("#codCentroCustoSC___"+linha).val($("#centroCustoTemp").val());
		$("#codCategoriaItemSC___"+linha).val($("#categoriaSC").val());
		$("#descCategoriaItemSC___"+linha).val($("#categoriaSC  option:selected").text());
		$("#descrCentroCustoSC___"+linha).val($("#centroCustoTemp  option:selected").text());
		$("#observacaoSC___"+linha).val($("#obsPedidoTemp").val());
		$("#infoComplProdutoSC___"+linha).val($("#infoComplProdutoTemp").val());
		
		limpaTbProdutoSCTemp();
		btnTbProdutosTempSC();	
		
		$("#produtoTemp").select2();	
		$("#centroCustoTemp").select2();	
		
		getProduto();
		getCentroCusto();
		
		$("#lb_produtoTemp").css('color', '');
		$("#lb_centroCustoTemp").css('color', '');
		
		$("#numLinhaProdutoSC").val("");
		
		verificaPrimeiroProd();
		
	}
	
}
	
function ocultaTbGradeProdutos(){
	//console.log("entrou ocultaTbGradeProdutos");
	limpaTbProdutoSCTemp();
	$(".divTempProdutos").hide();
	$("#ocultaProdutoSC").hide();
}
	
function editaServico(idCampo){
	
	var temp = idCampo.split("___");
	var numLinha = temp[1];
		
	$("#descricaoServicoTemp").val( $("#descricaoServico___"+numLinha).val() );
	$("#numLinhaServico").val( numLinha );
	
	$("#adicionaServico").hide();
	$("#salvaServico").show();
	
}	
	
function saveTbServicos(){
	
	var linha = $("#numLinhaServico").val();
	
	if($("#descricaoServicoTemp").val() != ""){
		$("#adicionaServico").show();
		$("#salvaServico").hide();
		
		$("#descricaoServico___"+linha).val($("#descricaoServicoTemp").val());
		$("#numLinhaServico").val("");
		$("#descricaoServicoTemp").val("");
	}
	
}

function retornaUser(){
		//console.log("entrou retornaUser");
		var codUser = $("#codUsuario").val();
		//console.log("codUser: "+codUser);
		
		var constraintColleague1 = DatasetFactory.createConstraint('colleaguePK.colleagueId', codUser, codUser, ConstraintType.MUST);
		var colunasColleague = new Array('colleagueName');
		var dataset = DatasetFactory.getDataset('colleague', colunasColleague, new Array(constraintColleague1), null);

		var row = dataset.values[0];
		
		//console.log("colleagueName: "+row["colleagueName"]);
		
		$("#solicitante").val(row["colleagueName"]);
		$("#codSolicitante").val(codUser);
		
	}


function addtbCotacao(){
	//console.log("entrou addtbCotacao");
	
	var dataLogTemp = new Date();

	var diaLog = dataLogTemp.getDate();
	if (parseInt(diaLog) < 10) {
		diaLog = "0" + diaLog;
	}
	var mesLog = dataLogTemp.getMonth();

	anoLog = dataLogTemp.getFullYear();

	var mes2Log = parseInt(mesLog) + 1;
	if (parseInt(mes2Log) < 10) {
		mes2Log = "0" + mes2Log;
	}
	
	var dataInvertida = anoLog.toString()+mes2Log.toString()+diaLog.toString();
	var dataCompletaLog = diaLog + '/' + mes2Log + '/' + anoLog;
	
	var contErro = validatbCotacao();
	
	if(contErro > 0){
		$("#msgErrotbCotacao").show();
		
		setTimeout(function() {
			$("#msgErrotbCotacao").hide();
		}, 5000);

	}else{
		var linha = wdkAddChild("tbCotacao");
	
		$("#numLinhaCotacao___"+linha).val(linha);
		$("#numFluigCotacao___"+linha).val($("#numSolicitacao").val());
		$("#cnpj___"+linha).val($("#razaoSocialTEMP").val());
		$("#cotacaoFinal___"+linha).val("NAO");
		$("#loja___"+linha).val($("#lojaTEMP").val());
		$("#cep___"+linha).val($("#cepTEMP").val());
		$("#estado___"+linha).val($("#estadoTEMP").val());
		$("#bairro___"+linha).val($("#bairroTEMP").val());
		$("#endereco___"+linha).val($("#enderecoTEMP").val());
		$("#complemento___"+linha).val($("#complementoTEMP").val());
		$("#contato___"+linha).val($("#contatoTEMP").val());
		$("#telefoneFornec___"+linha).val($("#telefoneFornecTEMP").val());
		$("#razaoSocial___"+linha).val($("#razaoSocialTEMP  option:selected").text());
		$("#emailFornec___"+linha).val($("#emailFornecTEMP").val());
		$("#dataCotacaoFormat___"+linha).val(dataInvertida);
		$("#dataCotacao___"+linha).val(dataCompletaLog);
		$("#anoCotacao___"+linha).val(anoLog);
		$("#mesCotacao___"+linha).val(mes2Log);
		$("#statusCotacao___"+linha).val("PENDENTE");
		
		limpatbCotacao();
		btntbCotacao();
		
		$("#msgErrotbCotacao").hide();
		
		criaItensCotacao(linha,"NAO");
	}
	
	//console.log("fim addtbCotacao");
	
}


function addCotacaoFinal(numLinha){
	
	var dataLogTemp = new Date();

	var diaLog = dataLogTemp.getDate();
	if (parseInt(diaLog) < 10) {
		diaLog = "0" + diaLog;
	}
	var mesLog = dataLogTemp.getMonth();

	anoLog = dataLogTemp.getFullYear();

	var mes2Log = parseInt(mesLog) + 1;
	if (parseInt(mes2Log) < 10) {
		mes2Log = "0" + mes2Log;
	}
	
	var dataInvertida = anoLog.toString()+mes2Log.toString()+diaLog.toString();
	var dataCompletaLog = diaLog + '/' + mes2Log + '/' + anoLog;
	
	limpaTbCotacaoVencedora();
	
	var linha = wdkAddChild("tbCotacaoFinal");
	
	$("#numLinhaCotacaoCTF___"+linha).val(linha);
	$("#numFluigCotacaoCTF___"+linha).val($("#numSolicitacao").val());
	$("#cnpjCTF___"+linha).val( $("#cnpj___"+numLinha).val() );
	$("#cotacaoFinalCTF___"+linha).val("SIM");
	$("#lojaCTF___"+linha).val( $("#loja___"+numLinha).val() );
	$("#cepCTF___"+linha).val( $("#cep___"+numLinha).val() );
	$("#estadoCTF___"+linha).val( $("#estado___"+numLinha).val() );
	$("#bairroCTF___"+linha).val( $("#bairro___"+numLinha).val() );
	$("#enderecoCTF___"+linha).val( $("#endereco___"+numLinha).val() );
	$("#complementoCTF___"+linha).val( $("#complemento___"+numLinha).val() );
	$("#contatoCTF___"+linha).val( $("#contato___"+numLinha).val() );
	$("#telefoneFornecCTF___"+linha).val( $("#telefoneFornec___"+numLinha).val() );
	$("#razaoSocialCTF___"+linha).val( $("#razaoSocial___"+numLinha).val() );
	$("#emailFornecCTF___"+linha).val( $("#emailFornec___"+numLinha).val() );	
	$("#totalItensCTF___"+linha).val( $("#totalItens___"+numLinha).val() );
	$("#totalDescontosCTF___"+linha).val( $("#totalDescontos___"+numLinha).val() );
	$("#totalImpostosCTF___"+linha).val( $("#totalImpostos___"+numLinha).val() );
	$("#totalFreteCTF___"+linha).val( $("#totalFrete___"+numLinha).val() );
	$("#formaPagamentoCTF___"+linha).val( $("#formaPagamento___"+numLinha).val() );
	//$("#totalCotacaoCTF___"+linha).val( $("#totalCotacao___"+numLinha).val() );
	$("#qtdDiasPrevEntregaCTF___"+linha).val( $("#qtdDiasPrevEntrega___"+numLinha).val() );
	$("#previsaoEntregaCTF___"+linha).val( $("#previsaoEntrega___"+numLinha).val() );
	$("#qtdDiasPrevPagamentoCTF___"+linha).val( $("#qtdDiasPrevPagamento___"+numLinha).val() );
	$("#previsaoPagamentoCTF___"+linha).val( $("#previsaoPagamento___"+numLinha).val() );

	$("#dataCotacaoFormatCTF___"+linha).val(dataInvertida);
	$("#dataCotacaoCTF___"+linha).val(dataCompletaLog);
	$("#anoCotacaoCTF___"+linha).val(anoLog);
	$("#mesCotacaoCTF___"+linha).val(mes2Log);
	$("#statusCotacaoCTF___"+linha).val("PENDENTE");

	btntbCotacaoFinal();
	btntbCotacao();
	
	$("#msgErrotbCotacao").hide();
	$("#divItensCotacao").hide();
	$("#btnEscolheCotacao").attr("disabled","disabled");
	
	criaItensCotacaoFinal(numLinha,"SIM");
	
	ocultaItemCotacao();
	ocultaResumo();
	
	
}

function limpaTbCotacaoVencedora(){
	var tbCotacaoFinal = varreTabela("tbCotacaoFinal");
	for(var i=0;i<tbCotacaoFinal.length;i++){
		var elemento = $("#excludetbCotacaoFinal___"+tbCotacaoFinal[i]).parent().parent();
		$(elemento).remove();
	}
	
	var tbItensCotacaoFinal = varreTabela("tbItensCotacaoFinal");
	for(var i=0;i<tbItensCotacaoFinal.length;i++){
		var elemento = $("#excludetbItensCotacaoFinal___"+tbItensCotacaoFinal[i]).parent().parent();
		$(elemento).remove();
	}
	
	$("#possuiCotacaoFinal").val("NAO");
	
}




function excluiFornecedorCotacao(elemento){
	
	
	//console.log("BTN Exclui id: "+elemento.id);
	
	var idBtn = elemento.id;
	var idCampo = idBtn.split("___");
	
	var tbItensCotacao = varreTabela("tbItensCotacao");
	
	for(var i=0;i<tbItensCotacao.length;i++){
		if($("#cnpjFornecCotacao___"+tbItensCotacao[i]).val() == $("#cnpj___"+idCampo[1]).val()){
			var linhaItem = $("#excludetbItensCotacao___"+tbItensCotacao[i]).parent().parent();
			//console.log("linhaItem: "+linhaItem);
			linhaItem.remove();
			fnWdkRemoveChild(elemento);
		}
	}
	
	
}

function limpatbCotacao(){
	//console.log("entrou limpatbCotacao");
	$("#cnpjTEMP").val("");
	$("#lojaTEMP").val("");
	$("#cepTEMP").val("");
	$("#estadoTEMP").val("");
	$("#cidadeTEMP").val("");
	$("#bairroTEMP").val("");
	$("#enderecoTEMP").val("");
	$("#complementoTEMP").val("");
	$("#contatoTEMP").val("");
	$("#emailFornecTEMP").val("");
	$("#telefoneFornecTEMP").val("");
	
	$("#razaoSocialTEMP option").remove();
	
}

function btntbCotacao(){
	console.log("entrou btntbCotacao");
	
	var tbCotacao = varreTabela("tbCotacao");
	var numAtividade = $("#numAtividade").val();
	
	var tbCotacaoFinal = varreTabela("tbCotacaoFinal");
	

	for (var i = 0; i < tbCotacao.length; i++) {
		var elemento = $("#acoesFornecedores___" + tbCotacao[i]).prev();
		
			var menu = " <div class='btn-group'> ";
			menu += 	"<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'> ";
			menu += 			"<span ><i class='flaticon flaticon-toc icon-md' aria-hidden='true' class='caret'></i></span> ";
			menu += 			"</button> ";
			menu += 			"<ul class='dropdown-menu menuTbCotacao' style='left: -50px !important;' role='menu'> ";
			menu += 				"<li><a href='javascript:void(0)' onclick='visualizaFornecedor(this.id)' id='btnDetalhesFornec___" + tbCotacao[i]+"' >Dados Fornecedor</a></li> ";
			menu += 				"<li><a href='javascript:void(0)' onclick='editaCotacao(this.id)' id='btnEditaCotacao___" + tbCotacao[i]+"' >Editar Cotação</a></li> ";
			menu += 				" <li class='divider'></li> ";
			menu += 				"<li><a href='javascript:void(0)' onclick='resumoCotacao(this.id)' id='btnEncerraCotacao___" + tbCotacao[i]+"' >Resumo Cotação</a></li> ";
			menu += 			"</ul> ";
			menu += 		"</div> ";
			
			
			var menuAtv12 = " <div class='btn-group'> ";
				menuAtv12 += 	"<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'> ";
				menuAtv12 += 			"<span ><i class='flaticon flaticon-toc icon-md' aria-hidden='true' class='caret'></i></span> ";
				menuAtv12 += 			"</button> ";
				menuAtv12 += 			"<ul class='dropdown-menu menuTbCotacao' style='left: -50px !important;' role='menu'> ";
				menuAtv12 += 				"<li><a href='javascript:void(0)' onclick='visualizaFornecedor(this.id)' id='btnDetalhesFornec___" + tbCotacao[i]+"' >Dados Fornecedor</a></li> ";
				menuAtv12 += 				"<li><a href='javascript:void(0)' onclick='visualizaCotacao(this.id)' id='btnVisualizaCotacao___" + tbCotacao[i]+"' >Ver Cotação</a></li> ";
				menuAtv12 += 			"</ul> ";
				menuAtv12 += 		"</div> ";
		
		
		
		var dados = "<div class='btn-group'>" +
						"<i class='flaticon flaticon-edit-square icon-md' onclick='editaFornecedor(this.id)' id='btnEdita___" + tbCotacao[i]+"' style='color:#4273d1'></i>&nbsp;&nbsp;&nbsp;&nbsp;"+
						"<i class='fluigicon fluigicon-trash icon-md' onclick='excluiFornecedorCotacao(this)' id='btnExclui___" + tbCotacao[i]+"' style='color:#cf007a' id='btnExclude___" + tbCotacao[i] + " '></i>"+
					"</div>";
		
		var editaCotacao = "<div class='btn-group'>" +
						"<button type='button' class='btn btn-info' onclick='editaCotacao(this.id)' id='btnEditaCotacao___" + tbCotacao[i]+"' >Editar Cotação</button>"+
					"</div>";
		
		var somenteLeitura = "<div class='btn-group'>" +
						"<button type='button' class='btn btn-info' onclick='visualizaFornecedor(this.id)' id='btnDetalhesFornec___" + tbCotacao[i]+"' >Detalhes</button>"+
					"</div>";
		
		$(elemento).html("");
		if(numAtividade == "0" || numAtividade == "4" || numAtividade == "") {
			$(elemento).append(editaCotacao);
		}else if(numAtividade == "5"){
			$(elemento).append(dados);
		}else if(numAtividade == "10"){
			$(elemento).append(menu);
		}else if(numAtividade == "12" && tbCotacaoFinal.length == 0){
			$(elemento).append(menuAtv12);
		}else if(numAtividade == "12" && tbCotacaoFinal.length > 0){
			$(elemento).append(menuAtv12);
		}else if(numAtividade == "16"){
			$(elemento).append(menu);
		}else if(numAtividade == "18"){
			$(elemento).append(menu);
		}else{
			$(elemento).append(somenteLeitura);
		}
	}
	//console.log("fim btntbCotacao");
	
}

function btntbCotacaoFinal(){
	console.log(">>>>>>>>>>> entrou btntbCotacaoFinal FINAL");
	
	var tbCotacao = varreTabela("tbCotacaoFinal");
	var numAtividade = $("#numAtividade").val();
	

	for (var i = 0; i < tbCotacao.length; i++) {
		var elemento = $("#acoesFornecedoresCTF___" + tbCotacao[i]).prev();
		
			var menu = " <div class='btn-group'> ";
			menu += 	"<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'> ";
			menu += 			"<span ><i class='flaticon flaticon-toc icon-md' aria-hidden='true' class='caret'></i></span> ";
			menu += 			"</button> ";
			menu += 			"<ul class='dropdown-menu menuTbCotacao' style='left: -50px !important;' role='menu'> ";
			menu += 				"<li><a href='javascript:void(0)' onclick='visualizaFornecedor(this.id)' id='btnDetalhesFornecCTF___" + tbCotacao[i]+"' >Dados Fornecedor</a></li> ";
			menu += 				"<li><a href='javascript:void(0)' onclick='editaCotacaoFinal(this.id)' id='btnEditaCotacaoCTF___" + tbCotacao[i]+"' >Editar Cotação</a></li> ";
			menu += 				" <li class='divider'></li> ";
			menu += 				"<li><a href='javascript:void(0)' onclick='resumoCotacaoFinal(this.id)' id='btnEncerraCotacaoCTF___" + tbCotacao[i]+"' >Resumo Cotação</a></li> ";
			menu += 			"</ul> ";
			menu += 		"</div> ";
			
			
			var menuAtv12 = " <div class='btn-group'> ";
				menuAtv12 += 	"<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'> ";
				menuAtv12 += 			"<span ><i class='flaticon flaticon-toc icon-md' aria-hidden='true' class='caret'></i></span> ";
				menuAtv12 += 			"</button> ";
				menuAtv12 += 			"<ul class='dropdown-menu menuTbCotacao' style='left: -50px !important;' role='menu'> ";
				menuAtv12 += 				"<li><a href='javascript:void(0)' onclick='visualizaFornecedor(this.id)' id='btnDetalhesFornecCTF___" + tbCotacao[i]+"' >Dados Fornecedor</a></li> ";
				menuAtv12 += 				"<li><a href='javascript:void(0)' onclick='visualizaCotacaoFinal(this.id)' id='btnVisualizaCotacaoCTF___" + tbCotacao[i]+"' >Ver Cotação</a></li> ";
				menuAtv12 += 			"</ul> ";
				menuAtv12 += 		"</div> ";
		
		
		
		var dados = "<div class='btn-group'>" +
						"<i class='flaticon flaticon-edit-square icon-md' onclick='editaFornecedor(this.id)' id='btnEditaCTF___" + tbCotacao[i]+"' style='color:#4273d1'></i>&nbsp;&nbsp;&nbsp;&nbsp;"+
						"<i class='fluigicon fluigicon-trash icon-md' onclick='excluiFornecedorCotacao(this)' id='btnExcluiCTF___" + tbCotacao[i]+"' style='color:#cf007a' id='btnExclude___" + tbCotacao[i] + " '></i>"+
					"</div>";
		
		var editaCotacao = "<div class='btn-group'>" +
						"<button type='button' class='btn btn-info' onclick='editaCotacaoFinal(this.id)' id='btnEditaCotacaoCTF___" + tbCotacao[i]+"' >Editar Cotação</button>"+
					"</div>";
		
		var somenteLeitura = "<div class='btn-group'>" +
						"<button type='button' class='btn btn-info' onclick='visualizaFornecedor(this.id)' id='btnDetalhesFornecCTF___" + tbCotacao[i]+"' >Detalhes</button>"+
					"</div>";
		
		$(elemento).html("");
		if(numAtividade == "0" || numAtividade == "4" || numAtividade == "") {
			$(elemento).append(editaCotacao);
		}else if(numAtividade == "5"){
			$(elemento).append(dados);
		}else if(numAtividade == "10"){
			$(elemento).append(menu);
		}else if(numAtividade == "12"){
			$(elemento).append(menuAtv12);
		}else if(numAtividade == "16"){
			$(elemento).append(menu);
		}else if(numAtividade == "18"){
			$(elemento).append(menu);
		}else{
			$(elemento).append(somenteLeitura);
		}
	}
	//console.log("fim btntbCotacao");
	
}


function visualizaCotacao(idCampo){
	console.log("##############   entrou visualizaCotacao: "+idCampo);
	var str = idCampo.split("___");
	var linhaCotacao = str[1];
	
	$("#linhaCotacaoOriginalCT").val(linhaCotacao);
	console.log("linhaCotacao: "+linhaCotacao);
	
	var cnpjCotacao = $("#cnpj___"+linhaCotacao).val();
	var totalCotacao = $("#total___"+linhaCotacao).val();
	
	
	var tbItensCotacao = varreTabela("tbItensCotacao");
	
	$("#divItensCotacao").show();
	$("#divResumoCotacao").show();
	
	for(var i=0;i<tbItensCotacao.length;i++){
		//console.log("entrou for visualizaCotacao");
		//console.log("cnpjFornecCotacao___"+tbItensCotacao[i]+": "+$("#cnpjFornecCotacao___"+tbItensCotacao[i]).val());
		console.log("cnpjFornecCotacao___"+tbItensCotacao[i]+": "+$("#cnpjFornecCotacao___"+tbItensCotacao[i]).val()+" == cnpjCotacao: "+cnpjCotacao);
		
		if($("#cnpjFornecCotacao___"+tbItensCotacao[i]).val() != cnpjCotacao ){
			//console.log("entrou primeiro if visualização");
			var elemento = $("#excludetbItensCotacao___"+tbItensCotacao[i]).parent().parent();
			elemento.hide();
		}else if($("#cnpjFornecCotacao___"+tbItensCotacao[i]).val() == cnpjCotacao ){
			//console.log("entrou segundo if visualização");
			var elemento = $("#excludetbItensCotacao___"+tbItensCotacao[i]).parent().parent();
			elemento.show();
		}
		
		//FLUIGC.switcher.isReadOnly("#checkPossuiItem___"+tbItensCotacao[i], true);	
	}
	
	$("#formaPagamentoCT").attr( "disabled","disabled" );
	$("#qtdDiasPrevEntregaCT").attr( "readonly","readonly" );
	$("#dataPrevItemCT").attr( "disabled","disabled" );
	$("#dataPrevItemCT").attr( "readonly","readonly" );
	$("#dataPrevItemCT").css( "background-color","#f3f3f3" );
	
	$("#qtdDiasPrevPagamentoCT").attr( "readonly","readonly" );
	$("#dataPrevPagItemCT").attr( "disabled","disabled" );
	$("#dataPrevPagItemCT").attr( "readonly","readonly" );
	$("#dataPrevPagItemCT").css( "background-color","#f3f3f3" );
	
	
	$("#btnEncerraCotacao").attr( "disabled","disabled" );
	
	carregaBtnPossuiItem();
	btnTbItensCotacao();
	somaTotalCotacao(linhaCotacao, cnpjCotacao);
	
	$("#divBtnSaveResumo").hide();
	//$("#divBtnEscolheCotacao").show();
	
	//console.log("totalCotacao: *"+totalCotacao+"*");
	
	var totalCotacao = $("#totalCotacao___"+linhaCotacao).val();
	
	if(totalCotacao == "" || totalCotacao == "0.00" || totalCotacao == "undefined" || totalCotacao == undefined){
		//console.log(">>>>>>entrou primeiro if");
		$("#btnEscolheCotacao").attr("disabled","disabled");
	}else{
		//console.log(">>>>>>>>>entrou segundo if");
		$("#btnEscolheCotacao").removeAttr("disabled");
	}
	
	
}

function visualizaCotacaoFinal(idCampo){
	console.log("##############   entrou visualizaCotacaoFinal: "+idCampo);
	var str = idCampo.split("___");
	var linhaCotacao = str[1];
	
	$("#linhaCotacaoOriginalCT").val(linhaCotacao);
	console.log("linhaCotacao: "+linhaCotacao);
	
	var cnpjCotacao = $("#cnpjCTF___"+linhaCotacao).val();
	var totalCotacao = $("#totalCTF___"+linhaCotacao).val();
	
	
	var tbItensCotacao = varreTabela("tbItensCotacaoFinal");
	
	$("#divItensCotacao").show();
	$("#divResumoCotacao").show();
	
	for(var i=0;i<tbItensCotacao.length;i++){
		//console.log("entrou for visualizaCotacao");
		//console.log("cnpjFornecCotacao___"+tbItensCotacao[i]+": "+$("#cnpjFornecCotacao___"+tbItensCotacao[i]).val());
		//console.log("cnpjCotacao: "+cnpjCotacao);
		
		//console.log("linhaCotacao: "+linhaCotacao);
		var linhaCotacaoOriginal = $("#linhaCotacaoOriginalCTF___"+tbItensCotacao[i]).val();
		//console.log("linhaCotacaoOriginal: "+linhaCotacaoOriginal);
		
		//$("#linhaCotacaoOriginalCT").val(linhaCotacaoOriginal);
		
		if($("#cnpjFornecCotacaoCTF___"+tbItensCotacao[i]).val() != cnpjCotacao && linhaCotacaoOriginal !=  linhaCotacao){
			//console.log("entrou primeiro if visualização");
			var elemento = $("#excludetbItensCotacaoFinal___"+tbItensCotacao[i]).parent().parent();
			elemento.hide();
		}else if($("#cnpjFornecCotacaoCTF___"+tbItensCotacao[i]).val() == cnpjCotacao && linhaCotacaoOriginal != linhaCotacao){
			//console.log("entrou segundo if visualização");
			var elemento = $("#excludetbItensCotacaoCTF___"+tbItensCotacao[i]).parent().parent();
			elemento.hide();
		}else if($("#cnpjFornecCotacaoCTF___"+tbItensCotacao[i]).val() == cnpjCotacao && linhaCotacaoOriginal == linhaCotacao){
			//console.log("entrou terceiro if visualização");
			var elemento = $("#excludetbItensCotacaoCTF___"+tbItensCotacao[i]).parent().parent();
			elemento.show();
		}
		
		FLUIGC.switcher.isReadOnly("#checkPossuiItemCTF___"+tbItensCotacao[i], true);	
	}
	
	$("#formaPagamentoCT").attr( "disabled","disabled" );
	$("#qtdDiasPrevEntregaCT").attr( "readonly","readonly" );
	$("#dataPrevItemCT").attr( "disabled","disabled" );
	$("#dataPrevItemCT").attr( "readonly","readonly" );
	$("#dataPrevItemCT").css( "background-color","#f3f3f3" );
	$("#btnEncerraCotacao").attr( "disabled","disabled" );
	
	carregaBtnPossuiItemFinal();
	btnTbItensCotacaoFinal();
	somaTotalCotacaoFinal(linhaCotacao, cnpjCotacao);
	
	$("#divBtnSaveResumo").hide();
	//$("#divBtnEscolheCotacao").show();
	
	//console.log("totalCotacao: *"+totalCotacao+"*");
	
	var totalCotacao = $("#totalCotacaoCTF___"+linhaCotacao).val();
	
	if(totalCotacao == "" || totalCotacao == "0.00" || totalCotacao == "undefined" || totalCotacao == undefined){
		//console.log(">>>>>>entrou primeiro if");
		$("#btnEscolheCotacao").attr("disabled","disabled");
	}else{
		//console.log(">>>>>>>>>entrou segundo if");
		$("#btnEscolheCotacao").removeAttr("disabled");
	}
	
	
}


function resumoCotacao(idCampo){
	//console.log("entrou resumoCotacao");
	
	//console.log("entrou editaItemCotacao");
	var temp = idCampo.split("___");
	var numLinha = temp[1];
	
	var cnpj = $("#cnpj___"+numLinha).val();
	
	$("#divResumoCotacao").show();
	
	somaTotalCotacao(numLinha, cnpj);
}

function resumoCotacaoFinal(idCampo){
	//console.log("entrou resumoCotacao");
	
	//console.log("entrou editaItemCotacao");
	var temp = idCampo.split("___");
	var numLinha = temp[1];
	
	var cnpj = $("#cnpj___"+numLinha).val();
	
	$("#divResumoCotacao").show();
	
	somaTotalCotacaoFinal(numLinha, cnpj);
}

function visualizaFornecedor(idCampo){
	//console.log("entrou editaFornecedor");
	//console.log("idCampo: "+idCampo);
	$("#tempSelecaoFornecedor").show();
	var temp = idCampo.split("___");
	var numLinha = temp[1];
	var numAtividade = $("#numAtividade").val();
	
	if(numAtividade == "5"){
		$("#razaoSocialTEMP").select2("destroy");
	}
	
	
	$("#razaoSocialTEMP option").remove();
	$("#razaoSocialTEMP").append($('<option>', {
		value: $("#cnpj___"+numLinha).val(),
		text: $("#razaoSocial___"+numLinha).val()
	}));
	
	$("#razaoSocialTEMP").attr("disabled","disabled");
	
	$("#cnpjTEMP").val( $("#cnpj___"+numLinha).val() );
	$("#lojaTEMP").val( $("#loja___"+numLinha).val() );
	$("#cepTEMP").val( $("#cep___"+numLinha).val() );
	$("#estadoTEMP").val( $("#estado___"+numLinha).val() );
	$("#cidadeTEMP").val( $("#cidade___"+numLinha).val() );
	$("#bairroTEMP").val( $("#bairro___"+numLinha).val() );
	$("#enderecoTEMP").val( $("#endereco___"+numLinha).val() );
	$("#complementoTEMP").val( $("#complemento___"+numLinha).val() );
	$("#contatoTEMP").val( $("#contato___"+numLinha).val() );
	$("#emailFornecTEMP").val( $("#emailFornec___"+numLinha).val() );
	$("#telefoneFornecTEMP").val( $("#telefoneFornec___"+numLinha).val() );
	$("#numLinhaFornecedor").val( numLinha );
	
	$("#contatoTEMP").attr("readonly","readonly");
	$("#emailFornecTEMP").attr("readonly","readonly");
	$("#telefoneFornecTEMP").attr("readonly","readonly");

	$("#btnAddFornecedor").hide();
	$("#btnSaveFornecedor").hide();
	$("#btnOcultaFornecedor").show();
		
}

function ocultaFornecedor(idCampo){
	limpatbCotacao();
	$("#tempSelecaoFornecedor").hide();
		
}

function ocultaResumo(){
	
	$("#divResumoCotacao").hide();
	
	$("#cnpjResumoTotal").val("");
	$("#totalItensCT").val("");
	$("#totalDescontosCT").val("");
	$("#totalImpostosCT").val("");
	$("#totalFreteCT").val("");
	$("#totalCotacaoCT").val("");
	$("#formaPagamentoCT").val("");
	$("#qtdDiasPrevEntregaCT").val("");
	$("#dataPrevItemCT").val("");
	$("#linhaCotacaoOriginalCT").val("");
	
}

function editaFornecedor(idCampo){
	//console.log("entrou editaFornecedor");
	
	var temp = idCampo.split("___");
	var numLinha = temp[1];
	
	$("#razaoSocialTEMP").select2("destroy");
	
	$("#razaoSocialTEMP option").remove();
	$("#razaoSocialTEMP").append($('<option>', {
		value: $("#cnpj___"+numLinha).val(),
		text: $("#razaoSocial___"+numLinha).val()
	}));
	
	$("#cnpjTEMP").val( $("#cnpj___"+numLinha).val() );
	$("#lojaTEMP").val( $("#loja___"+numLinha).val() );
	$("#cepTEMP").val( $("#cep___"+numLinha).val() );
	$("#estadoTEMP").val( $("#estado___"+numLinha).val() );
	$("#cidadeTEMP").val( $("#cidade___"+numLinha).val() );
	$("#bairroTEMP").val( $("#bairro___"+numLinha).val() );
	$("#enderecoTEMP").val( $("#endereco___"+numLinha).val() );
	$("#complementoTEMP").val( $("#complemento___"+numLinha).val() );
	$("#contatoTEMP").val( $("#contato___"+numLinha).val() );
	$("#emailFornecTEMP").val( $("#emailFornec___"+numLinha).val() );
	$("#telefoneFornecTEMP").val( $("#telefoneFornec___"+numLinha).val() );
	$("#numLinhaFornecedor").val( numLinha );

	$("#btnAddFornecedor").hide();
	$("#btnSaveFornecedor").show();
	
	/*somaTotalCotacao();
	
	//=======================================================================================================
	var totalItensCT = $("#totalItens___"+numLinha).val();
	if(totalItensCT != ""){
		var totalItens = parseFloat(totalItensCT);
		var totalItensFormatado = totalItens.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var totalItens = 0.00;
		var totalItensFormatado = totalItens.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#totalItensCT").val( totalItensFormatado );
	
	
	//=======================================================================================================
	var totalDescontosCT = $("#totalDescontos___"+numLinha).val();
	if(totalDescontosCT != ""){
		var totalDescontos = parseFloat(totalDescontosCT);
		var totalDescontosFormatado = totalDescontos.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var totalDescontos = 0.00;
		var totalDescontosFormatado = totalDescontos.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#totalDescontosCT").val( totalDescontosFormatado );
	
	//=======================================================================================================
	var totalImpostosCT = $("#totalItens___"+numLinha).val();
	if(totalDescontosCT != ""){
		var totalImpostos = parseFloat(totalImpostosCT);
		var totalImpostosFormatado = totalImpostos.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var totalImpostos = 0.00;
		var totalImpostosFormatado = totalImpostos.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#totalImpostosCT").val( totalImpostosFormatado );
	
	//=======================================================================================================
	var totalImpostosCT = $("#totalImpostos___"+numLinha).val();
	if(totalDescontosCT != ""){
		var totalImpostos = parseFloat(totalImpostosCT);
		var totalImpostosFormatado = totalImpostos.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var totalImpostos = 0.00;
		var totalImpostosFormatado = totalImpostos.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#totalImpostosCT").val( totalImpostosFormatado );
	
	//=======================================================================================================
	var totalFreteCT = $("#totalFrete___"+numLinha).val();
	if(totalFreteCT != ""){
		var totalFrete = parseFloat(totalFreteCT);
		var totalFreteFormatado = totalFrete.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var totalFrete = 0.00;
		var totalFreteFormatado = totalFrete.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#totalFreteCT").val( totalFreteFormatado );
	
	//=======================================================================================================
	var totalCotacaoCT = $("#totalCotacao___"+numLinha).val();
	if(totalCotacaoCT != ""){
		var totalCotacao = parseFloat(totalCotacaoCT);
		var totalCotacaoFormatado = totalCotacao.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var totalCotacao = 0.00;
		var totalCotacaoFormatado = totalCotacao.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#totalCotacaoCT").val( totalCotacaoFormatado );
	

	$("#formaPagamentoCT").val( $("#formaPagamento___"+numLinha).val() );
	$("#qtdDiasPrevEntregaCT").val( $("#qtdDiasPrevEntrega___"+numLinha).val() );
	$("#dataPrevItemCT").val( $("#previsaoEntrega___"+numLinha).val() );
		
	//console.log("fim editaFornecedor");
	imprimeTBCotacao();*/
}

function saveFornecedor(){
	//console.log("entrou saveFornecedor");
	
	var contErro = validatbCotacao();
	var linha = $("#numLinhaFornecedor").val();
	
	if(contErro == 0){
		$("#btnAddFornecedor").show();
		$("#btnSaveFornecedor").hide();
		
		$("#cnpj___"+linha).val($("#razaoSocialTEMP").val());
		$("#loja___"+linha).val($("#lojaTEMP").val());
		$("#cep___"+linha).val($("#cepTEMP").val());
		$("#estado___"+linha).val($("#estadoTEMP").val());
		$("#bairro___"+linha).val($("#bairroTEMP").val());
		$("#endereco___"+linha).val($("#enderecoTEMP").val());
		$("#complemento___"+linha).val($("#complementoTEMP").val());
		$("#contato___"+linha).val($("#contatoTEMP").val());
		$("#telefoneFornec___"+linha).val($("#telefoneFornecTEMP").val());
		$("#razaoSocial___"+linha).val($("#razaoSocialTEMP  option:selected").text());
		$("#emailFornec___"+linha).val($("#emailFornecTEMP").val());
		
		limpatbCotacao();
		btntbCotacao();
		
		$("#razaoSocialTEMP").select2();		
		
		getFornecedor();
		
		$("#lb_razaoSocialTEMP").css('color', '');
		$("#numLinhaFornecedor").val("");
		
	}
	//console.log("fim saveFornecedor");
	
}

function criaItensCotacao(idCampo,cotacaoFinal){
	//console.log("entrou criaItensCotacao");
	//console.log("idCampo: "+idCampo);
	
	
	
	var tbProdutos = varreTabela("tbGradeProdutos");
	var numItem = 0;
	
	for(var i=0;i<tbProdutos.length;i++){
		
		numItem++;
		
		var numLinha = wdkAddChild("tbItensCotacao");
		//console.log("numLinha: "+numLinha);
		//console.log("adicionando linha tbItensCotacao");
		//console.log("CNPJ acionado: "+$("#cnpj___"+idCampo).val());
		
		$("#itemCotacaoFinal___"+numLinha).val("NAO");		
		$("#numItem___"+numLinha).val(numItem);		
		$("#numLinhaItemCotacao___"+numLinha).val(numLinha);		
		$("#linhaCotacaoOriginal___"+numLinha).val(idCampo);		
		$("#numFluigItemCotacao___"+numLinha).val($("#numSolicitacao").val());		
		$("#cnpjFornecCotacao___"+numLinha).val($("#cnpj___"+idCampo).val());		
		$("#codItemSolicitado___"+numLinha).val($("#codProdutoSC___"+tbProdutos[i]).val());		
		$("#descItemSolicitado___"+numLinha).val($("#descrProdutoSC___"+tbProdutos[i]).val());		
		$("#infoComplItemSC___"+numLinha).val($("#infoComplProdutoSC___"+tbProdutos[i]).val());		
		$("#qtdSolicitada___"+numLinha).val($("#quantidadeSC___"+tbProdutos[i]).val());		
		$("#optPossuiItem___"+numLinha).val("true");	
		$("#optEscolheItem___"+numLinha).val("false");	

		FLUIGC.switcher.init("#checkPossuiItem___"+numLinha);
		FLUIGC.switcher.setTrue("#checkPossuiItem___"+numLinha);
		FLUIGC.switcher.isReadOnly("#checkPossuiItem___"+numLinha, true);
		
		FLUIGC.switcher.init("#checkEscolheItem___"+numLinha);
		FLUIGC.switcher.setFalse("#checkEscolheItem___"+numLinha);
		FLUIGC.switcher.isReadOnly("#checkEscolheItem___"+numLinha, true);
		
	}
	//btnTbItensCotacao();
	
	//console.log("fim criaItensCotacao");
	
	
}

function criaItensCotacaoFinal(idCampo,cotacaoFinal){
	console.log("entrou criaItensCotacao");
	
	var tbItensCotacao = varreTabela("tbItensCotacao");
	var numItem = 0;
	
	var cnpjOrigem =  $("#cnpj___"+idCampo).val();
	console.log("cnpjOrigem: "+cnpjOrigem);
	
	var contLinha = 0;
	for(var i=0;i<tbItensCotacao.length;i++){


		if($("#cnpjFornecCotacao___"+tbItensCotacao[i]).val() == cnpjOrigem){
			contLinha++;
			var numLinha = wdkAddChild("tbItensCotacaoFinal");
				
			$("#itemCotacaoFinalCTF___"+numLinha).val("SIM");		
			$("#numItemCTF___"+numLinha).val($("#numItem___"+tbItensCotacao[i]).val());		
			$("#numLinhaItemCotacaoCTF___"+numLinha).val(contLinha);		
			$("#linhaCotacaoOriginalCTF___"+numLinha).val(idCampo);		
			$("#numFluigItemCotacaoCTF___"+numLinha).val($("#numSolicitacao").val());		
			$("#cnpjFornecCotacaoCTF___"+numLinha).val(cnpjOrigem);		
			$("#codItemSolicitadoCTF___"+numLinha).val($("#codItemSolicitado___"+tbItensCotacao[i]).val());		
			$("#descItemSolicitadoCTF___"+numLinha).val($("#descItemSolicitado___"+tbItensCotacao[i]).val());		
			$("#infoComplItemSCCTF___"+numLinha).val($("#infoComplItemSC___"+tbItensCotacao[i]).val());		
			$("#qtdSolicitadaCTF___"+numLinha).val($("#qtdSolicitada___"+tbItensCotacao[i]).val());		
			$("#optPossuiItemCTF___"+numLinha).val($("#optPossuiItem___"+tbItensCotacao[i]).val());	
			
			
			$("#itemDisponibilizadoCTF___"+numLinha).val($("#itemDisponibilizado___"+tbItensCotacao[i]).val());	
			$("#qtdDisponibilizadaCTF___"+numLinha).val($("#qtdDisponibilizada___"+tbItensCotacao[i]).val());	
			$("#valUnitarioCTF___"+numLinha).val($("#valUnitario___"+tbItensCotacao[i]).val());	
			$("#freteItemCTF___"+numLinha).val($("#freteItem___"+tbItensCotacao[i]).val());	
			$("#descontoItemCTF___"+numLinha).val($("#descontoItem___"+tbItensCotacao[i]).val());	
			$("#icmsItemCTF___"+numLinha).val($("#icmsItem___"+tbItensCotacao[i]).val());	
			$("#ipiItemCTF___"+numLinha).val($("#ipiItem___"+tbItensCotacao[i]).val());	
			$("#pisItemCTF___"+numLinha).val($("#pisItem___"+tbItensCotacao[i]).val());	
			$("#cofinsItemCTF___"+numLinha).val($("#cofinsItem___"+tbItensCotacao[i]).val());	
			
			$("#issItemCTF___"+numLinha).val($("#issItem___"+tbItensCotacao[i]).val());	
			$("#inssItemCTF___"+numLinha).val($("#inssItem___"+tbItensCotacao[i]).val());	
			$("#irItemCTF___"+numLinha).val($("#irItem___"+tbItensCotacao[i]).val());	
			$("#clssItemCTF___"+numLinha).val($("#clssItem___"+tbItensCotacao[i]).val());	
			$("#outroImpostoVlrCTF___"+numLinha).val($("#outroImpostoVlr___"+tbItensCotacao[i]).val());	
			
			$("#totalItemCTF___"+numLinha).val($("#totalItem___"+tbItensCotacao[i]).val());	

			FLUIGC.switcher.init("#checkPossuiItemCTF___"+numLinha);
			if($("#optPossuiItem___"+tbItensCotacao[i]).val() == "true" || $("#optPossuiItem___"+tbItensCotacao[i]).val() == true){
				FLUIGC.switcher.setTrue("#checkPossuiItemCTF___"+numLinha);
			}else{
				FLUIGC.switcher.setFalse("#checkPossuiItemCTF___"+numLinha);
			}
			
			
			FLUIGC.switcher.isReadOnly("#checkPossuiItemCTF___"+numLinha, true);
		}
		
		
	}
	
	$("#possuiCotacaoFinal").val("SIM");
	
	btnTbItensCotacaoFinal();
	
	//console.log("fim criaItensCotacao");
	
	
}


function limpaItensCotacao(){
	
	
}

function recalculaCotacao(){
	
	
}

function fnAlteraCheckProduto(idCampo){
	//console.log("entrou fnAlteraCheckProduto");
	var str = FLUIGC.switcher.getState('#'+idCampo);
	
	var idCompleto = idCampo.split("___");
	var numLinha = idCompleto[1];
	
	$("#optPossuiItem___"+numLinha).val(str);
	
	if(str == true){
		$("#btnEdita___"+numLinha).removeAttr("disabled");
	}else{
		$("#btnEdita___"+numLinha).attr("disabled","disabled");
		$("#qtdDisponibilizada___"+numLinha).val("0" );
		$("#valUnitario___"+numLinha).val("0.00");
		$("#freteItem___"+numLinha).val("0.00");
		$("#descontoItem___"+numLinha).val("0.00");
		$("#icmsItem___"+numLinha).val("0.00");
		$("#ipiItem___"+numLinha).val("0.00");
		$("#pisItem___"+numLinha).val("0.00");
		$("#cofinsItem___"+numLinha).val("0.00");
		
		$("#issItem___"+numLinha).val("0.00");
		$("#inssItem___"+numLinha).val("0.00");
		$("#irItem___"+numLinha).val("0.00");
		$("#csllItem___"+numLinha).val("0.00");
		$("#outroImpostoVlr___"+numLinha).val("0.00");
		$("#outroImpostoDesc___"+numLinha).val("");
		
		$("#totalItem___"+numLinha).val("0.00");
		
		var cnpj = $("#cnpjFornecCotacao___"+numLinha).val();
		
		somaTotalCotacao(numLinha,cnpj);
	}
	
	
	
	
}

function fnAlteraCheckProdutoFinal(idCampo){
	//console.log("entrou fnAlteraCheckProduto");
	var str = FLUIGC.switcher.getState('#'+idCampo);
	
	var idCompleto = idCampo.split("___");
	var numLinha = idCompleto[1];
	
	$("#optPossuiItemCTF___"+numLinha).val(str);
	
	if(str == true){
		$("#btnEditaCTF___"+numLinha).removeAttr("disabled");
	}else{
		$("#btnEditaCTF___"+numLinha).attr("disabled","disabled");
		$("#qtdDisponibilizadaCTF___"+numLinha).val("0" );
		$("#valUnitarioCTF___"+numLinha).val("0.00");
		$("#freteItemCTF___"+numLinha).val("0.00");
		$("#descontoItemCTF___"+numLinha).val("0.00");
		$("#icmsItemCTF___"+numLinha).val("0.00");
		$("#ipiItemCTF___"+numLinha).val("0.00");
		$("#pisItemCTF___"+numLinha).val("0.00");
		$("#cofinsItemCTF___"+numLinha).val("0.00");
		
		$("#issItemCTF___"+numLinha).val("0.00");
		$("#inssItemCTF___"+numLinha).val("0.00");
		$("#irItemCTF___"+numLinha).val("0.00");
		$("#csllItemCTF___"+numLinha).val("0.00");
		$("#outroImpostoVlrCTF___"+numLinha).val("0.00");
		
		$("#totalItemCTF___"+numLinha).val("0.00");
		
		var cnpj = $("#cnpjFornecCotacaoCTF___"+numLinha).val();
		
		somaTotalCotacaoFinal(numLinha,cnpj);
	}
	
}

function fnAlteraEscolheItem(idCampo){
	
	var tbCotacao = varreTabela("tbCotacao");
	var tbItensCotacao = varreTabela("tbItensCotacao");
	
	var dataLogTemp = new Date();

	var diaLog = dataLogTemp.getDate();
	if (parseInt(diaLog) < 10) {
		diaLog = "0" + diaLog;
	}
	var mesLog = dataLogTemp.getMonth();

	anoLog = dataLogTemp.getFullYear();

	var mes2Log = parseInt(mesLog) + 1;
	if (parseInt(mes2Log) < 10) {
		mes2Log = "0" + mes2Log;
	}
	
	var dataInvertida = anoLog.toString()+mes2Log.toString()+diaLog.toString();
	var dataCompletaLog = diaLog + '/' + mes2Log + '/' + anoLog;
		
	var existeCNPJ = 0;
	var existeItem = 0;
	var existeFornecDif = 0;
	var posicaoItem = "";
	var posicaoCNPJ = "";
	console.log("ID CAMPO: #"+idCampo);
	var opcao = FLUIGC.switcher.getState('#'+idCampo);

	
	var idCompleto = idCampo.split("___");
	var numLinha = idCompleto[1];
	
	$("#optEscolheItem___"+numLinha).val(opcao);
	var codItemEscolhido = $("#codItemSolicitado___"+numLinha).val();
	var cnpjItem = $("#cnpjFornecCotacao___"+numLinha).val();
	
	//================ ADICIONANDO ITEM  ===========================================================
	
	if(opcao == true){
		console.log("entrou if true item");
		if(itensEscolhido.length == 0){
			itensEscolhido.push({
				"itemCotacaoFinal":"SIM",
				"numItemCTF" : $("#numItem___"+numLinha).val(),		
				"numLinhaItemCotacao" : numLinha,		
				"linhaCotacaoOriginal" : $("#linhaCotacaoOriginal___"+numLinha).val(),		
				"numFluigItemCotacao" : $("#numSolicitacao").val(),		
				"cnpjFornecCotacao" : cnpjItem,		
				"codItemSolicitado" : $("#codItemSolicitado___"+numLinha).val(),		
				"descItemSolicitado" : $("#descItemSolicitado___"+numLinha).val(),		
				"infoComplItemSC" : $("#infoComplItemSC___"+numLinha).val(),		
				"qtdSolicitada" : $("#qtdSolicitada___"+numLinha).val(),		
				"optPossuiItem" : $("#optPossuiItem___"+numLinha).val(),	
				"itemDisponibilizado" : $("#itemDisponibilizado___"+numLinha).val(),	
				"qtdDisponibilizada" : $("#qtdDisponibilizada___"+numLinha).val(),	
				"valUnitario" : $("#valUnitario___"+numLinha).val(),	
				"freteItem" : $("#freteItem___"+numLinha).val(),	
				"descontoItem" : $("#descontoItem___"+numLinha).val(),	
				"icmsItem" : $("#icmsItem___"+numLinha).val(),	
				"ipiItem" : $("#ipiItem___"+numLinha).val(),	
				"pisItem" : $("#pisItem___"+numLinha).val(),	
				"cofinsItem" : $("#cofinsItem___"+numLinha).val(),	
				"issItem" : $("#issItem___"+numLinha).val(),	
				"inssItem" : $("#inssItem___"+numLinha).val(),	
				"irItem" : $("#irItem___"+numLinha).val(),	
				"clssItem" : $("#clssItem___"+numLinha).val(),	
				"outroImpostoVlr" : $("#outroImpostoVlr___"+numLinha).val(),	
				"totalItem" : $("#totalItem___"+numLinha).val()
			});
		}else{
			for(var z = 0; z<itensEscolhido.length;z++){
				if(itensEscolhido[z].codItemSolicitado == codItemEscolhido && itensEscolhido[z].cnpjFornecCotacao == cnpjItem){
					existeItem++;
				}
				if(itensEscolhido[z].codItemSolicitado == codItemEscolhido && itensEscolhido[z].cnpjFornecCotacao != cnpjItem){
					existeFornecDif++;
				}
			}
			
			if(existeFornecDif >= 1 ){
				FLUIGC.message.alert({
					message: 'Já existe este mesmo item selecionado em outro fornecedor. Você deve desmarcar o outro antes de selecionar este.',
					title: 'Erro',
					label: 'OK'
				}, function(el, ev) {
					FLUIGC.switcher.setFalse('#'+idCampo);
				});
			}
			if(existeItem == 0 && existeFornecDif == 0){
				itensEscolhido.push({
					"itemCotacaoFinal":"SIM",
					"numItemCTF" : $("#numItem___"+numLinha).val(),		
					"numLinhaItemCotacao" : numLinha,		
					"linhaCotacaoOriginal" : $("#linhaCotacaoOriginal___"+numLinha).val(),		
					"numFluigItemCotacao" : $("#numSolicitacao").val(),		
					"cnpjFornecCotacao" : cnpjItem,		
					"codItemSolicitado" : $("#codItemSolicitado___"+numLinha).val(),		
					"descItemSolicitado" : $("#descItemSolicitado___"+numLinha).val(),		
					"infoComplItemSC" : $("#infoComplItemSC___"+numLinha).val(),		
					"qtdSolicitada" : $("#qtdSolicitada___"+numLinha).val(),		
					"optPossuiItem" : $("#optPossuiItem___"+numLinha).val(),	
					"itemDisponibilizado" : $("#itemDisponibilizado___"+numLinha).val(),	
					"qtdDisponibilizada" : $("#qtdDisponibilizada___"+numLinha).val(),	
					"valUnitario" : $("#valUnitario___"+numLinha).val(),	
					"freteItem" : $("#freteItem___"+numLinha).val(),	
					"descontoItem" : $("#descontoItem___"+numLinha).val(),	
					"icmsItem" : $("#icmsItem___"+numLinha).val(),	
					"ipiItem" : $("#ipiItem___"+numLinha).val(),	
					"pisItem" : $("#pisItem___"+numLinha).val(),	
					"cofinsItem" : $("#cofinsItem___"+numLinha).val(),	
					"issItem" : $("#issItem___"+numLinha).val(),	
					"inssItem" : $("#inssItem___"+numLinha).val(),	
					"irItem" : $("#irItem___"+numLinha).val(),	
					"clssItem" : $("#clssItem___"+numLinha).val(),	
					"outroImpostoVlr" : $("#outroImpostoVlr___"+numLinha).val(),	
					"totalItem" : $("#totalItem___"+numLinha).val()
				});
			}
		}
			
	}else if(opcao == false){
		console.log("entrou if false item");
		for(var z = 0; z<itensEscolhido.length;z++){
			if(itensEscolhido[z].codItemSolicitado == codItemEscolhido && itensEscolhido[z].cnpjFornecCotacao == cnpjItem){
				console.log("posicao item escolhido: "+z);
				itensEscolhido.splice(z, 1);
				z = itensEscolhido.length+1;
			}
		}
		
		//precisa verificar se existe algum item com o cnpj do item atual. Caso não exista é preciso remover o item do array de unicosCNPJ.
		
		
		
	}
	cnpjOBJ = [];
	unicosCNPJ = [];
	
	for(var i=0;i<itensEscolhido.length;i++){
		cnpjOBJ.push(itensEscolhido[i].cnpjFornecCotacao);
	}
	
	cnpjOBJ.sort(sortFunction);
	function sortFunction(a, b) {
		if (a[1] === b[1]) {
			return 0;
		}
		else {
			return (b[1] > a[1]) ? -1 : 1;
		}
	}
	
	for (var i=0; i<cnpjOBJ.length;i++){
		var contUni = 0;
		for(var y=0;y<unicosCNPJ.length;y++){
			if( cnpjOBJ[i] == unicosCNPJ[y]){
				contUni++;
			}
		}
		if(contUni == 0){
			unicosCNPJ.push( cnpjOBJ[i] );
		}
	}
	
	cnpjsEscolhidos = [];
	
	var itensSTR = JSON.stringify(itensEscolhido);
	console.log("================ ITENS ===================");
	console.log(itensSTR);
	
	//================ ADICIONANDO CABECALHO DA COTACAO ============================================
	for(var i=0;i<unicosCNPJ.length;i++){
		for(var z=0;z<tbCotacao.length;z++){
			if(unicosCNPJ[i] == $("#cnpj___"+tbCotacao[z]).val()){
				cnpjsEscolhidos.push({
					"numLinhaCotacao": $("#numLinhaCotacao___"+tbCotacao[z]).val(),
					"numFluigCotacao": $("#numFluigCotacao___"+tbCotacao[z]).val(),
					"cnpj": $("#cnpj___"+tbCotacao[z]).val(  ),
					"cotacaoFinal": $("#cotacaoFinal___"+tbCotacao[z]).val(),
					"loja": $("#loja___"+tbCotacao[z]).val(  ),
					"cep": $("#cep___"+tbCotacao[z]).val(  ),
					"estado": $("#estado___"+tbCotacao[z]).val( ),
					"bairro": $("#bairro___"+tbCotacao[z]).val( ),
					"endereco": $("#endereco___"+tbCotacao[z]).val(  ),
					"complemento": $("#complemento___"+tbCotacao[z]).val( ),
					"contato": $("#contato___"+tbCotacao[z]).val(  ),
					"telefoneFornec": $("#telefoneFornec___"+tbCotacao[z]).val( ),
					"razaoSocial": $("#razaoSocial___"+tbCotacao[z]).val(  ),
					"emailFornec": $("#emailFornec___"+tbCotacao[z]).val(  ),	
					"formaPagamento": $("#formaPagamento___"+tbCotacao[z]).val( ),
					"qtdDiasPrevEntrega": $("#qtdDiasPrevEntrega___"+tbCotacao[z]).val( ),
					"previsaoEntrega": $("#previsaoEntrega___"+tbCotacao[z]).val(  ),
					"qtdDiasPrevPagamento": $("#qtdDiasPrevPagamento___"+tbCotacao[z]).val(  ),
					"previsaoPagamento": $("#previsaoPagamento___"+tbCotacao[z]).val(  ),
					"dataCotacaoFormat": $("#dataCotacaoFormat___"+tbCotacao[z]).val(),
					"dataCotacao": $("#dataCotacao___"+tbCotacao[z]).val(),
					"anoCotacao": $("#anoCotacao___"+tbCotacao[z]).val(),
					"mesCotacao": $("#mesCotacao___"+tbCotacao[z]).val(),
					"statusCotacao" : "PENDENTE"
				});
			}
		}
	}

	
	var conteudo = JSON.stringify(cnpjsEscolhidos);
	
	console.log("================== CNPJs ===================");
	console.log(conteudo);
	
	var tbItensCotacaoCF = varreTabela("tbItensCotacaoFinal");
	var tbCotacaoCF = varreTabela("tbCotacaoFinal");

	for(var i=0;i<tbItensCotacaoCF.length;i++){
		var linhaItem = $("#excludetbItensCotacaoFinal___"+tbItensCotacaoCF[i]).parent().parent();
		linhaItem.remove();
		fnWdkRemoveChild(linhaItem);
	}
	
	for(var i=0;i<tbCotacaoCF.length;i++){
		var linhaItem = $("#excludetbCotacaoFinal___"+tbCotacaoCF[i]).parent().parent();
		linhaItem.remove();
		fnWdkRemoveChild(linhaItem);
	}
	
	var tbItensCotacaoCF = varreTabela("tbItensCotacaoFinal");
	var tbCotacaoCF = varreTabela("tbCotacaoFinal");
	
	console.log("tbCotacaoCF: "+tbCotacaoCF.length);
	console.log("tbItensCotacaoCF: "+tbItensCotacaoCF.length);
	
	var contCotacaoFinal = 0;
	var contItemCF = 0;
	for(var i=0;i<cnpjsEscolhidos.length;i++){
		var linha = wdkAddChild("tbCotacaoFinal");
		
		contCotacaoFinal++
		
		$("#numLinhaCotacaoCTF___"+linha).val(contCotacaoFinal);
		$("#numFluigCotacaoCTF___"+linha).val(cnpjsEscolhidos[i].numFluigCotacao);
		$("#cnpjCTF___"+linha).val( cnpjsEscolhidos[i].cnpj);
		$("#cotacaoFinalCTF___"+linha).val("SIM");
		$("#lojaCTF___"+linha).val( cnpjsEscolhidos[i].loja );
		$("#cepCTF___"+linha).val( cnpjsEscolhidos[i].cep );
		$("#estadoCTF___"+linha).val( cnpjsEscolhidos[i].estado );
		$("#bairroCTF___"+linha).val( cnpjsEscolhidos[i].bairro );
		$("#enderecoCTF___"+linha).val( cnpjsEscolhidos[i].endereco );
		$("#complementoCTF___"+linha).val( cnpjsEscolhidos[i].complemento );
		$("#contatoCTF___"+linha).val( cnpjsEscolhidos[i].contato );
		$("#telefoneFornecCTF___"+linha).val( cnpjsEscolhidos[i].telefoneFornec );
		$("#razaoSocialCTF___"+linha).val( cnpjsEscolhidos[i].razaoSocial );
		$("#emailFornecCTF___"+linha).val( cnpjsEscolhidos[i].emailFornec );	
		$("#totalItensCTF___"+linha).val( cnpjsEscolhidos[i].totalItens );
		$("#totalDescontosCTF___"+linha).val( cnpjsEscolhidos[i].totalDescontos );
		$("#totalImpostosCTF___"+linha).val( cnpjsEscolhidos[i].totalImpostos );
		$("#totalFreteCTF___"+linha).val( cnpjsEscolhidos[i].totalFrete );
		$("#formaPagamentoCTF___"+linha).val( cnpjsEscolhidos[i].formaPagamento );
		$("#totalCotacaoCTF___"+linha).val( cnpjsEscolhidos[i].totalCotacao );
		$("#qtdDiasPrevEntregaCTF___"+linha).val( cnpjsEscolhidos[i].qtdDiasPrevEntrega );
		$("#previsaoEntregaCTF___"+linha).val( cnpjsEscolhidos[i].previsaoEntrega );
		$("#qtdDiasPrevPagamentoCTF___"+linha).val( cnpjsEscolhidos[i].qtdDiasPrevPagamento );
		$("#previsaoPagamentoCTF___"+linha).val( cnpjsEscolhidos[i].previsaoPagamento );

		$("#dataCotacaoFormatCTF___"+linha).val(dataInvertida);
		$("#dataCotacaoCTF___"+linha).val(dataCompletaLog);
		$("#anoCotacaoCTF___"+linha).val(anoLog);
		$("#mesCotacaoCTF___"+linha).val(mes2Log);
		$("#statusCotacaoCTF___"+linha).val("PENDENTE");
		
		
		
		for(var z=0;z<itensEscolhido.length;z++){
			console.log(itensEscolhido[z].cnpjFornecCotacao+" == "+cnpjsEscolhidos[i].cnpj)
			if(itensEscolhido[z].cnpjFornecCotacao == cnpjsEscolhidos[i].cnpj){
				contItemCF++;
				var linhaItem = wdkAddChild("tbItensCotacaoFinal");
				console.log("numItem array: "+itensEscolhido[z].numItemCTF);
				$("#itemCotacaoFinalCTF___"+linhaItem).val("SIM");		
				$("#numItemCTF___"+linhaItem).val(itensEscolhido[z].numItemCTF);		
				$("#numLinhaItemCotacaoCTF___"+linhaItem).val(contItemCF);		
				$("#linhaCotacaoOriginalCTF___"+linhaItem).val(contCotacaoFinal);		
				$("#numFluigItemCotacaoCTF___"+linhaItem).val(itensEscolhido[z].numFluigItemCotacao);		
				$("#cnpjFornecCotacaoCTF___"+linhaItem).val(itensEscolhido[z].cnpjFornecCotacao);		
				$("#codItemSolicitadoCTF___"+linhaItem).val(itensEscolhido[z].codItemSolicitado);		
				$("#descItemSolicitadoCTF___"+linhaItem).val(itensEscolhido[z].descItemSolicitado);		
				$("#infoComplItemSCCTF___"+linhaItem).val(itensEscolhido[z].infoComplItemSC);		
				$("#qtdSolicitadaCTF___"+linhaItem).val(itensEscolhido[z].qtdSolicitada);		
				$("#optPossuiItemCTF___"+linhaItem).val(itensEscolhido[z].optPossuiItem);	
				
				
				$("#itemDisponibilizadoCTF___"+linhaItem).val(itensEscolhido[z].itemDisponibilizado);	
				$("#qtdDisponibilizadaCTF___"+linhaItem).val(itensEscolhido[z].qtdDisponibilizada);	
				$("#valUnitarioCTF___"+linhaItem).val(itensEscolhido[z].valUnitario);	
				$("#freteItemCTF___"+linhaItem).val(itensEscolhido[z].freteItem);	
				$("#descontoItemCTF___"+linhaItem).val(itensEscolhido[z].descontoItem);	
				$("#icmsItemCTF___"+linhaItem).val(itensEscolhido[z].icmsItem);	
				$("#ipiItemCTF___"+linhaItem).val(itensEscolhido[z].ipiItem);	
				$("#pisItemCTF___"+linhaItem).val(itensEscolhido[z].pisItem);	
				$("#cofinsItemCTF___"+linhaItem).val(itensEscolhido[z].cofinsItem);	
				
				$("#issItemCTF___"+linhaItem).val(itensEscolhido[z].issItem);	
				$("#inssItemCTF___"+linhaItem).val(itensEscolhido[z].inssItem);	
				$("#irItemCTF___"+linhaItem).val(itensEscolhido[z].irItem);	
				$("#clssItemCTF___"+linhaItem).val(itensEscolhido[z].clssItem);	
				$("#outroImpostoVlrCTF___"+linhaItem).val(itensEscolhido[z].outroImpostoVlr);	
				
				$("#totalItemCTF___"+linhaItem).val(itensEscolhido[z].totalItem);	

				FLUIGC.switcher.init("#checkPossuiItemCTF___"+linhaItem);
				if(itensEscolhido[z].optPossuiItem == "true" || itensEscolhido[z].optPossuiItem == true){
					FLUIGC.switcher.setTrue("#checkPossuiItemCTF___"+linhaItem);
					FLUIGC.switcher.isReadOnly("#checkPossuiItemCTF___"+linhaItem, true);
				}else{
					FLUIGC.switcher.setFalse("#checkPossuiItemCTF___"+linhaItem);
					FLUIGC.switcher.isReadOnly("#checkPossuiItemCTF___"+linhaItem, true);
				}
				
			}
		}
	}
	
	var tbCotacaoCF = varreTabela("tbCotacaoFinal");
	
	if(tbCotacaoCF.length>0){
		for(var i=0;i<tbCotacao.length;i++){
			$("#statusCotacao___"+tbCotacao).val("FINALIZADA");
		}
		
	}
	
	$("#possuiCotacaoFinal").val("SIM");
	
	btnTbItensCotacaoFinal();
	somaTotalCotacaoFinal();
	
	btntbCotacaoFinal();
	//btntbCotacao();
	
	somaTotalFornecedorFinal();

}

function pesquisaItemEscolhido(){
	
	var tbItensCotacao = varreTabela("tbItensCotacao");
	var existeItem = 0;
	var posicaoItem = 0;
		
	//for(var i=0;i<){
		
		
	//}
	
}


function carregaBtnPossuiItem(){
	console.log("entrou carregaBtnPossuiItem");
	
	var tbItensCotacao = varreTabela("tbItensCotacao");
	var numAtividade = $("#numAtividade").val();
	

	for (var i = 0; i < tbItensCotacao.length; i++) {
		var opt = $("#optPossuiItem___"+tbItensCotacao[i]).val();
		console.log("VALOR OPT "+tbItensCotacao[i]+" : "+opt);
		if(opt == "true" || opt == true){
			console.log("entrou opt == true");
			FLUIGC.switcher.setTrue("#checkPossuiItem___"+tbItensCotacao[i]);
		}else if(opt == "false" || opt == false){
			console.log("entrou opt == false - #checkPossuiItem___"+tbItensCotacao[i]);
			FLUIGC.switcher.setFalse("#checkPossuiItem___"+tbItensCotacao[i]);
		}
		FLUIGC.switcher.isReadOnly("#checkPossuiItem___"+tbItensCotacao[i], true);	
	}
	//console.log("fim carregaBtnPossuiItem");
	
	
}

function carregaBtnEscolhaItem(){
	console.log("entrou carregaBtnEscolhaItem");
	
	var tbItensCotacao = varreTabela("tbItensCotacao");
	var numAtividade = $("#numAtividade").val();
	

	for (var i = 0; i < tbItensCotacao.length; i++) {
		var opt = $("#optEscolheItem___"+tbItensCotacao[i]).val();
		console.log("VALOR OPT "+tbItensCotacao[i]+" : "+opt);
		if(opt == "true" || opt == true){
			console.log("entrou opt == true");
			FLUIGC.switcher.setTrue("#checkEscolheItem___"+tbItensCotacao[i]);
		}else if(opt == "false" || opt == false){
			console.log("entrou opt == false - #checkEscolheItem___"+tbItensCotacao[i]);
			FLUIGC.switcher.setFalse("#checkEscolheItem___"+tbItensCotacao[i]);
		}
		FLUIGC.switcher.isReadOnly("#checkEscolheItem___"+tbItensCotacao[i], false);	
	}
	//console.log("fim carregaBtnPossuiItem");
	
	
}

function carregaBtnPossuiItemFinal(){
	//console.log("entrou carregaBtnPossuiItem");
	
	var tbItensCotacao = varreTabela("tbItensCotacaoFinal");
	var numAtividade = $("#numAtividade").val();
	

	for (var i = 0; i < tbItensCotacao.length; i++) {
		var opt = $("#optPossuiItemCTF___"+tbItensCotacao[i]).val();
		if(opt == "true"){
			FLUIGC.switcher.setTrue("#checkPossuiItemCTF___"+tbItensCotacao[i]);
		}else if(opt == "false"){
			FLUIGC.switcher.setFalse("#checkPossuiItemCTF___"+tbItensCotacao[i]);
		}else{
			FLUIGC.switcher.setTrue("#checkPossuiItemCTF___"+tbItensCotacao[i]);
		}
	}
	//console.log("fim carregaBtnPossuiItem");
	
	
}

function btnTbItensCotacao(){
	//console.log("entrou btnTbItensCotacao");
	
	var tbItensCotacao = varreTabela("tbItensCotacao");
	var numAtividade = $("#numAtividade").val();
	

	for (var i = 0; i < tbItensCotacao.length; i++) {
		var elemento = $("#acoesItensCotacao___" + tbItensCotacao[i]).prev();
		
		
		var dados = "<div class='btn-group'>" +
						"<button type='button' class='btn btn-info' onclick='editaItemCotacao(this.id)' id='btnEdita___" + tbItensCotacao[i]+"'>Editar</button>"+
					"</div>";
		
		var somenteLeitura = "<div class='btn-group'>" +
								"<button type='button' class='btn btn-info' onclick='visualizaItemCotacao(this.id)' id='btnDetalhesItem___" + tbItensCotacao[i]+"' >Visualizar</button>"+
							"</div>";
		
		$(elemento).html("");
		if(numAtividade == "0" || numAtividade == "4" || numAtividade == "") {
			$(elemento).append(dados);
		}if(numAtividade == "10") {
			$(elemento).append(dados);
		}else{
			$(elemento).append(somenteLeitura);
		}
		var optPossuiItem = $("#optPossuiItem___"+tbItensCotacao[i]).val();
	
		if(optPossuiItem == "true"){
			$("#btnEdita___"+tbItensCotacao[i]).removeAttr("disabled");
		}else{
			$("#btnEdita___"+tbItensCotacao[i]).attr("disabled","disabled");
		}
	}
	
	//console.log("final btnTbItensCotacao");
	
}

function btnTbItensCotacaoFinal(){
	//console.log("entrou btnTbItensCotacao");
	
	var tbItensCotacao = varreTabela("tbItensCotacaoFinal");
	var numAtividade = $("#numAtividade").val();
	

	for (var i = 0; i < tbItensCotacao.length; i++) {
		var elemento = $("#acoesItensCotacaoCTF___" + tbItensCotacao[i]).prev();
		
		
		var dados = "<div class='btn-group'>" +
						"<button type='button' class='btn btn-info' onclick='editaItemCotacaoFinal(this.id)' id='btnEditaCTF___" + tbItensCotacao[i]+"'>Editar</button>"+
					"</div>";
		
		var somenteLeitura = "<div class='btn-group'>" +
								"<button type='button' class='btn btn-info' onclick='visualizaItemCotacaoFinal(this.id)' id='btnDetalhesItemCTF___" + tbItensCotacao[i]+"' >Visualizar</button>"+
							"</div>";
		
		$(elemento).html("");
		if(numAtividade == "0" || numAtividade == "4" || numAtividade == "") {
			$(elemento).append(dados);
		}if(numAtividade == "10") {
			$(elemento).append(dados);
		}else{
			$(elemento).append(somenteLeitura);
		}
		var optPossuiItem = $("#optPossuiItemCTF___"+tbItensCotacao[i]).val();
	
		if(optPossuiItem == "true"){
			$("#btnEditaCTF___"+tbItensCotacao[i]).removeAttr("disabled");
		}else{
			$("#btnEditaCTF___"+tbItensCotacao[i]).attr("disabled","disabled");
		}
	}
	
	//console.log("final btnTbItensCotacao");
	
}

function editaItemCotacao(idCampo){
	console.log(">>>>>>>>> entrou editaItemCotacao");
	var temp = idCampo.split("___");
	var numLinha = temp[1];
	
	$("#divDetalhesItemCotacao").show();
	
	$("#numLinhaItemCT").val( numLinha );
	
	$("#descItemCT").val( $("#descItemSolicitado___"+numLinha).val() );
	$("#codItemCT").val( $("#codItemSolicitado___"+numLinha).val() );
	$("#itemDisponibilizadoCT").val( $("#itemDisponibilizado___"+numLinha).val() );
	$("#qtdSolicitadaCT").val( $("#qtdSolicitada___"+numLinha).val() );
	$("#qtdDisponibilizadaCT").val( $("#qtdDisponibilizada___"+numLinha).val() );
	$("#infoComplItemSCCT").val( $("#infoComplItemSC___"+numLinha).val() );
	$("#infoComplItemFornecCT").val( $("#infoComplItemFornec___"+numLinha).val() );
	$("#outroImpostoDescCT").val( $("#outroImpostoDesc___"+numLinha).val() );
	
	$("#btnSaveItem").show();
	
	//===========================================================================================================
	var valUnitarioCT = $("#valUnitario___"+numLinha).val();
	console.log("valUnitarioCT antes unmasked: "+valUnitarioCT);
	if(valUnitarioCT != ""){
		var valUnitarioCT2 = $("#valUnitario___"+numLinha).maskMoney('unmasked')[0];
		console.log("valUnitarioCT após unmasked: "+valUnitarioCT2);
		var valUnitario = parseFloat(valUnitarioCT2);
		console.log("valUnitarioCT após parseFloat: "+valUnitario);
		var valUnitarioFormatado = valUnitario.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
		console.log("valUnitarioFormatado: "+valUnitarioFormatado);
	}else{
		var valUnitario = 0.00;
		var valUnitarioFormatado = valUnitario.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#valUnitarioCT").val( valUnitarioFormatado );
	
	//===========================================================================================================
	var freteItemCT = $("#freteItem___"+numLinha).val();
	if(freteItemCT != ""){
		var freteItem = parseFloat(freteItemCT);
		var freteFormatado = freteItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var freteItem = 0.00;
		var freteFormatado = freteItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#freteItemCT").val( freteFormatado );
	
	//===========================================================================================================	
	var descontoItemCT = $("#descontoItem___"+numLinha).val();
	if(descontoItemCT != ""){
		var descontoItem = parseFloat(descontoItemCT);
		var descontoFormatado = descontoItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var descontoItem = 0.00;
		var descontoFormatado = descontoItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#descontoItemCT").val( descontoFormatado );
	
	//===========================================================================================================
	var icmsItemCT = $("#icmsItem___"+numLinha).val();
	if(icmsItemCT != ""){
		var icmsItem = parseFloat(icmsItemCT);
		var icmsItemFormatado = icmsItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var icmsItem = 0.00;
		var icmsItemFormatado = icmsItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#icmsItemCT").val( icmsItemFormatado );
	
	//===========================================================================================================
	var ipiItemCT = $("#ipiItem___"+numLinha).val();
	if(ipiItemCT != ""){
		var ipiItem = parseFloat(ipiItemCT);
		var ipiFormatado = ipiItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var ipiItem = 0.00;
		var ipiFormatado = ipiItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#ipiItemCT").val( ipiFormatado );
	
	//===========================================================================================================
	var pisItemCT = $("#pisItem___"+numLinha).val();
	if(pisItemCT != ""){
		var pisItem = parseFloat(pisItemCT);
		var pisFormatado = pisItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var pisItem = 0.00;
		var pisFormatado = pisItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}	
	$("#pisItemCT").val( pisFormatado );
	
	//===========================================================================================================
	var cofinsItemCT = $("#cofinsItem___"+numLinha).val();
	if(cofinsItemCT != ""){
		var cofinsItem = parseFloat(cofinsItemCT);
		var cofinsFormatado = cofinsItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var cofinsItem = 0.00;
		var cofinsFormatado = cofinsItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}		
	$("#cofinsItemCT").val( cofinsFormatado );
	
	//===========================================================================================================
	var issItemCT = $("#issItem___"+numLinha).val();
	if(issItemCT != ""){
		var issItem = parseFloat(issItemCT);
		var issFormatado = issItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var issItem = 0.00;
		var issFormatado = issItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}		
	$("#issItemCT").val( issFormatado );
	
	//===========================================================================================================
	var inssItemCT = $("#inssItem___"+numLinha).val();
	if(inssItemCT != ""){
		var inssItem = parseFloat(inssItemCT);
		var inssFormatado = inssItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var inssItem = 0.00;
		var inssFormatado = inssItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}		
	$("#inssItemCT").val( inssFormatado );
	
	//===========================================================================================================
	var irItemCT = $("#irItem___"+numLinha).val();
	if(irItemCT != ""){
		var irItem = parseFloat(irItemCT);
		var irFormatado = irItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var irItem = 0.00;
		var irFormatado = irItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}		
	$("#irItemCT").val( irFormatado );
	
	//===========================================================================================================
	var csllItemCT = $("#csllItem___"+numLinha).val();
	if(csllItemCT != ""){
		var csllItem = parseFloat(csllItemCT);
		var csllFormatado = csllItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var csllItem = 0.00;
		var csllFormatado = csllItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}		
	$("#csllItemCT").val( csllFormatado );

	//===========================================================================================================
	var outroImpostoVlrCT = $("#outroImpostoVlr___"+numLinha).val();
	if(outroImpostoVlrCT != ""){
		var outroImpostoVlr = parseFloat(outroImpostoVlrCT);
		var outroImpostoVlrFormatado = outroImpostoVlr.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var outroImpostoVlr = 0.00;
		var outroImpostoVlrFormatado = outroImpostoVlr.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}		
	$("#outroImpostoVlrCT").val( outroImpostoVlrFormatado );
	
	//===========================================================================================================
	var totalItemCT = $("#totalItem___"+numLinha).val();
	//console.log("totalItemCT: "+totalItemCT);
	if(totalItemCT != ""){
		var totalItemCT = $("#totalItem___"+numLinha).maskMoney('unmasked')[0];
		//console.log("totalItemCT unmasked: "+totalItemCT);
		var totalItem = parseFloat(totalItemCT);
		var totalItemFormatado = totalItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var totalItem = 0.00;
		var totalItemFormatado = totalItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}	
	$("#totalItemCT").val( totalItemFormatado );

	
}

function editaItemCotacaoFinal(idCampo){
	//console.log("entrou editaItemCotacao");
	var temp = idCampo.split("___");
	var numLinha = temp[1];
	
	$("#divDetalhesItemCotacao").show();
	
	$("#numLinhaItemCT").val( numLinha );
	
	$("#descItemCT").val( $("#descItemSolicitadoCTF___"+numLinha).val() );
	$("#codItemCT").val( $("#codItemSolicitadoCTF___"+numLinha).val() );
	$("#itemDisponibilizadoCT").val( $("#itemDisponibilizadoCTF___"+numLinha).val() );
	$("#qtdSolicitadaCT").val( $("#qtdSolicitadaCTF___"+numLinha).val() );
	$("#qtdDisponibilizadaCT").val( $("#qtdDisponibilizadaCTF___"+numLinha).val() );
	$("#infoComplItemSCCT").val( $("#infoComplItemSCCTF___"+numLinha).val() );
	$("#infoComplItemFornecCT").val( $("#infoComplItemFornecCTF___"+numLinha).val() );
	$("#outroImpostoDescCT").val( $("#outroImpostoDesc___"+numLinha).val() );
		
	
	$("#btnSaveItem").show();
	
	//===========================================================================================================
	var valUnitarioCT = $("#valUnitarioCTF___"+numLinha).val();
	if(valUnitarioCT != ""){
		var valUnitarioCT = $("#valUnitarioCT").maskMoney('unmasked')[0];
		var valUnitario = parseFloat(valUnitarioCT);
		var valUnitarioFormatado = valUnitario.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var valUnitario = 0.00;
		var valUnitarioFormatado = valUnitario.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#valUnitarioCT").val( valUnitarioFormatado );
	
	//===========================================================================================================
	var freteItemCT = $("#freteItemCTF___"+numLinha).val();
	if(freteItemCT != ""){
		var freteItem = parseFloat(freteItemCT);
		var freteFormatado = freteItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var freteItem = 0.00;
		var freteFormatado = freteItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#freteItemCT").val( freteFormatado );
	
	//===========================================================================================================	
	var descontoItemCT = $("#descontoItemCTF___"+numLinha).val();
	if(descontoItemCT != ""){
		var descontoItem = parseFloat(descontoItemCT);
		var descontoFormatado = descontoItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var descontoItem = 0.00;
		var descontoFormatado = descontoItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#descontoItemCT").val( descontoFormatado );
	
	//===========================================================================================================
	var icmsItemCT = $("#icmsItemCTF___"+numLinha).val();
	if(icmsItemCT != ""){
		var icmsItem = parseFloat(icmsItemCT);
		var icmsItemFormatado = icmsItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var icmsItem = 0.00;
		var icmsItemFormatado = icmsItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#icmsItemCT").val( icmsItemFormatado );
	
	//===========================================================================================================
	var ipiItemCT = $("#ipiItemCTF___"+numLinha).val();
	if(ipiItemCT != ""){
		var ipiItem = parseFloat(ipiItemCT);
		var ipiFormatado = ipiItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var ipiItem = 0.00;
		var ipiFormatado = ipiItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#ipiItemCT").val( ipiFormatado );
	
	//===========================================================================================================
	var pisItemCT = $("#pisItemCTF___"+numLinha).val();
	if(pisItemCT != ""){
		var pisItem = parseFloat(pisItemCT);
		var pisFormatado = pisItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var pisItem = 0.00;
		var pisFormatado = pisItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}	
	$("#pisItemCT").val( pisFormatado );
	
	//===========================================================================================================
	var cofinsItemCT = $("#cofinsItemCTF___"+numLinha).val();
	if(cofinsItemCT != ""){
		var cofinsItem = parseFloat(cofinsItemCT);
		var cofinsFormatado = cofinsItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var cofinsItem = 0.00;
		var cofinsFormatado = cofinsItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}		
	$("#cofinsItemCT").val( cofinsFormatado );
	
	//===========================================================================================================
	var issItemCT = $("#issItemCTF___"+numLinha).val();
	if(issItemCT != ""){
		var issItem = parseFloat(issItemCT);
		var issFormatado = issItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var issItem = 0.00;
		var issFormatado = issItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}		
	$("#issItemCT").val( issFormatado );
	
	//===========================================================================================================
	var inssItemCT = $("#inssItemCTF___"+numLinha).val();
	if(inssItemCT != ""){
		var inssItem = parseFloat(inssItemCT);
		var inssFormatado = inssItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var inssItem = 0.00;
		var inssFormatado = inssItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}		
	$("#inssItemCT").val( inssFormatado );
	
	//===========================================================================================================
	var irItemCT = $("#irItemCTF___"+numLinha).val();
	if(irItemCT != ""){
		var irItem = parseFloat(irItemCT);
		var irFormatado = irItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var irItem = 0.00;
		var irFormatado = irItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}		
	$("#irItemCT").val( irFormatado );
	
	//===========================================================================================================
	var csllItemCT = $("#csllItemCTF___"+numLinha).val();
	if(csllItemCT != ""){
		var csllItem = parseFloat(csllItemCT);
		var csllFormatado = csllItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var csllItem = 0.00;
		var csllFormatado = csllItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}		
	$("#csllItemCT").val( csllFormatado );
	
	//===========================================================================================================
	var outroImpostoVlrCT = $("#outroImpostoVlrCTF___"+numLinha).val();
	if(outroImpostoVlrCT != ""){
		var outroImpostoVlr = parseFloat(outroImpostoVlrCT);
		var outroImpostoVlrFormatado = outroImpostoVlr.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var outroImpostoVlr = 0.00;
		var outroImpostoVlrFormatado = outroImpostoVlr.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}		
	$("#outroImpostoVlrCT").val( outroImpostoVlrFormatado );
	
	//===========================================================================================================
	var totalItemCT = $("#totalItemCTF___"+numLinha).val();
	//console.log("totalItemCT: "+totalItemCT);
	if(totalItemCT != ""){
		var totalItemCT = $("#totalItemCTF___"+numLinha).maskMoney('unmasked')[0];
		//console.log("totalItemCT unmasked: "+totalItemCT);
		var totalItem = parseFloat(totalItemCT);
		var totalItemFormatado = totalItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var totalItem = 0.00;
		var totalItemFormatado = totalItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}	
	$("#totalItemCT").val( totalItemFormatado );

	
}

function salvaItemCotacao(){
	console.log("entrou salvaItemCotacao");
	
	
	//var contErro = validatbCotacao();
	var numLinha = $("#numLinhaItemCT").val();
	
	console.log("SALVANDO ITEM COTACAO LINHA: "+numLinha);
	
	$("#descItemSolicitado___"+numLinha).val( $("#descItemCT").val());
	$("#codItemSolicitado___"+numLinha).val($("#codItemCT").val() );
	$("#itemDisponibilizado___"+numLinha).val($("#itemDisponibilizadoCT").val() );
	$("#qtdSolicitada___"+numLinha).val($("#qtdSolicitadaCT").val() );
	$("#qtdDisponibilizada___"+numLinha).val($("#qtdDisponibilizadaCT").val() );
	
	
	$("#infoComplItemSC___"+numLinha).val( $("#infoComplItemSCCT").val() );
	$("#infoComplItemFornec___"+numLinha).val( $("#infoComplItemFornecCT").val() );
	$("#outroImpostoDesc___"+numLinha).val( $("#outroImpostoDescCT").val() );
	
	
	if($("#valUnitarioCT").val() != ""){
		var valUnitarioCT = $("#valUnitarioCT").maskMoney('unmasked')[0];
		var valUnitario = parseFloat(valUnitarioCT); 
		$("#valUnitario___"+numLinha).val(valUnitario.toFixed(2));
	}else{
		$("#valUnitario___"+numLinha).val("0.00");
	}
	
	if($("#freteItemCT").val() != ""){
		var freteItemCT = $("#freteItemCT").maskMoney('unmasked')[0];
		var freteItem = parseFloat(freteItemCT); 
		$("#freteItem___"+numLinha).val(freteItem.toFixed(2));
	}else{
		$("#freteItem___"+numLinha).val("0.00");
	}
	
	if($("#descontoItemCT").val() != ""){
		var descontoItemCT = $("#descontoItemCT").maskMoney('unmasked')[0];
		var descontoItem = parseFloat(descontoItemCT); 
		$("#descontoItem___"+numLinha).val(descontoItem.toFixed(2));
	}else{
		$("#descontoItem___"+numLinha).val("0.00");
	}
	
	if($("#icmsItemCT").val() != ""){
		var icmsItemCT = $("#icmsItemCT").maskMoney('unmasked')[0];
		var icmsItem = parseFloat(icmsItemCT); 
		$("#icmsItem___"+numLinha).val(icmsItem.toFixed(2));
	}else{
		$("#icmsItem___"+numLinha).val("0.00");
	}

	if($("#ipiItemCT").val() != ""){
		var ipiItemCT = $("#ipiItemCT").maskMoney('unmasked')[0];
		var ipiItem = parseFloat(ipiItemCT); 
		$("#ipiItem___"+numLinha).val(ipiItem.toFixed(2));
	}else{
		$("#ipiItem___"+numLinha).val("0.00");
	}
	
	if($("#pisItemCT").val() != ""){
		var pisItemCT = $("#pisItemCT").maskMoney('unmasked')[0];
		var pisItem = parseFloat(pisItemCT); 
		$("#pisItem___"+numLinha).val(pisItem.toFixed(2));
	}else{
		$("#pisItem___"+numLinha).val("0.00");
	}

	if($("#cofinsItemCT").val() != ""){
		var cofinsItemCT = $("#cofinsItemCT").maskMoney('unmasked')[0];
		var cofinsItem = parseFloat(cofinsItemCT); 
		$("#cofinsItem___"+numLinha).val(cofinsItem.toFixed(2));
	}else{
		$("#cofinsItem___"+numLinha).val("0.00");
	}
	
	if($("#issItemCT").val() != ""){
		var issItemCT = $("#issItemCT").maskMoney('unmasked')[0];
		var issItem = parseFloat(issItemCT); 
		$("#issItem___"+numLinha).val(issItem.toFixed(2));
	}else{
		$("#issItem___"+numLinha).val("0.00");
	}
	
	if($("#inssItemCT").val() != ""){
		var inssItemCT = $("#inssItemCT").maskMoney('unmasked')[0];
		var inssItem = parseFloat(inssItemCT); 
		$("#inssItem___"+numLinha).val(inssItem.toFixed(2));
	}else{
		$("#inssItem___"+numLinha).val("0.00");
	}
	
	if($("#irItemCT").val() != ""){
		var irItemCT = $("#irItemCT").maskMoney('unmasked')[0];
		var irItem = parseFloat(irItemCT); 
		$("#irItem___"+numLinha).val(irItem.toFixed(2));
	}else{
		$("#irItem___"+numLinha).val("0.00");
	}
	
	if($("#csllItemCT").val() != ""){
		var csllItemCT = $("#csllItemCT").maskMoney('unmasked')[0];
		var csllItem = parseFloat(csllItemCT); 
		$("#csllItem___"+numLinha).val(csllItem.toFixed(2));
	}else{
		$("#csllItem___"+numLinha).val("0.00");
	}
	
	if($("#outroImpostoVlrItemCT").val() != ""){
		var outroImpostoVlrItemCT = $("#outroImpostoVlrItemCT").maskMoney('unmasked')[0];
		var outroImpostoVlrItem = parseFloat(outroImpostoVlrItemCT); 
		$("#outroImpostoVlrItem___"+numLinha).val(outroImpostoVlrItem.toFixed(2));
	}else{
		$("#outroImpostoVlrItem___"+numLinha).val("0.00");
	}
	
	if($("#totalItemCT").val() != ""){
		var totalItemCT = $("#totalItemCT").maskMoney('unmasked')[0];
		var totalItem = parseFloat(totalItemCT); 
		$("#totalItem___"+numLinha).val(totalItem.toFixed(2));
	}else{
		$("#totalItem___"+numLinha).val("0.00");
	}
	
	$("#divDetalhesItemCotacao").hide();
	//console.log("fim salvaItemCotacao e antes de chamar funcao de somaTotalCotacao");
	
	var linhaCotacaoOriginal = $("#linhaCotacaoOriginal___"+numLinha).val();
	var cnpjFornecCotacao = $("#cnpjFornecCotacao___"+numLinha).val();
	
	console.log("ANTES CHAMADA somaTotalCotacao");
	console.log("linhaCotacaoOriginal: "+linhaCotacaoOriginal);
	console.log("cnpjFornecCotacao: "+cnpjFornecCotacao);
	
	
	somaTotalCotacao(linhaCotacaoOriginal,cnpjFornecCotacao );
	
	//$("#divDetalhesItemCotacao").hide();
	
}

function salvaItemCotacaoFinal(){
	//console.log("entrou salvaItemCotacao");
	
	
	//var contErro = validatbCotacao();
	var numLinha = $("#numLinhaItemCT").val();
	
	$("#descItemSolicitadoCTF___"+numLinha).val( $("#descItemCT").val());
	$("#codItemSolicitadoCTF___"+numLinha).val($("#codItemCT").val() );
	$("#itemDisponibilizadoCTF___"+numLinha).val($("#itemDisponibilizadoCT").val() );
	$("#qtdSolicitadaCTF___"+numLinha).val($("#qtdSolicitadaCT").val() );
	$("#qtdDisponibilizadaCTF___"+numLinha).val($("#qtdDisponibilizadaCT").val() );
	
	
	$("#infoComplItemSCCTF___"+numLinha).val( $("#infoComplItemSCCT").val() );
	$("#infoComplItemFornecCTF___"+numLinha).val( $("#infoComplItemFornecCT").val() );
	$("#outroImpostoDescCTF___"+numLinha).val( $("#outroImpostoDescCT").val() );
	
	
	if($("#valUnitarioCT").val() != ""){
		var valUnitarioCT = $("#valUnitarioCT").maskMoney('unmasked')[0];
		var valUnitario = parseFloat(valUnitarioCT); 
		$("#valUnitarioCTF___"+numLinha).val(valUnitario.toFixed(2));
	}else{
		$("#valUnitarioCTF___"+numLinha).val("0.00");
	}
	
	if($("#freteItemCT").val() != ""){
		var freteItemCT = $("#freteItemCT").maskMoney('unmasked')[0];
		var freteItem = parseFloat(freteItemCT); 
		$("#freteItemCTF___"+numLinha).val(freteItem.toFixed(2));
	}else{
		$("#freteItemCTF___"+numLinha).val("0.00");
	}
	
	if($("#descontoItemCT").val() != ""){
		var descontoItemCT = $("#descontoItemCT").maskMoney('unmasked')[0];
		var descontoItem = parseFloat(descontoItemCT); 
		$("#descontoItemCTF___"+numLinha).val(descontoItem.toFixed(2));
	}else{
		$("#descontoItemCTF___"+numLinha).val("0.00");
	}
	
	if($("#icmsItemCT").val() != ""){
		var icmsItemCT = $("#icmsItemCT").maskMoney('unmasked')[0];
		var icmsItem = parseFloat(icmsItemCT); 
		$("#icmsItemCTF___"+numLinha).val(icmsItem.toFixed(2));
	}else{
		$("#icmsItemCTF___"+numLinha).val("0.00");
	}

	if($("#ipiItemCT").val() != ""){
		var ipiItemCT = $("#ipiItemCT").maskMoney('unmasked')[0];
		var ipiItem = parseFloat(ipiItemCT); 
		$("#ipiItemCTF___"+numLinha).val(ipiItem.toFixed(2));
	}else{
		$("#ipiItemCTF___"+numLinha).val("0.00");
	}
	
	if($("#pisItemCT").val() != ""){
		var pisItemCT = $("#pisItemCT").maskMoney('unmasked')[0];
		var pisItem = parseFloat(pisItemCT); 
		$("#pisItemCTF___"+numLinha).val(pisItem.toFixed(2));
	}else{
		$("#pisItemCTF___"+numLinha).val("0.00");
	}

	if($("#cofinsItemCT").val() != ""){
		var cofinsItemCT = $("#cofinsItemCT").maskMoney('unmasked')[0];
		var cofinsItem = parseFloat(cofinsItemCT); 
		$("#cofinsItemCTF___"+numLinha).val(cofinsItem.toFixed(2));
	}else{
		$("#cofinsItemCTF___"+numLinha).val("0.00");
	}
	
	if($("#issItemCT").val() != ""){
		var issItemCT = $("#issItemCT").maskMoney('unmasked')[0];
		var issItem = parseFloat(issItemCT); 
		$("#issItemCTF___"+numLinha).val(issItem.toFixed(2));
	}else{
		$("#issItemCTF___"+numLinha).val("0.00");
	}
	
	if($("#inssItemCT").val() != ""){
		var inssItemCT = $("#inssItemCT").maskMoney('unmasked')[0];
		var inssItem = parseFloat(inssItemCT); 
		$("#inssItemCTF___"+numLinha).val(inssItem.toFixed(2));
	}else{
		$("#inssItemCTF___"+numLinha).val("0.00");
	}
	
	if($("#irItemCT").val() != ""){
		var irItemCT = $("#irItemCT").maskMoney('unmasked')[0];
		var irItem = parseFloat(irItemCT); 
		$("#irItemCTF___"+numLinha).val(irItem.toFixed(2));
	}else{
		$("#irItemCTF___"+numLinha).val("0.00");
	}
	
	if($("#csllItemCT").val() != ""){
		var csllItemCT = $("#csllItemCT").maskMoney('unmasked')[0];
		var csllItem = parseFloat(csllItemCT); 
		$("#csllItemCTF___"+numLinha).val(csllItem.toFixed(2));
	}else{
		$("#csllItemCTF___"+numLinha).val("0.00");
	}
	
	if($("#outroImpostoVlrItemCT").val() != ""){
		var outroImpostoVlrItemCT = $("#outroImpostoVlrItemCT").maskMoney('unmasked')[0];
		var outroImpostoVlrItem = parseFloat(outroImpostoVlrItemCT); 
		$("#outroImpostoVlrItemCTF___"+numLinha).val(outroImpostoVlrItem.toFixed(2));
	}else{
		$("#outroImpostoVlrItemCTF___"+numLinha).val("0.00");
	}
	
	if($("#totalItemCT").val() != ""){
		var totalItemCT = $("#totalItemCT").maskMoney('unmasked')[0];
		var totalItem = parseFloat(totalItemCT); 
		$("#totalItemCTF___"+numLinha).val(totalItem.toFixed(2));
	}else{
		$("#totalItemCTF___"+numLinha).val("0.00");
	}
	
	$("#divDetalhesItemCotacao").hide();
	//console.log("fim salvaItemCotacao e antes de chamar funcao de somaTotalCotacao");
	
	//somaTotalCotacaoFinal();
	
	//$("#divDetalhesItemCotacao").hide();
	
}

//##################################################################################
//				FUNÇÃO QUE FORMATA VALOR PARA DECIMAL
//##################################################################################
function formataDecimal(src){
	//console.log("entrou formataDecimal: "+src.value);
	
	var val = src.value
	
	while(val.indexOf('.') != -1)  {
		val = val.replace('.','');  
	}
	return val;
	
}

function formataInt(idCampo){
	//console.log("entrou formataInt");	
	if($("#"+idCampo).val() != ""){
		var campo = $("#"+idCampo).val();
		if(campo.indexOf('.') != -1){
			while(campo.indexOf('.') != -1)  {
				campo = campo.replace('.','');  
			}
		}
		
		var retorno = parseInt(campo);
		const options = { minimumFractionDigits: 0, maximumFractionDigits: 3 }
		const formatNumber = new Intl.NumberFormat('pt-BR', options)
		 
		let number = retorno;
		retorno = formatNumber.format(number);

		$("#"+idCampo).val(retorno);
	}
	
}

function calculaTotalItem(){
	//console.log("entrou calculaTotalItem");	
	
	
	if($("#qtdDisponibilizadaCT").val() != ""){
		var qtdDisponibilizadaCT = $("#qtdDisponibilizadaCT").val();
		if(qtdDisponibilizadaCT.indexOf('.') != -1){
			while(qtdDisponibilizadaCT.indexOf('.') != -1)  {
				qtdDisponibilizadaCT = qtdDisponibilizadaCT.replace('.','');  
			}
		}
		var qtdDisponibilizada = parseFloat(qtdDisponibilizadaCT);
		//console.log("qtdDisponibilizada Float: "+qtdDisponibilizada);
	}else{
		var qtdDisponibilizada = 0.00;
	}
	
	if($("#valUnitarioCT").val() != ""){
		var valUnitarioCT = $("#valUnitarioCT").maskMoney('unmasked')[0];
		var valUnitario = parseFloat(valUnitarioCT); 
		////console.log("valUnitarioCT: "+valUnitarioCT);
	}else{
		var valUnitarioCT = 0.00;
	}
	
	if($("#freteItemCT").val() != ""){
		var freteItemCT = $("#freteItemCT").maskMoney('unmasked')[0];
		var freteItem = parseFloat(freteItemCT); 
		////console.log("freteItemCT: "+freteItemCT);
	}else{
		var freteItem = 0.00;
	}
	

	if($("#icmsItemCT").val() != ""){
		var icmsItemCT = $("#icmsItemCT").maskMoney('unmasked')[0];
		var icmsItem = parseFloat(icmsItemCT); 
		////console.log("icmsItemCT: "+icmsItemCT);
	}else{
		var icmsItem = 0.00;
	}

	if($("#ipiItemCT").val() != ""){
		var ipiItemCT = $("#ipiItemCT").maskMoney('unmasked')[0];
		var ipiItem = parseFloat(ipiItemCT); 
		////console.log("ipiItemCT: "+ipiItemCT);
	}else{
		var ipiItem = 0.00;
	}

	if($("#pisItemCT").val() != ""){
		var pisItemCT = $("#pisItemCT").maskMoney('unmasked')[0];
		var pisItem = parseFloat(pisItemCT); 
		////console.log("pisItemCT: "+pisItemCT);
	}else{
		var pisItem = 0.00;
	}

	if($("#cofinsItemCT").val() != ""){
		var cofinsItemCT = $("#cofinsItemCT").maskMoney('unmasked')[0];
		var cofinsItem = parseFloat(cofinsItemCT); 
		////console.log("cofinsItemCT: "+cofinsItemCT);
	}else{
		var cofinsItem = 0.00;
	}
	
	
	if($("#issItemCT").val() != ""){
		var issItemCT = $("#issItemCT").maskMoney('unmasked')[0];
		var issItem = parseFloat(issItemCT); 
	}else{
		var issItem = 0.00;
	}
	
	if($("#inssItemCT").val() != ""){
		var inssItemCT = $("#inssItemCT").maskMoney('unmasked')[0];
		var inssItem = parseFloat(inssItemCT); 
		////console.log("cofinsItemCT: "+cofinsItemCT);
	}else{
		var inssItem = 0.00;
	}
	
	if($("#irItemCT").val() != ""){
		var irItemCT = $("#irItemCT").maskMoney('unmasked')[0];
		var irItem = parseFloat(irItemCT); 
		////console.log("cofinsItemCT: "+cofinsItemCT);
	}else{
		var irItem = 0.00;
	}
	
	if($("#csllItemCT").val() != ""){
		var csllItemCT = $("#csllItemCT").maskMoney('unmasked')[0];
		var csllItem = parseFloat(csllItemCT); 
	}else{
		var csllItem = 0.00;
	}
	
	if($("#outroImpostoVlrCT").val() != ""){
		var outroImpostoVlrCT = $("#outroImpostoVlrCT").maskMoney('unmasked')[0];
		var outroImpostoVlr = parseFloat(outroImpostoVlrCT); 
		////console.log("cofinsItemCT: "+cofinsItemCT);
	}else{
		var outroImpostoVlr = 0.00;
	}
		
	if($("#descontoItemCT").val() != ""){
		var descontoItemCT = $("#descontoItemCT").maskMoney('unmasked')[0];
		var descontoItem = parseFloat(descontoItemCT); 
		////console.log("descontoItemCT: "+descontoItemCT);
	}else{
		var descontoItem = 0.00;
	}

	
	if(qtdDisponibilizadaCT != "" && valUnitarioCT != ""){
		//console.log("==============================================");
		//console.log("CALCULANDO TOTAL:");
		
		//console.log("qtdDisponibilizada: "+qtdDisponibilizada);
		////console.log("valUnitario: "+valUnitario);
		////console.log("freteItem: "+freteItem);
		////console.log("icmsItem: "+icmsItem);
		////console.log("ipiItem: "+ipiItem);
		////console.log("pisItem: "+pisItem);
		////console.log("cofinsItem: "+cofinsItem);
		////console.log("descontoItem: "+descontoItem);
		
		////console.log("qtdDisponibilizada * valUnitario: "+qtdDisponibilizada * valUnitario);
		
		
		
		var total = (qtdDisponibilizada * valUnitario)+(freteItem + icmsItem + ipiItem + pisItem + cofinsItem + issItem + inssItem + irItem + csllItem + outroImpostoVlr)-descontoItem;
		total = total.toFixed(2);
		////console.log("TOTAL: "+total);
		
		var atual = parseFloat(total);
		//$("#totalItemCT").val(total.toFixed(2));
		//$("#totalItemCT").maskMoney();
		var totalFormatado = atual.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
		////console.log("TOTAL FORMATADO: "+totalFormatado);
		$("#totalItemCT").val(totalFormatado);
	}else{
		////console.log("entrou else calculo");
		$("#totalItemCT").maskMoney('mask', 0.00);
		
	}
	
	//console.log("fim calculaTotalItem");
	

}


function somaTotalCotacao(numLinha, cnpj){
	console.log("entrou somaTotalCotacao");
	
	if(numLinha == undefined || numLinha == "undefined" || numLinha == ""){
		var numLinha = $("#numLinhaItemCT").val();
		var cnpj = $("#cnpjFornecCotacao___"+numLinha).val();
	}
	
	var tbItensCotacao = varreTabela("tbItensCotacao");
	var tbCotacao = varreTabela("tbCotacao");
	
	var subtotal = 0.00;
	var totalDesconto = 0.00;
	var totalFrete = 0.00;
	var totalImpostos = 0.00;
	var totalICMS = 0.00;
	var totalIPI = 0.00;
	var totalPIS = 0.00;
	var totalCOFINS = 0.00;
	
	var totalISS = 0.00;
	var totalINSS = 0.00;
	var totalIR = 0.00;
	var totalCSLL = 0.00;
	var totalOUTRO = 0.00;

	var totalItem = 0.00;
	
	var itemFormatado = 0.00;
	var unitarioFormatado = 0.00;
	var descontoFormatado = 0.00;
	var freteFormatado = 0.00;
	
	var icmsFormatado = 0.00;
	var ipiFormatado = 0.00;
	var pisFormatado = 0.00;
	var cofinsFormatado = 0.00;
	
	var issFormatado = 0.00;
	var inssFormatado = 0.00;
	var irFormatado = 0.00;
	var csllFormatado = 0.00;
	var outroImpostoVlrFormatado = 0.00;
	
	var impostosFormatado = 0.00;
	
	var objData = new Array();
	var objDataOrdenado = new Array();
	
	//===============================================================
	//							CALCULA ITENS
	//===============================================================
	console.log(">> ENTROU CALCULA ITENS <<");
	console.log("cnpj: "+cnpj);
	console.log("numLinha: "+numLinha);
	for(var i=0;i<tbItensCotacao.length;i++){
		console.log("Calculando linha: "+tbItensCotacao[i]);
		
		if($("#cnpjFornecCotacao___"+tbItensCotacao[i]).val() == cnpj && $("#optPossuiItem___"+tbItensCotacao[i]).val() == "true" && 
		$("#linhaCotacaoOriginal___"+tbItensCotacao[i]).val() == numLinha){
			
			var possuiItem = $("#optPossuiItem___"+tbItensCotacao[i]).val();
			var itemLinha = $("#optPossuiItem___"+tbItensCotacao[i]).val();
			//CALCULA ITENS
			var valUnitario = $("#valUnitario___"+tbItensCotacao[i]).val();
			var qtdItem = $("#qtdDisponibilizada___"+tbItensCotacao[i]).val();
			
			var valUnitarioFloat = $("#valUnitario___"+tbItensCotacao[i]).maskMoney('unmasked')[0];
			//console.log("valUnitarioFloat: "+valUnitarioFloat);
			
			var valUnitario = $("#valUnitario___"+tbItensCotacao[i]).val();
			if(valUnitario != "" && possuiItem == "true"){
				//console.log("valUnitario___"+tbItensCotacao[i]+": "+valUnitario);
				var valUnitarioCT = $("#valUnitario___"+tbItensCotacao[i]).maskMoney('unmasked')[0];
				
				//console.log("valUnitarioCT após unmasked: "+valUnitarioCT);
				unitarioFormatado = parseFloat(valUnitarioCT);
				//console.log("valUnitarioCT após parseFloat: "+unitarioFormatado);
				//console.log("totalLinha Formatado: "+unitarioFormatado);
				//console.log("totalItem antes de somar: "+totalItem);
				//var subtotal = parseFloat(valUnitario) * parseFloat(qtdItem);
				totalItem = parseFloat(totalItem) + (parseFloat(unitarioFormatado) * parseFloat(qtdItem));
				//console.log("totalItem depois de somar: "+totalItem);
				//totalItem = totalItem.toFixed(2);
				//console.log("totalItem: "+totalItem);
			}else if(possuiItem == "false"){
				totalItem = 0.00;
			}
			
			//CALCULA TOTAL ITENS
			var totalLinha = $("#totalItem___"+tbItensCotacao[i]).val();
			console.log("totalItem___"+tbItensCotacao[i]+": "+totalLinha);
			if(totalLinha != "" && possuiItem == "true"){
				var totalLinhaCT = $("#totalItem___"+tbItensCotacao[i]).maskMoney('unmasked')[0];
				console.log("totalItem___"+tbItensCotacao[i]+" unmasked: "+totalLinhaCT);
				
				totalLinhaFloat = parseFloat(totalLinhaCT);
				
				console.log("totalItem___"+tbItensCotacao[i]+" após parseFloat: "+totalLinhaFloat);
				
				console.log("subtotal: "+subtotal+" = subtotal: "+parseFloat(subtotal)+" + "+parseFloat(totalLinhaFloat) );
				subtotal = parseFloat(subtotal) + parseFloat(totalLinhaFloat);
				subtotal = subtotal.toFixed(2);
				
				var subtotalMoeda = totalLinhaFloat.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
				console.log("subtotalMoeda: "+subtotalMoeda);
				$("#totalItem___"+tbItensCotacao[i]).val(subtotalMoeda);
				
			}else if(totalLinha != "" && possuiItem == "false"){
				var subtotalMoeda = 0.00;
				subtotalMoeda = subtotalMoeda.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
				$("#totalItem___"+tbItensCotacao[i]).val(subtotalMoeda);	
			}
			
			//CALCULA TOTAL DESCONTOS
			var descontoLinha = $("#descontoItem___"+tbItensCotacao[i]).val();
			if(descontoLinha != "" && possuiItem == "true"){
				descontoFormatado = parseFloat(descontoLinha);
				totalDesconto = parseFloat(totalDesconto) + parseFloat(descontoFormatado);
				totalDesconto = totalDesconto.toFixed(2);
			}else if(descontoLinha != "" && possuiItem == "true"){
				totalDesconto = 0.00;
			}
			
			//CALCULA TOTAL FRETE
			var itemFrete = $("#freteItem___"+tbItensCotacao[i]).val();
			if(itemFrete != "" && possuiItem == "true"){
				freteFormatado = parseFloat(itemFrete);
				totalFrete = parseFloat(totalFrete) + parseFloat(freteFormatado);
				totalFrete = totalFrete.toFixed(2);
			}else if(itemFrete != "" && possuiItem == "true"){
				totalFrete = 0.00;
			}
			
			//CAPTURA ICMS
			var icmsItem = $("#icmsItem___"+tbItensCotacao[i]).val();
			if(icmsItem != "" && possuiItem == "true"){
				icmsFormatado = parseFloat(icmsItem);
				totalICMS = parseFloat(totalICMS) + parseFloat(icmsFormatado);
				totalICMS = totalICMS.toFixed(2);
			}else if(icmsItem != "" && possuiItem == "true"){
				totalICMS = 0.00;
			}
			
			//CAPTURA IPI
			var ipiItem = $("#ipiItem___"+tbItensCotacao[i]).val();
			if(ipiItem != "" && possuiItem == "true"){
				ipiFormatado = parseFloat(ipiItem);
				totalIPI = parseFloat(totalIPI) + parseFloat(ipiFormatado);
				totalIPI = totalIPI.toFixed(2);
			}else if(ipiItem != "" && possuiItem == "true"){
				totalIPI = 0.00;
			}
			
			//CAPTURA PIS
			var pisItem = $("#pisItem___"+tbItensCotacao[i]).val();
			if(pisItem != "" && possuiItem == "true"){
				pisFormatado = parseFloat(pisItem);
				totalPIS = parseFloat(totalPIS) + parseFloat(pisFormatado);
				totalPIS = totalPIS.toFixed(2);
			}else if(pisItem != "" && possuiItem == "true"){
				totalPIS = 0.00;
			}
			
			//CAPTURA COFINS
			var cofinsItem = $("#cofinsItem___"+tbItensCotacao[i]).val();
			if(cofinsItem != "" && possuiItem == "true"){
				cofinsFormatado = parseFloat(cofinsItem);
				totalCOFINS = parseFloat(totalCOFINS) + parseFloat(cofinsFormatado);
				totalCOFINS = totalCOFINS.toFixed(2);
			}else if(cofinsItem != "" && possuiItem == "true"){
				totalCOFINS = 0.00;
			}
			
			//CAPTURA ISS
			var issItem = $("#issItem___"+tbItensCotacao[i]).val();
			if(issItem != "" && possuiItem == "true"){
				issFormatado = parseFloat(issItem);
				totalISS = parseFloat(totalISS) + parseFloat(issFormatado);
				totalISS = totalISS.toFixed(2);
			}else if(issItem != "" && possuiItem == "true"){
				totalISS = 0.00;
			}
			
			//CAPTURA INSS
			var inssItem = $("#inssItem___"+tbItensCotacao[i]).val();
			console.log("inssItem: "+inssItem+" - possuiItem: "+possuiItem);
			if(inssItem != "" && possuiItem == "true"){
				inssFormatado = parseFloat(inssItem);
				console.log("inssFormatado: "+inssFormatado);
				totalINSS = parseFloat(totalINSS) + parseFloat(inssFormatado);
				console.log("totalINSS: "+totalINSS);
				totalINSS = totalINSS.toFixed(2);
			}else if(inssItem != "" && possuiItem == "true"){
				totalINSS = 0.00;
			}
			
			//CAPTURA IR
			var irItem = $("#irItem___"+tbItensCotacao[i]).val();
			if(irItem != "" && possuiItem == "true"){
				irFormatado = parseFloat(irItem);
				totalIR = parseFloat(totalIR) + parseFloat(irFormatado);
				totalIR = totalIR.toFixed(2);
			}else if(inssItem != "" && possuiItem == "true"){
				totalIR = 0.00;
			}
			
			//CAPTURA CSLL
			var csllItem = $("#csllItem___"+tbItensCotacao[i]).val();
			if(csllItem != "" && possuiItem == "true"){
				csllFormatado = parseFloat(csllItem);
				totalCSLL = parseFloat(totalCSLL) + parseFloat(csllFormatado);
				totalCSLL = totalCSLL.toFixed(2);
			}else if(inssItem != "" && possuiItem == "true"){
				totalCSLL = 0.00;
			}
			
			//CAPTURA outroImpostoVlr
			var outroImpostoVlr = $("#outroImpostoVlr___"+tbItensCotacao[i]).val();
			if(outroImpostoVlr != "" && possuiItem == "true"){
				outroImpostoVlrFormatado = parseFloat(outroImpostoVlr);
				totalOUTRO = parseFloat(totalOUTRO) + parseFloat(outroImpostoVlrFormatado);
				totalOUTRO = totalOUTRO.toFixed(2);
			}else if(inssItem != "" && possuiItem == "true"){
				totalOUTRO = 0.00;
			}
			
		}		
	}

	//===============================================================
	//							CALCULA TOTAL
	//===============================================================
	console.log("ENTROU CALCULA TOTAL");
	totalImpostos = parseFloat(totalICMS) + parseFloat(totalIPI) + parseFloat(totalPIS) + parseFloat(totalCOFINS) + parseFloat(totalISS) + parseFloat(totalINSS) + parseFloat(totalIR) + parseFloat(totalCSLL) + parseFloat(totalOUTRO) ;

	totalImpostos = totalImpostos.toFixed(2);
	
	$("#cnpjResumoTotal").val(cnpj);
	
	//=======================================================================================================
	var totalItensCT = $("#totalItens___"+numLinha).val();
	console.log("totalItens___"+numLinha+" antes do if: "+totalItensCT);
	if(totalItensCT != ""){
		console.log("entrou if totalItensCT: "+totalItensCT);
		var totalItensCT = $("#totalItens___"+numLinha).maskMoney('unmasked')[0];
		console.log("totalItensCT unmasked: "+totalItensCT);
		var totalItens = parseFloat(totalItensCT);
		if(!isNaN(totalItens)){
			//console.log("entrou primeiro if");
			var totalItensFormatado = totalItens.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
		}else{
			//console.log("entrou segundo if");
			var totalItensFormatado = totalItensCT;
		}
	}else{
		var totalItens = 0.00;
		var totalItensFormatado = totalItens.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#totalItensCT").val( totalItensFormatado );
	
	
	//=======================================================================================================
	var totalDescontosCT = $("#totalDescontos___"+numLinha).val();
	if(totalDescontosCT != ""){
		var totalDescontos = parseFloat(totalDescontosCT);
		//var totalDescontosFormatado = totalDescontos.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
		if(!isNaN(totalDescontos)){
			//console.log("entrou primeiro if");
			var totalDescontosFormatado = totalDescontos.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
		}else{
			//console.log("entrou segundo if");
			var totalDescontosFormatado = totalDescontosCT;
		}
	}else{
		var totalDescontos = 0.00;
		var totalDescontosFormatado = totalDescontos.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#totalDescontosCT").val( totalDescontosFormatado );
	
	//=======================================================================================================
	var totalImpostosCT = $("#totalImpostos___"+numLinha).val();
	if(totalImpostosCT != ""){
		var totalImpostos = parseFloat(totalImpostosCT);
		//var totalImpostosFormatado = totalImpostos.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
		
		if(!isNaN(totalImpostos)){
			//console.log("entrou primeiro if");
			var totalImpostosFormatado = totalImpostos.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
		}else{
			//console.log("entrou segundo if");
			var totalImpostosFormatado = totalImpostosCT;
		}
		
		
	}else{
		var totalImpostos = 0.00;
		var totalImpostosFormatado = totalImpostos.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#totalImpostosCT").val( totalImpostosFormatado );

	
	//=======================================================================================================
	var totalFreteCT = $("#totalFrete___"+numLinha).val();
	if(totalFreteCT != ""){
		var totalFrete = parseFloat(totalFreteCT);
		//var totalFreteFormatado = totalFrete.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});

		if(!isNaN(totalFrete)){
			//console.log("entrou primeiro if");
			var totalFreteFormatado = totalFrete.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
		}else{
			//console.log("entrou segundo if");
			var totalFreteFormatado = totalFreteCT;
		}
		
	}else{
		var totalFrete = 0.00;
		var totalFreteFormatado = totalFrete.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#totalFreteCT").val( totalFreteFormatado );
	
	//=======================================================================================================
	var totalCotacaoCT = subtotal;
	console.log("totalCotacao___"+numLinha+": "+totalCotacaoCT);
	if(totalCotacaoCT != ""){
		var totalCotacao = parseFloat(totalCotacaoCT);
		//console.log("totalCotacaoCT formatado: "+totalCotacaoCT);
		if(!isNaN(totalCotacao)){
			console.log("entrou primeiro if isNaN(totalCotacao)");
			var totalCotacaoFormatado = totalCotacao.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
			$("#totalCotacao___"+numLinha).val(totalCotacaoFormatado);
		}else{
			console.log("entrou segundo if isNaN(totalCotacao)");
			var totalCotacaoFormatado = totalCotacaoCT;
			$("#totalCotacao___"+numLinha).val(totalCotacaoFormatado);
		}
		
	}else{
		var totalCotacao = 0.00;
		var totalCotacaoFormatado = totalCotacao.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
		$("#totalCotacao___"+numLinha).val(totalCotacaoFormatado);
	}
	//console.log("totalCotacaoCT formatado money: "+totalCotacaoFormatado);
	$("#totalCotacaoCT").val( totalCotacaoFormatado );
	

	$("#formaPagamentoCT").val( $("#formaPagamento___"+numLinha).val() );
	$("#qtdDiasPrevEntregaCT").val( $("#qtdDiasPrevEntrega___"+numLinha).val() );
	$("#dataPrevItemCT").val( $("#previsaoEntrega___"+numLinha).val() );
	
	$("#qtdDiasPrevPagamentoCT").val( $("#qtdDiasPrevPagamento___"+numLinha).val() );
	$("#dataPrevPagItemCT").val( $("#previsaoPagamento___"+numLinha).val() );

	
}


function somaTotalCotacaoFinal(){
	console.log("entrou somaTotalCotacaoFinal");
	
	var tbItensCotacao = varreTabela("tbItensCotacaoFinal");
	var tbCotacao = varreTabela("tbCotacaoFinal");
	
	var subtotal = 0.00;
	var totalDesconto = 0.00;
	var totalFrete = 0.00;
	var totalImpostos = 0.00;
	var totalICMS = 0.00;
	var totalIPI = 0.00;
	var totalPIS = 0.00;
	var totalCOFINS = 0.00;
	var totalItem = 0.00;
	
	var totalISS = 0.00;
	var totalINSS = 0.00;
	var totalIR = 0.00;
	var totalCSLL = 0.00;
	var totalOUTRO = 0.00;
	
	var itemFormatado = 0.00;
	var unitarioFormatado = 0.00;
	var descontoFormatado = 0.00;
	var freteFormatado = 0.00;
	
	var icmsFormatado = 0.00;
	var ipiFormatado = 0.00;
	var pisFormatado = 0.00;
	var cofinsFormatado = 0.00;
	
	var issFormatado = 0.00;
	var inssFormatado = 0.00;
	var irFormatado = 0.00;
	var csllFormatado = 0.00;
	var outroImpostoVlrFormatado = 0.00;
	
	var impostosFormatado = 0.00;
	
	var objData = new Array();
	var objDataOrdenado = new Array();
	
	//=============================================================================
	//								CALCULA ITENS COTACAO FINAL
	// ============================================================================
	for(var i=0;i<tbItensCotacao.length;i++){
		var possuiItem = $("#optPossuiItemCTF___"+tbItensCotacao[i]).val();
		//CALCULA ITENS
		var itemLinha = $("#valUnitarioCTF___"+tbItensCotacao[i]).val();
		if(itemLinha != "" && possuiItem == "true"){
			unitarioFormatado = parseFloat(itemLinha.replace(/[^0-9,]*/g, '').replace(',', '.')).toFixed(2);
			//unitarioFormatado = parseFloat(itemLinha);
			
			totalItem = parseFloat(totalItem) + parseFloat(unitarioFormatado);
			totalItem = totalItem.toFixed(2);
		}else if(itemLinha != "" && possuiItem == "false"){
			totalItem = 0.00;
		}
		
		//CALCULA TOTAL ITENS
		var totalLinha = $("#totalItemCTF___"+tbItensCotacao[i]).val();
		console.log("totalLinha original: "+totalLinha);
		if(totalLinha != "" && possuiItem == "true"){
			
			if (totalLinha.indexOf('R$') > -1){
				console.log("achou R$ em totalLinha");
				var totalLinha = parseFloat(totalLinha.replace(/[^0-9,]*/g, '').replace(',', '.')).toFixed(2);
			}else{
				console.log("não achou R$ em totalLinha");
				var totalLinhaSTR = $("#totalItemCTF___"+tbItensCotacao[i]).maskMoney('unmasked')[0];
				var totalLinha = totalLinhaSTR
			}
			
			console.log("totalLinha sem mascara: "+totalLinha);
			
			itemFormatado = parseFloat(totalLinha);
			console.log("totalLinha float: "+itemFormatado);
			subtotal = parseFloat(subtotal) + parseFloat(itemFormatado);
			subtotal = subtotal.toFixed(2);
		}else if(totalLinha != "" && possuiItem == "false"){
			subtotal = 0.00;
		}
		
		//CALCULA TOTAL DESCONTOS
		var descontoLinha = $("#descontoItemCTF___"+tbItensCotacao[i]).val();
		if(descontoLinha != "" && possuiItem == "true"){
			descontoFormatado = parseFloat(descontoLinha);
			totalDesconto = parseFloat(totalDesconto) + parseFloat(descontoFormatado);
			totalDesconto = totalDesconto.toFixed(2);
		}else if(descontoLinha != "" && possuiItem == "true"){
			totalDesconto = 0.00;
		}
		
		//CALCULA TOTAL FRETE
		var itemFrete = $("#freteItemCTF___"+tbItensCotacao[i]).val();
		if(itemFrete != "" && possuiItem == "true"){
			freteFormatado = parseFloat(itemFrete);
			totalFrete = parseFloat(totalFrete) + parseFloat(freteFormatado);
			totalFrete = totalFrete.toFixed(2);
		}else if(itemFrete != "" && possuiItem == "true"){
			totalFrete = 0.00;
		}
		
		//CAPTURA ICMS
		var icmsItem = $("#icmsItemCTF___"+tbItensCotacao[i]).val();
		if(icmsItem != "" && possuiItem == "true"){
			icmsFormatado = parseFloat(icmsItem);
			totalICMS = parseFloat(totalICMS) + parseFloat(icmsFormatado);
			totalICMS = totalICMS.toFixed(2);
		}else if(icmsItem != "" && possuiItem == "true"){
			totalICMS = 0.00;
		}
		
		//CAPTURA IPI
		var ipiItem = $("#ipiItemCTF___"+tbItensCotacao[i]).val();
		if(ipiItem != "" && possuiItem == "true"){
			ipiFormatado = parseFloat(ipiItem);
			totalIPI = parseFloat(totalIPI) + parseFloat(ipiFormatado);
			totalIPI = totalIPI.toFixed(2);
		}else if(ipiItem != "" && possuiItem == "true"){
			totalIPI = 0.00;
		}
		
		//CAPTURA PIS
		var pisItem = $("#pisItemCTF___"+tbItensCotacao[i]).val();
		if(pisItem != "" && possuiItem == "true"){
			pisFormatado = parseFloat(pisItem);
			totalPIS = parseFloat(totalPIS) + parseFloat(pisFormatado);
			totalPIS = totalPIS.toFixed(2);
		}else if(pisItem != "" && possuiItem == "true"){
			totalPIS = 0.00;
		}
		
		//CAPTURA COFINS
		var cofinsItem = $("#cofinsItemCTF___"+tbItensCotacao[i]).val();
		if(cofinsItem != "" && possuiItem == "true"){
			cofinsFormatado = parseFloat(cofinsItem);
			totalCOFINS = parseFloat(totalCOFINS) + parseFloat(cofinsFormatado);
			totalCOFINS = totalCOFINS.toFixed(2);
		}else if(cofinsItem != "" && possuiItem == "true"){
			totalCOFINS = 0.00;
		}
		
		//CAPTURA ISS
		var issItem = $("#issItemCTF___"+tbItensCotacao[i]).val();
		if(issItem != "" && possuiItem == "true"){
			issFormatado = parseFloat(issItem);
			totalISS = parseFloat(totalISS) + parseFloat(issFormatado);
			totalISS = totalISS.toFixed(2);
		}else if(issItem != "" && possuiItem == "true"){
			totalISS = 0.00;
		}
		
		//CAPTURA INSS
		var inssItem = $("#inssItemCTF___"+tbItensCotacao[i]).val();
		if(inssItem != "" && possuiItem == "true"){
			inssFormatado = parseFloat(inssItem);
			totalINSS = parseFloat(totalINSS) + parseFloat(inssFormatado);
			totalINSS = totalINSS.toFixed(2);
		}else if(inssItem != "" && possuiItem == "true"){
			totalINSS = 0.00;
		}
		
		//CAPTURA IR
		var irItem = $("#irItemCTF___"+tbItensCotacao[i]).val();
		if(irItem != "" && possuiItem == "true"){
			irFormatado = parseFloat(irItem);
			totalIR = parseFloat(totalIR) + parseFloat(irFormatado);
			totalIR = totalIR.toFixed(2);
		}else if(irItem != "" && possuiItem == "true"){
			totalIR = 0.00;
		}
		
		//CAPTURA CSLL
		var csllItem = $("#csllItemCTF___"+tbItensCotacao[i]).val();
		if(csllItem != "" && possuiItem == "true"){
			csllFormatado = parseFloat(csllItem);
			totalCSLL = parseFloat(totalCSLL) + parseFloat(csllFormatado);
			totalCSLL = totalCSLL.toFixed(2);
		}else if(csllItem != "" && possuiItem == "true"){
			totalCSLL = 0.00;
		}
		
		//CAPTURA outroImpostoVlr
		var outroImpostoVlr = $("#csllItemCTF___"+tbItensCotacao[i]).val();
		if(outroImpostoVlr != "" && possuiItem == "true"){
			outroImpostoVlrFormatado = parseFloat(outroImpostoVlr);
			totalOUTRO = parseFloat(totalOUTRO) + parseFloat(outroImpostoVlrFormatado);
			totalOUTRO = totalOUTRO.toFixed(2);
		}else if(outroImpostoVlr != "" && possuiItem == "true"){
			totalOUTRO = 0.00;
		}	
	}

	//=============================================================================
	//						CALCULA TOTAL COTACAO FINAL
	// ============================================================================
	
	totalImpostos = parseFloat(totalICMS) + parseFloat(totalIPI) + parseFloat(totalPIS) + parseFloat(totalCOFINS) + parseFloat(totalISS) + parseFloat(totalINSS) + parseFloat(totalIR) + parseFloat(totalCSLL) + parseFloat(totalOUTRO) ;

	totalImpostos = totalImpostos.toFixed(2);

	
	//$("#cnpjResumoTotalCTF_resumo").val(cnpj);
	
	//=======================================================================================================
	var totalItensCT = totalItem;
	console.log("totalItensCT antes do if: "+totalItensCT);
	if(totalItensCT != ""){
		console.log("somaTotalCotacaoFinal entrou if totalItensCT: "+totalItensCT);
		if (totalItensCT.indexOf('R$ ') > -1){
			var totalItensCT = parseFloat(totalItem.replace(/[^0-9,]*/g, '').replace(',', '.')).toFixed(2);
		}else{
			var totalItensCT = totalItem;
		}
		console.log("totalItensCT unmasked: "+totalItensCT);
		var totalItens = parseFloat(totalItensCT);
		if(!isNaN(totalItens)){
			//console.log("entrou primeiro if");
			var totalItensFormatado = totalItens.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
		}else{
			//console.log("entrou segundo if");
			var totalItensFormatado = totalItensCT;
		}
	}else{
		var totalItens = 0.00;
		var totalItensFormatado = totalItens.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#totalItensCTF_resumo").val( totalItensFormatado );
	
	
	//=======================================================================================================
	var totalDescontosCT = totalDesconto;
	if(totalDescontosCT != ""){
		var totalDescontos = parseFloat(totalDescontosCT);
		//var totalDescontosFormatado = totalDescontos.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
		if(!isNaN(totalDescontos)){
			//console.log("entrou primeiro if");
			var totalDescontosFormatado = totalDescontos.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
		}else{
			//console.log("entrou segundo if");
			var totalDescontosFormatado = totalDescontosCT;
		}
	}else{
		var totalDescontos = 0.00;
		var totalDescontosFormatado = totalDescontos.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#totalDescontosCTF_resumo").val( totalDescontosFormatado );
	
	//=======================================================================================================
	var totalImpostosCT = totalImpostos;
	if(totalImpostosCT != ""){
		var totalImpostos = parseFloat(totalImpostosCT);
		//var totalImpostosFormatado = totalImpostos.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
		
		if(!isNaN(totalImpostos)){
			//console.log("entrou primeiro if");
			var totalImpostosFormatado = totalImpostos.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
		}else{
			//console.log("entrou segundo if");
			var totalImpostosFormatado = totalImpostosCT;
		}
		
		
	}else{
		var totalImpostos = 0.00;
		var totalImpostosFormatado = totalImpostos.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#totalImpostosCTF_resumo").val( totalImpostosFormatado );
	
	//=======================================================================================================
	var totalFreteCT = totalFrete;
	if(totalFreteCT != ""){
		var totalFrete = parseFloat(totalFreteCT);
		//var totalFreteFormatado = totalFrete.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});

		if(!isNaN(totalFrete)){
			//console.log("entrou primeiro if");
			var totalFreteFormatado = totalFrete.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
		}else{
			//console.log("entrou segundo if");
			var totalFreteFormatado = totalFreteCT;
		}
		
	}else{
		var totalFrete = 0.00;
		var totalFreteFormatado = totalFrete.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#totalFreteCTF_resumo").val( totalFreteFormatado );
	
	//=======================================================================================================
	var totalCotacaoCT = subtotal;
	console.log("totalCotacaoCT: "+totalCotacaoCT);
	if(totalCotacaoCT != ""){
		if (totalCotacaoCT.indexOf('R$ ') > -1){
			var totalCotacaoCT = parseFloat(subtotal.replace(/[^0-9,]*/g, '').replace(',', '.')).toFixed(2);
		}else{
			var totalCotacaoCT = subtotal;
		}
		console.log("totalCotacaoCT float: "+totalCotacaoCT);
		if(!isNaN(totalCotacao)){
			console.log("entrou primeiro if");
			var totalCotacaoFormatado = parseFloat(totalCotacaoCT);
			totalCotacaoFormatado = totalCotacaoFormatado.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
		}else{
			console.log("entrou segundo if");
			var totalCotacaoFormatado = parseFloat(totalCotacaoCT);
			totalCotacaoFormatado = totalCotacaoFormatado.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
			//totalCotacaoFormatado = totalCotacaoCT;
		}
		
	}else{
		var totalCotacao = 0.00;
		var totalCotacaoFormatado = totalCotacao.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	//console.log("totalCotacaoCT formatado money: "+totalCotacaoFormatado);
	$("#totalCotacaoCTF_resumo").val( totalCotacaoFormatado );

	
}


function somaTotalFornecedorFinal(){
	console.log("entrou somaTotalFornecedorFinal");
	
	var tbItensCotacao = varreTabela("tbItensCotacaoFinal");
	var tbCotacao = varreTabela("tbCotacaoFinal");
	
	var subtotal = 0.00;
	var totalDesconto = 0.00;
	var totalFrete = 0.00;
	var totalImpostos = 0.00;
	var totalICMS = 0.00;
	var totalIPI = 0.00;
	var totalPIS = 0.00;
	var totalCOFINS = 0.00;
	var totalItem = 0.00;
	
	var totalISS = 0.00;
	var totalINSS = 0.00;
	var totalIR = 0.00;
	var totalCSLL = 0.00;
	var totalOUTRO = 0.00;
	
	var itemFormatado = 0.00;
	var unitarioFormatado = 0.00;
	var descontoFormatado = 0.00;
	var freteFormatado = 0.00;
	
	var icmsFormatado = 0.00;
	var ipiFormatado = 0.00;
	var pisFormatado = 0.00;
	var cofinsFormatado = 0.00;
	
	var issFormatado = 0.00;
	var inssFormatado = 0.00;
	var irFormatado = 0.00;
	var csllFormatado = 0.00;
	var outroImpostoVlrFormatado = 0.00;
	
	var impostosFormatado = 0.00;
	
	var objData = new Array();
	var objDataOrdenado = new Array();
	
	//=============================================================================
	//								CALCULA ITENS COTACAO FINAL
	// ============================================================================
	for(var z=0;z<tbCotacao.length;z++){
		
		var subtotal = 0.00;
		var totalDesconto = 0.00;
		var totalFrete = 0.00;
		var totalImpostos = 0.00;
		var totalICMS = 0.00;
		var totalIPI = 0.00;
		var totalPIS = 0.00;
		var totalCOFINS = 0.00;
		var totalItem = 0.00;
		
		var totalISS = 0.00;
		var totalINSS = 0.00;
		var totalIR = 0.00;
		var totalCSLL = 0.00;
		var totalOUTRO = 0.00;
		
		var itemFormatado = 0.00;
		var unitarioFormatado = 0.00;
		var descontoFormatado = 0.00;
		var freteFormatado = 0.00;
		
		var icmsFormatado = 0.00;
		var ipiFormatado = 0.00;
		var pisFormatado = 0.00;
		var cofinsFormatado = 0.00;
		
		var issFormatado = 0.00;
		var inssFormatado = 0.00;
		var irFormatado = 0.00;
		var csllFormatado = 0.00;
		var outroImpostoVlrFormatado = 0.00;
		
		var impostosFormatado = 0.00;
		
		var cnpjCabecalho = $("#cnpjCTF___"+tbCotacao[z]).val();
		console.log("SOMANDO CNPJ: "+cnpjCabecalho);
		for(var i=0;i<tbItensCotacao.length;i++){
			if($("#cnpjFornecCotacaoCTF___"+tbItensCotacao[i]).val() == cnpjCabecalho){
				
				var possuiItem = $("#optPossuiItemCTF___"+tbItensCotacao[i]).val();
				//CALCULA ITENS
				var itemLinha = $("#valUnitarioCTF___"+tbItensCotacao[i]).val();
				if(itemLinha != "" && possuiItem == "true"){
					unitarioFormatado = parseFloat(itemLinha.replace(/[^0-9,]*/g, '').replace(',', '.')).toFixed(2);
					//unitarioFormatado = parseFloat(itemLinha);
					
					totalItem = parseFloat(totalItem) + parseFloat(unitarioFormatado);
					totalItem = totalItem.toFixed(2);
				}else if(itemLinha != "" && possuiItem == "false"){
					totalItem = 0.00;
				}
				
				//CALCULA TOTAL ITENS
				var totalLinha = $("#totalItemCTF___"+tbItensCotacao[i]).val();
				console.log("totalLinha original: "+totalLinha);
				if(totalLinha != "" && possuiItem == "true"){
					
					if (totalLinha.indexOf('R$') > -1){
						console.log("achou R$ em totalLinha");
						var totalLinha = parseFloat(totalLinha.replace(/[^0-9,]*/g, '').replace(',', '.')).toFixed(2);
					}else{
						console.log("não achou R$ em totalLinha");
						var totalLinhaSTR = $("#totalItemCTF___"+tbItensCotacao[i]).maskMoney('unmasked')[0];
						var totalLinha = totalLinhaSTR
					}
					
					console.log("totalLinha sem mascara: "+totalLinha);
					
					itemFormatado = parseFloat(totalLinha);
					console.log("totalLinha float: "+itemFormatado);
					subtotal = parseFloat(subtotal) + parseFloat(itemFormatado);
					subtotal = subtotal.toFixed(2);
				}else if(totalLinha != "" && possuiItem == "false"){
					subtotal = 0.00;
				}
				
				var subtotalFormatado = parseFloat(subtotal);
				subtotalFormatado = subtotalFormatado.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
				console.log("SUBTOTAL MOEDA: "+subtotalFormatado);
				
				$("#totalCotacaoCTF___"+tbCotacao[z]).val(subtotalFormatado);
				
				//CALCULA TOTAL DESCONTOS
				var descontoLinha = $("#descontoItemCTF___"+tbItensCotacao[i]).val();
				if(descontoLinha != "" && possuiItem == "true"){
					descontoFormatado = parseFloat(descontoLinha);
					totalDesconto = parseFloat(totalDesconto) + parseFloat(descontoFormatado);
					totalDesconto = totalDesconto.toFixed(2);
				}else if(descontoLinha != "" && possuiItem == "true"){
					totalDesconto = 0.00;
				}
				
				//CALCULA TOTAL FRETE
				var itemFrete = $("#freteItemCTF___"+tbItensCotacao[i]).val();
				if(itemFrete != "" && possuiItem == "true"){
					freteFormatado = parseFloat(itemFrete);
					totalFrete = parseFloat(totalFrete) + parseFloat(freteFormatado);
					totalFrete = totalFrete.toFixed(2);
				}else if(itemFrete != "" && possuiItem == "true"){
					totalFrete = 0.00;
				}
				
				//CAPTURA ICMS
				var icmsItem = $("#icmsItemCTF___"+tbItensCotacao[i]).val();
				if(icmsItem != "" && possuiItem == "true"){
					icmsFormatado = parseFloat(icmsItem);
					totalICMS = parseFloat(totalICMS) + parseFloat(icmsFormatado);
					totalICMS = totalICMS.toFixed(2);
				}else if(icmsItem != "" && possuiItem == "true"){
					totalICMS = 0.00;
				}
				
				//CAPTURA IPI
				var ipiItem = $("#ipiItemCTF___"+tbItensCotacao[i]).val();
				if(ipiItem != "" && possuiItem == "true"){
					ipiFormatado = parseFloat(ipiItem);
					totalIPI = parseFloat(totalIPI) + parseFloat(ipiFormatado);
					totalIPI = totalIPI.toFixed(2);
				}else if(ipiItem != "" && possuiItem == "true"){
					totalIPI = 0.00;
				}
				
				//CAPTURA PIS
				var pisItem = $("#pisItemCTF___"+tbItensCotacao[i]).val();
				if(pisItem != "" && possuiItem == "true"){
					pisFormatado = parseFloat(pisItem);
					totalPIS = parseFloat(totalPIS) + parseFloat(pisFormatado);
					totalPIS = totalPIS.toFixed(2);
				}else if(pisItem != "" && possuiItem == "true"){
					totalPIS = 0.00;
				}
				
				//CAPTURA COFINS
				var cofinsItem = $("#cofinsItemCTF___"+tbItensCotacao[i]).val();
				if(cofinsItem != "" && possuiItem == "true"){
					cofinsFormatado = parseFloat(cofinsItem);
					totalCOFINS = parseFloat(totalCOFINS) + parseFloat(cofinsFormatado);
					totalCOFINS = totalCOFINS.toFixed(2);
				}else if(cofinsItem != "" && possuiItem == "true"){
					totalCOFINS = 0.00;
				}
				
				//CAPTURA ISS
				var issItem = $("#issItemCTF___"+tbItensCotacao[i]).val();
				if(issItem != "" && possuiItem == "true"){
					issFormatado = parseFloat(issItem);
					totalISS = parseFloat(totalISS) + parseFloat(issFormatado);
					totalISS = totalISS.toFixed(2);
				}else if(issItem != "" && possuiItem == "true"){
					totalISS = 0.00;
				}
				
				//CAPTURA INSS
				var inssItem = $("#inssItemCTF___"+tbItensCotacao[i]).val();
				if(inssItem != "" && possuiItem == "true"){
					inssFormatado = parseFloat(inssItem);
					totalINSS = parseFloat(totalINSS) + parseFloat(inssFormatado);
					totalINSS = totalINSS.toFixed(2);
				}else if(inssItem != "" && possuiItem == "true"){
					totalINSS = 0.00;
				}
				
				//CAPTURA IR
				var irItem = $("#irItemCTF___"+tbItensCotacao[i]).val();
				if(irItem != "" && possuiItem == "true"){
					irFormatado = parseFloat(irItem);
					totalIR = parseFloat(totalIR) + parseFloat(irFormatado);
					totalIR = totalIR.toFixed(2);
				}else if(irItem != "" && possuiItem == "true"){
					totalIR = 0.00;
				}
				
				//CAPTURA CSLL
				var csllItem = $("#csllItemCTF___"+tbItensCotacao[i]).val();
				if(csllItem != "" && possuiItem == "true"){
					csllFormatado = parseFloat(csllItem);
					totalCSLL = parseFloat(totalCSLL) + parseFloat(csllFormatado);
					totalCSLL = totalCSLL.toFixed(2);
				}else if(csllItem != "" && possuiItem == "true"){
					totalCSLL = 0.00;
				}
				
				//CAPTURA outroImpostoVlr
				var outroImpostoVlr = $("#csllItemCTF___"+tbItensCotacao[i]).val();
				if(outroImpostoVlr != "" && possuiItem == "true"){
					outroImpostoVlrFormatado = parseFloat(outroImpostoVlr);
					totalOUTRO = parseFloat(totalOUTRO) + parseFloat(outroImpostoVlrFormatado);
					totalOUTRO = totalOUTRO.toFixed(2);
				}else if(outroImpostoVlr != "" && possuiItem == "true"){
					totalOUTRO = 0.00;
				}	
			}
			
		}
		
	}
	
	


	
}



/*function somaTotalCotacaoFinal(numLinha, cnpj){
	console.log("entrou somaTotalCotacao");

	
	if(numLinha == undefined || numLinha == "undefined" || numLinha == ""){
		var numLinha = $("#numLinhaItemCTF").val();
		var cnpj = $("#cnpjFornecCotacaoCTF___"+numLinha).val();
	}
	
	var tbItensCotacao = varreTabela("tbItensCotacaoFinal");
	var tbCotacao = varreTabela("tbCotacaoFinal");
	
	var subtotal = 0.00;
	var totalDesconto = 0.00;
	var totalFrete = 0.00;
	var totalImpostos = 0.00;
	var totalICMS = 0.00;
	var totalIPI = 0.00;
	var totalPIS = 0.00;
	var totalCOFINS = 0.00;
	var totalItem = 0.00;
	
	var totalISS = 0.00;
	var totalINSS = 0.00;
	var totalIR = 0.00;
	var totalCSLL = 0.00;
	var totalOUTRO = 0.00;
	
	var itemFormatado = 0.00;
	var unitarioFormatado = 0.00;
	var descontoFormatado = 0.00;
	var freteFormatado = 0.00;
	
	var icmsFormatado = 0.00;
	var ipiFormatado = 0.00;
	var pisFormatado = 0.00;
	var cofinsFormatado = 0.00;
	
	var issFormatado = 0.00;
	var inssFormatado = 0.00;
	var irFormatado = 0.00;
	var csllFormatado = 0.00;
	var outroImpostoVlrFormatado = 0.00;
	
	var impostosFormatado = 0.00;
	
	var objData = new Array();
	var objDataOrdenado = new Array();
	
	//=============================================================================
	//								CALCULA ITENS COTACAO FINAL
	// ============================================================================
	for(var i=0;i<tbItensCotacao.length;i++){
		if($("#cnpjFornecCotacaoCTF___"+tbItensCotacao[i]).val() == cnpj && $("#optPossuiItemCTF___"+tbItensCotacao[i]).val() == "true" 
		 && $("#linhaCotacaoOriginalCTF___"+tbItensCotacao[i]).val() == numLinha ){
			var possuiItem = $("#optPossuiItemCTF___"+tbItensCotacao[i]).val();
			//CALCULA ITENS
			var itemLinha = $("#valUnitarioCTF___"+tbItensCotacao[i]).val();
			if(itemLinha != "" && possuiItem == "true"){
				unitarioFormatado = parseFloat(itemLinha);
				
				totalItem = parseFloat(totalItem) + parseFloat(unitarioFormatado);
				totalItem = totalItem.toFixed(2);
			}else if(itemLinha != "" && possuiItem == "false"){
				totalItem = 0.00;
			}
			
			//CALCULA TOTAL ITENS
			var totalLinha = $("#totalItemCTF___"+tbItensCotacao[i]).val();
			if(totalLinha != "" && possuiItem == "true"){
				itemFormatado = parseFloat(totalLinha);
				subtotal = parseFloat(subtotal) + parseFloat(itemFormatado);
				subtotal = subtotal.toFixed(2);
			}else if(totalLinha != "" && possuiItem == "false"){
				subtotal = 0.00;
			}
			
			//CALCULA TOTAL DESCONTOS
			var descontoLinha = $("#descontoItemCTF___"+tbItensCotacao[i]).val();
			if(descontoLinha != "" && possuiItem == "true"){
				descontoFormatado = parseFloat(descontoLinha);
				totalDesconto = parseFloat(totalDesconto) + parseFloat(descontoFormatado);
				totalDesconto = totalDesconto.toFixed(2);
			}else if(descontoLinha != "" && possuiItem == "true"){
				totalDesconto = 0.00;
			}
			
			//CALCULA TOTAL FRETE
			var itemFrete = $("#freteItemCTF___"+tbItensCotacao[i]).val();
			if(itemFrete != "" && possuiItem == "true"){
				freteFormatado = parseFloat(itemFrete);
				totalFrete = parseFloat(totalFrete) + parseFloat(freteFormatado);
				totalFrete = totalFrete.toFixed(2);
			}else if(itemFrete != "" && possuiItem == "true"){
				totalFrete = 0.00;
			}
			
			//CAPTURA ICMS
			var icmsItem = $("#icmsItemCTF___"+tbItensCotacao[i]).val();
			if(icmsItem != "" && possuiItem == "true"){
				icmsFormatado = parseFloat(icmsItem);
				totalICMS = parseFloat(totalICMS) + parseFloat(icmsFormatado);
				totalICMS = totalICMS.toFixed(2);
			}else if(icmsItem != "" && possuiItem == "true"){
				totalICMS = 0.00;
			}
			
			//CAPTURA IPI
			var ipiItem = $("#ipiItemCTF___"+tbItensCotacao[i]).val();
			if(ipiItem != "" && possuiItem == "true"){
				ipiFormatado = parseFloat(ipiItem);
				totalIPI = parseFloat(totalIPI) + parseFloat(ipiFormatado);
				totalIPI = totalIPI.toFixed(2);
			}else if(ipiItem != "" && possuiItem == "true"){
				totalIPI = 0.00;
			}
			
			//CAPTURA PIS
			var pisItem = $("#pisItemCTF___"+tbItensCotacao[i]).val();
			if(pisItem != "" && possuiItem == "true"){
				pisFormatado = parseFloat(pisItem);
				totalPIS = parseFloat(totalPIS) + parseFloat(pisFormatado);
				totalPIS = totalPIS.toFixed(2);
			}else if(pisItem != "" && possuiItem == "true"){
				totalPIS = 0.00;
			}
			
			//CAPTURA COFINS
			var cofinsItem = $("#cofinsItemCTF___"+tbItensCotacao[i]).val();
			if(cofinsItem != "" && possuiItem == "true"){
				cofinsFormatado = parseFloat(cofinsItem);
				totalCOFINS = parseFloat(totalCOFINS) + parseFloat(cofinsFormatado);
				totalCOFINS = totalCOFINS.toFixed(2);
			}else if(cofinsItem != "" && possuiItem == "true"){
				totalCOFINS = 0.00;
			}
			
			//CAPTURA ISS
			var issItem = $("#issItemCTF___"+tbItensCotacao[i]).val();
			if(issItem != "" && possuiItem == "true"){
				issFormatado = parseFloat(issItem);
				totalISS = parseFloat(totalISS) + parseFloat(issFormatado);
				totalISS = totalISS.toFixed(2);
			}else if(issItem != "" && possuiItem == "true"){
				totalISS = 0.00;
			}
			
			//CAPTURA INSS
			var inssItem = $("#inssItemCTF___"+tbItensCotacao[i]).val();
			if(inssItem != "" && possuiItem == "true"){
				inssFormatado = parseFloat(inssItem);
				totalINSS = parseFloat(totalINSS) + parseFloat(inssFormatado);
				totalINSS = totalINSS.toFixed(2);
			}else if(inssItem != "" && possuiItem == "true"){
				totalINSS = 0.00;
			}
			
			//CAPTURA IR
			var irItem = $("#irItemCTF___"+tbItensCotacao[i]).val();
			if(irItem != "" && possuiItem == "true"){
				irFormatado = parseFloat(irItem);
				totalIR = parseFloat(totalIR) + parseFloat(irFormatado);
				totalIR = totalIR.toFixed(2);
			}else if(irItem != "" && possuiItem == "true"){
				totalIR = 0.00;
			}
			
			//CAPTURA CSLL
			var csllItem = $("#csllItemCTF___"+tbItensCotacao[i]).val();
			if(csllItem != "" && possuiItem == "true"){
				csllFormatado = parseFloat(csllItem);
				totalCSLL = parseFloat(totalCSLL) + parseFloat(csllFormatado);
				totalCSLL = totalCSLL.toFixed(2);
			}else if(csllItem != "" && possuiItem == "true"){
				totalCSLL = 0.00;
			}
			
			//CAPTURA outroImpostoVlr
			var outroImpostoVlr = $("#csllItemCTF___"+tbItensCotacao[i]).val();
			if(outroImpostoVlr != "" && possuiItem == "true"){
				outroImpostoVlrFormatado = parseFloat(outroImpostoVlr);
				totalOUTRO = parseFloat(totalOUTRO) + parseFloat(outroImpostoVlrFormatado);
				totalOUTRO = totalOUTRO.toFixed(2);
			}else if(outroImpostoVlr != "" && possuiItem == "true"){
				totalOUTRO = 0.00;
			}
			
		}		
	}

	//=============================================================================
	//						CALCULA TOTAL COTACAO FINAL
	// ============================================================================
	
	totalImpostos = parseFloat(totalICMS) + parseFloat(totalIPI) + parseFloat(totalPIS) + parseFloat(totalCOFINS) + parseFloat(totalISS) + parseFloat(totalINSS) + parseFloat(totalIR) + parseFloat(totalCSLL) + parseFloat(totalOUTRO) ;

	totalImpostos = totalImpostos.toFixed(2);

	
	$("#cnpjResumoTotalCTF_resumo").val(cnpj);
	
	//=======================================================================================================
	var totalItensCT = $("#totalItensCTF___"+numLinha).val();
	console.log("totalItensCT antes do if: "+totalItensCT);
	if(totalItensCT != ""){
		console.log("somaTotalCotacaoFinal entrou if totalItensCT: "+totalItensCT);
		var totalItensCT = $("#totalItensCTF___"+numLinha).maskMoney('unmasked')[0];
		console.log("totalItensCT unmasked: "+totalItensCT);
		var totalItens = parseFloat(totalItensCT);
		if(!isNaN(totalItens)){
			//console.log("entrou primeiro if");
			var totalItensFormatado = totalItens.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
		}else{
			//console.log("entrou segundo if");
			var totalItensFormatado = totalItensCT;
		}
	}else{
		var totalItens = 0.00;
		var totalItensFormatado = totalItens.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#totalItensCTF_resumo").val( totalItensFormatado );
	
	
	//=======================================================================================================
	var totalDescontosCT = $("#totalDescontosCTF___"+numLinha).val();
	if(totalDescontosCT != ""){
		var totalDescontos = parseFloat(totalDescontosCT);
		//var totalDescontosFormatado = totalDescontos.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
		if(!isNaN(totalDescontos)){
			//console.log("entrou primeiro if");
			var totalDescontosFormatado = totalDescontos.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
		}else{
			//console.log("entrou segundo if");
			var totalDescontosFormatado = totalDescontosCT;
		}
	}else{
		var totalDescontos = 0.00;
		var totalDescontosFormatado = totalDescontos.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#totalDescontosCTF_resumo").val( totalDescontosFormatado );
	
	//=======================================================================================================
	var totalImpostosCT = $("#totalImpostosCTF___"+numLinha).val();
	if(totalImpostosCT != ""){
		var totalImpostos = parseFloat(totalImpostosCT);
		//var totalImpostosFormatado = totalImpostos.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
		
		if(!isNaN(totalImpostos)){
			//console.log("entrou primeiro if");
			var totalImpostosFormatado = totalImpostos.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
		}else{
			//console.log("entrou segundo if");
			var totalImpostosFormatado = totalImpostosCT;
		}
		
		
	}else{
		var totalImpostos = 0.00;
		var totalImpostosFormatado = totalImpostos.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#totalImpostosCTF_resumo").val( totalImpostosFormatado );
	
	//=======================================================================================================
	var totalFreteCT = $("#totalFreteCTF___"+numLinha).val();
	if(totalFreteCT != ""){
		var totalFrete = parseFloat(totalFreteCT);
		//var totalFreteFormatado = totalFrete.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});

		if(!isNaN(totalFrete)){
			//console.log("entrou primeiro if");
			var totalFreteFormatado = totalFrete.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
		}else{
			//console.log("entrou segundo if");
			var totalFreteFormatado = totalFreteCT;
		}
		
	}else{
		var totalFrete = 0.00;
		var totalFreteFormatado = totalFrete.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#totalFreteCTF_resumo").val( totalFreteFormatado );
	
	//=======================================================================================================
	var totalCotacaoCT = $("#totalCotacaoCTF___"+numLinha).val();
	//console.log("totalCotacaoCT: "+totalCotacaoCT);
	if(totalCotacaoCT != ""){
		var totalCotacao = parseFloat(totalCotacaoCT);
		//console.log("totalCotacaoCT formatado: "+totalCotacaoCT);
		if(!isNaN(totalCotacao)){
			//console.log("entrou primeiro if");
			var totalCotacaoFormatado = totalCotacao.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
		}else{
			//console.log("entrou segundo if");
			var totalCotacaoFormatado = totalCotacaoCT;
		}
		
	}else{
		var totalCotacao = 0.00;
		var totalCotacaoFormatado = totalCotacao.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	//console.log("totalCotacaoCT formatado money: "+totalCotacaoFormatado);
	$("#totalCotacaoCTF_resumo").val( totalCotacaoFormatado );

	
}
*/

function formataTbItensCotacaoMoeda(){
	console.log("entrou formataTbItensCotacaoMoeda");
	var tbItensCotacao = varreTabela("tbItensCotacao");
	
	for(var i=0;i<tbItensCotacao.length;i++){
		
		var valUnitario = $("#valUnitario___"+tbItensCotacao[i]).val();
		if(valUnitario.indexOf("R$") > -1){
			valUnitario = $("#valUnitario___"+tbItensCotacao[i]).maskMoney('unmasked')[0];
		}
		if(valUnitario != "" ){
			valUnitario = parseFloat(valUnitario);
			var valUnitarioMoeda = valUnitario.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
			$("#valUnitario___"+tbItensCotacao[i]).val(valUnitarioMoeda);	
		}
		
		var totalItem = $("#totalItem___"+tbItensCotacao[i]).val();
		if(totalItem.indexOf("R$") > -1){
			totalItem = $("#totalItem___"+tbItensCotacao[i]).maskMoney('unmasked')[0];
		}
		if(totalItem != "" ){
			totalItem = parseFloat(totalItem);
			var totalItemMoeda = totalItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
			$("#totalItem___"+tbItensCotacao[i]).val(totalItemMoeda);
			console.log("após formatação totalItens: "+$("#totalItem___"+tbItensCotacao[i]).val());
		}
			
	
	}
	
}

function formataTbItensCotacaoFinalMoeda(){
	
	var tbItensCotacao = varreTabela("tbItensCotacaoFinal");
	
	for(var i=0;i<tbItensCotacao.length;i++){
		
		var valUnitario = $("#valUnitarioCTF___"+tbItensCotacao[i]).val();
		if(valUnitario.indexOf("R$") > -1){
			valUnitario = $("#valUnitarioCTF___"+tbItensCotacao[i]).maskMoney('unmasked')[0];
		}
		if(valUnitario != "" ){
			valUnitario = parseFloat(valUnitario);
			var valUnitarioMoeda = valUnitario.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
			$("#valUnitarioCTF___"+tbItensCotacao[i]).val(valUnitarioMoeda);	
		}
		
		var totalItem = $("#totalItemCTF___"+tbItensCotacao[i]).val();
		if(totalItem.indexOf("R$") > -1){
			totalItem = $("#totalItemCTF___"+tbItensCotacao[i]).maskMoney('unmasked')[0];
		}
		if(totalItem != "" ){
			totalItem = parseFloat(totalItem);
			var totalItemMoeda = totalItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
			$("#totalItemCTF___"+tbItensCotacao[i]).val(totalItemMoeda);	
		}
			
	
	}
	
}

function encerraCotacao(){
	
	var cnpjTotal = $("#cnpjResumoTotal").val();
	
	var tbCotacao = varreTabela("tbCotacao");
	var tbItensCotacao = varreTabela("tbItensCotacao");
	
	var itemPendente = 0;
	var qtdItensCotacao = 0;
	
	var dataLogTemp = new Date();

	var diaLog = dataLogTemp.getDate();
	if (parseInt(diaLog) < 10) {
		diaLog = "0" + diaLog;
	}
	var mesLog = dataLogTemp.getMonth();

	anoLog = dataLogTemp.getFullYear();

	var mes2Log = parseInt(mesLog) + 1;
	if (parseInt(mes2Log) < 10) {
		mes2Log = "0" + mes2Log;
	}

	var dataCompletaLog = diaLog + '/' + mes2Log + '/' + anoLog;
	var dataInvertida = anoLog+mes2Log+diaLog;
	
	for(var i=0;i<tbItensCotacao.length;i++){
		
		var totalItem = $("#totalItem___"+tbItensCotacao[i]).val();
		var optPossuiItem = $("#optPossuiItem___"+tbItensCotacao[i]).val();
		var cnpjFornecCotacao = $("#cnpjFornecCotacao___"+tbItensCotacao[i]).val();
		
		if( ( (totalItem == "" || totalItem == "0.00") && optPossuiItem == "true") && (cnpjFornecCotacao == cnpjTotal)){
			itemPendente++;
		}
	}
	
	for(var i=0;i<tbCotacao.length;i++){
		if($("#cnpj___"+tbCotacao[i]).val() == cnpjTotal){
			qtdItensCotacao++;
		}
	}
	
	for(var i=0;i<tbCotacao.length;i++){
		if($("#cnpj___"+tbCotacao[i]).val() == cnpjTotal){
			$("#dataRespCotacao___"+tbCotacao[i]).val( dataCompletaLog );
			$("#dataRespCotacaoFormat___"+tbCotacao[i]).val( dataInvertida );
			$("#anoRespCotacao___"+tbCotacao[i]).val( anoLog );
			$("#mesRespCotacao___"+tbCotacao[i]).val( mes2Log );
			$("#formaPagamento___"+tbCotacao[i]).val( $("#formaPagamentoCT").val() );
			$("#qtdDiasPrevEntrega___"+tbCotacao[i]).val( $("#qtdDiasPrevEntregaCT").val() );
			$("#previsaoEntrega___"+tbCotacao[i]).val( $("#dataPrevItemCT").val() );
			
			$("#qtdDiasPrevPagamento___"+tbCotacao[i]).val( $("#qtdDiasPrevPagamentoCT").val() );
			$("#previsaoPagamento___"+tbCotacao[i]).val( $("#dataPrevPagItemCT").val() );
			
			if(itemPendente == 0){
				$("#statusCotacao___"+tbCotacao[i]).val( "CONCLUIDO" );
				$("#divItensCotacao").hide();
			}else if(itemPendente > 0 && itemPendente == qtdItensCotacao){
				$("#statusCotacao___"+tbCotacao[i]).val( "CONCLUIDO" );
				$("#divItensCotacao").hide();
			}else if(itemPendente > 0 && itemPendente != qtdItensCotacao){
					FLUIGC.toast({
						title: 'Atenção! ',
						message: 'Cotação não foi encerrada devido haver itens pendentes. Favor verifique para poder concluir!',
						type: 'danger'
					});
					$("#statusCotacao___"+tbCotacao[i]).val( "PENDENTE" );
			}
		}
		i = tbCotacao.length +1;
	}
	
	ocultaResumo();
	
}

function setFormaPagamento(){
	//console.log("entrou setFormaPagamento");
	var cnpj = $("#cnpjResumoTotal").val();
	var tbCotacao = varreTabela("tbCotacao");
	
	for(var i=0;i<tbCotacao.length;i++){
		if($("#cnpj___"+tbCotacao[i]).val() == cnpj){
			$("#formaPagamento___"+tbCotacao[i]).val($("#formaPagamentoCT").val());		
			i = tbCotacao.length +1;
		}		
	}
}

function setQtdDiasEntrega(){
	//console.log("entrou setQtdDiasEntrega");
	var cnpj = $("#cnpjResumoTotal").val();
	var tbCotacao = varreTabela("tbCotacao");
	
	for(var i=0;i<tbCotacao.length;i++){
		if($("#cnpj___"+tbCotacao[i]).val() == cnpj){
			$("#qtdDiasPrevEntrega___"+tbCotacao[i]).val($("#qtdDiasPrevEntregaCT").val());		
			i = tbCotacao.length +1;
		}		
	}
}

function setDataPrevEntrega(){
	//console.log("entrou setDataPrevEntrega");
	var cnpj = $("#cnpjResumoTotal").val();
	var tbCotacao = varreTabela("tbCotacao");
	
	for(var i=0;i<tbCotacao.length;i++){
		if($("#cnpj___"+tbCotacao[i]).val() == cnpj){
			$("#previsaoEntrega___"+tbCotacao[i]).val($("#dataPrevItemCT").val());		
			i = tbCotacao.length +1;
		}		
	}
}


function imprimeTBCotacao(){
	
	var tbCotacao = varreTabela("tbCotacao");
	//console.log("Tamanho tbCotacao: "+tbCotacao.length);
	
	for(var i=0;i<tbCotacao.length;i++){
		//console.log("################################################################");
		//console.log("NUM LINHA  : *"+tbCotacao[i]+"*");
		//console.log("excludetbCotacao  : *"+$("#excludetbCotacao___"+tbCotacao[i]).val()+"*");
		//console.log("cnpj  : *"+$("#cnpj___"+tbCotacao[i]).val()+"*");
		//console.log("loja  : *"+$("#loja___"+tbCotacao[i]).val()+"*");
		//console.log("cep  : *"+$("#cep___"+tbCotacao[i]).val()+"*");
		//console.log("estado  : *"+$("#estado___"+tbCotacao[i]).val()+"*");
		//console.log("bairro  : *"+$("#bairro___"+tbCotacao[i]).val()+"*");
		//console.log("endereco  : *"+$("#endereco___"+tbCotacao[i]).val()+"*");
		//console.log("complemento  : *"+$("#complemento___"+tbCotacao[i]).val()+"*");
		//console.log("contato  : *"+$("#contato___"+tbCotacao[i]).val()+"*");
		//console.log("telefoneFornec  : *"+$("#telefoneFornec___"+tbCotacao[i]).val()+"*");
		//console.log("emailFornec  : *"+$("#emailFornec___"+tbCotacao[i]).val()+"*");
		//console.log("razaoSocial  : *"+$("#razaoSocial___"+tbCotacao[i]).val()+"*");
		//console.log("statusCotacao  : *"+$("#statusCotacao___"+tbCotacao[i]).val()+"*");
		//console.log("totalItens  : *"+$("#totalItens___"+tbCotacao[i]).val()+"*");
		//console.log("totalDescontos  : *"+$("#totalDescontos___"+tbCotacao[i]).val()+"*");
		//console.log("totalImpostos  : *"+$("#totalImpostos___"+tbCotacao[i]).val()+"*");
		//console.log("totalFrete  : *"+$("#totalFrete___"+tbCotacao[i]).val()+"*");
		//console.log("formaPagamento  : *"+$("#formaPagamento___"+tbCotacao[i]).val()+"*");
		//console.log("dataCotacao  : *"+$("#dataCotacao___"+tbCotacao[i]).val()+"*");
		//console.log("dataRespCotacao  : *"+$("#dataRespCotacao___"+tbCotacao[i]).val()+"*");
		//console.log("totalCotacao  : *"+$("#totalCotacao___"+tbCotacao[i]).val()+"*");
		//console.log("qtdDiasPrevEntrega  : *"+$("#qtdDiasPrevEntrega___"+tbCotacao[i]).val()+"*");
		//console.log("previsaoEntrega  : *"+$("#previsaoEntrega___"+tbCotacao[i]).val()+"*");
		//console.log("acoesFornecedores  : *"+$("#acoesFornecedores___"+tbCotacao[i]).val()+"*");
		//console.log("################################################################"+"*");
	}
	
	
}

function editaCotacao(idCampo){
	//console.log("entrou editaCotacao");
	var str = idCampo.split("___");
	var linhaCotacao = str[1];
	
	var cnpjCotacao = $("#cnpj___"+linhaCotacao).val();
	
	
	var tbItensCotacao = varreTabela("tbItensCotacao");
	
	for(var i=0;i<tbItensCotacao.length;i++){
		var linhaCotacaoOriginal = $("#linhaCotacaoOriginal___"+tbItensCotacao[i]).val();
		//console.log("#cnpjFornecCotacao___"+tbItensCotacao[i]+": "+$("#cnpjFornecCotacao___"+tbItensCotacao[i]).val()+" = cnpjCotacao: "+cnpjCotacao);
		//console.log("#linhaCotacaoOriginal: "+linhaCotacaoOriginal+" = linhaCotacao: "+linhaCotacao);
		if($("#cnpjFornecCotacao___"+tbItensCotacao[i]).val() == cnpjCotacao && linhaCotacaoOriginal == linhaCotacao){
			var elemento = $("#excludetbItensCotacao___"+tbItensCotacao[i]).parent().parent();
			elemento.show();
		}else{
			var elemento = $("#excludetbItensCotacao___"+tbItensCotacao[i]).parent().parent();
			elemento.hide();
		}
	}
	
	$("#divItensCotacao").show();
	carregaBtnPossuiItem();
	btnTbItensCotacao();
}

function editaCotacaoFinal(idCampo){
	//console.log("entrou editaCotacao");
	var str = idCampo.split("___");
	var linhaCotacao = str[1];
	
	var cnpjCotacao = $("#cnpjCTF___"+linhaCotacao).val();
	
	
	var tbItensCotacao = varreTabela("tbItensCotacaoFinal");
	
	for(var i=0;i<tbItensCotacao.length;i++){
		var linhaCotacaoOriginal = $("#linhaCotacaoOriginalCTF___"+tbItensCotacao[i]).val();
		//console.log("#cnpjFornecCotacao___"+tbItensCotacao[i]+": "+$("#cnpjFornecCotacao___"+tbItensCotacao[i]).val()+" = cnpjCotacao: "+cnpjCotacao);
		//console.log("#linhaCotacaoOriginal: "+linhaCotacaoOriginal+" = linhaCotacao: "+linhaCotacao);
		if($("#cnpjFornecCotacaoCTF___"+tbItensCotacao[i]).val() == cnpjCotacao && linhaCotacaoOriginal == linhaCotacao){
			var elemento = $("#excludetbItensCotacaoCTF___"+tbItensCotacao[i]).parent().parent();
			elemento.show();
		}else{
			var elemento = $("#excludetbItensCotacaoCTF___"+tbItensCotacao[i]).parent().parent();
			elemento.hide();
		}
	}
	
	$("#divItensCotacaoFinal").show();
	carregaBtnPossuiItemFinal();
	btnTbItensCotacaoFinal();
}

function ocultaItensCotacao(){
	
	var tbItensCotacao = varreTabela("tbItensCotacao");
	
	var elemento = $("#excludetbItensCotacao___"+tbItensCotacao[i]).parent().parent();
	elemento.hide();
		
}


function visualizaItemCotacao(idCampo){
	//console.log("entrou editaItemCotacao");
	var temp = idCampo.split("___");
	var numLinha = temp[1];
	
	$("#divDetalhesItemCotacao").show();
	
	$("#numLinhaItemCT").val( numLinha );
	
	$("#descItemCT").val( $("#descItemSolicitado___"+numLinha).val() );
	$("#codItemCT").val( $("#codItemSolicitado___"+numLinha).val() );
	$("#itemDisponibilizadoCT").val( $("#itemDisponibilizado___"+numLinha).val() );
	$("#qtdSolicitadaCT").val( $("#qtdSolicitada___"+numLinha).val() );
	$("#qtdDisponibilizadaCT").val( $("#qtdDisponibilizada___"+numLinha).val() );
	
	//console.log("infoComplItemSC___"+numLinha+": "+$("#infoComplItemSC___"+numLinha).val());
	$("#infoComplItemSCCT").val( $("#infoComplItemSC___"+numLinha).val() );
	$("#infoComplItemFornecCT").val( $("#infoComplItemFornec___"+numLinha).val() );
	
	$("#btnSaveItem").show();
	
	//===========================================================================================================
	var valUnitarioCT = $("#valUnitario___"+numLinha).val();
	if(valUnitarioCT != ""){
		var valUnitarioUnmasked = $("#valUnitario___"+numLinha).maskMoney('unmasked')[0];
		var valUnitarioCT = parseFloat(valUnitarioUnmasked);
		var valUnitario = parseFloat(valUnitarioCT);
		var valUnitarioFormatado = valUnitario.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var valUnitario = 0.00;
		var valUnitarioFormatado = valUnitario.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#valUnitarioCT").val( valUnitarioFormatado );
	
	//===========================================================================================================
	var freteItemCT = $("#freteItem___"+numLinha).val();
	if(freteItemCT != ""){
		var freteItem = parseFloat(freteItemCT);
		var freteFormatado = freteItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var freteItem = 0.00;
		var freteFormatado = freteItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#freteItemCT").val( freteFormatado );
	
	//===========================================================================================================	
	var descontoItemCT = $("#descontoItem___"+numLinha).val();
	if(descontoItemCT != ""){
		var descontoItem = parseFloat(descontoItemCT);
		var descontoFormatado = descontoItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var descontoItem = 0.00;
		var descontoFormatado = descontoItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#descontoItemCT").val( descontoFormatado );
	
	//===========================================================================================================
	var icmsItemCT = $("#icmsItem___"+numLinha).val();
	if(icmsItemCT != ""){
		var icmsItem = parseFloat(icmsItemCT);
		var icmsItemFormatado = icmsItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var icmsItem = 0.00;
		var icmsItemFormatado = icmsItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#icmsItemCT").val( icmsItemFormatado );
	
	//===========================================================================================================
	var ipiItemCT = $("#ipiItem___"+numLinha).val();
	if(ipiItemCT != ""){
		var ipiItem = parseFloat(ipiItemCT);
		var ipiFormatado = ipiItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var ipiItem = 0.00;
		var ipiFormatado = ipiItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#ipiItemCT").val( ipiFormatado );
	
	//===========================================================================================================
	var pisItemCT = $("#pisItem___"+numLinha).val();
	if(pisItemCT != ""){
		var pisItem = parseFloat(pisItemCT);
		var pisFormatado = pisItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var pisItem = 0.00;
		var pisFormatado = pisItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}	
	$("#pisItemCT").val( pisFormatado );
	
	//===========================================================================================================
	var cofinsItemCT = $("#cofinsItem___"+numLinha).val();
	if(cofinsItemCT != ""){
		var cofinsItem = parseFloat(cofinsItemCT);
		var cofinsFormatado = cofinsItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var cofinsItem = 0.00;
		var cofinsFormatado = cofinsItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}		
	$("#cofinsItemCT").val( cofinsFormatado );
	
	//===========================================================================================================
	var issItemCT = $("#issItem___"+numLinha).val();
	if(issItemCT != ""){
		var issItem = parseFloat(issItemCT);
		var issFormatado = issItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var issItem = 0.00;
		var issFormatado = issItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}		
	$("#issItemCT").val( issFormatado );
	
	//===========================================================================================================
	var inssItemCT = $("#inssItem___"+numLinha).val();
	if(inssItemCT != ""){
		var inssItem = parseFloat(inssItemCT);
		var inssFormatado = inssItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var inssItem = 0.00;
		var inssFormatado = inssItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}		
	$("#inssItemCT").val( inssFormatado );
	
	//===========================================================================================================
	var irItemCT = $("#irItem___"+numLinha).val();
	if(irItemCT != ""){
		var irItem = parseFloat(irItemCT);
		var irFormatado = irItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var irItem = 0.00;
		var irFormatado = irItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}		
	$("#irItemCT").val( irFormatado );
	
	//===========================================================================================================
	var csllItemCT = $("#csllItem___"+numLinha).val();
	if(csllItemCT != ""){
		var csllItem = parseFloat(csllItemCT);
		var csllFormatado = csllItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var csllItem = 0.00;
		var csllFormatado = csllItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}		
	$("#csllItemCT").val( csllFormatado );
	
	//===========================================================================================================
	var outroImpostoVlrItemCT = $("#outroImpostoVlrItem___"+numLinha).val();
	if(outroImpostoVlrItemCT != ""){
		var outroImpostoVlrItem = parseFloat(outroImpostoVlrItemCT);
		var outroImpostoVlrFormatado = outroImpostoVlrItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var outroImpostoVlrItem = 0.00;
		var outroImpostoVlrFormatado = outroImpostoVlrItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}		
	$("#outroImpostoVlrItemCT").val( outroImpostoVlrFormatado );
	
	
	//===========================================================================================================
	var totalItemCT = $("#totalItem___"+numLinha).val();
	if(totalItemCT != ""){
		var totalItemCT = $("#totalItem___"+numLinha).maskMoney('unmasked')[0];
		var totalItem = parseFloat(totalItemCT);
		var totalItemFormatado = totalItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var totalItem = 0.00;
		var totalItemFormatado = totalItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}	
	$("#totalItemCT").val( totalItemFormatado );
	
	$("#descItemCT").attr("readonly","readonly" );
	$("#codItemCT").attr("readonly","readonly" );
	$("#itemDisponibilizadoCT").attr("readonly","readonly" );
	$("#qtdSolicitadaCT").attr("readonly","readonly" );
	$("#qtdDisponibilizadaCT").attr("readonly","readonly" );
	$("#valUnitarioCT").attr("readonly","readonly" );
	$("#freteItemCT").attr("readonly","readonly" );
	$("#descontoItemCT").attr("readonly","readonly" );
	$("#icmsItemCT").attr("readonly","readonly" );
	$("#ipiItemCT").attr("readonly","readonly" );
	$("#pisItemCT").attr("readonly","readonly" );
	$("#cofinsItemCT").attr("readonly","readonly" );
	
	$("#issItemCT").attr("readonly","readonly" );
	$("#inssItemCT").attr("readonly","readonly" );
	$("#irItemCT").attr("readonly","readonly" );
	$("#csllItemCT").attr("readonly","readonly" );
	$("#outroImpostoDescCT").attr("readonly","readonly" );
	$("#outroImpostoVlrCT").attr("readonly","readonly" );
	
	$("#totalItemCT").attr("readonly","readonly" );
	$("#totalItemCT").css("background-color","#F3f3f3" );
	
	$("#infoComplItemSCCT").attr("readonly","readonly" );
	$("#infoComplItemFornecCT").attr("readonly","readonly" );
	
	$("#btnSaveItem").hide();
	$("#btnOcultaItem").show();
	
}
function visualizaItemCotacaoFinal(idCampo){
	console.log("##### entrou visualizaItemCotacaoFinal");
	var temp = idCampo.split("___");
	var numLinha = temp[1];
	console.log("tornando div divDetalhesItemCotacaoFinal visivel");
	$("#divDetalhesItemCotacaoFinal").show();
	
	$("#numLinhaItemCTF_resumo").val( numLinha );
	
	$("#descItemCTF_resumo").val( $("#descItemSolicitadoCTF___"+numLinha).val() );
	$("#codItemCTF_resumo").val( $("#codItemSolicitadoCTF___"+numLinha).val() );
	$("#itemDisponibilizadoCTF_resumo").val( $("#itemDisponibilizadoCTF___"+numLinha).val() );
	$("#qtdSolicitadaCTF_resumo").val( $("#qtdSolicitadaCTF___"+numLinha).val() );
	$("#qtdDisponibilizadaCTF_resumo").val( $("#qtdDisponibilizadaCTF___"+numLinha).val() );
	
	//console.log("infoComplItemSC___"+numLinha+": "+$("#infoComplItemSC___"+numLinha).val());
	$("#infoComplItemSCCTF_resumo").val( $("#infoComplItemSCCTF___"+numLinha).val() );
	$("#infoComplItemFornecCTF_resumo").val( $("#infoComplItemFornecCTF___"+numLinha).val() );
	
	//$("#btnSaveItem").show();
	
	//===========================================================================================================
	var valUnitarioCT = $("#valUnitarioCTF___"+numLinha).val();
	console.log("valUnitarioCTF antes do parseFloat: "+valUnitarioCT);
	if(valUnitarioCT != ""){
		var valUnitarioUnmasked = $("#valUnitarioCTF___"+numLinha).maskMoney('unmasked')[0];
		var valUnitario = parseFloat(valUnitarioUnmasked);
		console.log("valUnitarioCTF após parseFloat: "+valUnitario);
		var valUnitarioFormatado = valUnitario.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
		console.log("valUnitarioCTF após formatacao de moeda: "+valUnitarioFormatado);
	}else{
		var valUnitario = 0.00;
		var valUnitarioFormatado = valUnitario.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#valUnitarioCTF_resumo").val( valUnitarioFormatado );
	
	//===========================================================================================================
	var freteItemCT = $("#freteItemCTF___"+numLinha).val();
	if(freteItemCT != ""){
		var freteItem = parseFloat(freteItemCT);
		var freteFormatado = freteItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var freteItem = 0.00;
		var freteFormatado = freteItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#freteItemCTF_resumo").val( freteFormatado );
	
	//===========================================================================================================	
	var descontoItemCT = $("#descontoItemCTF___"+numLinha).val();
	if(descontoItemCT != ""){
		var descontoItem = parseFloat(descontoItemCT);
		var descontoFormatado = descontoItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var descontoItem = 0.00;
		var descontoFormatado = descontoItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#descontoItemCTF_resumo").val( descontoFormatado );
	
	//===========================================================================================================
	var icmsItemCT = $("#icmsItemCTF___"+numLinha).val();
	if(icmsItemCT != ""){
		var icmsItem = parseFloat(icmsItemCT);
		var icmsItemFormatado = icmsItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var icmsItem = 0.00;
		var icmsItemFormatado = icmsItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#icmsItemCTF_resumo").val( icmsItemFormatado );
	
	//===========================================================================================================
	var ipiItemCT = $("#ipiItemCTF___"+numLinha).val();
	if(ipiItemCT != ""){
		var ipiItem = parseFloat(ipiItemCT);
		var ipiFormatado = ipiItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var ipiItem = 0.00;
		var ipiFormatado = ipiItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}
	$("#ipiItemCTF_resumo").val( ipiFormatado );
	
	//===========================================================================================================
	var pisItemCT = $("#pisItemCTF___"+numLinha).val();
	if(pisItemCT != ""){
		var pisItem = parseFloat(pisItemCT);
		var pisFormatado = pisItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var pisItem = 0.00;
		var pisFormatado = pisItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}	
	$("#pisItemCTF_resumo").val( pisFormatado );
	
	//===========================================================================================================
	var cofinsItemCT = $("#cofinsItemCTF___"+numLinha).val();
	if(cofinsItemCT != ""){
		var cofinsItem = parseFloat(cofinsItemCT);
		var cofinsFormatado = cofinsItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var cofinsItem = 0.00;
		var cofinsFormatado = cofinsItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}		
	$("#cofinsItemCTF_resumo").val( cofinsFormatado );
	
	//===========================================================================================================
	var issItemCT = $("#issItemCTF___"+numLinha).val();
	if(issItemCT != ""){
		var issItem = parseFloat(issItemCT);
		var issFormatado = issItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var issItem = 0.00;
		var issFormatado = issItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}		
	$("#issItemCTF_resumo").val( issFormatado );
	
	//===========================================================================================================
	var inssItemCT = $("#inssItemCTF___"+numLinha).val();
	if(inssItemCT != ""){
		var inssItem = parseFloat(inssItemCT);
		var inssFormatado = inssItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var inssItem = 0.00;
		var inssFormatado = inssItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}		
	$("#inssItemCTF_resumo").val( inssFormatado );
	
	//===========================================================================================================
	var irItemCT = $("#irItemCTF___"+numLinha).val();
	if(irItemCT != ""){
		var irItem = parseFloat(irItemCT);
		var irFormatado = irItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var irItem = 0.00;
		var irFormatado = irItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}		
	$("#irItemCTF_resumo").val( irFormatado );
	
	//===========================================================================================================
	var csllItemCT = $("#csllItemCTF___"+numLinha).val();
	if(csllItemCT != ""){
		var csllItem = parseFloat(csllItemCT);
		var csllFormatado = csllItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var csllItem = 0.00;
		var csllFormatado = csllItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}		
	$("#csllItemCTF_resumo").val( csllFormatado );
	
	//===========================================================================================================
	var outroImpostoVlrItemCT = $("#outroImpostoVlrItemCTF___"+numLinha).val();
	if(outroImpostoVlrItemCT != ""){
		var outroImpostoVlrItem = parseFloat(outroImpostoVlrItemCT);
		var outroImpostoVlrFormatado = outroImpostoVlrItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var outroImpostoVlrItem = 0.00;
		var outroImpostoVlrFormatado = outroImpostoVlrItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}		
	$("#outroImpostoVlrItemCTF_resumo").val( outroImpostoVlrFormatado );
	
	//===========================================================================================================
	var totalItemCT = $("#totalItemCTF___"+numLinha).val();
	if(totalItemCT != ""){
		var totalItemCT = $("#totalItemCTF___"+numLinha).maskMoney('unmasked')[0];
		var totalItem = parseFloat(totalItemCT);
		var totalItemFormatado = totalItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}else{
		var totalItem = 0.00;
		var totalItemFormatado = totalItem.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
	}	
	$("#totalItemCTF_resumo").val( totalItemFormatado );
	
	$("#descItemCTF_resumo").attr("readonly","readonly" );
	$("#codItemCTF_resumo").attr("readonly","readonly" );
	$("#itemDisponibilizadoCTF_resumo").attr("readonly","readonly" );
	$("#qtdSolicitadaCTF_resumo").attr("readonly","readonly" );
	$("#qtdDisponibilizadaCTF_resumo").attr("readonly","readonly" );
	$("#valUnitarioCTF_resumo").attr("readonly","readonly" );
	$("#freteItemCTF_resumo").attr("readonly","readonly" );
	$("#descontoItemCTF_resumo").attr("readonly","readonly" );
	$("#icmsItemCTF_resumo").attr("readonly","readonly" );
	$("#ipiItemCTF_resumo").attr("readonly","readonly" );
	$("#pisItemCTF_resumo").attr("readonly","readonly" );
	$("#cofinsItemCTF_resumo").attr("readonly","readonly" );
	
	$("#issItemCTF_resumo").attr("readonly","readonly" );
	$("#inssItemCTF_resumo").attr("readonly","readonly" );
	$("#irItemCTF_resumo").attr("readonly","readonly" );
	$("#csllItemCTF_resumo").attr("readonly","readonly" );
	$("#outroImpostoDescCTF_resumo").attr("readonly","readonly" );
	$("#outroImpostoVlrCTF_resumo").attr("readonly","readonly" );
	
	$("#totalItemCTF_resumo").attr("readonly","readonly" );
	$("#totalItemCTF_resumo").css("background-color","#F3f3f3" );
	
	$("#infoComplItemSCCTF_resumo").attr("readonly","readonly" );
	$("#infoComplItemFornecCTF_resumo").attr("readonly","readonly" );

	$("#btnOcultaItemCTF").show();
	
}

function ocultaItemCotacao(){
	//console.log("entrou ocultaItemCotacao");
	$("#divDetalhesItemCotacao").hide();
	
	$("#totalItemCT").val( "" );
	
	$("#descItemCT").val("");
	$("#infoComplItemSCCT").val("");
	$("#qtdSolicitadaCT").val("");
	$("#totalItemCT").val("");
	$("#totalItemCT").css("background-color","#FFF" );
	
	$("#codItemCT").val("");
	$("#itemDisponibilizadoCT").val("");
	$("#qtdDisponibilizadaCT").val("");
	$("#valUnitarioCT").val("");
	$("#freteItemCT").val("");
	$("#descontoItemCT").val("");
	$("#icmsItemCT").val("");
	$("#ipiItemCT").val("");
	$("#pisItemCT").val("");
	$("#cofinsItemCT").val("");
	
	$("#issItemCT").val("");
	$("#inssItemCT").val("");
	$("#irItemCT").val("");
	$("#csllItemCT").val("");
	$("#outroImpostoDescCT").val("");
	$("#outroImpostoVlrCT").val("");
	
	$("#infoComplItemFornecCT").val("");
	
}

function ocultaItemCotacaoFinal(){
	//console.log("entrou ocultaItemCotacao");
	$("#divDetalhesItemCotacaoFinal").hide();
	
	$("#totalItemCTF_resumo").val( "" );
	
	$("#descItemCTF_resumo").val("");
	$("#infoComplItemSCCTF_resumo").val("");
	$("#qtdSolicitadaCTF_resumo").val("");
	$("#totalItemCTF_resumo").val("");
	$("#totalItemCTF_resumo").css("background-color","#FFF" );
	
	$("#codItemCTF_resumo").val("");
	$("#itemDisponibilizadoCTF_resumo").val("");
	$("#qtdDisponibilizadaCTF_resumo").val("");
	$("#valUnitarioCTF_resumo").val("");
	$("#freteItemCTF_resumo").val("");
	$("#descontoItemCTF_resumo").val("");
	$("#icmsItemCTF_resumo").val("");
	$("#ipiItemCTF_resumo").val("");
	$("#pisItemCTF_resumo").val("");
	$("#cofinsItemCTF_resumo").val("");
	
	$("#issItemCTF_resumo").val("");
	$("#inssItemCTF_resumo").val("");
	$("#irItemCTF_resumo").val("");
	$("#csllItemCTF_resumo").val("");
	$("#outroImpostoDescCTF_resumo").val("");
	$("#outroImpostoVlrCTF_resumo").val("");
	
	$("#infoComplItemFornecCTF_resumo").val("");
	
}


function verificaFiltroEmp(){
	console.log("entrou verificaFiltroEmp");
	/*var res = '';
		  var items = document.getElementsByName('filtroEmpresa');
		  for (var i = 0; i < items.length; i++) {
			if (items[i].checked) {
			  res = items[i].value
			  break;
			}
		  }  
		  console.log("valor filtroEmpresa: "+res);
		  if(res != ""){
			 $("#filtroEmpresaTXT").val(res);
			  
		  }*/
		  
	 $("#filtroEmpresaTXT").val($("#filtroEmpresa").val());
	
}

//##################################################################################
//FUNÇÃO EXIBE BOTAO DE UPLOAD
//##################################################################################
function exibeBtnUpload(conteudo){
	console.log("conteudo: "+conteudo+ " - Tamanho: "+conteudo.length);
	
	if($("#descDocTemp").val() != "" && conteudo.length >= 4 ){
		$("#btnUpload").show();
		$("#btnUploadOFF").hide();
	}else{
		$("#btnUpload").hide();
		$("#btnUploadOFF").show();
	}
		
}

function emiteAlertaDoc(){
	FLUIGC.toast({
		 title: '',
		 message: "Necessário informar uma descrição para o documento!",
		 type: 'danger'
	 });
	
}



function downloadDocumento(este, tbDoc){ 
	var campo = $(este).closest('tr').find('.exclude').attr('id');
	var idcampo = campo.split("___");
	var documento = $('#idDocumento${tbDoc}___${idcampo[1]}').val();
	var url = 'http://fluighml.vs.unimed.com.br:8080/webdesk/webdownload?documentId=${documento}&version=1000&tenantId=1';
	var win = window.open(url);
}

function excluirDocumento(este, tbDoc){
	var campo = $(este).closest('tr').find('.exclude').attr('id');
	var idcampo = campo.split("___");
	var usuario = $("#matAtual").val();

	var idDocumento = $('#idDocumento${tbDoc}___${idcampo[1]}').val();
	console.log(usuario + " " + idDocumento)
	var c1 = DatasetFactory.createConstraint("GUIA", idDocumento, idDocumento, ConstraintType.MUST);
	var c2 = DatasetFactory.createConstraint("USUARIO", usuario, usuario, ConstraintType.MUST);
	var constraints = new Array(c1,c2);

	var dataset = DatasetFactory.getDataset("dsDeleteDocument",null,constraints,null);

	var row = dataset.values[0];

	var id = varreTabela('tbDocs${tbDoc}');

	for(i=0;i<id.length;i++){
		if( $('#idDocumento${tbDoc}___${id[i]}').val() == idDocumento ){
			var par = $('#idDocumento${tbDoc}___${id[i]}').parent().parent(); //tr
		    par.remove();
		}
	}
}

function updateDocumento(documento){
	var c0 = DatasetFactory.createConstraint("documento", documento, documento, ConstraintType.MUST);
	var c1 = DatasetFactory.createConstraint("notificacao", false, false, ConstraintType.MUST);
	var c2 = DatasetFactory.createConstraint("expira", false, false, ConstraintType.MUST);
	var dataset = DatasetFactory.getDataset("dsUpdateDocumentECM", null, new Array(c0, c1, c2), null);
}

function visualizarDocumento(este, tbDoc){
	var campo = $(este).closest('tr').find('.exclude').attr('id');
	var idcampo = campo.split("___");
	var documento = $('#idDocumento${tbDoc}___${idcampo[1]}').val();
	var url = "http://fluig.vs.unimed.com.br:8080/portal/p/1/ecmnavigation?app_ecm_navigation_doc="+documento;
	var win = window.open(url, '_blank');
	win.focus();
}

function registraDocumento(data, id){
	var pos = wdkAddChild("tbDocumentos");
	$("#nomeArquivoUpload___"+pos).val(data.content.description);
	$("#nomeDocumento___"+pos).val(data.content.description);
	$("#descDocumento___"+pos).val($("#descDocTemp").val());
	$("#numDocumento___"+pos).val(data.content.id);
	$("#dataUpload___"+pos).val(data.content.createDate);
	$("#codRespUpload___"+pos).val(data.content.colleagueId);
	$("#docReferente___"+pos).val($("#docReferenteTEMP option:selected").text());
	$("#codDocReferente___"+pos).val($("#docReferenteTEMP").val());
	
	var constraintColleague1 = DatasetFactory.createConstraint('colleaguePK.colleagueId', data.content.colleagueId, data.content.colleagueId, ConstraintType.MUST);
	var colunasColleague = new Array('colleagueName');
	var dataset = DatasetFactory.getDataset('colleague', colunasColleague, new Array(constraintColleague1), null);

	var row = dataset.values[0];
	
	$("#respUpload___"+pos).val(row["colleagueName"]);
	
	$("#descDocTemp").val("");
	$("#docReferenteTEMP").val("");
	
	btnDocumentos();
}

function pesquisaPasta(){
	console.log("entrou pesquisaPasta");
	
	var numSCEmp = $("#numSCEmp").val();
	var numSolicitacao = $("#numSolicitacao").val();
	var parentDocument = ID_PASTA_PAI;
	
	var descricao = numSCEmp+"_"+numSolicitacao;
	
	var c0 = DatasetFactory.createConstraint("descricao", descricao, descricao, ConstraintType.MUST);
	var dataset = DatasetFactory.getDataset("dsPesquisaPastaECM", null, new Array(c0), null);
	
	for(var i=0;i<dataset.values.length;i++){
		var row = dataset.values[i];
		console.log("DS_PRINCIPAL_DOCUMENTO: "+row["DS_PRINCIPAL_DOCUMENTO"]);
		if(row["DS_PRINCIPAL_DOCUMENTO"] == ""){
			criarPasta(descricao, parentDocument);
		}else{
			ID_PASTA_UPLOAD = row["NR_DOCUMENTO"];
		}
		
	}
	
}

function criarPasta(nomePasta, parentDocument){
	console.log("entrou criarPasta");
	var codUsuario = $("#codSolicitante").val();

	var c0 = DatasetFactory.createConstraint('nomePasta', nomePasta, nomePasta, ConstraintType.MUST);
	var c1 = DatasetFactory.createConstraint('ParentDocument', parentDocument, parentDocument, ConstraintType.MUST);
	var c2 = DatasetFactory.createConstraint('publisher', codUsuario, codUsuario, ConstraintType.MUST);
	var constraints = new Array(c0, c1,c2);

	var dataset = DatasetFactory.getDataset("dsCriaPastaECM",null,constraints,null);
	var row = dataset.values[0];

	var dado = row["documentId"];
	
	console.log("Código pasta criada - documentId: "+dado);
	
	$("#diretorioCotacao").val(dado);
	
	ID_PASTA_UPLOAD = dado;

	return dado;
}

function populaDocReferenteTEMP(){
	
	var tbGradeProdutos = varreTabela("tbGradeProdutos");
	var descricaoItem = new Array();
	
	$("#docReferenteTEMP option").remove();
	
	$("#docReferenteTEMP").append($('<option>', {
		value: "",
		text: "Cotação Geral"
	}));
	
	for(var i=0;i<tbGradeProdutos.length;i++){	
		$("#docReferenteTEMP").append($('<option>', {
			value: $("#codProdutoSC___"+tbGradeProdutos[i]).val(),
			text: $("#descrProdutoSC___"+tbGradeProdutos[i]).val()
		}));
	}

}

function btnDocumentos(){
	
	var id = varreTabela("tbDocumentos");
	
	var btn = "<a href=\"javascript:void(0);\" onclick=\"visualizaDocumento(this)\"><span class=\"fluigicon fluigicon-eye-open fluigicon-xl\" style=\"color:#4682B4;font-size:22px;\"></span></a>"+
		"&nbsp;&nbsp;&nbsp;&nbsp;<a onclick=\"excluiDocumento(this)\" href=\"javascript:void(0);\"><span class=\"fluigicon fluigicon-remove-circle fluigicon-lg\" style=\"color:#8B0000;font-size:18px;\"></span></a>";
	
	$("#tbDocumentos tbody tr .acoestbDocumentos").each(function(){
		var campo = $(this).attr("id");
		var pos = campo.lastIndexOf("___");
		if(pos > 0){
			var elemento = $(this).prev();
			$(elemento).html('');
		}
	});

	$("#tbDocumentos tbody tr .acoestbDocumentos").each(function(){
		var campo = $(this).attr("id");
		var pos = campo.lastIndexOf("___");
		
		if(pos > 0){
			var elemento = $(this).prev();
			var elemento2 = $(this).parent().parent().find('td').first().find('.exclude').attr('id');
			var pos2 = elemento2.split("___");
		
			$(elemento).append(btn);				
		}
	});
	
}


function visualizaDocumento(idDocumento){
	console.log("entrou visualizaDocumento");
	console.log(idDocumento);
	var elemento = $(idDocumento).parent().next().attr('id');
	var pos = elemento.split("___");
	console.log("pos: "+pos);
	
	var idDocumento = $("#numDocumento___"+pos[1]).val();
		
	var destino = URL_FLUIG+"/portal/p/1/ecmnavigation?app_ecm_navigation_doc="+idDocumento;
	console.log("DESTINO:");
	console.log(destino);
	
	window.open(URL_FLUIG+"/portal/p/1/ecmnavigation?app_ecm_navigation_doc="+idDocumento, "_blank");
}

//##################################################################################
//FUNÇÃO EXCLUI DOCUMENTO DO ECM
//##################################################################################
function excluiDocumento(obj){
	console.log("entrou excluiDocumento");
	console.log(obj);
	var elemento = $(obj).parent().next().attr('id');
	var pos = elemento.split("___");
	console.log("pos: "+pos);

	
	FLUIGC.message.confirm({
		message: 'Deseja realmente excluir este arquivo?',
		title: 'Atenção',
		labelYes: 'Ok',
		labelNo: 'Cancelar'
	}, function(result, el, ev) {				 
	  if(result==true){	 	
			var idDocumento = $("#numDocumento___"+pos[1]).val();
			console.log("idDocumento: "+idDocumento);
			var codUser = $("#codUsuario").val();
			var c1 = DatasetFactory.createConstraint("GUIA", idDocumento, idDocumento, ConstraintType.MUST);
			var c2 = DatasetFactory.createConstraint("codUsuario", codUser ,codUser, ConstraintType.MUST);
			var constraints = new Array(c1,c2);
			var dataset = DatasetFactory.getDataset("dsDeleteDocument",null,constraints,null);

			row = dataset.values[0];
			var id = varreTabela("tbDocumentos");
			
			for(i=0;i<id.length;i++){
				if( $("#numDocumento___"+id[i]).val() == idDocumento ){
					var par = $("#excludetbDocumentos___"+id[i]).parent().parent(); //tr
					par.remove();
				}
			}
						
			FLUIGC.toast({
				title: '',
				message: 'Documento excluído com sucesso!',
				type: 'success'
			});
	  }
	});	
	
	
}
