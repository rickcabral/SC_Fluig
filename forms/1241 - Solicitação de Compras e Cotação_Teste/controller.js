function controller() {
	console.log("entrou controller");

	var numAtividade = $("#numAtividade").val();

	var codUser = $("#codUsuario").val();

	var c1 = DatasetFactory.createConstraint("matUsuarioCorrente", codUser, codUser, ConstraintType.MUST);
	var constraintColleague1 = DatasetFactory.createConstraint('colleaguePK.colleagueId', codUser, codUser, ConstraintType.MUST);
	var colunasColleague = new Array('colleaguePK.colleagueId', 'colleagueName', 'mail', 'login');
	var datasetColleague = DatasetFactory.getDataset('colleague', colunasColleague, new Array(constraintColleague1), new Array('colleagueName'));

	var row = datasetColleague.values[0];
	//$("#nomeRespAtual").val(row["colleagueName"]);



	//===============================================
	//		0 ou 4 - ABERTURA DA SOLICITACAO
	//===============================================	
	//console.log("NUM ATIVIDADE: "+numAtividade);
	if (numAtividade == "0" || numAtividade == "4") {
		$("#selecaoFornecedores").hide();
		
		getVerificaUserProtheus();
		
		getSolicitanteCompras();
		getEmpresa();
		getProduto();
		retornaUser();
		getVerificaUserProtheus();
		getFornecedor();
		
		if($("#tipoSC").val() == "produto"){
			$("#pn-produto").show();
			$("#pn-servico").hide();
		}else if($("#tipoSC").val() == "servico"){
			$("#pn-produto").show();
			$("#pn-servico").hide();
		}else{
			$("#pn-produto").show();
			$("#pn-servico").hide();
		}

		var dataAtual = new Date();

		var dia = dataAtual.getDate();
		var mes = dataAtual.getMonth();
		var ano = dataAtual.getFullYear();

		h = dataAtual.getHours();
		m = dataAtual.getMinutes();
		s = dataAtual.getSeconds();

		var mes2 = parseInt(mes) + 1;

		if (parseInt(dia) < 10) {
			dia = "0" + dia;
		}

		if (parseInt(mes2) < 10) {
			mes2 = "0" + mes2;
		}

		var dataFormatada = dia + '/' + (mes2) + '/' + ano;
		var dataInvertida = ano.toString()+mes2.toString()+dia.toString();
		
		$("#dt_emissao").val(dataFormatada);
		$("#dataEmissaoFormatada").val(dataInvertida);


	}

	if (numAtividade == "4") {
		
		//btntbCotacao();
		//btnTbItensCotacao();
		//carregaBtnPossuiItem();
		if($("#numSC").val() != ""){
			btnTbProdutosTempSC("SOMENTE_LEITURA");
		}else{
			btnTbProdutosTempSC();
		}
	}
	
	if (numAtividade == "5") {
		
		blockDadosSol();
		
		btnTbProdutosTempSC();
		populaDocReferenteTEMP();
		pesquisaPasta();
		exibeBtnUpload("");
		btnDocumentos();
		//$("#filtroEmpresaTXT").val($("#filtroEmpresa").val());
		$(".thAcoesItensCotacao").hide();
		$(".divTempItensCotacao").hide();
		$("#divDetalhesItemCotacao").hide();
		$("#divResumoCotacaoFinal").hide();
		$("#divMotivoEscolhaCotacao").hide();
		$("#divItensCotacao").hide();
		$("#title-tbCotacao").append("FORNECEDORES COTAÇÃO");
		getFornecedor();
		 
	}
	
		
	if (numAtividade == "10") {
		
		blockDadosSol();
		btnTbProdutosTempSC();
		populaDocReferenteTEMP();
		pesquisaPasta();
		btntbCotacao();
		exibeBtnUpload("");
		btnDocumentos();
		formataTbCotacaoMoeda();
		formataTbItensCotacaoMoeda();
		$("#tempSelecaoFornecedor").hide();
		$("#divMotivoEscolhaCotacao").hide();
		//$(".thAcoesItensCotacao").hide();
		$(".divTempItensCotacao").hide();
		$("#divDetalhesItemCotacao").hide();
		$("#divResumoCotacaoFinal").hide();
		$("#divItensCotacao").hide();
		$("#title-tbCotacao").append("COTAÇÃO");
	}
	
	if (numAtividade == "12") {
		
		blockDadosSol();
		btnTbProdutosTempSC();
		btntbCotacao();
		populaDocReferenteTEMP();
		pesquisaPasta();
		exibeBtnUpload("");
		btnDocumentos();
		carregaBtnEscolhaItem();
		formataTbCotacaoMoeda();
		formataTbItensCotacaoMoeda();
		$("#tempSelecaoFornecedor").hide();
		//$(".thAcoesItensCotacao").hide();
		
		$(".divTempItensCotacao").hide();
		$("#divBtnEscolheCotacao").hide();
		$(".pnCotacaoFinal").show();
		$("#divMotivoEscolhaCotacao").show();
		$("#divDetalhesItemCotacao").hide();
		$("#divItensCotacao").hide();
		$("#title-tbCotacao").append("COTAÇÃO");
		somaTotalFornecedorFinal();
		
	}
	
	if (numAtividade == "16") {
		
		blockDadosSol();
		btnTbProdutosTempSC();
		populaDocReferenteTEMP();
		pesquisaPasta();
		exibeBtnUpload("");
		btnDocumentos();
		btntbCotacaoFinal();
		carregaBtnPossuiItemFinal();
		
		formataTbCotacaoMoeda();
		formataTbItensCotacaoMoeda();
		formataTbCotacaoFinalMoeda();
		formataTbItensCotacaoFinalMoeda();
		
		btnTbItensCotacaoFinal();
		btnTbItensCotacaoFinal();
		$("#tempSelecaoFornecedor").hide();
		//$(".thAcoesItensCotacao").hide();
		$(".divTempItensCotacao").hide();
		$(".pnCotacaoFinal").show();
		$("#divMotivoEscolhaCotacao").show();
		$(".pnCotacao").hide();
		$("#divDetalhesItemCotacao").hide();
		$("#divItensCotacao").hide();
		$("#title-tbCotacao").append("COTAÇÃO");
		somaTotalFornecedorFinal();
		
	}
	
	if (numAtividade == "18") {
		
		blockDadosSol();
		btnTbProdutosTempSC();
		populaDocReferenteTEMP();
		pesquisaPasta();
		exibeBtnUpload("");
		btnDocumentos();
		btntbCotacaoFinal();
		carregaBtnPossuiItemFinal();
		
		//formataTbCotacaoMoeda();
		//formataTbItensCotacaoMoeda();
		//formataTbCotacaoFinalMoeda();
		//formataTbItensCotacaoFinalMoeda();
		
		if($("#tipoSCTXT").val() == "PRODUTO"){
			$("#divBtnGeraPedCompras").show();
		}else{
			$("#divBtnGeraSolContratos").show();
		}
		
		btnTbItensCotacaoFinal();
		btnTbItensCotacaoFinal();
		$("#tempSelecaoFornecedor").hide();
		//$(".thAcoesItensCotacao").hide();
		$(".divTempItensCotacao").hide();
		$(".pnCotacaoFinal").show();
		$("#divMotivoEscolhaCotacao").show();
		$(".pnCotacao").hide();
		$("#divDetalhesItemCotacao").hide();
		$("#divItensCotacao").hide();
		$("#title-tbCotacao").append("COTAÇÃO");
		
	}
	

}

