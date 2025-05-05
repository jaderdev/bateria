// app.js - Script principal para o sistema de testes de baterias ER18505M

document.addEventListener('DOMContentLoaded', function() {
  // Inicialização
  initApp();
  
  // Event Listeners
  setupEventListeners();
});

// Inicialização da aplicação
function initApp() {
  // Definir data atual no campo de data
  const hoje = new Date().toISOString().split('T')[0];
  document.querySelector('input[name="dataInspecao"]').value = hoje;
  
  // Verificar tema salvo
  if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark');
  }
  
  // Inicializar a tabela
  atualizarTabela();
}

// Configurar todos os event listeners
function setupEventListeners() {
  // Alternância de tema claro/escuro
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  
  // Navegação por abas
  document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      switchTab(tabId);
    });
  });
  
  // Ativar campos de teste após 5 caracteres no código de barras
  const codigoBarrasInput = document.getElementById('codigoBarras');
  if (codigoBarrasInput) {
    codigoBarrasInput.addEventListener('input', handleCodigoBarrasInput);
  }
  
  // Validar automaticamente os campos com base nos valores inseridos
  const camposValidacao = ['ocvInicial', 'correnteCarga', 'ocvPosCarga', 'tensaoPulso'];
  camposValidacao.forEach(campo => {
    const input = document.querySelector(`input[name="${campo}"]`);
    if (input) {
      input.addEventListener('input', validarCampos);
    }
  });
  
  // Atualizar conclusão quando inspeção visual mudar
  const inspecaoVisual = document.querySelector('select[name="inspecaoVisual"]');
  if (inspecaoVisual) {
    inspecaoVisual.addEventListener('change', validarCampos);
  }
  
  // Botões do formulário
  document.getElementById('btnRegistrar').addEventListener('click', registrarTeste);
  document.getElementById('btnLimpar').addEventListener('click', limparFormulario);
  
  // Filtrar registros
  document.getElementById('filtroStatus').addEventListener('change', atualizarTabela);
  
  // Exportar dados
  document.getElementById('btnExportarCSV').addEventListener('click', exportarCSV);
  document.getElementById('btnExportarExcel').addEventListener('click', exportarExcel);
  
  // Limpar todos os dados
  document.getElementById('btnLimparDados').addEventListener('click', limparTodosDados);
  
  // Modal de detalhes
  document.getElementById('fecharModal').addEventListener('click', fecharModal);
  document.getElementById('fecharModalBtn').addEventListener('click', fecharModal);
}

// Alternar entre tema claro e escuro
function toggleTheme() {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
}

// Alternar entre abas
function switchTab(tabId) {
  // Desativar todas as abas
  document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.classList.remove('active');
  });
  
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // Ativar a aba selecionada
  document.getElementById(tabId).classList.add('active');
  document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
  
  // Atualizar a tabela se estiver na aba de registros
  if (tabId === 'secaoRegistros') {
    atualizarTabela();
  }
}

// Manipular entrada do código de barras
function handleCodigoBarrasInput() {
  if (this.value.length >= 5) {
    document.getElementById('testes').classList.remove('hidden');
  } else {
    document.getElementById('testes').classList.add('hidden');
  }
}

