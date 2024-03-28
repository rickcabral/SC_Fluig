function validaEdicao(campo,tipoCampo) {
	
	if ($("#"+campo).val() == "" && (tipoCampo == "text" || tipoCampo == "select" || tipoCampo == "textarea")) {
		console.log("valor select: *"+$("#"+campo).val()+"*");
		$("#"+campo).css('background', '#ffe6e6');
		var label = $("#"+campo).prev();
		$(label).css('color', '#c12020');
	}else if ($("#"+campo).val() != "" && (tipoCampo == "text" || tipoCampo == "select" || tipoCampo == "textarea")) {
		$("#"+campo).css('background', '');
		var label = $("#"+campo).prev();
		$(label).css('color', '');
	}
	
	if ($("#"+campo).val() == "" && tipoCampo == "email") {
		$("#"+campo).css('background', '#ffe6e6');
		var label = $("#"+campo).prev();
		$(label).css('color', '#c12020');
	}if ($("#"+campo).val() != "" && tipoCampo == "email") {
		var erroEmail = validaEmail($("#"+campo).val());
		if(erroEmail >0){
			$("#"+campo).css('background', '#ffe6e6');
			var label = $("#"+campo).prev();
			$(label).css('color', '#c12020');	
		}else{
			$("#"+campo).css('background', '');
			var label = $("#"+campo).prev();
			$(label).css('color', '');
		}
		
	}else{
		$("#"+campo).css('background', '');
		var label = $("#"+campo).prev();
		$(label).css('color', '');
	}
	
			

	if ( ($("#"+campo).val() == "" || $("#"+campo).val() == undefined) && (tipoCampo == "select2") ) {
		$("#"+campo).parent().find("span").css("background", "#ffe6e6");
		$("#clean_"+campo).css("background", "#ffF");
		$("#lb_"+campo).css('color', '#c12020');
		
	} else if ( ($("#"+campo).val() != "" && $("#"+campo).val() != undefined) && (tipoCampo == "select2") ) {
		$("#"+campo).parent().find("span").css("background", "#fff");
		$("#lb_"+campo).css('color', '');
		$("#clean_"+campo).css("background", "#ffF");
	}

	if(tipoCampo == "select2"){
		$("#cleanProdutoTemp").css("background", "#fff");
	}
	
	if(tipoCampo == "date"){
		var valorCampo = $("#dataNecessidade").val();
		var objDate = valorCampo.split("/");
		var dataFormatada = new Date(objDate[2], objDate[1] - 1, objDate[0]);
	}
	
	var dataAtual = new Date();
	var dia = dataAtual.getDate();
	var mes = dataAtual.getMonth() + 1;
	var ano = dataAtual.getFullYear();

	var hoje = dia + "/" + mes + "/" + ano;

	var partesHoje = hoje.split("/");
	var dataHoje = new Date(partesHoje[2], partesHoje[1] - 1, partesHoje[0]);
	
	if (  $("#"+campo).val() == "" && tipoCampo == "date"){
		$("#"+campo).css('background', '#ffe6e6');
		$("#lb_"+campo).css('color', '#c12020');
	}else if(dataFormatada < dataHoje && tipoCampo == "date") {
		$("#"+campo).css('background', '#ffe6e6');
		$("#lb_"+campo).css('color', '#c12020');
	}else if(dataFormatada >= dataHoje && tipoCampo == "date") {
		console.log("entrou terceiro if campo date");
		$("#"+campo).css('background', '#FFF');
		$("#lb_"+campo).css('color', '');
	}
	
	
}

