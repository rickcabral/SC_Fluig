<div id="MyWidget_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="MyWidget.instance()">
	<form role="form">
		<div class="form-group">	
			<div class = "form-group col-md-12" style="display: flex; justify-content: center; align-items: center;">
				<h2>Área Jurídica</h2>
			</div>
			<div class="form-group col-md-6">
				<label for="Info_contrato">Informações Contratuais</label>
				<input type="file" id="fileInput" name="Info_contrato" class="form-control">
			</div>
            <div class = "form-group col-md-6">
                <label for="dt_final">Data Final Contratual</label>
				<input type="text" id="dt_final" name="dt_final" class="form-control" readonly>
            </div>
			<div class= "form-group col-md-12">
				<label for="info_juridico">Informações Adicionais</label>
				<textarea name="info_juridico" id="info_juridico" cols="30" rows="5" class="form-control"></textarea>
			</div>
			<div class= "form-group col-md-12">
				<label for="minuta_contratual">Inserção da minuta contratual</label>
				<input type="file" id="fileInput" name="minuta_contratual" class="form-control">
			</div>
			<div class= "form-group col-md-12">
				<label for="info_alteradas">Informações a serem alteradas</label>
				<textarea name="info_alteradas" id="info_alteradas" cols="30" rows="5" class="form-control"></textarea>
			</div>
			<div>
				<div class= "form-group col-md-1" style="display: flex; align-items: end; justify-content: right;">
					<button type="button" class="btn btn-info form-control" id="Avancar" style="margin-left: 10px;">Avançar</button>
				</div>
				<div class= "form-group col-md-2" style="display: flex; align-items: end; justify-content: right;">
					<button type="button" class="btn btn-info form-control" id="Solicitar_alteracao">Solicitar Alteração</button>
				</div>
				<div class= "form-group col-md-2" style="display: flex; align-items: end; justify-content: right;">
					<button type="button" class="btn btn-success form-control" id="Enviar" style="margin-left: 10px;">Enviar ao contratos</button>
				</div>
			</div>
		</div>
	</form>
</div>

