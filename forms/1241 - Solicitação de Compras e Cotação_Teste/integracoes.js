function getSolicitanteCompras() {
	console.log("entrou getSolicitanteCompras");
	
	var codUsuario = $("#codUsuario").val();
	
	if( $("#codUsuario").val() != ""){
		console.log("entrou if");
		$.ajax({
			type: "GET",
			headers: {
				'Access-Control-Allow-Origin': '*'
			},
			url: 'http://abainfraestrutura144398.protheus.cloudtotvs.com.br:1116/api-rest/PERM_SOLICITANTE',
			data: { CODUSUARIO: codUsuario },
			dataType: 'json',
			contentType: "application/json",
			crossDomain:true,
			success: function(res, status, xhr){
				if(res.length <= 0){
					$("#msgErroUserSC").show();	
						setTimeout(function() {
							$("#msgErroUserSC").hide();
						}, 5000);						
				}else{
					if(res[0].ACESSO != "T"){
						$("#msgErroUserSC").show();	
						setTimeout(function() {
							$("#msgErroUserSC").hide();
						}, 5000);	
					}else{
						$("#existeUserProtheus").val("SIM");
						$("#msgErroUserSC").hide();
					}
					
				}
				
				
			}
		});	
	}

}

function criaSolicitacaDeCompra(){
	console.log("entrou criaSolicitacaDeCompra: ");
	
	var contValidaInicio = validaAtivInicio("CRIASC");
	
	if($("#numSC").val() == "" && contValidaInicio == 0){
		console.log("entrou primeiro if");
		$("#btnGeraSC").attr("disabled","disabled");
		
		var myLoading2 = FLUIGC.loading(window);
		// We can show the message of loading
		myLoading2.show();
		
		var empresaOBJTXT = $("#empresaOBJ").val();
		var empresaOBJ = JSON.parse(empresaOBJTXT);
		
		var codEmp = empresaOBJ[0].selecionado;
		
		
		var dados = preparaIntegracao();
		console.log("JSON ORIGINAL: ");
		console.log(dados[0]);
		var STR = JSON.stringify(dados[0]);
		console.log("JSON TXT: ");
		console.log(STR);
		var settings = {
		  "url": "http://abainfraestrutura144398.protheus.cloudtotvs.com.br:1116/api-rest/WS_SOL_COMPRAS?FILIAL= ",
		  "method": "POST",
		  "timeout": 0,
		  "headers": {
			"Content-Type": "application/json"
		  },
		  "data": STR,
		};

		$.ajax(settings).done(function (data, textStatus, jqXHR) {
			
			$("#msgSucessoIntegracaoSC").show();
			$("#msgErroIntegracaoSC").hide();
			
			$("#numSC").val(data[0].NUMERO);
			$("#numSCEmp").val(codEmp+"-"+data[0].NUMERO);
			$("#codeSucessoIntegracaoSC").html("");
			$("#codeSucessoIntegracaoSC").append(data[0].NUMERO);
			$("#produtoTemp").select2("destroy");
			$("#centroCustoTemp").select2("destroy");
			
			btnTbProdutosTempSC("SOMENTE_LEITURA");
			
			console.log("SUCESSO");
			// We can hide the message of loading
			myLoading2.hide();
		}).fail(function(jqXHR, textStatus, errorThrown) {
			$("#codeErroIntegracaoSC").html("");
			
			$("#msgSucessoIntegracaoSC").hide();
			$("#msgErroIntegracaoSC").show();
			
			setTimeout(function() {
						$("#msgErroIntegracaoSC").hide();
					}, 5000);	
			
			$("#codeErroIntegracaoSC").append(jqXHR.status+ " - Internal Server Error");
			console.log("FALHA");
			console.log("jqXHR: "+jqXHR);
			console.log("textStatus: "+textStatus);
			console.log("errorThrown: "+errorThrown);
			$("#btnGeraSC").removeAttr("disabled");
			myLoading2.hide();
			$("#msgErroValidaInicio").hide();
		});	
	}if($("#numSC").val() == "" && contValidaInicio > 0){
		console.log("entrou segundo if");
		$("#msgErroValidaCriaSC").show();
		setTimeout(function() {
						$("#msgErroValidaCriaSC").hide();
					}, 5000);	
	}if($("#numSC").val() != ""){
		console.log("entrou terceiro if");
		btnTbProdutosTempSC("SOMENTE_LEITURA");
		alert("Solicitação de Compras já criada!")
		$("#msgErroValidaCriaSC").hide();
	}
	
		
}