function blockDadosSol() {

	$("#empresa").attr("disabled", "disabled");
	$("#filial").attr("disabled", "disabled");
	$("#tipoSC").attr("disabled", "disabled");
	$("#possuiContrato").attr("disabled", "disabled");
	$("#aditivo").attr("disabled", "disabled");
	$("#tipoMaterial").attr("disabled", "disabled");
	$("#dataNecessidade").attr("disabled", "disabled");
	$("#dataNecessidade").val($("#dataNecessidadeTXT").val());
	$("#dataNecessidade").css("background-color","#f2f2f2");
	
	if($("#tipoSCTXT").val() == "PRODUTO"){
		$("#pn-produto").show();
		$("#pn-servico").hide();
		$(".divTempProdutos").hide();
	}else if($("#tipoSCTXT").val() == "SERVICO"){
		$(".servicoDiv").show();
		$("#pn-produto").show();
		$("#pn-servico").hide();
		$(".divTempProdutos").hide();
	}else{
		$(".servicoDiv").hide();
		$("#pn-produto").show();
		$("#pn-servico").hide();
		$(".divTempProdutos").hide();
	}
	
	$("#divBtnGeraSolCompras").hide();
	
	$("#tipoSC").val( $("#tipoSCTXT").val() );
	$("#possuiContrato").val( $("#possuiContratoTXT").val() );
	$("#aditivo").val( $("#aditivoTXT").val() );
	$("#tipoMaterial").val( $("#tipoMaterialTXT").val() );
	
	
	var empresaOBJ = $("#empresaOBJ").val();
	
	if(empresaOBJ != ""){
		var obj = JSON.parse(empresaOBJ);
		$("#empresa option").remove();
		$("#empresa").append($('<option>', {
			value: obj[0].selecionado,
			text: obj[0].text
		}));
		$("#empresa").val(obj[0].selecionado);
	}
	
	var filialOBJ = $("#filialOBJ").val();
	
	if(filialOBJ != ""){
		var obj = JSON.parse(filialOBJ);
		$("#filial option").remove();
		$("#filial").append($('<option>', {
			value: obj[0].selecionado,
			text: obj[0].text
		}));
		$("#filial").val(obj[0].selecionado);
	}


}

