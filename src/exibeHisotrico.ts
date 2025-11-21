function exibeHistorico(novaTransacao: Transacao): void {
  const registroDeTransacoes = document.querySelector(
    "aside.extrato .registro-transacoes"
  ) as HTMLElement;
  const novoRegistro = document.createElement("div");
  novoRegistro.innerHTML = `
        <strong class="mes-group" style="color: var(--cor-secundaria); font-weight: 600; font-size: var(--fonte-t3);">${formatarData(novaTransacao.data, FormatoData.MES)}</strong>
                    <div class="transacao-item">
                        <div class="transacao-info">
                            <span class="tipo">${novaTransacao.tipoTransacao}</span>
                            <strong class="valor">${formatarMoeda(
                              novaTransacao.valor
                            )}</strong>
                        </div>
                        <time class="data">${formatarData(
                          novaTransacao.data,
                          FormatoData.DIA_MES
                        )}</time>
                    </div>
    `;
  registroDeTransacoes.appendChild(novoRegistro);
}