function preparaIntegracao(){
	
	var empresa = $("#empresaTXT").val();
	var filial = $("#filial").val();
	var codSolicitante = $("#codUsuario").val();
	var solicitante = $("#solicitante").val();
	var idUserProtheus = $("#idUserProtheus").val();
	
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

	var dataFormatada = anoLog+mes2Log+diaLog;
	
	var dataEmissao = dataFormatada;
	
	var itens = new Array();
	var dados = new Array();
	
	var tbProdutos = varreTabela("tbGradeProdutos");
	var cont = 0;
	for (var i = 0; i < tbProdutos.length; i++) {
		var numItem = "";
		var codProduto = $("#codProdutoSC___" + tbProdutos[i]).val();
		var quantidade = $("#quantidadeSC___" + tbProdutos[i]).val();
		var ccusto = $("#codCentroCustoSC___" + tbProdutos[i]).val();
		var observacao = $("#observacaoSC___" + tbProdutos[i]).val();
		var categoria = $("#codCategoriaItemSC___" + tbProdutos[i]).val();
		
		var dataNecessidade = $("#dataNecessidadeFormatada").val();
		
		itens.push(
			{
				"codProduto": codProduto,
				"quantidade": quantidade,
				"ccusto": ccusto,
				"observacao": observacao,
				"categoria" : categoria,
				"dataNecessidade": dataNecessidade
			}
		);
		
	}
	
	dados.push(
		{
			"empresa":empresa,
			"filial": filial,
			"codSolicitante":codSolicitante,
			"solicitante": solicitante,
			"dataEmissao": dataFormatada,
			"idProtheus": idUserProtheus,
			"itens":itens
		}
	);
	
	//console.log("OBJETO JSON:");
	//console.log(dados);
	
	//var data = JSON.stringify(dados);
	
	
	return dados;
	
}

function getVerificaUserProtheus() {
	console.log("entrou getVerificaUserProtheus");
	
	var codUsuario = $("#codUsuario").val();
	
	if( $("#codUsuario").val() != ""){
		console.log("entrou if");
		$.ajax({
			type: "GET",
			headers: {
				'Access-Control-Allow-Origin': '*'
			},
			url: 'http://abainfraestrutura144398.protheus.cloudtotvs.com.br:1116/api-rest/USER_PROTHEUS',
			data: { CODUSUARIO: codUsuario },
			dataType: 'json',
			contentType: "application/json",
			crossDomain:true,
			success: function(res, status, xhr){
				if(res.length <= 0){
					$("#msgErroUserSC").show();	

					setTimeout(function() {
						$("#msgErroUserSC").hide();
					}, 5000);					
				}else{
					console.log(res[0].IDUSER)
					$("#idUserProtheus").val(res[0].IDUSER);
									
				}
				
				
			}
		});	
	}

}

function getEmpresa() {
	console.log("entrou getEmpresa");
	$("#empresa option").remove();	
	$('#empresa').val(null).trigger('change');	
	
	$("#empresa").select2({
		minimumInputLength: 2,
		ajax:{
			type: "GET",
			//beforeSend: function (xhr) {
			//	xhr.setRequestHeader('Authorization', 'Basic YWxvaXNpby5sb3VyZW5jbzoxMjM0NTY=');
			//},
			url: URL_TOTVS+'/LISTA_EMPRESAS',
			data: function (params) {
				var str = params.term
				return {
				  DESCEMPRESA: str.toUpperCase()
				};
			},
			dataType: 'json',
			crossDomain:true,
			processResults: function (data) {
				var dados = []
				
				data.sort(compareSecondColumn);

				function compareSecondColumn(a, b) {
					if (a[1] === b[1]) {
						return 0;
					}
					else {
						return (a[1] < b[1]) ? -1 : 1;
					}
				}
				//console.log("data.length: "+data.length)
				for(var i=0;i<data.length;i++){
					//console.log("data[i].CODIGO: "+data[i].CODIGO);
					if(data[i].CODEMP == "undefined" || data[i].CODEMP == undefined){
						dados.push({
							'id':"",
							'text':"Cadastro não encontrado"
						})
					}else{
						dados.push({
							'id':data[i].CODEMP,
							'text':data[i].CODEMP+" - "+data[i].NOMEEMP
						})
					}
				}
				
				/*if(data.length == 0){
						dados.push({
							'id':"",
							'text':"Cadastro não encontrado"
						})
				}*/
				
				return {
					results: dados
				};
			}
		},escapeMarkup: function (m) { return m; }
	});
	$("#empresa").attr("onchange","validaEdicao(this.id,'select2')");

}

