import { useState, Component } from 'react';
import './index.css';
import { useAppStore } from './store/useStore';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Precificacao from './pages/Precificacao';
import Propostas from './pages/Propostas';
import Configuracoes from './pages/Configuracoes';

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '100vh', background: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 24 }}>
          <p style={{ color: '#f87171', fontSize: 18, fontWeight: 700, margin: 0 }}>Algo deu errado</p>
          <p style={{ color: '#6b7280', fontSize: 13, margin: 0, fontFamily: 'monospace' }}>{this.state.error.message}</p>
          <button
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}
          >
            Limpar dados e reiniciar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [page, setPage] = useState('dashboard');
  const store = useAppStore();

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard proposals={store.proposals} modules={store.modules} setPage={setPage} />;
      case 'precificacao':
        return (
          <Precificacao
            modules={store.modules}
            iaItems={store.iaItems}
            roboItems={store.roboItems}
            servicoItems={store.servicoItems}
            valorHora={store.valorHora}
            setValorHora={store.setValorHora}
            mensalidadeBase={store.mensalidadeBase}
            saveProposal={store.saveProposal}
            empresa={store.empresa}
            setPage={setPage}
          />
        );
      case 'propostas':
        return (
          <Propostas
            proposals={store.proposals}
            removeProposal={store.removeProposal}
            empresa={store.empresa}
            setPage={setPage}
          />
        );
      case 'configuracoes':
        return (
          <Configuracoes
            modules={store.modules}
            addModule={store.addModule}
            updateModule={store.updateModule}
            removeModule={store.removeModule}
            iaItems={store.iaItems}
            updateIaItem={store.updateIaItem}
            roboItems={store.roboItems}
            updateRoboItem={store.updateRoboItem}
            valorHora={store.valorHora}
            setValorHora={store.setValorHora}
            mensalidadeBase={store.mensalidadeBase}
            setMensalidadeBase={store.setMensalidadeBase}
            empresa={store.empresa}
            setEmpresa={store.setEmpresa}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <Layout page={page} setPage={setPage} empresa={store.empresa}>
        {renderPage()}
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
