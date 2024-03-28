$(function () {  
	$('#fileupload').fileupload({
	    dataType: 'json',
	    done: function (e, data) {
				var idPasta = ID_PASTA_UPLOAD;
				var myLoading1 = FLUIGC.loading('#upload-file');
				myLoading1.show();
			console.log("idPasta upload rest: "+idPasta);
	    	if(idPasta != ""){
	    				    	
				
		        $.each(data.result.files, function (index, file) {
		            $.ajax({
		                async : true,
		                type : "POST",
		                contentType: "application/json",
		                url : '/api/public/ecm/document/createDocument',
		
		        		data: JSON.stringify({
		        			"description": file.name,
		        			"parentId": idPasta,
		        			"attachments": [{
		        				"fileName": file.name
		        			}],
		        		}),
		
			        		error: function() {
			        			FLUIGC.toast({
			        			     title: '',
			        			     message: "Falha ao enviar",
			        			     type: 'danger'
			        			 });
			        			myLoading1.hide();
			        		},
		        		
			        		success: function(data) {
			        			FLUIGC.toast({
									 title: '',
									 message: "Documento anexado com sucesso!",
									 type: 'success'
								 });
			        			console.log(data);
			        			registraDocumento(data);
			        			myLoading1.hide();
								//exibeAnexosAcao();
			        		},
		        	});
		        });
	    	}else{
	    		FLUIGC.toast({
   			     title: '',
   			     message: "Erro ao anexar documento: Pasta de Upload não encontrada no ECM! Contate a TI!",
   			     type: 'danger'
   			 });
   			myLoading1.hide();
	    		
	    	}
	    }
	});
});