function getFiliais(codEmpresa) {
	console.log("entrou getFiliais");
	$("#filial option").remove();
	console.log("existe: "+$("input[type=hidden][name=existeUserProtheus]").val());
	
	if(codEmpresa != ""){
		
		var codEmp = codEmpresa.substr(0, 2);
		var codFilial = codEmpresa.substr(2,4);
		
		$.ajax({
			type: "GET",
			headers: {
				'Access-Control-Allow-Origin': '*'
			},
			url: URL_TOTVS + '/LISTA_FILIAIS',
			data: { 
					CODEMPRESA:	codEmp,
					FILIAL: codFilial
					},
			dataType: 'json',
			contentType: "application/json",
			crossDomain: true,
			success: function (res, status, xhr) {
				
				if(res.length > 1){
					$("#filial").append($('<option>', {
						value: "",
						text: "Selecione"
					}));
					
					for(var i=0; i<res.length;i++){
					
						$("#filial").append($('<option>', {
							value: res[i].COD_FILIAL,
							text: res[i].COD_FILIAL+" - "+res[i].FILIAL
						}));
					}
					
					getProduto();
					getCentroCusto();
					
				}else{
					$("#filial").append($('<option>', {
						value: res[0].COD_FILIAL,
						text: res[0].COD_FILIAL+" - "+res[0].FILIAL
					}));
					
					$("#filialTXT").val(res[0].COD_FILIAL);
					
					var filial = new Array();
					filial.push({
						'selecionado':res[0].COD_FILIAL,
						'text': res[0].COD_FILIAL+" - "+res[0].FILIAL
					});
					var obj = JSON.stringify(filial);
					$("#filialOBJ").val(obj);
					
					getProduto();
					getCentroCusto();
				}
				
				

			}
		});
	}
	validaEdicao('filial','select');

}

function getProduto(){
	
	$("#produtoTemp option").remove();	
	$('#produtoTemp').val(null).trigger('change');	
	
	var filial = $("#filialTXT").val();
	console.log("FILIAL getProduto: "+filial);
	
	$("#produtoTemp").select2({
		minimumInputLength: 2,
		ajax:{
			type: "GET",
			//beforeSend: function (xhr) {
			//	xhr.setRequestHeader('Authorization', 'Basic YWxvaXNpby5sb3VyZW5jbzoxMjM0NTY=');
			//},
			url: URL_TOTVS+'/RETPROD',
			data: function (params) {
				var str = params.term
				return {
				  FILIAL: filial,
				  CODIGO: str.toUpperCase(),
				  DESCRICAO: str.toUpperCase(),
				  FILTRO: 'DESCRICAO'
				};
			},
			dataType: 'json',
			crossDomain:true,
			processResults: function (data) {
				var dados = []
				
				data.sort(compareSecondColumn);

				function compareSecondColumn(a, b) {
					if (a[1] === b[1]) {
						return 0;
					}
					else {
						return (a[1] < b[1]) ? -1 : 1;
					}
				}
				//console.log("data.length: "+data.length)
				for(var i=0;i<data.length;i++){
					//console.log("data[i].CODIGO: "+data[i].CODIGO);
					if(data[i].CODIGO == "undefined" || data[i].CODIGO == undefined){
						dados.push({
							'id':"",
							'text':"Cadastro não encontrado"
						})
					}else{
						dados.push({
							'id':data[i].CODIGO,
							'text':data[i].CODIGO+" - "+data[i].DESCRICAO
						})
					}
				}
				
				/*if(data.length == 0){
						dados.push({
							'id':"",
							'text':"Cadastro não encontrado"
						})
				}*/
				
				return {
					results: dados
				};
			}
		},escapeMarkup: function (m) { return m; }
	});
	$("#produtoTemp").attr("onchange","validaEdicao(this.id,'select2')");
}

function getCentroCusto(){
	
	$("#centroCustoTemp option").remove();	
	$('#centroCustoTemp').val(null).trigger('change');	
	
	var filial = $("#filialTXT").val();
	console.log("FILIAL getProduto: "+filial);
	
	$("#centroCustoTemp").select2({
		minimumInputLength: 2,
		ajax:{
			type: "GET",
			//beforeSend: function (xhr) {
			//	xhr.setRequestHeader('Authorization', 'Basic YWxvaXNpby5sb3VyZW5jbzoxMjM0NTY=');
			//},
			url: URL_TOTVS+'/WS_CCUSTO',
			data: function (params) {
				var str = params.term
				return {
				  FILIAL: filial,
				  DESCRICAO: str.toUpperCase()
				};
			},
			dataType: 'json',
			crossDomain:true,
			processResults: function (data) {
				var dados = []
				
				data.sort(compareSecondColumn);

				function compareSecondColumn(a, b) {
					if (a[1] === b[1]) {
						return 0;
					}
					else {
						return (a[1] < b[1]) ? -1 : 1;
					}
				}
				console.log("data.length: "+data.length)
				for(var i=0;i<data.length;i++){
					console.log("data[i].CODIGO: "+data[i].CODIGO);
					if(data[i].CODIGO == "undefined" || data[i].CODIGO == undefined){
						dados.push({
							'id':"",
							'text':"Cadastro não encontrado"
						})
					}else{
						dados.push({
							'id':data[i].CODIGO,
							'text':data[i].CODIGO+" - "+data[i].DESCRICAO
						})
					}
					
					var label = $("#centroCustoTemp").prev().prev();
					$(label).css('color', '');
					
				}
				return {
					results: dados
				};
			}
		},escapeMarkup: function (m) { return m; }
	});
	
	$("#centroCustoTemp").attr("onchange","validaEdicao(this.id,'select2')");
	
}

