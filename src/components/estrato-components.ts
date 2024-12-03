import Conta from "../types/Conta.js"
import { FormatoData } from "../types/FormatoData.js"
import  {GrupoTransacao} from "../types/GrupoTransacao.js"
import { formatarMoeda } from "../utils/formatters.js"
import { formatarData } from "../utils/formatters.js"

const elementoRegistroTransacaoExtrato:HTMLElement = document.querySelector('.extrato .registro-transacoes');

renderizarExtrato()


function renderizarExtrato():void{
    const grupoTransacoes :GrupoTransacao[] = Conta.getGruposTransacoes() 
    elementoRegistroTransacaoExtrato.innerHTML = ''
    let htmlRegistroTransacoes: string = ''

    for(let grupoTransacao of grupoTransacoes){
        let htmltransacaoItem: string = ''

        for(let transacao of grupoTransacao.transacoes){

            htmltransacaoItem += `
            <div class="transacao-item">
                <div class="transacao-info">
                    <span class="tipo">${transacao.tipoTransacao}</span>
                    <strong class="valor">${formatarMoeda(transacao.valor)}</strong>
                </div>
                <time class="data">${formatarData(transacao.data, FormatoData.DIA_MES)}</time>
            </div>
        `;
        }
        
        htmlRegistroTransacoes += `
        <div class="transacoes-group">
            <strong class="mes-group">${grupoTransacao.label}</strong>
            ${htmltransacaoItem}
        </div>
    `;
        
    }
    
    if(htmlRegistroTransacoes === ""){
        htmlRegistroTransacoes = "<div>Nao ha registros de transaçoes.</div>"
    }

  elementoRegistroTransacaoExtrato.innerHTML = htmlRegistroTransacoes
  
}

const ExtratoComponent ={
    atualizar():void{
       renderizarExtrato()
      
    }
}

export default ExtratoComponent