function validaTbGradeProdutos(){
	var contErro = 0;
	
	var dataAtual = new Date();
	var dia = dataAtual.getDate();
	var mes = dataAtual.getMonth() + 1;
	var ano = dataAtual.getFullYear();

	var hoje = dia + "/" + mes + "/" + ano;

	var partesHoje = hoje.split("/");
	var dataHoje = new Date(partesHoje[2], partesHoje[1] - 1, partesHoje[0]);
	
	if ($("#produtoTemp").val() == "" || $("#produtoTemp").val() == undefined) {
		$("#produtoTemp").parent().find("span").css("background", "#ffe6e6");
		$("#lb_produtoTemp").css('color', '#c12020');
		$("#clean_produtoTemp").css('background-color', '#FFF');
		$("#clean_produtoTemp").css('color', '#df3159');
		contErro++;
	} else {
		$("#produtoTemp").parent().find("span").css("background", "");
		$("#lb_produtoTemp").css('color', '');
	}
	
	var qtd = $("#quantidadeTemp").val();
	var qtdInt = parseInt(qtd);
	
	if ($("#quantidadeTemp").val() == "" || qtdInt <= 0) {
		$("#quantidadeTemp").css('background', '#ffe6e6');
		var label = $("#quantidadeTemp").prev();
		$(label).css('color', '#c12020');
		contErro++;
	}else{
		$("#quantidadeTemp").css('background', '');
		var label = $("#quantidadeTemp").prev();
		$(label).css('color', '');
	}
	
	if ($("#centroCustoTemp").val() == "" || $("#centroCustoTemp").val() == undefined) {
		$("#centroCustoTemp").parent().find("span").css("background", "#ffe6e6");
		$("#lb_centroCustoTemp").css('color', '#c12020');
		$("#clean_centroCustoTemp").css('background-color', '#FFF');
		$("#clean_centroCustoTemp").css('color', '#df3159');
		contErro++;
	} else {
		$("#centroCustoTemp").parent().find("span").css("background", "#fff");
		$("#lb_centroCustoTemp").css('color', '');
	}
	
	if ($("#categoriaSC").val() == "") {
		$("#categoriaSC").css('background', '#ffe6e6');
		var label = $("#categoriaSC").prev();
		$(label).css('color', '#c12020');
		contErro++;
	} else {
		$("#categoriaSC").css('background', '');
		var label = $("#categoriaSC").prev();
		$(label).css('color', '');
	}
	
	return contErro;
	
}

function validaTbServicos(){
	var contErro = 0;
	
	if ($("#descricaoServicoTemp").val() == "") {
		$("#descricaoServicoTemp").css('background', '#ffe6e6');
		var label = $("#descricaoServicoTemp").prev();
		$(label).css('color', '#c12020');
		contErro++;
	} else {
		$("#descricaoServicoTemp").css('background', '');
		var label = $("#descricaoServicoTemp").prev();
		$(label).css('color', '');
	}
	
	return contErro;
	
}

function validatbCotacao(){
	var contErro = 0;
	
	if ($("#razaoSocialTEMP").val() == "" || $("#razaoSocialTEMP").val() == undefined) {
		$("#razaoSocialTEMP").parent().find("span").css("background", "#ffe6e6");
		$("#lb_razaoSocialTEMP").css('color', '#c12020');
		contErro++;
	} else {
		$("#razaoSocialTEMP").parent().find("span").css("background", "");
		$("#lb_razaoSocialTEMP").css('color', '');
	}
	
	if ($("#contatoTEMP").val() == "") {
		$("#contatoTEMP").css('background', '#ffe6e6');
		var label = $("#contatoTEMP").prev();
		$(label).css('color', '#c12020');
		contErro++;
	} else {
		$("#contatoTEMP").css('background', '');
		var label = $("#contatoTEMP").prev();
		$(label).css('color', '');
	}
	
	var contEmail = validaEmail($("#emailFornecTEMP").val());
	
	if ($("#emailFornecTEMP").val() == "" || contEmail > 0) {
		$("#emailFornecTEMP").css('background', '#ffe6e6');
		var label = $("#emailFornecTEMP").prev();
		$(label).css('color', '#c12020');
		contErro++;
	} else {
		$("#emailFornecTEMP").css('background', '');
		var label = $("#emailFornecTEMP").prev();
		$(label).css('color', '');
	}
	
	if ($("#telefoneFornecTEMP").val() == "") {
		$("#telefoneFornecTEMP").css('background', '#ffe6e6');
		var label = $("#telefoneFornecTEMP").prev();
		$(label).css('color', '#c12020');
		contErro++;
	} else {
		$("#telefoneFornecTEMP").css('background', '');
		var label = $("#telefoneFornecTEMP").prev();
		$(label).css('color', '');
	}
	
	
	
	contErro = contErro + contEmail;
	
	return contErro;
	
}


