import { Trash2, FileDown, Search } from 'lucide-react';
import { useState } from 'react';
import { gerarPDF } from '../utils/gerarPDF';

function fmt(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Propostas({ proposals, removeProposal, empresa, setPage }) {
  const [search, setSearch] = useState('');
  const [gerando, setGerando] = useState(null);

  const filtered = proposals.filter(p =>
    p.cliente?.nome?.toLowerCase().includes(search.toLowerCase())
  );

  async function handlePDF(proposal) {
    setGerando(proposal.id);
    try {
      await gerarPDF(proposal, empresa);
    } finally {
      setGerando(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Propostas Salvas</h1>
          <p className="text-gray-500 text-sm mt-1">{proposals.length} proposta{proposals.length !== 1 ? 's' : ''} gerada{proposals.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setPage('precificacao')} className="btn-primary">
          + Nova Proposta
        </button>
      </div>

      {proposals.length > 0 && (
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            className="input pl-9"
            placeholder="Buscar por nome do cliente..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <FileDown size={48} className="mx-auto mb-4 text-gray-700" />
          <p className="text-lg font-medium text-gray-400">Nenhuma proposta encontrada</p>
          <p className="text-sm mt-1 text-gray-600">Crie sua primeira proposta na aba "Nova Proposta"</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(p => (
            <div key={p.id} className="card hover:border-gray-700 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-100 truncate">{p.cliente?.nome || 'Cliente sem nome'}</h3>
                    <span className="px-2 py-0.5 bg-blue-500/15 text-blue-400 text-xs rounded-full font-medium shrink-0 border border-blue-500/20">
                      {p.porteLabel}
                    </span>
                  </div>
                  {p.cliente?.email && (
                    <p className="text-sm text-gray-500">{p.cliente.email}</p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.modulosSelecionados?.map(m => (
                      <span key={m.id} className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded border border-gray-700">
                        {m.nome}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold text-emerald-400">{fmt(p.totalGeral || 0)}</p>
                  {p.incluiSuporte && (
                    <p className="text-xs text-gray-500">+ {fmt(p.totalMensal || 0)}/mês</p>
                  )}
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(p.criadoEm).toLocaleDateString('pt-BR')}
                  </p>

                  <div className="flex gap-2 mt-3 justify-end">
                    <button
                      onClick={() => handlePDF(p)}
                      disabled={gerando === p.id}
                      className="btn-primary text-xs px-3 py-1.5"
                    >
                      <FileDown size={13} />
                      {gerando === p.id ? 'Gerando...' : 'PDF'}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Remover esta proposta?')) removeProposal(p.id);
                      }}
                      className="btn-danger text-xs px-3 py-1.5 flex items-center gap-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