function formataTbCotacaoMoeda(){
	console.log("entrou formataTbCotacaoMoeda");
	var tbCotacao = varreTabela("tbCotacao");
	
	for(var i=0;i<tbCotacao.length;i++){
		var totalItens = $("#totalItens___"+tbCotacao[i]).val();
		if(totalItens.indexOf("R$") > -1){
			totalItens = $("#totalItens___"+tbCotacao[i]).maskMoney('unmasked')[0];
		}
		if(totalItens != ""){
			var totalItemMoeda = parseFloat(totalItens);
			totalItemMoeda = totalItemMoeda.toFixed(2);
			totalItemMoeda = totalItemMoeda.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
			$("#totalItens___"+tbCotacao[i]).val(totalItemMoeda);	
		}else{
			totalItemMoeda = 0.00;
			totalItemMoeda = totalItemMoeda.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
			$("#totalItens___"+tbCotacao[i]).val(totalItemMoeda);	
		}
		

		var totalCotacao = $("#totalCotacao___"+tbCotacao[i]).val();
		console.log("totalCotacao "+tbCotacao[i]+" antes do parseFloat: "+totalCotacao);
		
		if(totalCotacao.indexOf("R$") > -1){
			totalCotacao = $("#totalCotacao___"+tbCotacao[i]).maskMoney('unmasked')[0];
		}
		if(totalCotacao != "" ){
			var totalCotacaoMoeda = parseFloat(totalCotacao);
			totalCotacaoMoeda = totalCotacaoMoeda.toFixed(2);
			totalCotacaoMoeda = parseFloat(totalCotacaoMoeda);
			
			console.log("totalCotacao após parseFloat: "+totalCotacaoMoeda);
			totalCotacaoMoeda = totalCotacaoMoeda.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
			console.log("totalCotacao após moeda: "+totalCotacaoMoeda);
			$("#totalCotacao___"+tbCotacao[i]).val(totalCotacaoMoeda);	
			
		}else{
			totalCotacaoMoeda = 0.00;
			totalCotacaoMoeda = totalCotacaoMoeda.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
			$("#totalCotacao___"+tbCotacao[i]).val(totalCotacaoMoeda);
		}
		
		
		var totalDescontos = $("#totalDescontos___"+tbCotacao[i]).val();
		if(totalDescontos.indexOf("R$") > -1){
			totalDescontos = $("#totalDescontos___"+tbCotacao[i]).maskMoney('unmasked')[0];
		}
		if(totalDescontos != ""){
			var totalDescontosMoeda = parseFloat(totalDescontos);
			totalDescontosMoeda = totalDescontosMoeda.toFixed(2);
			totalDescontosMoeda = parseFloat(totalDescontosMoeda);
			totalDescontosMoeda = totalDescontosMoeda.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
			console.log("totalDescontosMoeda após moeda: "+totalDescontosMoeda);
			$("#totalDescontos___"+tbCotacao[i]).val(totalDescontosMoeda);
		}else{
			totalDescontosMoeda = 0.00;
			totalDescontosMoeda = totalDescontosMoeda.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
			$("#totalDescontos___"+tbCotacao[i]).val(totalDescontosMoeda);
		}
		
		
		var totalImpostos = $("#totalImpostos___"+tbCotacao[i]).val();
		if(totalImpostos.indexOf("R$") > -1){
			totalImpostos = $("#totalImpostos___"+tbCotacao[i]).maskMoney('unmasked')[0];
		}
		if(totalImpostos != ""){
			var totalImpostosMoeda = parseFloat(totalImpostos);
			totalImpostosMoeda = totalImpostosMoeda.toFixed(2);
			totalImpostosMoeda = parseFloat(totalImpostosMoeda);
			var totalImpostosMoeda = totalImpostosMoeda.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
			console.log("totalImpostosMoeda após moeda: "+totalImpostosMoeda);
			$("#totalImpostos___"+tbCotacao[i]).val(totalImpostosMoeda);
		}else{
			totalImpostosMoeda = 0.00;
			totalImpostosMoeda = totalImpostosMoeda.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
			$("#totalImpostos___"+tbCotacao[i]).val(totalImpostosMoeda);
		}

	}
	
}