// Validar campos automaticamente
function validarCampos() {
  const ocvInicial = document.querySelector('input[name="ocvInicial"]').value.replace(',', '.');
  const correnteCarga = document.querySelector('input[name="correnteCarga"]').value.replace(',', '.');
  const ocvPosCarga = document.querySelector('input[name="ocvPosCarga"]').value.replace(',', '.');
  const tensaoPulso = document.querySelector('input[name="tensaoPulso"]').value.replace(',', '.');
  const inspecaoVisual = document.querySelector('select[name="inspecaoVisual"]').value;
  
  // Status OCV Inicial (entre 3,63V e 3,73V)
  const statusOcv = document.querySelector('select[name="statusOcv"]');
  if (ocvInicial) {
    const ocvInicialNum = parseFloat(ocvInicial);
    statusOcv.value = (!isNaN(ocvInicialNum) && ocvInicialNum >= 3.63 && ocvInicialNum <= 3.73) ? 'OK' : 'NOK';
    atualizarEstiloStatus(statusOcv);
  }
  
  // Status Corrente de Carga (entre 23mA e 25mA)
  const statusCarga = document.querySelector('select[name="statusCarga"]');
  if (correnteCarga) {
    const correnteCargaNum = parseFloat(correnteCarga);
    statusCarga.value = (!isNaN(correnteCargaNum) && correnteCargaNum >= 23 && correnteCargaNum <= 25) ? 'OK' : 'NOK';
    atualizarEstiloStatus(statusCarga);
  }
  
  // Status OCV Pós-Carga (≥ 3,60V)
  const statusPosCarga = document.querySelector('select[name="statusPosCarga"]');
  if (ocvPosCarga) {
    const ocvPosCargaNum = parseFloat(ocvPosCarga);
    statusPosCarga.value = (!isNaN(ocvPosCargaNum) && ocvPosCargaNum >= 3.60) ? 'OK' : 'NOK';
    atualizarEstiloStatus(statusPosCarga);
  }
  
  // Status Tensão Pulso (≥ 2,90V)
  const statusPulso = document.querySelector('select[name="statusPulso"]');
  if (tensaoPulso) {
    const tensaoPulsoNum = parseFloat(tensaoPulso);
    statusPulso.value = (!isNaN(tensaoPulsoNum) && tensaoPulsoNum >= 2.90) ? 'OK' : 'NOK';
    atualizarEstiloStatus(statusPulso);
  }
  
  // Atualizar conclusão automaticamente
  const conclusao = document.querySelector('select[name="conclusao"]');
  const hasNOK = 
    statusOcv.value === 'NOK' || 
    statusCarga.value === 'NOK' || 
    statusPosCarga.value === 'NOK' || 
    statusPulso.value === 'NOK' ||
    inspecaoVisual === 'NOK';
  
  conclusao.value = hasNOK ? 'Reprovada - Descartar' : 'Aprovada para Estoque';
  atualizarEstiloStatus(conclusao);
}

// Atualizar estilo dos campos de status
function atualizarEstiloStatus(selectElement) {
  if (selectElement.value === 'NOK' || selectElement.value.includes('Reprovada')) {
    selectElement.className = 'form-select status-select bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800';
  } else {
    selectElement.className = 'form-select status-select bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-800';
  }
}

// Registrar teste
function registrarTeste() {
  const form = document.getElementById('form');
  const codigo = form.querySelector('input[name="codigo"]').value;
  
  if (codigo.length < 5) {
    showNotification('Por favor, escaneie ou digite um código de barras válido.', 'error');
    return;
  }
  
  // Verificar se há algum status NOK
  const statusOcv = form.querySelector('select[name="statusOcv"]').value;
  const statusCarga = form.querySelector('select[name="statusCarga"]').value;
  const statusPosCarga = form.querySelector('select[name="statusPosCarga"]').value;
  const statusPulso = form.querySelector('select[name="statusPulso"]').value;
  const inspecaoVisual = form.querySelector('select[name="inspecaoVisual"]').value;
  const conclusao = form.querySelector('select[name="conclusao"]').value;
  
  const status = (
    statusOcv === 'NOK' || 
    statusCarga === 'NOK' || 
    statusPosCarga === 'NOK' || 
    statusPulso === 'NOK' || 
    inspecaoVisual === 'NOK' || 
    conclusao.includes('Reprovada')
  ) ? 'reprovado' : 'aprovado';
  
  // Criar objeto de teste
  const novoTeste = {
    id: Date.now().toString(),
    codigo: codigo,
    dataRegistro: new Date().toISOString(),
    dataInspecao: form.querySelector('input[name="dataInspecao"]').value || new Date().toISOString().split('T')[0],
    ocvInicial: form.querySelector('input[name="ocvInicial"]').value || '',
    statusOcv: statusOcv,
    correnteCarga: form.querySelector('input[name="correnteCarga"]').value || '',
    statusCarga: statusCarga,
    ocvPosCarga: form.querySelector('input[name="ocvPosCarga"]').value || '',
    statusPosCarga: statusPosCarga,
    tensaoPulso: form.querySelector('input[name="tensaoPulso"]').value || '',
    statusPulso: statusPulso,
    inspecaoVisual: inspecaoVisual,
    conclusao: conclusao,
    observacoes: form.querySelector('textarea[name="observacoes"]').value || '',
    status: status
  };
  
  // Salvar no localStorage
  const registros = JSON.parse(localStorage.getItem('registrosBaterias') || '[]');
  registros.push(novoTeste);
  localStorage.setItem('registrosBaterias', JSON.stringify(registros));
  
  // Limpar formulário
  limparFormulario();
  
  // Mostrar mensagem de sucesso
  showNotification('Registro salvo com sucesso!', 'success');
  
  // Mudar para a aba de registros
  // switchTab('secaoRegistros');
}

