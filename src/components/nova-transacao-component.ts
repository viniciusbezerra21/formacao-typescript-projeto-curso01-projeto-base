import { Transacao } from '../types/Transacao.js';
import { TipoTransacao } from '../types/TipoTransacao.js';
import SaldoComponent from './saldo-component.js';
import Conta from './Conta.js';
import ExtratoComponent from './extrato-component.js';



const elementoFormulario = document.querySelector('.block-nova-transacao form') as HTMLFormElement;
elementoFormulario.addEventListener('submit', function(event) {
    try {

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
    


    const novaTransacao: Transacao = {
        tipoTransacao: tipoTransacao as TipoTransacao,
        valor: valor,
        data: data
    };
3
    Conta.registrarTransacao(novaTransacao);
    SaldoComponent.atualizar();
    elementoFormulario.reset();
    ExtratoComponent.atualizar();

    } catch (error) {
        alert(error.message);
    }
});