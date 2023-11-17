<div id="MyWidget_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="MyWidget.instance()">
	<form role="form">
		<div class="form-group">
			<div class="col-md-12">
				<div class = "form-group col-md-12" style="display: flex; justify-content: center; align-items: center;">
					<h1>Área de Cotação</h1>
				</div>
				<div class = "form-group col-md-12" style="display: flex; justify-content: center; align-items: center;">
					<p>Prezado fornecedor, você foi selecionado para participar de uma de nossas cotações. Por favor preencha os campos abaixo e nos envie até a data de validade informada a seguir.</p>
				</div>
			</div>
		
			<div class="panel col-md-6">
				<div class = "form-group col-md-12" style="display: flex; justify-content: center; align-items: center;">
					<h2>Dados da Empresa</h2>
				</div>
				<div class="form-group col-md-6">
					<label for="razao">Razão Social</label>
					<input type="text" name="razao" id="razao" class="form-control">
				</div>
				<div class="form-group col-md-6">
					<label for="CNPJ">CNPJ</label>
					<input type="number" name="CNPJ" id="CNPJ" class="form-control">
				</div>
				<div class="form-group col-md-6">
					<label for="comprador">Comprador</label>
					<input type="text" name="comprador" id="comprador" class="form-control">
				</div>
				<div class="form-group col-md-6">
					<label for="email">E-mail</label>
					<input type="email" name="email" id="email" class="form-control">
				</div>
				<div class="form-group col-md-12">
					<label for="endEntrega">Endereço para entrega</label>
					<input type="text" name="endEntrega" id="endEntrega" class="form-control">
				</div>
			</div>
			<div class="panel col-md-6">
				<div class = "form-group col-md-12" style="display: flex; justify-content: center; align-items: center;">
					<h2>Dados do Fornecedor</h2>
				</div>
				<div class="form-group col-md-6">
					<label for="razaoForn">Razão Social</label>
					<input type="text" name="razaoForn" id="razaoForn" class="form-control">
				</div>
				<div class="form-group col-md-6">
					<label for="CNPJForn">CNPJ</label>
					<input type="number" name="CNPJForn" id="CNPJForn" class="form-control">
				</div>
				<div class="form-group col-md-4">
					<label for="estado">Estado</label>
					<input type="text" name="estado" id="estado" class="form-control">
				</div>
				<div class="form-group col-md-4">
					<label for="cidade">Cidade</label>
					<input type="text" name="cidade" id="cidade" class="form-control">
				</div>
				<div class="form-group col-md-4">
					<label for="contato">Contato</label>
					<input type="text" name="contato" id="contato" class="form-control">
				</div>
				<div class="form-group col-md-6">
					<label for="emailForn">E-mail</label>
					<input type="email" name="emailForn" id="emailForn" class="form-control">
				</div>
				<div class="form-group col-md-6">
					<label for="numero">Telefone</label>
					<input type="number" name="numero" id="numero" class="form-control">
				</div>
			</div>
			<div class="panel col-md-12">
				<div class = "form-group col-md-12" style="display: flex; justify-content: center; align-items: center;">
					<h2>Itens da Cotação</h2>
				</div>
				<div class="form-group col-md-5">
					<label for="item">Item</label>
					<input type="text" name="Item" id="Item" class="form-control" readonly>
				</div>
				<div class="form-group col-md-5">
					<label for="qnt_solicitada">Quantidade Solicitada</label>
					<input type="text" name="qnt_solicitada" id="qnt_solicitada" class="form-control" readonly>
				</div>
				<div class="form-group col-md-2">
					<label for="Dados">Ação</label>
					<button type="button" class="btn btn-primary form-control" id="togglePreencherOcultar">Preencher Dados</button>
				</div>
				<div id="teste">
					<div class="form-group col-md-6">
						<label for="item">Itens</label>
						<input type="text" name="item" id="item" class="form-control">
					</div>
					<div class="form-group col-md-2">
						<label for="qtd">Quantidade</label>
						<input type="number" name="qtd" id="qtd" class="form-control">
					</div>
					<div class="form-group col-md-2">
						<label for="valorUnit">Valor Unitário</label>
						<input type="number" name="valorUnit" id="valorUnit" class="form-control">
					</div>
					<div class="form-group col-md-2">
						<label for="frete">Frete</label>
						<input type="number" name="frete" id="frete" class="form-control">
					</div>
					<div class="form-group col-md-2">
						<label for="desconto">Desconto</label>
						<input type="number" name="desconto" id="desconto" class="form-control">
					</div>
					<div class="form-group col-md-1">
						<label for="icms">ICMS</label>
						<input type="number" name="icms" id="icms" class="form-control">
					</div>
					<div class="form-group col-md-1">
						<label for="ipi">IPI</label>
						<input type="number" name="ipi" id="ipi" class="form-control">
					</div>
					<div class="form-group col-md-1">
						<label for="pis">PIS</label>
						<input type="number" name="pis" id="pis" class="form-control">
					</div>
					<div class="form-group col-md-1">
						<label for="cofins">COFINS</label>
						<input type="number" name="cofins" id="cofins" class="form-control">
					</div>
					<div class="form-group col-md-2">
						<label for="valorTotal">Valor Total</label>
						<input type="number" name="valorTotal" id="valorTotal" class="form-control">
					</div>
					<div class="form-group col-md-2">
						<label for="prazoEntrega">Prazo de Entrega (dias)</label>
						<input type="number" name="prazoEntrega" id="prazoEntrega" class="form-control">
					</div>
					<div class="form-group col-md-2">
						<label for="prevEntrega">Prev Entrega</label>
						<input type="number" name="prevEntrega" id="prevEntrega" class="form-control">
					</div>
				</div>
			</div>
			<div class="panel form-group col-md-6">
				<div class = "form-group col-md-12" style="display: flex; justify-content: center; align-items: center;">
					<h2>Resumo da Cotação</h2>
				</div>
				<div class="form-group col-md-6">
					<label for="totalItens">Total dos Itens</label>
					<input type="number" name="totalItens" id="totalItens" class="form-control">
				</div>
				<div class="form-group col-md-6">
					<label for="totalDesc">Descontos</label>
					<input type="number" name="totalDesc" id="totalDesc" class="form-control">
				</div>
				<div class="form-group col-md-6">
					<label for="totalImposto">Impostos</label>
					<input type="number" name="totalImposto" id="totalImposto" class="form-control">
				</div>
				<div class="form-group col-md-6">
					<label for="totalFrete">Frete</label>
					<input type="number" name="totalFrete" id="totalFrete" class="form-control">
				</div>
				<div class="form-group col-md-6">
					<label for="totalCotacao">Total da Cotação</label>
					<input type="number" name="totalCotacao" id="totalCotacao" class="form-control">
				</div>
				<div class = "form-group col-md-6">
					<label for="formPag">Forma de Pagamento</label>
					<select name="forma_pgm" id="forma_pgm" class="form-control">
						<option value="">-------</option>
						<option value="boleto">Boleto</option>
						<option value="deposito_conta">Depósito em Conta</option>
						<option value="pix">Pix</option>
					</select>
				</div>	
			</div>
			<div class = "panel form-group col-md-6" id="teste2">
				<div class = "form-group col-md-12" id="testeMinimizar" style="display: flex; justify-content: center; align-items: center;">
					<h2>Anexos do Fornecedor</h2>
				</div>
				<div class = "form-group col-md-12">
					<upload-component
    					max-size="10mb"
    					multiple="true"
    					formats-allowed="jpg, png, svg"
    					accept=".jpg, .png, .svg"
    					theme-small="false"
    					btn-class="btn-cerise-gradient"
    					upload-api='{
							"url": "sua_url_de_upload",
							"params": {
								"page": "1"
							},
							"headers": {
								"Content-Type": "text/plain;charset=UTF-8"
							}
    					}'
					></upload-component>
				</div>
		</div>

		<script>
			document.addEventListener("DOMContentLoaded", function () {
   				var camposParaHabilitarOcultar = [document.getElementById("teste")];
    			for (var campo of camposParaHabilitarOcultar) {
        			campo.style.display = "none";
    			}

    			var toggleButton = document.getElementById("togglePreencherOcultar");
    			toggleButton.addEventListener("click", function () {
        			for (var campo of camposParaHabilitarOcultar) {
            			if (campo.style.display === "none") {
                			campo.style.display = "block";
                			toggleButton.textContent = "Ocultar";
							toggleButton.classList.remove("btn-primary");
                			toggleButton.classList.add("btn-default");
            			} else {
                			campo.style.display = "none";
                			toggleButton.textContent = "Preencher Dados";
							toggleButton.classList.remove("btn-default");
                			toggleButton.classList.add("btn-primary");
            			}
        			}
   				});
			});
		</script>
	</form>
</div>

