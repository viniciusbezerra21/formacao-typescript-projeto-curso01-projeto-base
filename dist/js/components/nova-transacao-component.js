import SaldoComponent from './saldo-component.js';
import Conta from './Conta.js';
import ExtratoComponent from './extrato-component.js';
const elementoFormulario = document.querySelector('.block-nova-transacao form');
elementoFormulario.addEventListener('submit', function (event) {
    try {
        event.preventDefault();
        if (!elementoFormulario.checkValidity()) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }
        const inputTipoTransacao = document.querySelector('#tipoTransacao');
        const inputValor = elementoFormulario.querySelector('#valor');
        const inputData = elementoFormulario.querySelector('#data');
        let tipoTransacao = inputTipoTransacao.value;
        let valor = inputValor.valueAsNumber;
        let data = new Date(inputData.value);
        const novaTransacao = {
            tipoTransacao: tipoTransacao,
            valor: valor,
            data: data
        };
        3;
        Conta.registrarTransacao(novaTransacao);
        SaldoComponent.atualizar();
        elementoFormulario.reset();
        ExtratoComponent.atualizar();
    }
    catch (error) {
        alert(error.message);
    }
});
