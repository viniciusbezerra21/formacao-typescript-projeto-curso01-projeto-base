import { GrupoTransacao } from "../types/GrupoTransacao.js";
import { Transacao } from "../types/Transacao.js";
import { TipoTransacao } from "../types/TipoTransacao.js";
import { Armazenador } from "../types/Armazenador.js";
import { ValidaDebito, ValidaDeposito } from "../types/Decorators.js";

export class Conta {
  protected nome: string;
  protected saldo: number = Armazenador.obter<number>("saldo") || 0;
  private transacoes: Transacao[] =
    Armazenador.obter<Transacao[]>("transacoes", (key: string, value: any) => {
      if (key === "data") {
        return new Date(value);
      }
      return value;
    }) || [];

  constructor(nome: string) {
    this.nome = nome;
  }

  protected getTitular() {
    return this.nome;
  }

  getGruposTransacoes(): GrupoTransacao[] {
    const gruposTransacoes: GrupoTransacao[] = [];
    const listaTransacoes: Transacao[] = structuredClone(this.transacoes);
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
  }

  getSaldo() {
    return this.saldo;
  }

  getDataAcesso() {
    return new Date();
  }
  registrarTransacao(novaTransacao: Transacao): void {
    if (novaTransacao.tipoTransacao === TipoTransacao.DEPOSITO) {
      this.depositar(novaTransacao.valor);
    } else if (
      novaTransacao.tipoTransacao === TipoTransacao.TRASFERENCIA ||
      novaTransacao.tipoTransacao === TipoTransacao.PAGAMENTO_BOLETO
    ) {
      this.saldo -= novaTransacao.valor;
      this.debitar(novaTransacao.valor);
      novaTransacao.valor *= -1;
    } else {
      throw new Error("Tipo de transação inválido.");
    }

    this.transacoes.push(novaTransacao);
    console.log(this.transacoes);
    Armazenador.salvar("transacoes", JSON.stringify(this.transacoes));
  }

  @ValidaDebito
  private debitar(valor: number) {
    this.saldo -= valor;
    Armazenador.salvar("saldo", JSON.stringify(this.saldo));
  }
  @ValidaDeposito
  private depositar(valor: number) {
    this.saldo += valor;
    Armazenador.salvar("saldo", JSON.stringify(this.saldo));
  }
}

export class ContaPremium extends Conta {
  registrarTransacao(transacao: Transacao): void {
    if (transacao.tipoTransacao === TipoTransacao.DEPOSITO) {
      console.log("Ganhou um bonos de 0,50 centavos");
      transacao.valor += 0.5;
    }
    super.registrarTransacao(transacao);
  }
}

const conta = new Conta("Joana da Silva Oliveira");
const contaPremium = new ContaPremium("Vinicius Bezerra");

export default conta;