function getFornecedor(){
	
	$("#razaoSocialTEMP option").remove();	
	$('#razaoSocialTEMP').val(null).trigger('change');	
	
	if($("#filtroEmpresaTXT").val() != ""){
		var filtroEmpresa = $("#filtroEmpresaTXT").val();
	}else{
		var filtroEmpresa = "DESCRICAO";
	}
		
	$("#razaoSocialTEMP").select2({
		minimumInputLength: 2,
		ajax:{
			type: "GET",
			//beforeSend: function (xhr) {
			//	xhr.setRequestHeader('Authorization', 'Basic YWxvaXNpby5sb3VyZW5jbzoxMjM0NTY=');
			//},
			url: URL_TOTVS+'/WS_FORNECEDORES',
			data: function (params) {
				var str = params.term
				var filtroEmp = $("#filtroEmpresaTXT").val() ;
				return {
				  DESCRICAO: str.toUpperCase(),
				  CNPJ: str.toUpperCase(),
				  FILTRO: filtroEmp
				};
			},
			dataType: 'json',
			crossDomain:true,
			processResults: function (data) {
				var dados = []
				
				data.sort(compareSecondColumn);

				function compareSecondColumn(a, b) {
					if (a[1] === b[1]) {
						return 0;
					}
					else {
						return (a[1] < b[1]) ? -1 : 1;
					}
				}
				//console.log("data.length: "+data.length)
				for(var i=0;i<data.length;i++){
					//console.log("data[i].CODIGO: "+data[i].CODIGO);
					if(data[i].CNPJ == "undefined" || data[i].CNPJ == undefined){
						dados.push({
							'id':"",
							'text':"Cadastro não encontrado"
						})
					}else{
						var txtCNPJ = data[i].CNPJ
						var cnpjFormatado = txtCNPJ.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
						
						dados.push({
							'id':data[i].CNPJ,
							'text':cnpjFormatado+" - "+data[i].NOME
						})
					}
				}
				return {
					results: dados
				};
			}
		},escapeMarkup: function (m) { return m; }
	});
	$("#razaoSocialTEMP").attr("onchange","validaEdicao(this.id,'select2'),getComplFornec()");
}

function getComplFornec() {
	console.log("entrou getComplFornec");
	var cnpj = $("#razaoSocialTEMP").val();
	
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
	
	console.log("cnpj: "+cnpj);
	
	if(cnpj != "" && cnpj != undefined){
		
		$.ajax({
			type: "GET",
			headers: {
				'Access-Control-Allow-Origin': '*'
			},
			url: URL_TOTVS + '/WS_FORNECEDORES',
			data: { 
					DESCRICAO: '',
					CNPJ: cnpj,
					FILTRO: 'CNPJ'
					},
			dataType: 'json',
			contentType: "application/json",
			crossDomain: true,
			success: function (res, status, xhr) {
				
				if(res.length > 0){
					$("#cnpjTEMP").val(res[0].CNPJ);
					$("#lojaTEMP").val(res[0].LOJA);
					$("#cepTEMP").val(res[0].CEP);
					$("#estadoTEMP").val(res[0].ESTADO);
					$("#cidadeTEMP").val(res[0].MUNICIPIO);
					$("#bairroTEMP").val(res[0].BAIRRO);
					$("#enderecoTEMP").val(res[0].ENDERECO);
					//$("#complementoTEMP").val(res[0].COMPLEMENTO);
					$("#contatoTEMP").val(res[0].CONTATO);
					$("#emailFornecTEMP").val(res[0].EMAIL);
					$("#telefoneFornecTEMP").val( "(" +res[0].DDD+ ") " +res[0].TELEFONE);
					
				}
			}
		});
	}


}






