import { useState, useEffect } from 'react';
import { DEFAULT_MODULES, DEFAULT_IA, DEFAULT_ROBOS, DEFAULT_SERVICOS, VALOR_HORA_IMPLEMENTACAO, MENSALIDADE_SUPORTE_BASE } from '../data/defaultData';

const STORAGE_VERSION = 'v4';

// Limpa dados antigos incompatíveis quando a versão muda
function migrateStorage() {
  try {
    const saved = localStorage.getItem('erp_version');
    if (saved !== STORAGE_VERSION) {
      ['erp_modules','erp_ia','erp_robos','erp_servicos','erp_valorHora','erp_mensalidade','erp_proposals','erp_empresa'].forEach(
        k => localStorage.removeItem(k)
      );
      localStorage.setItem('erp_version', STORAGE_VERSION);
    }
  } catch { /* nada */ }
}

migrateStorage();

function loadFromStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    // garante que arrays são arrays e objetos são objetos
    if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* nada */ }
}

export function useAppStore() {
  const [modules, setModules] = useState(() =>
    loadFromStorage('erp_modules', DEFAULT_MODULES)
  );
  const [iaItems, setIaItems] = useState(() =>
    loadFromStorage('erp_ia', DEFAULT_IA)
  );
  const [roboItems, setRoboItems] = useState(() =>
    loadFromStorage('erp_robos', DEFAULT_ROBOS)
  );
  const [servicoItems, setServicoItems] = useState(() =>
    loadFromStorage('erp_servicos', DEFAULT_SERVICOS)
  );
  const [valorHora, setValorHora] = useState(() =>
    loadFromStorage('erp_valorHora', VALOR_HORA_IMPLEMENTACAO)
  );
  const [mensalidadeBase, setMensalidadeBase] = useState(() =>
    loadFromStorage('erp_mensalidade', MENSALIDADE_SUPORTE_BASE)
  );
  const [proposals, setProposals] = useState(() =>
    loadFromStorage('erp_proposals', [])
  );
  const [empresa, setEmpresa] = useState(() =>
    loadFromStorage('erp_empresa', {
      nome: 'Minha Empresa Tech',
      cnpj: '',
      telefone: '',
      email: '',
      site: '',
      cor: '#2563eb',
    })
  );

  useEffect(() => { saveToStorage('erp_modules', modules); }, [modules]);
  useEffect(() => { saveToStorage('erp_ia', iaItems); }, [iaItems]);
  useEffect(() => { saveToStorage('erp_robos', roboItems); }, [roboItems]);
  useEffect(() => { saveToStorage('erp_servicos', servicoItems); }, [servicoItems]);
  useEffect(() => { saveToStorage('erp_valorHora', valorHora); }, [valorHora]);
  useEffect(() => { saveToStorage('erp_mensalidade', mensalidadeBase); }, [mensalidadeBase]);
  useEffect(() => { saveToStorage('erp_proposals', proposals); }, [proposals]);
  useEffect(() => { saveToStorage('erp_empresa', empresa); }, [empresa]);

  function addModule(mod) {
    setModules(prev => [...prev, { ...mod, id: Date.now() }]);
  }
  function updateModule(id, updates) {
    setModules(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }
  function removeModule(id) {
    setModules(prev => prev.filter(m => m.id !== id));
  }

  function updateIaItem(id, updates) {
    setIaItems(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }
  function updateRoboItem(id, updates) {
    setRoboItems(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }
  function updateServicoItem(id, updates) {
    setServicoItems(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }

  function saveProposal(proposal) {
    const newProposal = { ...proposal, id: Date.now(), criadoEm: new Date().toISOString() };
    setProposals(prev => [newProposal, ...prev]);
    return newProposal;
  }
  function removeProposal(id) {
    setProposals(prev => prev.filter(p => p.id !== id));
  }

  return {
    modules, addModule, updateModule, removeModule,
    iaItems, updateIaItem,
    roboItems, updateRoboItem,
    servicoItems, updateServicoItem,
    valorHora, setValorHora,
    mensalidadeBase, setMensalidadeBase,
    proposals, saveProposal, removeProposal,
    empresa, setEmpresa,
  };
}