// Limpar formulário
function limparFormulario() {
  document.getElementById('form').reset();
  document.getElementById('testes').classList.add('hidden');
  document.querySelector('input[name="dataInspecao"]').value = new Date().toISOString().split('T')[0];
  document.getElementById('codigoBarras').focus();
}

// Atualizar tabela de registros
function atualizarTabela() {
  const registros = JSON.parse(localStorage.getItem('registrosBaterias') || '[]');
  const filtro = document.getElementById('filtroStatus').value;
  const tabelaRegistros = document.getElementById('tabelaRegistros');
  const semRegistros = document.getElementById('semRegistros');
  const totalRegistros = document.getElementById('totalRegistros');
  
  // Filtrar registros
  const registrosFiltrados = registros.filter(registro => {
    if (filtro === 'aprovados') return registro.status === 'aprovado';
    if (filtro === 'reprovados') return registro.status === 'reprovado';
    if (filtro === 'inspecao') return isInspecaoProxima(registro.dataInspecao);
    return true; // 'todos'
  });
  
  // Atualizar contador
  totalRegistros.textContent = `Total: ${registrosFiltrados.length} registro${registrosFiltrados.length !== 1 ? 's' : ''}`;
  
  // Limpar tabela
  tabelaRegistros.innerHTML = '';
  
  // Verificar se há registros
  if (registrosFiltrados.length === 0) {
    semRegistros.style.display = 'flex';
    return;
  }
  
  // Esconder mensagem de sem registros
  semRegistros.style.display = 'none';
  
  // Preencher tabela
  registrosFiltrados.forEach(registro => {
    const tr = document.createElement('tr');
    
    // Determinar classe da linha com base no status
    if (registro.status === 'reprovado') {
      tr.className = 'table-row-rejected';
    } else if (isInspecaoProxima(registro.dataInspecao)) {
      tr.className = 'table-row-inspection';
    } else {
      tr.className = 'table-row-approved';
    }
    
    tr.innerHTML = `
      <td class="table-cell">${registro.codigo}</td>
      <td class="table-cell">${formatarData(registro.dataInspecao)}</td>
      <td class="table-cell">
        ${registro.ocvInicial} ${getStatusIcon(registro.statusOcv)}
      </td>
      <td class="table-cell">
        ${registro.correnteCarga} ${getStatusIcon(registro.statusCarga)}
      </td>
      <td class="table-cell">
        ${registro.ocvPosCarga} ${getStatusIcon(registro.statusPosCarga)}
      </td>
      <td class="table-cell">
        ${registro.tensaoPulso} ${getStatusIcon(registro.statusPulso)}
      </td>
      <td class="table-cell">
        ${getStatusIcon(registro.inspecaoVisual)}
      </td>
      <td class="table-cell">
        ${registro.conclusao.includes('Aprovada') ? 
          '<span class="text-green-600 dark:text-green-400 font-medium">Aprovada</span>' : 
          '<span class="text-red-600 dark:text-red-400 font-medium">Reprovada</span>'}
      </td>
      <td class="table-cell">
        <button data-id="${registro.id}" class="btnDetalhes action-btn action-btn-details">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Detalhes
        </button>
        <button data-id="${registro.id}" class="btnExcluir action-btn action-btn-delete">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Excluir
        </button>
      </td>
    `;
    
    tabelaRegistros.appendChild(tr);
  });
  
  // Adicionar eventos aos botões
  document.querySelectorAll('.btnDetalhes').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      mostrarDetalhes(id);
    });
  });
  
  document.querySelectorAll('.btnExcluir').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      excluirRegistro(id);
    });
  });
}

