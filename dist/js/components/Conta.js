import { TipoTransacao } from '../types/TipoTransacao';
export class Conta {
    nome;
    saldo = JSON.parse(localStorage.getItem("saldo")) || 0;
    transacoes = JSON.parse(localStorage.getItem("transacoes"), (key, value) => {
        if (key === "data") {
            return new Date(value);
        }
        return value;
    }) || [];
    constructor(nome) {
        this.nome = nome;
    }
    getGruposTransacoes() {
        const gruposTransacoes = [];
        const listaTransacoes = structuredClone(this.transacoes);
        const transacoesOrdenadas = listaTransacoes.sort((t1, t2) => t2.data.getTime() - t1.data.getTime());
        let labelAtualGrupoTransacao = "";
        for (let transacao of transacoesOrdenadas) {
            let labelGrupoTransacao = transacao.data.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
            if (labelAtualGrupoTransacao !== labelGrupoTransacao) {
                labelAtualGrupoTransacao = labelGrupoTransacao;
                gruposTransacoes.push({
                    label: labelGrupoTransacao,
                    transacoes: [transacao],
                });
            }
            gruposTransacoes.at(-1).transacoes.push(transacao);
        }
        return gruposTransacoes;
    }
    getSaldo() {
        return this.saldo;
    }
    getDataAcesso() {
        return new Date();
    }
    registrarTransacao(novaTransacao) {
        if (novaTransacao.tipoTransacao === TipoTransacao.DEPOSITO) {
            this.depositar(novaTransacao.valor);
        }
        else if (novaTransacao.tipoTransacao === TipoTransacao.TRASFERENCIA ||
            novaTransacao.tipoTransacao === TipoTransacao.PAGAMENTO_BOLETO) {
            this.saldo -= novaTransacao.valor;
            this.debitar(novaTransacao.valor);
            novaTransacao.valor *= -1;
        }
        else {
            throw new Error("Tipo de transação inválido.");
        }
        this.transacoes.push(novaTransacao);
        console.log(this.transacoes);
        localStorage.setItem("transacoes", JSON.stringify(this.transacoes));
    }
    debitar(valor) {
        if (valor <= 0) {
            throw new Error("O valor da transação deve ser maior que zero.");
        }
        if (valor > this.saldo) {
            throw new Error("Saldo insuficiente.");
        }
        this.saldo -= valor;
        localStorage.setItem("saldo", JSON.stringify(this.saldo));
    }
    depositar(valor) {
        if (valor <= 0) {
            throw new Error("O valor da transação deve ser maior que zero.");
        }
        this.saldo += valor;
        localStorage.setItem("saldo", JSON.stringify(this.saldo));
    }
}
const conta = new Conta("Joana da Silva Oliveira");
export default conta;
