import jsPDF from 'jspdf';

function fmt(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

export async function gerarPDF(proposal, empresa) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210;
  const corPrimaria = empresa.cor || '#2563eb';
  const [cr, cg, cb] = hexToRgb(corPrimaria);

  let y = 0;

  // ── HEADER ──────────────────────────────────────────────────────────────────
  doc.setFillColor(cr, cg, cb);
  doc.rect(0, 0, W, 38, 'F');

  doc.setFillColor(255, 255, 255, 0.2);
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0);
  doc.roundedRect(12, 8, 22, 22, 3, 3, 'F');
  doc.setTextColor(cr, cg, cb);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(empresa.nome.charAt(0).toUpperCase(), 23, 22, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text(empresa.nome, 40, 17);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const contatos = [empresa.cnpj, empresa.telefone, empresa.email, empresa.site].filter(Boolean).join('  •  ');
  doc.text(contatos, 40, 24);

  doc.setFontSize(8);
  doc.text('PROPOSTA COMERCIAL', W - 12, 13, { align: 'right' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Nº ${Date.now().toString().slice(-6)}`, W - 12, 20, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(new Date().toLocaleDateString('pt-BR'), W - 12, 27, { align: 'right' });

  y = 48;

  // ── DADOS DO CLIENTE ─────────────────────────────────────────────────────────
  doc.setTextColor(cr, cg, cb);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DO CLIENTE', 12, y);
  y += 3;
  doc.setDrawColor(cr, cg, cb);
  doc.setLineWidth(0.5);
  doc.line(12, y, W - 12, y);
  y += 5;

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  const clienteInfo = [
    ['Empresa / Cliente', proposal.cliente?.nome || '—'],
    ['CNPJ',             proposal.cliente?.cnpj || '—'],
    ['E-mail',           proposal.cliente?.email || '—'],
    ['Telefone',         proposal.cliente?.telefone || '—'],
    ['Porte',            proposal.porteLabel],
  ];

  clienteInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    doc.text(label + ':', 12, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    doc.text(String(value), 55, y);
    y += 6;
  });

  y += 4;

  // ── helper tabela com colunas: Item | Mensalidade | Implantação ──────────────
  function renderTabela(titulo, itens, mult) {
    if (!itens || itens.length === 0) return;

    if (y > 230) { doc.addPage(); y = 20; }

    doc.setTextColor(cr, cg, cb);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(titulo, 12, y);
    y += 3;
    doc.setDrawColor(cr, cg, cb);
    doc.line(12, y, W - 12, y);
    y += 5;

    // cabeçalho
    doc.setFillColor(245, 247, 250);
    doc.rect(12, y - 3, W - 24, 8, 'F');
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('Item', 14, y + 2);
    doc.text('Mensalidade', 130, y + 2);
    doc.text('Implantação', W - 14, y + 2, { align: 'right' });
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    itens.forEach((m, i) => {
      if (y > 260) { doc.addPage(); y = 20; }
      if (i % 2 === 0) {
        doc.setFillColor(252, 252, 253);
        doc.rect(12, y - 3, W - 24, 7, 'F');
      }
      doc.setFontSize(8);
      doc.text(m.nome.length > 55 ? m.nome.slice(0, 53) + '…' : m.nome, 14, y + 1);

      if (m.gratis) {
        doc.setTextColor(22, 163, 74);
        doc.setFont('helvetica', 'bold');
        doc.text('GRÁTIS', 130, y + 1);
        doc.text('GRÁTIS', W - 14, y + 1, { align: 'right' });
        doc.setTextColor(40, 40, 40);
      } else {
        const mens = (m.mensalidade || 0) * mult;
        const impl = (m.implantacao || 0) * mult;
        doc.setTextColor(100, 100, 100);
        doc.text(fmt(mens) + '/mês', 130, y + 1);
        doc.setTextColor(40, 40, 40);
        doc.setFont('helvetica', 'bold');
        doc.text(fmt(impl), W - 14, y + 1, { align: 'right' });
      }
      doc.setFont('helvetica', 'normal');
      y += 7;
    });
    y += 4;
  }

  renderTabela('MÓDULOS ERP CONTRATADOS', proposal.modulosSelecionados, proposal.multiplicador);
  renderTabela('IA INTEGRADA', proposal.iaSelecionados, proposal.multiplicador);
  renderTabela('ROBÔS E AUTOMAÇÃO', proposal.roboSelecionados, proposal.multiplicador);

  // Tabela de serviços avulsos (valorUnico + mensalidade opcional, sem multiplicador)
  if (proposal.servicoSelecionados && proposal.servicoSelecionados.length > 0) {
    if (y > 230) { doc.addPage(); y = 20; }
    doc.setTextColor(cr, cg, cb);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('SERVIÇOS DE IMPLANTAÇÃO', 12, y);
    y += 3;
    doc.setDrawColor(cr, cg, cb);
    doc.line(12, y, W - 12, y);
    y += 5;

    doc.setFillColor(245, 247, 250);
    doc.rect(12, y - 3, W - 24, 8, 'F');
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('Serviço', 14, y + 2);
    doc.text('Valor Único', 120, y + 2);
    doc.text('Mensalidade', W - 14, y + 2, { align: 'right' });
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    proposal.servicoSelecionados.forEach((m, i) => {
      if (y > 260) { doc.addPage(); y = 20; }
      if (i % 2 === 0) {
        doc.setFillColor(252, 252, 253);
        doc.rect(12, y - 3, W - 24, 7, 'F');
      }
      doc.setFontSize(8);
      doc.text(m.nome.length > 50 ? m.nome.slice(0, 48) + '…' : m.nome, 14, y + 1);
      if (m.gratis) {
        doc.setTextColor(22, 163, 74);
        doc.setFont('helvetica', 'bold');
        doc.text('GRÁTIS', 120, y + 1);
        doc.text('GRÁTIS', W - 14, y + 1, { align: 'right' });
        doc.setTextColor(40, 40, 40);
      } else {
        doc.setTextColor(40, 40, 40);
        doc.setFont('helvetica', 'bold');
        doc.text(m.valorUnico > 0 ? fmt(m.valorUnico) : '—', 120, y + 1);
        doc.setTextColor(100, 100, 100);
        doc.text(m.mensalidade > 0 ? fmt(m.mensalidade) + '/mês' : '—', W - 14, y + 1, { align: 'right' });
      }
      doc.setFont('helvetica', 'normal');
      y += 7;
    });
    y += 4;
  }

  // ── RESUMO FINANCEIRO ─────────────────────────────────────────────────────────
  if (y > 220) { doc.addPage(); y = 20; }

  doc.setTextColor(cr, cg, cb);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('RESUMO FINANCEIRO', 12, y);
  y += 3;
  doc.setDrawColor(cr, cg, cb);
  doc.line(12, y, W - 12, y);
  y += 6;

  // — Mensalidade recorrente —
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text('MENSALIDADE RECORRENTE', 14, y);
  y += 5;

  const rowsMens = [];
  if (proposal.mensalidadeModulos > 0)
    rowsMens.push([`Módulos ERP (${proposal.modulosSelecionados.length})`, fmt(proposal.mensalidadeModulos) + '/mês']);
  if (proposal.mensalidadeIA > 0)
    rowsMens.push([`IA Integrada (${proposal.iaSelecionados.length})`, fmt(proposal.mensalidadeIA) + '/mês']);
  if (proposal.mensalidadeRobos > 0)
    rowsMens.push([`Robôs e Automação (${proposal.roboSelecionados.length})`, fmt(proposal.mensalidadeRobos) + '/mês']);
  if ((proposal.mensalidadeServicos || 0) > 0)
    rowsMens.push([`Serviços de Implantação (${proposal.servicoSelecionados?.length || 0})`, fmt(proposal.mensalidadeServicos) + '/mês']);
  if (proposal.incluiSuporte)
    rowsMens.push(['Suporte técnico mensal', fmt(proposal.suporteMensal) + '/mês']);
  if ((proposal.adicionalImpl || 0) > 0)
    rowsMens.push([`Adicional por complexidade (${proposal.percAdicional}% da implantação)`, fmt(proposal.adicionalImpl) + '/mês']);

  rowsMens.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(label, 16, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text(value, W - 14, y, { align: 'right' });
    y += 6;
  });

  // total mensalidade
  doc.setFillColor(cr, cg, cb);
  doc.roundedRect(12, y - 2, W - 24, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL MENSAL', 18, y + 5);
  doc.setFontSize(11);
  doc.text(fmt(proposal.totalMensalidade) + '/mês', W - 14, y + 5, { align: 'right' });
  y += 16;

  // — Taxa de implantação —
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text('TAXA DE IMPLANTAÇÃO (cobrada uma única vez)', 14, y);
  y += 5;

  const rowsImpl = [];
  if (proposal.implantacaoModulos > 0)
    rowsImpl.push([`Módulos ERP`, fmt(proposal.implantacaoModulos)]);
  if (proposal.implantacaoIA > 0)
    rowsImpl.push([`IA Integrada`, fmt(proposal.implantacaoIA)]);
  if (proposal.implantacaoRobos > 0)
    rowsImpl.push([`Robôs e Automação`, fmt(proposal.implantacaoRobos)]);
  if ((proposal.valorUnicoServicos || 0) > 0)
    rowsImpl.push([`Serviços (${proposal.servicoSelecionados?.length || 0} itens)`, fmt(proposal.valorUnicoServicos)]);
  if (proposal.totalImpl > 0)
    rowsImpl.push([`Treinamento (${proposal.horasImpl}h × ${fmt(proposal.valorHora)}/h)`, fmt(proposal.totalImpl)]);

  rowsImpl.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(label, 16, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text(value, W - 14, y, { align: 'right' });
    y += 6;
  });

  // total implantação
  doc.setFillColor(180, 130, 20);
  doc.roundedRect(12, y - 2, W - 24, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL IMPLANTAÇÃO', 18, y + 5);
  doc.setFontSize(11);
  doc.text(fmt(proposal.totalImplantacao), W - 14, y + 5, { align: 'right' });
  y += 18;

  // ── OBSERVAÇÕES ───────────────────────────────────────────────────────────────
  if (proposal.observacoes) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setTextColor(cr, cg, cb);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('OBSERVAÇÕES', 12, y);
    y += 3;
    doc.setDrawColor(cr, cg, cb);
    doc.line(12, y, W - 12, y);
    y += 6;
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(proposal.observacoes, W - 26);
    doc.text(lines, 14, y);
    y += lines.length * 5 + 4;
  }

  // ── VALIDADE ────────────────────────────────────────────────────────────────
  const validadeDate = new Date();
  validadeDate.setDate(validadeDate.getDate() + 30);
  doc.setFontSize(8);
  doc.setTextColor(130, 130, 130);
  doc.setFont('helvetica', 'italic');
  doc.text(`Esta proposta é válida até ${validadeDate.toLocaleDateString('pt-BR')}. Contrato sem fidelidade — cancelamento com 30 dias de aviso.`, 12, y + 4);

  // ── FOOTER ───────────────────────────────────────────────────────────────────
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(245, 247, 250);
    doc.rect(0, 284, W, 13, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(130, 130, 130);
    doc.text(empresa.nome, 12, 291);
    doc.text(`Página ${i} de ${pageCount}`, W / 2, 291, { align: 'center' });
    if (empresa.site) doc.text(empresa.site, W - 12, 291, { align: 'right' });
  }

  const nomeArq = `Proposta_${(proposal.cliente?.nome || 'cliente').replace(/\s+/g, '_')}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
  doc.save(nomeArq);
}