// Verificar se a inspeção está próxima (30 dias)
function isInspecaoProxima(dataInspecao) {
  const dataInsp = new Date(dataInspecao);
  const hoje = new Date();
  const trintaDiasDepois = new Date(dataInsp);
  trintaDiasDepois.setDate(dataInsp.getDate() + 30);
  
  return hoje >= dataInsp && hoje <= trintaDiasDepois;
}

// Formatar data
function formatarData(dataString) {
  if (!dataString) return '';
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR');
}

// Obter ícone de status
function getStatusIcon(status) {
  if (status === 'OK') {
    return '<span class="status-icon status-icon-ok">✓</span>';
  } else if (status === 'NOK') {
    return '<span class="status-icon status-icon-nok">✗</span>';
  }
  return '';
}

// Mostrar detalhes do registro
function mostrarDetalhes(id) {
  const registros = JSON.parse(localStorage.getItem('registrosBaterias') || '[]');
  const registro = registros.find(r => r.id === id);
  
  if (!registro) return;
  
  const conteudoModal = document.getElementById('conteudoModal');
  conteudoModal.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <p class="font-semibold text-gray-600 dark:text-gray-300">Código de Barras:</p>
        <p class="text-gray-800 dark:text-white">${registro.codigo}</p>
      </div>
      <div>
        <p class="font-semibold text-gray-600 dark:text-gray-300">Data de Inspeção:</p>
        <p class="text-gray-800 dark:text-white">${formatarData(registro.dataInspecao)}</p>
      </div>
      <div>
        <p class="font-semibold text-gray-600 dark:text-gray-300">OCV Inicial (V):</p>
        <p class="text-gray-800 dark:text-white">${registro.ocvInicial} ${getStatusIcon(registro.statusOcv)}</p>
      </div>
      <div>
        <p class="font-semibold text-gray-600 dark:text-gray-300">Corrente Carga (mA):</p>
        <p class="text-gray-800 dark:text-white">${registro.correnteCarga} ${getStatusIcon(registro.statusCarga)}</p>
      </div>
      <div>
        <p class="font-semibold text-gray-600 dark:text-gray-300">OCV Pós-Carga (V):</p>
        <p class="text-gray-800 dark:text-white">${registro.ocvPosCarga} ${getStatusIcon(registro.statusPosCarga)}</p>
      </div>
      <div>
        <p class="font-semibold text-gray-600 dark:text-gray-300">Tensão Pulso (V):</p>
        <p class="text-gray-800 dark:text-white">${registro.tensaoPulso} ${getStatusIcon(registro.statusPulso)}</p>
      </div>
      <div>
        <p class="font-semibold text-gray-600 dark:text-gray-300">Inspeção Visual:</p>
        <p class="text-gray-800 dark:text-white">${registro.inspecaoVisual}</p>
      </div>
      <div>
        <p class="font-semibold text-gray-600 dark:text-gray-300">Conclusão Final:</p>
        <p class="text-gray-800 dark:text-white">${registro.conclusao}</p>
      </div>
    </div>
    <div class="mt-4">
      <p class="font-semibold text-gray-600 dark:text-gray-300">Observações:</p>
      <p class="text-gray-800 dark:text-white">${registro.observacoes || 'Nenhuma observação'}</p>
    </div>
  `;
  
  document.getElementById('modalDetalhes').classList.add('active');
}

// Fechar modal
function fecharModal() {
  document.getElementById('modalDetalhes').classList.remove('active');
}

// Excluir registro
function excluirRegistro(id) {
  if (confirm('Tem certeza que deseja excluir este registro?')) {
    const registros = JSON.parse(localStorage.getItem('registrosBaterias') || '[]');
    const novosRegistros = registros.filter(r => r.id !== id);
    localStorage.setItem('registrosBaterias', JSON.stringify(novosRegistros));
    atualizarTabela();
    showNotification('Registro excluído com sucesso!', 'success');
  }
}

// Limpar todos os dados
function limparTodosDados() {
  if (confirm('Tem certeza que deseja excluir todos os registros? Esta ação não pode ser desfeita.')) {
    localStorage.removeItem('registrosBaterias');
    atualizarTabela();
    showNotification('Todos os registros foram excluídos!', 'success');
  }
}

// Exportar dados em CSV
function exportarCSV() {
  const registros = JSON.parse(localStorage.getItem('registrosBaterias') || '[]');
  const filtro = document.getElementById('filtroStatus').value;
  
  // Filtrar registros
  const registrosFiltrados = registros.filter(registro => {
    if (filtro === 'aprovados') return registro.status === 'aprovado';
    if (filtro === 'reprovados') return registro.status === 'reprovado';
    if (filtro === 'inspecao') return isInspecaoProxima(registro.dataInspecao);
    return true; // 'todos'
  });
  
  if (registrosFiltrados.length === 0) {
    showNotification('Não há registros para exportar.', 'error');
    return;
  }
  
  // Cabeçalhos do CSV
  const headers = [
    'Código de Barras',
    'Data de Registro',
    'Data de Inspeção',
    'OCV Inicial (V)',
    'Status OCV',
    'Corrente Carga (mA)',
    'Status Carga',
    'OCV Pós-Carga (V)',
    'Status Pós-Carga',
    'Tensão Pulso (V)',
    'Status Pulso',
    'Inspeção Visual',
    'Conclusão Final',
    'Observações',
    'Status'
  ];
  
  // Converter registros para linhas CSV
  let csvContent = headers.join(',') + '\n';
  
  registrosFiltrados.forEach(registro => {
    const dataRegistro = new Date(registro.dataRegistro).toLocaleDateString('pt-BR');
    
    // Escapar campos com vírgulas ou aspas
    const row = [
      `"${registro.codigo}"`,
      `"${dataRegistro}"`,
      `"${formatarData(registro.dataInspecao)}"`,
      `"${registro.ocvInicial}"`,
      `"${registro.statusOcv}"`,
      `"${registro.correnteCarga}"`,
      `"${registro.statusCarga}"`,
      `"${registro.ocvPosCarga}"`,
      `"${registro.statusPosCarga}"`,
      `"${registro.tensaoPulso}"`,
      `"${registro.statusPulso}"`,
      `"${registro.inspecaoVisual}"`,
      `"${registro.conclusao}"`,
      `"${registro.observacoes.replace(/"/g, '""')}"`,
      `"${registro.status === 'aprovado' ? 'Aprovado' : 'Reprovado'}"`
    ];
    
    csvContent += row.join(',') + '\n';
  });
  
  // Criar blob e link para download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  // Nome do arquivo com data atual
  const dataAtual = new Date().toISOString().split('T')[0];
  const nomeArquivo = `registros_baterias_${dataAtual}.csv`;
  
  link.setAttribute('href', url);
  link.setAttribute('download', nomeArquivo);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showNotification('Arquivo CSV exportado com sucesso!', 'success');
}