function validaAtivInicio(opcao){
	console.log("entrou validaAtivInicio");
	var cabecalho = 0;
	var errostbProdutos = 0;
	var errostbServicos = 0;
	var totalErros = 0;
	
	var tbProdutos = varreTabela("tbGradeProdutos");
	//var tbServicos = varreTabela("tbServicos");
	
	var dataAtual = new Date();
	var dia = dataAtual.getDate();
	var mes = dataAtual.getMonth() + 1;
	var ano = dataAtual.getFullYear();

	var hoje = dia + "/" + mes + "/" + ano;

	var partesHoje = hoje.split("/");
	var dataHoje = new Date(partesHoje[2], partesHoje[1] - 1, partesHoje[0]);
	
	if ($("#empresa").val() == "") {
		$("#empresa").css('background', '#ffe6e6');
		var label = $("#empresa").prev();
		$(label).css('color', '#c12020');
		cabecalho++;
	} else {
		$("#empresa").css('background', '');
		var label = $("#empresa").prev();
		$(label).css('color', '');
	}
	
	if ($("#filial").val() == "" || $("#filial").val() == undefined) {
		$("#filial").css('background', '#ffe6e6');
		var label = $("#filial").prev();
		$(label).css('color', '#c12020');
		cabecalho++;
	} else {
		$("#filial").css('background', '');
		var label = $("#filial").prev();
		$(label).css('color', '');
	}
	
	if ($("#tipoSC").val() == "") {
		$("#tipoSC").css('background', '#ffe6e6');
		var label = $("#tipoSC").prev();
		$(label).css('color', '#c12020');
		cabecalho++;
	} else {
		$("#tipoSC").css('background', '');
		var label = $("#tipoSC").prev();
		$(label).css('color', '');
	}
	
	if ($("#tipoSC").val() == "SERVICO" && $("#possuiContrato").val() == "" ) {
		$("#possuiContrato").css('background', '#ffe6e6');
		var label = $("#possuiContrato").prev();
		$(label).css('color', '#c12020');
		cabecalho++;
	} else if ($("#tipoSC").val() == "SERVICO" && $("#possuiContrato").val() != "" ) {
		$("#possuiContrato").css('background', '');
		var label = $("#possuiContrato").prev();
		$(label).css('color', '');
	}
	
	if ($("#tipoSC").val() == "SERVICO" && $("#aditivo").val() == "" ) {
		$("#aditivo").css('background', '#ffe6e6');
		var label = $("#aditivo").prev();
		$(label).css('color', '#c12020');
		cabecalho++;
	} else if ($("#tipoSC").val() == "SERVICO" && $("#aditivo").val() != "" ) {
		$("#aditivo").css('background', '');
		var label = $("#aditivo").prev();
		$(label).css('color', '');
	}
	
	if ( tbProdutos.length == 0 ) {
		errostbProdutos++;
		validaTbGradeProdutos();
	}
	
	if ($("#tipoMaterial").val() == "" && $("#tipoSC").val() == "PRODUTO") {
		$("#tipoMaterial").css('background', '#ffe6e6');
		var label = $("#tipoMaterial").prev();
		$(label).css('color', '#c12020');
		cabecalho++;
	} else {
		$("#tipoMaterial").css('background', '');
		var label = $("#tipoMaterial").prev();
		$(label).css('color', '');
	}
	
	var dataNecessidadeSTR = $("#dataNecessidade").val();
	var dataNecOBJ = dataNecessidadeSTR.split("/");
	var dataNecessidade = new Date(dataNecOBJ[2], dataNecOBJ[1]-1, dataNecOBJ[0]);
	
	var diffTime = Math.abs(dataNecessidade - dataHoje);
	var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
	console.log(diffTime + " milliseconds");
	console.log(diffDays + " days");
	
	console.log("dataNecessidade: "+dataNecessidade);
	
	if (  $("#dataNecessidade").val() == "" ){
		$("#dataNecessidade").css('background', '#ffe6e6');
		$("#lb_dataNecessidade").css('color', '#c12020');
		cabecalho++;
	} else if(dataNecessidade <= dataHoje) {
		$("#dataNecessidade").css('background', '#ffe6e6');
		$("#lb_dataNecessidade").css('color', '#c12020');
		cabecalho++;
	} else if(diffDays <= 7) {
		$("#dataNecessidade").css('background', '#ffe6e6');
		$("#lb_dataNecessidade").css('color', '#c12020');
		cabecalho++;
	}else{
		$("#dataNecessidade").css('background', '#FFF');
		$("#lb_dataNecessidade").css('color', '');
	}
	
	if(opcao == "INICIO"){
		if (  $("#numSC").val() == "" && $("#tipoSC").val() == "PRODUTO" ){
			$("#divBtnGeraSolCompras").css('background-color', '#ffdfdf');
			$("#divBtnGeraSolCompras").css('border', '1px solid #e7a0a0');
			cabecalho++;
		}else{
			$("#divBtnGeraSolCompras").css('background-color', '#f5f5f5');
			$("#divBtnGeraSolCompras").css('border', '1px solid #e3e3e3');
		}
	}
	
	
	if(cabecalho > 0){
		$("#msgErroValidaInicio").show();
		
		setTimeout(function() {
			$("#msgErroValidaInicio").hide();
		}, 5000);
	}else{
		$("#msgErroValidaInicio").hide();
	}
	
	var totalErros = cabecalho + errostbProdutos + errostbServicos;
	console.log("total Erros: "+totalErros);
	
	return totalErros;
	
}

