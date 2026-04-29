import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, setSelectedRow, getUsers, handleDeleteRow } from "../../../features/dashboards/admin/userReport/userReportSlice";

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}

export default function UserReport() {
  const dispatch = useDispatch();
  const { rows, selectedRow } = useSelector(store => store.userReport);

  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(0);
  const [confirmOpen, setConfirm] = useState(false);
  const PAGE_SIZE = 10;

  useEffect(() => { dispatch(getUsers()); }, [dispatch]);

  const filtered = (rows || []).filter(r =>
    [r.name, r.email].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const selectedUser = rows?.find(r => r.id === selectedRow);

  return (
    <div style={s.page}>
      <div style={s.banner}>
        <div>
          <div style={s.bannerTitle}><i className="fas fa-users" style={{ marginRight: 10 }} />Users Report</div>
          <div style={s.bannerSub}>{filtered.length} registered user{filtered.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      <div style={s.toolbar}>
        <div style={s.searchWrap}>
          <i className="fas fa-search" style={s.searchIcon} />
          <input style={s.searchInput} placeholder="Search by name or email…" value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }} />
        </div>
        <div style={s.countBadge}>{filtered.length} users</div>
      </div>

      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>{['#', 'Name', 'Email', 'Action'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={4} style={s.empty}>No users found</td></tr>
            ) : paged.map((row, i) => (
              <tr key={row.id} style={s.tr}>
                <td style={{ ...s.td, color: '#aaa', fontSize: 12 }}>{page * PAGE_SIZE + i + 1}</td>
                <td style={s.td}>
                  <div style={s.nameCell}>
                    <div style={s.avatar}>{(row.name || row.email || 'U').charAt(0).toUpperCase()}</div>
                    <span style={{ fontWeight: 600 }}>{row.name || '—'}</span>
                  </div>
                </td>
                <td style={{ ...s.td, color: '#666' }}>{row.email}</td>
                <td style={s.td}>
                  <button style={s.btnDangerSm} onClick={() => { dispatch(setSelectedRow(row.id)); setConfirm(true); }}>
                    <i className="fa-solid fa-trash" style={{ marginRight: 6 }} />Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={s.pagination}>
          <button style={s.pageBtn} disabled={page === 0} onClick={() => setPage(p => p - 1)}>
            <i className="fa-solid fa-chevron-left" />
          </button>
          <span style={s.pageInfo}>Page {page + 1} of {totalPages}</span>
          <button style={s.pageBtn} disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
            <i className="fa-solid fa-chevron-right" />
          </button>
        </div>
      )}

      <Modal open={confirmOpen} onClose={() => setConfirm(false)}>
        <div style={s.modalHeader}>
          <span style={s.modalTitle}>Delete User</span>
          <button style={s.closeBtn} onClick={() => setConfirm(false)}><i className="fa-solid fa-xmark" /></button>
        </div>
        <div style={s.modalBody}>
          <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: 44, color: '#f59e0b', marginBottom: 12 }} />
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Delete this user?</div>
            {selectedUser && <div style={{ color: '#888', fontSize: 14 }}>{selectedUser.name || selectedUser.email}</div>}
            <div style={{ color: '#aaa', fontSize: 12, marginTop: 4 }}>This will permanently remove their account and data.</div>
          </div>
        </div>
        <div style={s.modalFooter}>
          <button style={s.btnSecondary} onClick={() => setConfirm(false)}>Cancel</button>
          <button style={s.btnDanger} onClick={() => {
            dispatch(deleteUser({ selectedRow }));
            dispatch(handleDeleteRow());
            setConfirm(false);
          }}>Delete</button>
        </div>
      </Modal>
    </div>
  );
}

const s = {
  page:        { padding: '28px 32px', fontFamily: 'var(--fontHeading)', maxWidth: 1000, margin: '0 auto' },
  banner:      { background: 'linear-gradient(135deg,#1a237e,#4a148c)', borderRadius: 16, padding: '22px 28px', color: '#fff', marginBottom: 24, boxShadow: '0 8px 32px rgba(26,35,126,0.2)' },
  bannerTitle: { fontSize: 20, fontWeight: 800 },
  bannerSub:   { fontSize: 13, opacity: 0.7, marginTop: 4 },
  toolbar:     { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 },
  searchWrap:  { position: 'relative', flex: 1, maxWidth: 360 },
  searchIcon:  { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontSize: 14 },
  searchInput: { width: '100%', padding: '9px 12px 9px 34px', borderRadius: 10, border: '1.5px solid #e8eaf6', fontSize: 14, fontFamily: 'var(--fontHeading)', outline: 'none', background: '#fff', boxSizing: 'border-box' },
  countBadge:  { background: '#f0f0ff', color: '#5c35be', borderRadius: 99, padding: '5px 14px', fontSize: 12, fontWeight: 700 },
  tableWrap:   { background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0f0f8', overflow: 'hidden' },
  table:       { width: '100%', borderCollapse: 'collapse' },
  th:          { padding: '13px 16px', fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #f0f0f8', textAlign: 'left', background: '#fafbff' },
  tr:          { borderBottom: '1px solid #f7f7fc' },
  td:          { padding: '12px 16px', fontSize: 13.5, color: '#333', verticalAlign: 'middle' },
  empty:       { padding: '40px', textAlign: 'center', color: '#bbb', fontSize: 14 },
  nameCell:    { display: 'flex', alignItems: 'center', gap: 10 },
  avatar:      { width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#4a148c,#1a237e)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 },
  btnDangerSm: { background: '#fff0f0', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'var(--fontHeading)', display: 'flex', alignItems: 'center' },
  pagination:  { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 20 },
  pageBtn:     { background: '#fff', border: '1.5px solid #e8eaf6', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  pageInfo:    { fontSize: 13, color: '#888', fontWeight: 600 },
  overlay:     { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal:       { background: '#fff', borderRadius: 16, width: '90%', maxWidth: 420, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  modalHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f0f0f8' },
  modalTitle:  { fontWeight: 800, fontSize: 15, color: '#1a1a2e' },
  closeBtn:    { background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#aaa', padding: 0 },
  modalBody:   { padding: '20px' },
  modalFooter: { display: 'flex', gap: 10, justifyContent: 'flex-end', padding: '14px 20px', borderTop: '1px solid #f0f0f8' },
  btnSecondary:{ padding: '8px 20px', borderRadius: 9, border: '1.5px solid #e8eaf6', background: '#fff', cursor: 'pointer', fontFamily: 'var(--fontHeading)', fontSize: 13, fontWeight: 600 },
  btnDanger:   { padding: '8px 20px', borderRadius: 9, border: 'none', background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: '#fff', cursor: 'pointer', fontFamily: 'var(--fontHeading)', fontSize: 13, fontWeight: 700 },
};
