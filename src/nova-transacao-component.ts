const elementoFormulario = document.querySelector('.block-nova-transacao form') as HTMLFormElement;
elementoFormulario.addEventListener('submit', function(event) {
    event.preventDefault();
    if (!elementoFormulario.checkValidity()) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    const inputTipoTransacao = document.querySelector('#tipoTransacao') as HTMLSelectElement;
    const inputValor = elementoFormulario.querySelector('#valor') as HTMLInputElement;
    const inputData = elementoFormulario.querySelector('#data') as HTMLInputElement;

    let tipoTransacao: string = inputTipoTransacao.value as TipoTransacao;
    let valor: number = inputValor.valueAsNumber;
    let data: Date = new Date(inputData.value);

    if (tipoTransacao === TipoTransacao.DEPOSITO) {
        saldo += valor;
    } else if (tipoTransacao === TipoTransacao.TRASFERENCIA || tipoTransacao === TipoTransacao.PAGAMENTO_BOLETO) {
        saldo -= valor;
    } else {
        alert('Tipo de transação inválido.');
        return;
    }

    elementoSaldo.textContent = formatarMoeda(saldo);


    const novaTransacao: Transacao = {
        tipoTransacao: tipoTransacao as TipoTransacao,
        valor: valor,
        data: data
    };

    elementoFormulario.reset();
});