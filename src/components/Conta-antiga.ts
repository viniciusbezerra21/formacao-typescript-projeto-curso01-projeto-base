import { Transacao } from "../types/Transacao.js";
import { TipoTransacao } from "../types/TipoTransacao.js";
import { GrupoTransacao } from "../types/GrupoTransacao.js";

let saldo: number = JSON.parse(localStorage.getItem("saldo")) || 0;
const transacoes: Transacao[] =
  JSON.parse(
    localStorage.getItem("transacoes"),
    (key: string, value: string) => {
      if (key === "data") {
        return new Date(value);
      }
      return value;
    }
  ) || [];

function debitar(valor: number) {
  if (valor <= 0) {
    throw new Error("O valor da transação deve ser maior que zero.");
  }
  if (valor > saldo) {
    throw new Error("Saldo insuficiente.");
  }
  saldo -= valor;
  localStorage.setItem("saldo", JSON.stringify(saldo));
}

function depositar(valor: number) {
  if (valor <= 0) {
    throw new Error("O valor da transação deve ser maior que zero.");
  }
  saldo += valor;
  localStorage.setItem("saldo", JSON.stringify(saldo));
}

const Conta = {
  getSaldo() {
    return saldo;
  },
  getDataAcesso(): Date {
    return new Date();
  },
  getGruposTransacoes(): GrupoTransacao[] {
    const gruposTransacoes: GrupoTransacao[] = [];
    const listaTransacoes: Transacao[] = structuredClone(transacoes);
    const transacoesOrdenadas: Transacao[] = listaTransacoes.sort(
      (t1, t2) => t2.data.getTime() - t1.data.getTime()
    );
    let labelAtualGrupoTransacao: string = "";

    for (let transacao of transacoesOrdenadas) {
      let labelGrupoTransacao: string = transacao.data.toLocaleDateString(
        "pt-BR",
        { month: "long", year: "numeric" }
      );
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
  },

  registrarTransacao(novaTransacao: Transacao): void {
    if (novaTransacao.tipoTransacao === TipoTransacao.DEPOSITO) {
      depositar(novaTransacao.valor);
    } else if (
      novaTransacao.tipoTransacao === TipoTransacao.TRASFERENCIA ||
      novaTransacao.tipoTransacao === TipoTransacao.PAGAMENTO_BOLETO
    ) {
      saldo -= novaTransacao.valor;
      debitar(novaTransacao.valor);
      novaTransacao.valor *= -1;
    } else {
      throw new Error("Tipo de transação inválido.");
    }

    transacoes.push(novaTransacao);
    console.log(transacoes);
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
  },

  agruparTransacoes(): ResumoTransacoes {
    const resumo: ResumoTransacoes = { 
    totalDepositos: 0, 
totalTransferencias: 0, 
totalPagamentosBoleto: 0 
    };

    this.transacoes.forEach(transacao => {
        switch (transacao.tipoTransacao) {
            case TipoTransacao.DEPOSITO:
                resumo.totalDepositos += transacao.valor;
                break;

            case TipoTransacao.TRASFERENCIA:
                resumo.totalTransferencias += transacao.valor;
                break;

            case TipoTransacao.PAGAMENTO_BOLETO:
                resumo.totalPagamentosBoleto += transacao.valor;
                break;
        }
    });

    return resumo;
}
};



export default Conta;
