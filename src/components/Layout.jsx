import { Calculator, FileText, Settings, LayoutDashboard } from 'lucide-react';

const NAV = [
  { id: 'dashboard',      label: 'Dashboard',      icon: LayoutDashboard },
  { id: 'precificacao',   label: 'Nova Proposta',   icon: Calculator },
  { id: 'propostas',      label: 'Propostas',       icon: FileText },
  { id: 'configuracoes',  label: 'Configurações',   icon: Settings },
];

export default function Layout({ page, setPage, empresa, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', backgroundColor: '#030712' }}>

      {/* Header — largura total */}
      <header style={{ backgroundColor: '#111827', borderBottom: '1px solid #1f2937', width: '100%' }}>
        <div style={{ width: '100%', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36, height: 36, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: 16, color: '#fff', flexShrink: 0,
                backgroundColor: empresa.cor || '#2563eb',
              }}
            >
              {empresa.nome.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, color: '#f3f4f6', margin: 0, lineHeight: 1.2 }}>{empresa.nome}</p>
              <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>Sistema de Precificação ERP</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 12, color: '#6b7280' }}>Online</span>
          </div>
        </div>
      </header>

      {/* Nav mobile */}
      <nav className="bg-gray-900 border-b border-gray-800 flex lg:hidden overflow-x-auto w-full">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer shrink-0 ${
              page === id ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </nav>

      {/* Corpo: sidebar + conteúdo */}
      <div style={{ display: 'flex', flex: 1, width: '100%', padding: '20px', gap: 20, boxSizing: 'border-box' }}>

        {/* Sidebar — só desktop */}
        <aside className="hidden lg:block" style={{ width: 192, flexShrink: 0 }}>
          <nav className="card p-2 sticky top-5">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setPage(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 mb-0.5 cursor-pointer ${
                  page === id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Conteúdo principal */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