function formataTbCotacaoFinalMoeda(){
	
	var tbCotacao = varreTabela("tbCotacaoFinal");
	
	for(var i=0;i<tbCotacao.length;i++){
		var totalItens = $("#totalItensCTF___"+tbCotacao[i]).val();
		if(totalItens.indexOf("R$") > -1){
			totalItens = $("#totalItensCTF___"+tbCotacao[i]).maskMoney('unmasked')[0];
		}
		var totalItemMoeda = totalItens.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
		$("#totalItensCTF___"+tbCotacao[i]).val(totalItemMoeda);	
		
		var totalCotacao = $("#totalCotacaoCTF___"+tbCotacao[i]).val();
		if(totalCotacao.indexOf("R$") > -1){
			totalCotacao = $("#totalCotacaoCTF___"+tbCotacao[i]).maskMoney('unmasked')[0];
		}
		//console.log(">>> totalCotacao: "+totalCotacao);
		if(totalCotacao != "" ){
			totalCotacao = parseFloat(totalCotacao);
			var subtotalMoeda = totalCotacao.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
			$("#totalCotacaoCTF___"+tbCotacao[i]).val(subtotalMoeda);	
		}
		var totalDescontos = $("#totalDescontosCTF___"+tbCotacao[i]).val();
		if(totalDescontos.indexOf("R$") > -1){
			totalDescontos = $("#totalDescontosCTF___"+tbCotacao[i]).maskMoney('unmasked')[0];
		}
		totalDescontos = parseFloat(totalDescontos);
		var totalDescontoMoeda = totalDescontos.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
		$("#totalDescontosCTF___"+tbCotacao[i]).val(totalDescontoMoeda);	
		
		var totalImpostos = $("#totalImpostosCTF___"+tbCotacao[i]).val();
		if(totalImpostos.indexOf("R$") > -1){
			totalImpostos = $("#totalImpostosCTF___"+tbCotacao[i]).maskMoney('unmasked')[0];
		}
		totalImpostos = parseFloat(totalImpostos);
		var totalImpostosMoeda = totalImpostos.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
		$("#totalImpostosCTF___"+tbCotacao[i]).val(totalImpostosMoeda);	
	
	}
	
}