// Exportar dados em Excel
function exportarExcel() {
  const registros = JSON.parse(localStorage.getItem('registrosBaterias') || '[]');
  const filtro = document.getElementById('filtroStatus').value;
  
  // Filtrar registros
  const registrosFiltrados = registros.filter(registro => {
    if (filtro === 'aprovados') return registro.status === 'aprovado';
    if (filtro === 'reprovados') return registro.status === 'reprovado';
    if (filtro === 'inspecao') return isInspecaoProxima(registro.dataInspecao);
    return true; // 'todos'
  });
  
  if (registrosFiltrados.length === 0) {
    showNotification('Não há registros para exportar.', 'error');
    return;
  }
  
  // Preparar dados para o Excel
  const excelData = registrosFiltrados.map(registro => {
    return {
      'Código de Barras': registro.codigo,
      'Data de Registro': new Date(registro.dataRegistro).toLocaleDateString('pt-BR'),
      'Data de Inspeção': formatarData(registro.dataInspecao),
      'OCV Inicial (V)': registro.ocvInicial,
      'Status OCV': registro.statusOcv,
      'Corrente Carga (mA)': registro.correnteCarga,
      'Status Carga': registro.statusCarga,
      'OCV Pós-Carga (V)': registro.ocvPosCarga,
      'Status Pós-Carga': registro.statusPosCarga,
      'Tensão Pulso (V)': registro.tensaoPulso,
      'Status Pulso': registro.statusPulso,
      'Inspeção Visual': registro.inspecaoVisual,
      'Conclusão Final': registro.conclusao,
      'Observações': registro.observacoes,
      'Status': registro.status === 'aprovado' ? 'Aprovado' : 'Reprovado'
    };
  });
  
  // Criar workbook e worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  
  // Adicionar título ao filtro atual
  let tituloFiltro = 'Todos os Registros';
  if (filtro === 'aprovados') tituloFiltro = 'Registros Aprovados';
  if (filtro === 'reprovados') tituloFiltro = 'Registros Reprovados';
  if (filtro === 'inspecao') tituloFiltro = 'Registros com Inspeção Próxima';
  
  // Adicionar worksheet ao workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, tituloFiltro);
  
  // Nome do arquivo com data atual e filtro
  const dataAtual = new Date().toISOString().split('T')[0];
  const filtroTexto = filtro !== 'todos' ? `_${filtro}` : '';
  const nomeArquivo = `registros_baterias${filtroTexto}_${dataAtual}.xlsx`;
  
  // Exportar arquivo
  XLSX.writeFile(workbook, nomeArquivo);
  
  showNotification('Arquivo Excel exportado com sucesso!', 'success');
}

