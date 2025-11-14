let saldo = 0;

const elementoSaldo = document.querySelector('.saldo-valor .valor');
elementoSaldo.textContent = `R$ ${saldo.toFixed(2)}`;

const elementoFormulario = document.querySelector('.block-nova-transacao form');
elementoFormulario.addEventListener('submit', function(event) {
    event.preventDefault();
    if (!elementoFormulario.checkValidity()) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    const inputTipoTransacao = document.querySelector('#tipoTransacao');
    const inputValor = elementoFormulario.querySelector('#valor');
    const inputData = elementoFormulario.querySelector('#data');

    let tipoTransacao = inputTipoTransacao.value;
    let valor = inputValor.value;
    let data = inputData.value;

    if (tipoTransacao === 'Depósito') {
        saldo += parseFloat(valor);
    } else if (tipoTransacao === 'Transferência' || tipoTransacao === 'Pagamento de Boleto') {
        saldo -= parseFloat(valor);
    } else {
        alert('Tipo de transação inválido.');
        return;
    }

    elementoSaldo.textContent = `R$ ${saldo.toFixed(2)}`;


    const novaTransacao = {
        tipo: tipoTransacao,
        valor: parseFloat(valor),
        data: data
    };

    elementoFormulario.reset();
});