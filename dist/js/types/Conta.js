import { TipoTransacao } from "./TipoTransacao.js";
let saldo = JSON.parse(localStorage.getItem('saldo')) || 0;
const transacoes = JSON.parse(localStorage.getItem('transacoes'), (key, value) => {
    if (key === 'data') {
        return new Date(value);
    }
    return value;
}) || [];
function debitar(valor) {
    if (valor < 0) {
        throw new Error('O valor debitado deve ser maior que zero');
    }
    if (valor > saldo) {
        throw new Error('saldo insuficiente');
    }
    saldo -= valor;
    localStorage.setItem('saldo', saldo.toString());
}
function depositar(valor) {
    if (valor < 0) {
        throw new Error('O valor depositado deve ser maior que zero');
    }
    saldo += valor;
    localStorage.setItem('saldo', saldo.toString());
}
const Conta = {
    getSaldo() {
        return saldo;
    },
    getDataAcesso() {
        return new Date();
    },
    getGruposTransacoes() {
        const grupoTransacoes = [];
        const listaTransacoes = structuredClone(transacoes);
        const transacoesOrdenadas = listaTransacoes.sort((t1, t2) => t2.data.getTime() - t1.data.getTime());
        let labelAtualGrupoTransacao = "";
        for (let transacao of transacoesOrdenadas) {
            let labelGrupoTransacao = transacao.data.toLocaleDateString('pt-br', { month: 'long', year: "numeric" });
            if (labelAtualGrupoTransacao !== labelGrupoTransacao) {
                labelAtualGrupoTransacao = labelGrupoTransacao;
                grupoTransacoes.push({
                    label: labelGrupoTransacao,
                    transacoes: []
                });
            }
            grupoTransacoes.at(-1).transacoes.push(transacao);
        }
        return grupoTransacoes;
    },
    registrarTransacao(novaTransacao) {
        if (novaTransacao.tipoTransacao == TipoTransacao.DEPOSITO) {
            depositar(novaTransacao.valor);
        }
        else if (novaTransacao.tipoTransacao == TipoTransacao.TRANSFERENCIA) {
            debitar(novaTransacao.valor);
            novaTransacao.valor *= -1;
        }
        else if (novaTransacao.tipoTransacao == TipoTransacao.PAGAMENTO_BOLETO) {
            debitar(novaTransacao.valor);
            novaTransacao.valor *= -1;
        }
        else {
            throw new Error("Tipo de Transação é inválido!");
        }
        transacoes.push(novaTransacao);
        console.log(this.getGruposTransacoes());
        localStorage.setItem('transacoes', JSON.stringify(transacoes));
    },
    resumoTransaçoes() {
        const listaTransacoes = structuredClone(transacoes);
        const grupoDeposito = [];
        const grupoTransferencia = [];
        const grupoBoleto = [];
        for (let transacao of listaTransacoes) {
            if (transacao.tipoTransacao === TipoTransacao.DEPOSITO) {
                grupoDeposito.push(transacao);
            }
            if (transacao.tipoTransacao === TipoTransacao.TRANSFERENCIA) {
                grupoTransferencia.push(transacao);
            }
            if (transacao.tipoTransacao === TipoTransacao.PAGAMENTO_BOLETO) {
                grupoBoleto.push(transacao);
            }
        }
        let somaBoleto = 0;
        let somaDeposito = 0;
        let somaTranf = 0;
        for (let i = 0; i < grupoBoleto.length; i++) {
            somaBoleto += grupoBoleto[i].valor;
        }
        for (let i = 0; i < grupoDeposito.length; i++) {
            somaDeposito += grupoDeposito[i].valor;
        }
        for (let i = 0; i < grupoTransferencia.length; i++) {
            somaTranf += grupoTransferencia[i].valor;
        }
        console.log(`Você pagou R$:${somaBoleto.toFixed()} no total`);
        console.log(`Você depositou  R$:${somaDeposito.toFixed()} no total`);
        console.log(`Você transferiu  R$:${somaTranf.toFixed()} no total`);
    }
};
export default Conta;
