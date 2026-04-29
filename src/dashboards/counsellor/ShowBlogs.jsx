import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCounsellorBlogs, handleDeleteBlog, deleteBlog, handleCancelDelete } from "../../features/dashboards/counsellor/showBlogsSlice"

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function StatusBadge({ approved }) {
  return (
    <span style={{ ...s.badge, ...(approved ? { background: '#d1fae5', color: '#065f46' } : { background: '#fef3c7', color: '#92400e' }) }}>
      {approved ? 'Published' : 'Pending'}
    </span>
  );
}

export default function ShowBlogs() {
  const dispatch = useDispatch();
  const { selectedBlog, deleteConfirmationOpen, rows } = useSelector(s => s.showBlogs);

  const [search, setSearch] = useState('');
  const [page, setPage]     = useState(0);
  const PAGE_SIZE = 8;

  useEffect(() => { dispatch(getCounsellorBlogs()); }, []);

  const filtered = (rows || []).filter(r =>
    [r.title, r.author_name, r.area_of_field].some(v =>
      v?.toLowerCase().includes(search.toLowerCase())
    )
  );
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <div style={s.page}>
      <div style={s.banner}>
        <div>
          <div style={s.bannerTitle}><i className="fa fa-sticky-note" style={{ marginRight: 10 }} />My Blogs</div>
          <div style={s.bannerSub}>{filtered.length} article{filtered.length !== 1 ? 's' : ''} total</div>
        </div>
        <Link to="/counsellor/addBlog" style={s.newBtn}>
          <i className="fa-solid fa-plus" style={{ marginRight: 8 }} />New Blog
        </Link>
      </div>

      <div style={s.toolbar}>
        <div style={s.searchWrap}>
          <i className="fas fa-search" style={s.searchIcon} />
          <input style={s.searchInput} placeholder="Search by title, author, or field…" value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }} />
        </div>
        <div style={s.countBadge}>{filtered.length} blogs</div>
      </div>

      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>{['#', 'Title', 'Author', 'Field', 'Date', 'Status', 'Actions'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={7} style={s.empty}>
                  <i className="fa-solid fa-newspaper" style={{ fontSize: 28, marginBottom: 10, color: '#e0e0e0' }} />
                  <div>No blogs yet. <Link to="/counsellor/addBlog" style={{ color: '#8b5cf6' }}>Write your first one →</Link></div>
                </td>
              </tr>
            ) : paged.map((row, i) => (
              <tr key={row.id} style={s.tr}>
                <td style={{ ...s.td, color: '#aaa', fontSize: 12 }}>{page * PAGE_SIZE + i + 1}</td>
                <td style={{ ...s.td, fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.title}</td>
                <td style={s.td}>{row.author_name}</td>
                <td style={{ ...s.td, color: '#888' }}>
                  {row.area_of_field && (
                    <span style={s.fieldPill}>{row.area_of_field}</span>
                  )}
                </td>
                <td style={{ ...s.td, color: '#aaa', fontSize: 12 }}>{row.created_at}</td>
                <td style={s.td}><StatusBadge approved={row.is_approved} /></td>
                <td style={s.td}>
                  <div style={s.actions}>
                    <Link to={`/counsellor/showBlogs/${row.id}`} style={{ ...s.btnIcon, textDecoration: 'none' }} title="View">
                      <i className="fa fa-eye" />
                    </Link>
                    <Link to={`/counsellor/addBlog/${row.id}`} style={{ ...s.btnIcon, color: '#8b5cf6', textDecoration: 'none' }} title="Edit">
                      <i className="fa-solid fa-pen-to-square" />
                    </Link>
                    <button style={{ ...s.btnIcon, color: '#ef4444' }} title="Delete"
                      onClick={() => dispatch(handleDeleteBlog({ data: row }))}>
                      <i className="fa fa-trash" />
                    </button>
                  </div>
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

      {/* Delete Modal */}
      <Modal open={deleteConfirmationOpen} onClose={() => dispatch(handleCancelDelete())}>
        <div style={s.modalHeader}>
          <span style={s.modalTitle}>Delete Blog</span>
          <button style={s.closeBtn} onClick={() => dispatch(handleCancelDelete())}><i className="fa-solid fa-xmark" /></button>
        </div>
        <div style={s.modalBody}>
          <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: 44, color: '#f59e0b', marginBottom: 12 }} />
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Delete this blog?</div>
            {selectedBlog && <div style={{ color: '#888', fontSize: 14 }}>{selectedBlog.title}</div>}
            <div style={{ color: '#aaa', fontSize: 12, marginTop: 4 }}>This cannot be undone.</div>
          </div>
        </div>
        <div style={s.modalFooter}>
          <button style={s.btnSecondary} onClick={() => dispatch(handleCancelDelete())}>Cancel</button>
          <button style={s.btnDanger} onClick={() => dispatch(deleteBlog(selectedBlog.id))}>Delete</button>
        </div>
      </Modal>
    </div>
  );
}

const s = {
  page:        { padding: '28px 32px', fontFamily: 'var(--fontHeading)', maxWidth: 1100, margin: '0 auto' },
  banner:      { background: 'linear-gradient(135deg,#4a148c,#1a237e)', borderRadius: 16, padding: '22px 28px', color: '#fff', marginBottom: 24, boxShadow: '0 8px 32px rgba(74,20,140,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  bannerTitle: { fontSize: 20, fontWeight: 800 },
  bannerSub:   { fontSize: 13, opacity: 0.7, marginTop: 4 },
  newBtn:      { background: 'rgba(255,255,255,0.18)', color: '#fff', borderRadius: 10, padding: '9px 18px', fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', border: '1.5px solid rgba(255,255,255,0.3)', flexShrink: 0 },
  toolbar:     { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 },
  searchWrap:  { position: 'relative', flex: 1, maxWidth: 380 },
  searchIcon:  { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontSize: 14 },
  searchInput: { width: '100%', padding: '9px 12px 9px 34px', borderRadius: 10, border: '1.5px solid #e8eaf6', fontSize: 14, fontFamily: 'var(--fontHeading)', outline: 'none', background: '#fff', boxSizing: 'border-box' },
  countBadge:  { background: '#f3e8ff', color: '#7c3aed', borderRadius: 99, padding: '5px 14px', fontSize: 12, fontWeight: 700 },
  tableWrap:   { background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0f0f8', overflow: 'hidden' },
  table:       { width: '100%', borderCollapse: 'collapse' },
  th:          { padding: '13px 16px', fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #f0f0f8', textAlign: 'left', background: '#fafbff' },
  tr:          { borderBottom: '1px solid #f7f7fc' },
  td:          { padding: '12px 16px', fontSize: 13.5, color: '#333', verticalAlign: 'middle' },
  empty:       { padding: '48px', textAlign: 'center', color: '#bbb', fontSize: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  badge:       { padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600 },
  fieldPill:   { background: '#ede9fe', color: '#6d28d9', borderRadius: 99, padding: '2px 10px', fontSize: 12, fontWeight: 600 },
  actions:     { display: 'flex', gap: 8 },
  btnIcon:     { background: '#f5f5ff', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#5c35be' },
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