function validaEmail(emailContato){
   
	var validarRegExNoEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	
	var contErro = 0;
  
	if (emailContato.match(validarRegExNoEmail)) {
	   console.log("email valido"); 
	} else {
		console.log("email inválido");
		contErro++;		
	}
	
	return contErro;
	
}


function validaAtiv5(){
	var contErro = 0;
	
	var tbCotacao = varreTabela("tbCotacao");
	console.log("tbCotacao.length: "+tbCotacao.length);
	
	if(tbCotacao.length == 0 || tbCotacao.length == ""){
		contErro++;
		$("#msgErrotbCotacao").show();
		
		setTimeout(function() {
			$("#msgErrotbCotacao").hide();
		}, 5000);
	}else{
		$("#msgErrotbCotacao").hide();
	}
	
	return contErro
	
}


function validaAtiv10(){
	console.log("entrou validaAtiv10");
	var contErro = 0;
	
	var tbCotacao = varreTabela("tbCotacao");
	var existeConcluida = 0;
	
	for(var i=0;i<tbCotacao.length;i++){
		if($("#statusCotacao___"+tbCotacao[i]).val() == "CONCLUIDO" && ($("#totalCotacao___"+tbCotacao[i]).val() != "0" && $("#totalCotacao___"+tbCotacao[i]).val() != "R$ 0,00")){
			existeConcluida++;
		}
		
	}
	
	console.log("existeConcluida: "+existeConcluida);
	
	if(existeConcluida == 0){
		contErro++;
		$("#msgErroCotacaoConcluida").show();
		
		setTimeout(function() {
			$("#msgErroCotacaoConcluida").hide();
		}, 5000);
	}else{
		$("#msgErroCotacaoConcluida").hide();
	}
	
	return contErro;
	
}

function validaAtiv12(){
	console.log("entrou validaAtiv12");
	var contErro = 0;
	
	var tbCotacaoFinal = varreTabela("tbCotacaoFinal");
	console.log("tbCotacaoFinal.length: "+tbCotacaoFinal.length);
	
	if(tbCotacaoFinal.length == 0 || tbCotacaoFinal.length == ""){
		contErro++;
		$("#msgErroCotacaoConcluida").show();
		
		setTimeout(function() {
			$("#msgErroCotacaoConcluida").hide();
		}, 5000);
		
	}else{
		$("#msgErroCotacaoConcluida").hide();
	}
	
	if ($("#motivoEscolhaCotacao").val() == "") {
		$("#motivoEscolhaCotacao").css('background', '#ffe6e6');
		var label = $("#motivoEscolhaCotacao").prev();
		$(label).css('color', '#c12020');
		contErro++;
		
		setTimeout(function() {
			$("#msgErroJustCF").hide();
		}, 5000);
		
		
	} else {
		$("#motivoEscolhaCotacao").css('background', '');
		var label = $("#motivoEscolhaCotacao").prev();
		$(label).css('color', '');
	}
	
	return contErro;
	
}






