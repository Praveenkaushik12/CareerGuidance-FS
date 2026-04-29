import { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import JoditEditor from "jodit-react"
import {
  getBlogDetails, handleChange, setDescription,
  addBlogData, editBlogData, clearForm, showErrorMsg
} from "../../features/dashboards/counsellor/addBlogSlice"

export default function AddBlog() {
  const params   = useParams()
  const editor   = useRef(null)
  const dispatch = useDispatch()
  const { addBlog, errorMsg, user_email } = useSelector(s => s.addBlog)

  const [isSubmitting, setIsSubmitting]     = useState(false)
  const [coverImage, setCoverImage]         = useState(null)
  const [coverImageURL, setCoverImageURL]   = useState(null)
  const isEdit = Boolean(params.id)

  const handleAddBlog = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const parser      = new DOMParser()
      const htmlDoc     = parser.parseFromString(addBlog.description, "text/html")
      const textContent = htmlDoc.body.innerHTML
      dispatch(setDescription({ description: textContent }))
      const formData = new FormData()
      formData.append('addBlogData', JSON.stringify(addBlog))
      formData.append('cover_image', coverImage)
      if (isEdit) {
        formData.append('blogId', params.id)
        await dispatch(editBlogData(formData))
      } else {
        await dispatch(addBlogData(formData))
      }
    } catch (e) {
      console.error(e)
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    return () => { dispatch(clearForm()) }
  }, [dispatch, params.id])

  useEffect(() => {
    if (params.id) dispatch(getBlogDetails(params.id))
  }, [params.id])

  const field = (label, name, placeholder, required = true) => (
    <div style={s.field}>
      <label style={s.label}>{label}{required && <span style={s.req}>*</span>}</label>
      <input
        style={s.input}
        type="text"
        placeholder={placeholder}
        name={name}
        value={addBlog[name] || ''}
        required={required}
        onChange={e => dispatch(handleChange({ name: e.target.name, value: e.target.value }))}
      />
    </div>
  )

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.banner}>
        <div>
          <div style={s.bannerTitle}>
            <i className={`fa-solid ${isEdit ? 'fa-pen-to-square' : 'fa-plus'}`} style={{ marginRight: 10 }} />
            {isEdit ? 'Edit Blog' : 'Write a New Blog'}
          </div>
          <div style={s.bannerSub}>Fill in the details below and publish your article</div>
        </div>
      </div>

      <form
        onSubmit={e => {
          e.preventDefault()
          if (!isEdit && !coverImage) {
            dispatch(showErrorMsg({ error: "Please upload a cover image" }))
            return
          }
          dispatch(showErrorMsg({ error: "" }))
          handleAddBlog()
        }}
        style={s.form}
      >
        <div style={s.card}>
          <div style={s.cardTitle}>
            <i className="fa-solid fa-circle-info" style={{ marginRight: 8, color: '#8b5cf6' }} />
            Blog Details
          </div>

          {field("Blog Title", "title", "Enter a compelling title…")}
          {field("Area of Field", "area_of_field", "e.g. Engineering, Medicine, Arts…")}

          {/* Cover Image */}
          <div style={s.field}>
            <label style={s.label}>Cover Image{!isEdit && <span style={s.req}>*</span>}</label>
            <label style={s.fileLabel}>
              <i className="fa-solid fa-image" style={{ marginRight: 8 }} />
              {coverImage ? coverImage.name : isEdit ? 'Change cover image (optional)' : 'Choose an image…'}
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                style={{ display: 'none' }}
                onChange={e => {
                  const f = e.target.files[0]
                  if (f) { setCoverImageURL(URL.createObjectURL(f)); setCoverImage(f) }
                }}
              />
            </label>
            {(coverImageURL || (isEdit && addBlog.cover_image)) && (
              <div style={s.previewWrap}>
                <img
                  src={coverImageURL || `../../../career_counselling_portal/Counsellors/${user_email}/Blogs${addBlog.cover_image}`}
                  alt="cover preview"
                  style={s.preview}
                />
              </div>
            )}
          </div>
        </div>

        {/* Editor */}
        <div style={s.card}>
          <div style={s.cardTitle}>
            <i className="fa-solid fa-file-pen" style={{ marginRight: 8, color: '#8b5cf6' }} />
            Post Content
          </div>
          <JoditEditor
            ref={editor}
            value={addBlog.description}
            tabIndex={1}
            onBlur={newContent => dispatch(handleChange({ name: "description", value: newContent }))}
          />
        </div>

        {/* Messages */}
        {errorMsg && <div style={s.errorMsg}><i className="fa-solid fa-circle-exclamation" style={{ marginRight: 8 }} />{errorMsg}</div>}
        {isSubmitting && <div style={s.successMsg}><i className="fa-solid fa-circle-check" style={{ marginRight: 8 }} />Saved successfully!</div>}

        {/* Submit */}
        <button type="submit" style={{ ...s.submitBtn, opacity: isSubmitting ? 0.65 : 1 }} disabled={isSubmitting}>
          <i className={`fa-solid ${isEdit ? 'fa-floppy-disk' : 'fa-paper-plane'}`} style={{ marginRight: 10 }} />
          {isEdit ? 'Save Changes' : 'Publish Blog'}
        </button>
      </form>
    </div>
  )
}

const s = {
  page:      { padding: '28px 32px', fontFamily: 'var(--fontHeading)', maxWidth: 860, margin: '0 auto' },
  banner:    { background: 'linear-gradient(135deg,#4a148c,#1a237e)', borderRadius: 16, padding: '22px 28px', color: '#fff', marginBottom: 28, boxShadow: '0 8px 32px rgba(74,20,140,0.22)' },
  bannerTitle:{ fontSize: 20, fontWeight: 800 },
  bannerSub: { fontSize: 13, opacity: 0.7, marginTop: 4 },
  form:      { display: 'flex', flexDirection: 'column', gap: 20 },
  card:      { background: '#fff', borderRadius: 14, padding: '24px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0f0f8' },
  cardTitle: { fontWeight: 800, fontSize: 14, color: '#333', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #f0f0f8', textTransform: 'uppercase', letterSpacing: 0.5 },
  field:     { marginBottom: 20 },
  label:     { display: 'block', fontSize: 13, fontWeight: 700, color: '#555', marginBottom: 6 },
  req:       { color: '#ef4444', marginLeft: 3 },
  input:     { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e8eaf6', fontSize: 14, fontFamily: 'var(--fontHeading)', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box', background: '#fafbff' },
  fileLabel: { display: 'flex', alignItems: 'center', padding: '10px 16px', borderRadius: 10, border: '1.5px dashed #c4b5fd', background: '#faf5ff', color: '#7c3aed', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: 'fit-content' },
  previewWrap:{ marginTop: 14, borderRadius: 12, overflow: 'hidden', maxWidth: 560 },
  preview:   { width: '100%', maxHeight: 280, objectFit: 'cover', display: 'block', borderRadius: 12 },
  errorMsg:  { background: '#fff0f0', color: '#dc2626', borderRadius: 10, padding: '12px 16px', fontSize: 13, fontWeight: 600, border: '1px solid #fecaca', display: 'flex', alignItems: 'center' },
  successMsg:{ background: '#f0fdf4', color: '#16a34a', borderRadius: 10, padding: '12px 16px', fontSize: 13, fontWeight: 600, border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center' },
  submitBtn: { background: 'linear-gradient(135deg,#6a1b9a,#1a237e)', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--fontHeading)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.2s' },
}
