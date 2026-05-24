import { FileText, DollarSign, TrendingUp, Package } from 'lucide-react';

function fmt(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Dashboard({ proposals, modules, setPage }) {
  const totalImpl  = proposals.reduce((s, p) => s + (p.totalImplantacao || p.totalGeral || 0), 0);
  const totalMens  = proposals.reduce((s, p) => s + (p.totalMensalidade || p.totalMensal || 0), 0);
  const mediaImpl  = proposals.length ? totalImpl / proposals.length : 0;

  const stats = [
    { label: 'Total de Propostas',    value: proposals.length,  icon: FileText,    iconColor: 'text-blue-400',   bg: 'bg-blue-500/10' },
    { label: 'Implantação Acumulada', value: fmt(totalImpl),    icon: DollarSign,  iconColor: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Receita Mensal Total',  value: fmt(totalMens) + '/mês', icon: TrendingUp, iconColor: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Módulos Cadastrados',   value: modules.length,    icon: Package,     iconColor: 'text-amber-400',  bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Visão geral do sistema de precificação</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map(({ label, value, icon: Icon, iconColor, bg }) => (
          <div key={label} className="card flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}>
              <Icon size={22} className={iconColor} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <p className="text-xl font-bold text-gray-100">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Últimas propostas */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-100">Últimas Propostas</h2>
          <button onClick={() => setPage('propostas')} className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
            Ver todas →
          </button>
        </div>

        {proposals.length === 0 ? (
          <div className="text-center py-10 text-gray-600">
            <FileText size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm text-gray-500">Nenhuma proposta gerada ainda.</p>
            <button onClick={() => setPage('precificacao')} className="mt-3 btn-primary text-sm">
              Criar primeira proposta
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-2 text-gray-500 font-medium">Cliente</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Porte</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Módulos</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Mensalidade</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Implantação</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {proposals.slice(0, 5).map(p => (
                  <tr key={p.id} className="border-b border-gray-800/60 hover:bg-gray-800/40 transition-colors">
                    <td className="py-2.5 font-medium text-gray-200">{p.cliente.nome || '—'}</td>
                    <td className="py-2.5 text-gray-400">{p.porteLabel}</td>
                    <td className="py-2.5 text-gray-400">{p.modulosSelecionados?.length || 0} módulo(s)</td>
                    <td className="py-2.5 text-right font-semibold text-blue-400">{fmt(p.totalMensalidade || p.totalMensal || 0)}/mês</td>
                    <td className="py-2.5 text-right font-semibold text-amber-400">{fmt(p.totalImplantacao || p.totalGeral || 0)}</td>
                    <td className="py-2.5 text-right text-gray-500">
                      {new Date(p.criadoEm).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Atalho rápido */}
      <div className="card border-blue-500/30 bg-gradient-to-r from-blue-600/20 to-blue-500/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-gray-100">Criar Nova Proposta</h3>
            <p className="text-gray-400 text-sm mt-1">Calcule o preço e gere um PDF profissional</p>
          </div>
          <button
            onClick={() => setPage('precificacao')}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            Começar
          </button>
        </div>
      </div>
    </div>
  );
}
