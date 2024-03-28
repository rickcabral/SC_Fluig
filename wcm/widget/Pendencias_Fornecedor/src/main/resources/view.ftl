<div id="MyWidget_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="MyWidget.instance()">
		<form role="form">
			<div>
				<div class="Top_area">
					<h1><u>Área do Fornecedor</u></h1>
				</div>
				<div class="buttons">
					<button type="button" class="btn btn-default" style="margin-left:10px">Nome do Fornecedor</button>
					<button type="button" class="btn btn-default" style="margin-left:10px">Histórico de cotações</button>
					<button type="button" class="btn btn-danger" style="margin-left:10px">Sair</button>
				</div>
				<br>
				<div class="table-responsive">
					<table class="table table-bordered" id="PendenciasFornecedor" name="PendenciasFornecedor">
						<thead>
							<tr>
								<th class="align-middle custom-th" id="fornec_tr" colspan="6">Cotações Pendentes</th>
							</tr>
							<tr>
								<th class="align-middle custom-th" style="width:20%;text-align:center">Nome da empresa (Solicitante)</th>
								<th class="align-middle custom-th" style="width:10%;text-align:center">CNPJ (Solicitante)</th>
								<th class="align-middle custom-th" style="width:20%;text-align:center">item</th>
								<th class="align-middle custom-th" style="width:5%;text-align:center">Quantidade</th>
								<th class="align-middle custom-th" style="width:25%;text-align:center">Endereço para Entrega</th>
								<th class="align-middle custom-th" style="width:20%;text-align:center">Ação</th>
							</tr>
						</thead>
						<tbody>
						</tbody>
					</table>
				</div>
			</div>
		</form>
</div>
