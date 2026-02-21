import React, { useState } from 'react';

const API_BASE = '/api/admin';

const AdminPage = () => {
  const [tokenInput, setTokenInput] = useState('');
  const [token, setToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('propfirm');

  const authenticate = async () => {
    if (!tokenInput) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/waitlists`, {
        headers: { Authorization: `Bearer ${tokenInput}` },
      });
      if (res.status === 401) {
        setError('Invalid token. Please try again.');
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError('Server error. Please try again.');
        setLoading(false);
        return;
      }
      const json = await res.json();
      setToken(tokenInput);
      setData(json);
      setIsAuthenticated(true);
    } catch {
      setError('Connection error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken('');
    setTokenInput('');
    setIsAuthenticated(false);
    setData(null);
    setError('');
  };

  const exportCSV = (list) => {
    fetch(`${API_BASE}/waitlists/export?list=${list}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${list}-waitlist.csv`;
        a.click();
        URL.revokeObjectURL(url);
      });
  };

  const tabs = [
    { id: 'propfirm', label: 'Prop Firm Waitlist' },
    { id: 'standr', label: 'STANDR Waitlist' },
    { id: 'newsletter', label: 'Newsletter' },
  ];

  // ── Token entry screen ──────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#07090f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#edf2ff',
        padding: '1rem',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(17, 21, 34, 0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '2rem',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f6d9bf', margin: 0 }}>
              Admin Dashboard
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#6a7a9b', marginTop: '0.25rem' }}>
              EOSI Finance — Subscriber Management
            </p>
          </div>

          <label style={{
            display: 'block',
            fontSize: '0.7rem',
            color: '#94a5c8',
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 600,
          }}>
            Admin Token
          </label>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && authenticate()}
            placeholder="Enter your admin token"
            style={{
              width: '100%',
              background: '#0e162b',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
              color: '#edf2ff',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />

          {error && (
            <p style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#ff9d9d' }}>{error}</p>
          )}

          <button
            onClick={authenticate}
            disabled={loading || !tokenInput}
            style={{
              marginTop: '1rem',
              width: '100%',
              background: 'linear-gradient(120deg, #c8860a, #f2b569)',
              border: 'none',
              borderRadius: '50px',
              padding: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: '#1a0f00',
              cursor: loading || !tokenInput ? 'not-allowed' : 'pointer',
              opacity: loading || !tokenInput ? 0.6 : 1,
            }}
          >
            {loading ? 'Authenticating…' : 'Unlock Dashboard'}
          </button>
        </div>
      </div>
    );
  }

  // ── Dashboard screen ────────────────────────────────────────────────────────
  const tableData = data?.[activeTab] ?? [];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#07090f',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#edf2ff',
      padding: '1.5rem 1rem',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f6d9bf', margin: 0 }}>
              Admin Dashboard
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#6a7a9b', marginTop: '0.2rem' }}>
              EOSI Finance — Subscriber Management
            </p>
          </div>
          <button
            onClick={logout}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              padding: '0.45rem 1rem',
              fontSize: '0.8rem',
              color: '#8a95ae',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {tabs.map((tab) => {
            const count = data?.[tab.id]?.length ?? 0;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: active ? 'rgba(242,181,105,0.1)' : 'rgba(255,255,255,0.04)',
                  border: active ? '1px solid rgba(242,181,105,0.35)' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  padding: '0.45rem 0.9rem',
                  fontSize: '0.8rem',
                  fontWeight: active ? 600 : 400,
                  color: active ? '#f2b569' : '#94a5c8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                {tab.label}
                <span style={{
                  background: active ? 'rgba(242,181,105,0.18)' : 'rgba(255,255,255,0.08)',
                  borderRadius: '999px',
                  padding: '0.1rem 0.45rem',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table card */}
        <div style={{
          background: 'rgba(17,21,34,0.95)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}>
          {/* Toolbar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.875rem 1.25rem',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}>
            <p style={{ fontSize: '0.78rem', color: '#94a5c8', margin: 0 }}>
              {tableData.length} subscriber{tableData.length !== 1 ? 's' : ''}
            </p>
            <button
              onClick={() => exportCSV(activeTab)}
              style={{
                background: 'rgba(242,181,105,0.08)',
                border: '1px solid rgba(242,181,105,0.28)',
                borderRadius: '8px',
                padding: '0.35rem 0.8rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#f2b569',
                cursor: 'pointer',
              }}
            >
              Export CSV ↓
            </button>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.025)' }}>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>Email</th>
                  {activeTab !== 'newsletter' && <th style={thStyle}>Twitter / X</th>}
                  <th style={thStyle}>Signed Up</th>
                </tr>
              </thead>
              <tbody>
                {tableData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={activeTab !== 'newsletter' ? 4 : 3}
                      style={{ padding: '2.5rem 1.25rem', textAlign: 'center', color: '#6a7a9b' }}
                    >
                      No subscribers yet.
                    </td>
                  </tr>
                ) : (
                  tableData.map((row, i) => (
                    <tr key={row.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={tdMuted}>{i + 1}</td>
                      <td style={tdMain}>{row.email}</td>
                      {activeTab !== 'newsletter' && (
                        <td style={row.twitter ? tdMain : tdMuted}>{row.twitter || '—'}</td>
                      )}
                      <td style={{ ...tdMuted, whiteSpace: 'nowrap' }}>
                        {new Date(row.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const thStyle = {
  padding: '0.65rem 1.25rem',
  textAlign: 'left',
  color: '#6a7a9b',
  fontWeight: 600,
  whiteSpace: 'nowrap',
};

const tdMain = {
  padding: '0.7rem 1.25rem',
  color: '#dbe5f8',
};

const tdMuted = {
  padding: '0.7rem 1.25rem',
  color: '#6a7a9b',
};

export default AdminPage;
