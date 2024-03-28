function displayFields(form,customHTML){
	
	form.setShowDisabledFields(true);
	form.setHideDeleteButton(true);
	
	var nrAtividade = getValue("WKNumState");
	var numSolicitacao = getValue("WKNumProces");
	var codUsuario = getValue("WKUser");
	
	var gestorProc = getValue("WKManagerMode");
	
	form.setValue('codUsuario', codUsuario);
	form.setValue('numAtividade', nrAtividade);
	
	if(nrAtividade == 0){

		form.setValue('loginSolicitante', codUsuario);
		
	}
	
	if(nrAtividade != 0){

		form.setValue('numSolicitacao', numSolicitacao);
		
	}
	
	
}