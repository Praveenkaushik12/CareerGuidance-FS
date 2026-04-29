import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {
  getUnapprovedBlogs, setRejectionReason, rejectBlog,
  handleChange, setSelectedBlog, handleConfirmDelete, approveBlog
} from '../../../features/dashboards/admin/approveBlogs/approveBlogsSlice';

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function Badge({ approved }) {
  return (
    <span style={{ ...s.badge, ...(approved ? { background: '#d1fae5', color: '#065f46' } : { background: '#fef3c7', color: '#92400e' }) }}>
      {approved ? 'Approved' : 'Pending'}
    </span>
  );
}

export default function ApproveBlogs() {
  const dispatch = useDispatch();
  const { rows, selectedBlog } = useSelector(state => state.approveBlogs);

  const [search, setSearch]           = useState('');
  const [viewModal, setViewModal]     = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [approveModal, setApproveModal] = useState(false);
  const [page, setPage]               = useState(0);
  const PAGE_SIZE = 8;

  useEffect(() => { dispatch(getUnapprovedBlogs()); }, [dispatch]);

  const filtered = (rows || []).filter(r =>
    [r.title, r.author_name].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <div style={s.page}>
      {/* Banner */}
      <div style={s.banner}>
        <div>
          <div style={s.bannerTitle}>
            <i className="fas fa-blog" style={{ marginRight: 10 }} />
            Approve Blogs
          </div>
          <div style={s.bannerSub}>{filtered.length} blog{filtered.length !== 1 ? 's' : ''} pending review</div>
        </div>
      </div>

      {/* Search */}
      <div style={s.toolbar}>
        <div style={s.searchWrap}>
          <i className="fas fa-search" style={s.searchIcon} />
          <input
            style={s.searchInput}
            placeholder="Search by title or author…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>
              {['#', 'Title', 'Author', 'Date', 'Status', 'Actions'].map(h => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={6} style={s.empty}>No blogs found</td></tr>
            ) : paged.map((row, i) => (
              <tr key={row.id} style={s.tr}>
                <td style={s.td}>{page * PAGE_SIZE + i + 1}</td>
                <td style={{ ...s.td, fontWeight: 600, maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.title}</td>
                <td style={s.td}>{row.author_name}</td>
                <td style={s.td}>{row.created_at}</td>
                <td style={s.td}><Badge approved={row.is_approved} /></td>
                <td style={s.td}>
                  <div style={s.actions}>
                    <button style={s.btnIcon} title="View" onClick={() => { dispatch(setSelectedBlog(row)); setViewModal(true); }}>
                      <i className="fa fa-eye" />
                    </button>
                    <button style={{ ...s.btnIcon, color: '#10b981' }} title="Approve" onClick={() => { dispatch(setSelectedBlog(row)); setApproveModal(true); }}>
                      <i className="fa-solid fa-check" />
                    </button>
                    <button style={{ ...s.btnIcon, color: '#ef4444' }} title="Reject" onClick={() => { dispatch(setSelectedBlog(row)); setRejectModal(true); }}>
                      <i className="fa-solid fa-times" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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

      {/* View Modal */}
      <Modal open={viewModal} onClose={() => setViewModal(false)}>
        {selectedBlog && (
          <>
            <div style={s.modalHeader}>
              <span style={s.modalTitle}>Blog Detail</span>
              <button style={s.closeBtn} onClick={() => setViewModal(false)}><i className="fa-solid fa-xmark" /></button>
            </div>
            <div style={s.modalBody}>
              <div style={s.detailRow}><span style={s.detailLabel}>Title</span><span style={s.detailVal}>{selectedBlog.title}</span></div>
              <div style={s.detailRow}><span style={s.detailLabel}>Author</span><span style={s.detailVal}>{selectedBlog.author_name}</span></div>
              <div style={s.detailRow}><span style={s.detailLabel}>Date</span><span style={s.detailVal}>{selectedBlog.created_at}</span></div>
              {selectedBlog.counsellor_email && (
                <img
                  src={`../../../../../career_counselling_portal/Counsellors/${selectedBlog.counsellor_email}/Blogs/${selectedBlog.cover_image}`}
                  alt="cover"
                  style={{ width: '100%', borderRadius: 10, marginTop: 12, marginBottom: 12, objectFit: 'cover', maxHeight: 220 }}
                />
              )}
              <div style={{ fontSize: 14, lineHeight: 1.7, color: '#444' }} dangerouslySetInnerHTML={{ __html: selectedBlog.description }} />
            </div>
            <div style={s.modalFooter}>
              <button style={s.btnSecondary} onClick={() => setViewModal(false)}>Close</button>
            </div>
          </>
        )}
      </Modal>

      {/* Approve Modal */}
      <Modal open={approveModal} onClose={() => setApproveModal(false)}>
        {selectedBlog && (
          <>
            <div style={s.modalHeader}>
              <span style={s.modalTitle}>Approve Blog</span>
              <button style={s.closeBtn} onClick={() => setApproveModal(false)}><i className="fa-solid fa-xmark" /></button>
            </div>
            <div style={s.modalBody}>
              <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
                <i className="fa-solid fa-circle-check" style={{ fontSize: 44, color: '#10b981', marginBottom: 12 }} />
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Approve this blog?</div>
                <div style={{ color: '#888', fontSize: 14 }}>{selectedBlog.title}</div>
                <div style={{ color: '#aaa', fontSize: 12, marginTop: 4 }}>by {selectedBlog.author_name}</div>
              </div>
            </div>
            <div style={s.modalFooter}>
              <button style={s.btnSecondary} onClick={() => setApproveModal(false)}>Cancel</button>
              <button style={s.btnSuccess} onClick={() => {
                dispatch(setSelectedBlog(selectedBlog.id));
                dispatch(handleConfirmDelete());
                dispatch(approveBlog({ blog_id: selectedBlog.id }));
                setApproveModal(false);
              }}>Approve</button>
            </div>
          </>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal open={rejectModal} onClose={() => setRejectModal(false)}>
        {selectedBlog && (
          <>
            <div style={s.modalHeader}>
              <span style={s.modalTitle}>Reject Blog</span>
              <button style={s.closeBtn} onClick={() => setRejectModal(false)}><i className="fa-solid fa-xmark" /></button>
            </div>
            <div style={s.modalBody}>
              <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
                <i className="fa-solid fa-circle-xmark" style={{ fontSize: 44, color: '#ef4444', marginBottom: 12 }} />
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Reject this blog?</div>
                <div style={{ color: '#888', fontSize: 14 }}>{selectedBlog.title}</div>
                <div style={{ color: '#aaa', fontSize: 12, marginTop: 4 }}>This action cannot be undone.</div>
              </div>
            </div>
            <div style={s.modalFooter}>
              <button style={s.btnSecondary} onClick={() => setRejectModal(false)}>Cancel</button>
              <button style={s.btnDanger} onClick={() => {
                dispatch(setSelectedBlog(selectedBlog.id));
                dispatch(handleConfirmDelete());
                dispatch(rejectBlog({ blog_id: selectedBlog.id, counsellor_email: selectedBlog.counsellor_email }));
                setRejectModal(false);
              }}>Reject</button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

const s = {
  page:       { padding: '28px 32px', fontFamily: 'var(--fontHeading)', maxWidth: 1100, margin: '0 auto' },
  banner:     { background: 'linear-gradient(135deg,#1a237e,#4a148c)', borderRadius: 16, padding: '22px 28px', color: '#fff', marginBottom: 24, boxShadow: '0 8px 32px rgba(26,35,126,0.2)' },
  bannerTitle:{ fontSize: 20, fontWeight: 800 },
  bannerSub:  { fontSize: 13, opacity: 0.7, marginTop: 4 },

  toolbar:    { display: 'flex', alignItems: 'center', marginBottom: 18, gap: 12 },
  searchWrap: { position: 'relative', flex: 1, maxWidth: 360 },
  searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontSize: 14 },
  searchInput:{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: 10, border: '1.5px solid #e8eaf6', fontSize: 14, fontFamily: 'var(--fontHeading)', outline: 'none', background: '#fff', boxSizing: 'border-box' },

  tableWrap:  { background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0f0f8', overflow: 'hidden' },
  table:      { width: '100%', borderCollapse: 'collapse' },
  th:         { padding: '13px 16px', fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #f0f0f8', textAlign: 'left', background: '#fafbff' },
  tr:         { borderBottom: '1px solid #f7f7fc', transition: 'background 0.12s' },
  td:         { padding: '13px 16px', fontSize: 13.5, color: '#333', verticalAlign: 'middle' },
  empty:      { padding: '40px', textAlign: 'center', color: '#bbb', fontSize: 14 },

  badge:      { padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600 },
  actions:    { display: 'flex', gap: 8 },
  btnIcon:    { background: '#f5f5ff', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#5c35be', transition: 'background 0.15s' },

  pagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 20 },
  pageBtn:    { background: '#fff', border: '1.5px solid #e8eaf6', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  pageInfo:   { fontSize: 13, color: '#888', fontWeight: 600 },

  overlay:    { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal:      { background: '#fff', borderRadius: 16, width: '90%', maxWidth: 520, maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  modalHeader:{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f0f0f8', flexShrink: 0 },
  modalTitle: { fontWeight: 800, fontSize: 15, color: '#1a1a2e' },
  closeBtn:   { background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#aaa', lineHeight: 1, padding: 0 },
  modalBody:  { padding: '20px', overflowY: 'auto', flex: 1 },
  modalFooter:{ display: 'flex', gap: 10, justifyContent: 'flex-end', padding: '14px 20px', borderTop: '1px solid #f0f0f8', flexShrink: 0 },
  detailRow:  { display: 'flex', gap: 12, marginBottom: 10, alignItems: 'flex-start' },
  detailLabel:{ fontSize: 12, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', minWidth: 60, paddingTop: 2 },
  detailVal:  { fontSize: 14, color: '#333', flex: 1 },

  btnSecondary:{ padding: '8px 20px', borderRadius: 9, border: '1.5px solid #e8eaf6', background: '#fff', cursor: 'pointer', fontFamily: 'var(--fontHeading)', fontSize: 13, fontWeight: 600 },
  btnSuccess:  { padding: '8px 20px', borderRadius: 9, border: 'none', background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', cursor: 'pointer', fontFamily: 'var(--fontHeading)', fontSize: 13, fontWeight: 700 },
  btnDanger:   { padding: '8px 20px', borderRadius: 9, border: 'none', background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: '#fff', cursor: 'pointer', fontFamily: 'var(--fontHeading)', fontSize: 13, fontWeight: 700 },
};
