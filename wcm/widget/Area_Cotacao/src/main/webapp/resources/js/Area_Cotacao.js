var MyWidget = SuperWidget.extend({
    //variáveis da widget
    variavelNumerica: null,
    variavelCaracter: null,

    //método iniciado quando a widget é carregada
    init: function() {
    },
  
    //BIND de eventos
    bindings: {
        local: {
            'execute': ['click_executeAction']
        },
        global: {}
    },
 
    executeAction: function(htmlElement, event) {
    }

});

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