// Mostrar notificação
function showNotification(message, type = 'info') {
  // Verificar se já existe uma notificação
  let notification = document.querySelector('.notification');
  
  // Se já existe, remover para criar uma nova
  if (notification) {
    notification.remove();
  }
  
  // Criar elemento de notificação
  notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  // Ícone baseado no tipo
  let icon = '';
  if (type === 'success') {
    icon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>';
  } else if (type === 'error') {
    icon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>';
  } else {
    icon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
  }
  
  // Conteúdo da notificação
  notification.innerHTML = `
    <div class="notification-icon">${icon}</div>
    <div class="notification-message">${message}</div>
    <button class="notification-close">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  `;
  
  // Adicionar ao DOM
  document.body.appendChild(notification);
  
  // Adicionar evento para fechar
  notification.querySelector('.notification-close').addEventListener('click', function() {
    notification.classList.add('notification-hiding');
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
  
  // Auto-remover após 5 segundos
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.classList.add('notification-hiding');
      setTimeout(() => {
        if (document.body.contains(notification)) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);
  
  // Animar entrada
  setTimeout(() => {
    notification.classList.add('notification-show');
  }, 10);
}

// Adicionar estilos para notificações
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  .notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    padding: 12px 16px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(100px);
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
    z-index: 1000;
    max-width: 400px;
  }
  
  .dark .notification {
    background-color: #1f2937;
    color: #f9fafb;
  }
  
  .notification-show {
    transform: translateY(0);
    opacity: 1;
  }
  
  .notification-hiding {
    transform: translateY(100px);
    opacity: 0;
  }
  
  .notification-icon {
    margin-right: 12px;
    flex-shrink: 0;
  }
  
  .notification-message {
    flex-grow: 1;
    font-size: 14px;
  }
  
  .notification-close {
    margin-left: 12px;
    cursor: pointer;
    color: #6b7280;
    flex-shrink: 0;
  }
  
  .notification-success .notification-icon {
    color: #10b981;
  }
  
  .notification-error .notification-icon {
    color: #ef4444;
  }
  
  .notification-info .notification-icon {
    color: #3b82f6;
  }
  
  @media (max-width: 640px) {
    .notification {
      left: 20px;
      right: 20px;
      max-width: none;
    }
  }
`;

document.head.appendChild(notificationStyles);
