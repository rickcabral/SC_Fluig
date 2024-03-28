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