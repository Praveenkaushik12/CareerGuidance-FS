import { useState } from "react"

const RESOURCES = [
  {
    category: "Career Roadmaps",
    icon: "fa-solid fa-map-location-dot",
    color: "#7c3aed",
    description: "Visual step-by-step guides to reach any career",
    items: [
      { name: "roadmap.sh", desc: "⭐ The best free roadmaps for tech, design, DevOps & more. Highly recommended — start here.", url: "https://roadmap.sh", tag: "Must Visit", tagColor: "#7c3aed" },
      { name: "roadmap.sh · Full Stack", desc: "Complete frontend + backend developer roadmap with every technology you need to learn.", url: "https://roadmap.sh/full-stack", tag: "Tech", tagColor: "#3b82f6" },
      { name: "roadmap.sh · AI & Data Science", desc: "Structured path from Python basics to machine learning and AI engineering.", url: "https://roadmap.sh/ai-data-scientist", tag: "Tech", tagColor: "#3b82f6" },
      { name: "roadmap.sh · DevOps", desc: "Infrastructure, CI/CD, cloud, Docker, Kubernetes — everything in one roadmap.", url: "https://roadmap.sh/devops", tag: "Tech", tagColor: "#3b82f6" },
      { name: "roadmap.sh · UX Design", desc: "From design thinking basics to research, wireframing, prototyping, and beyond.", url: "https://roadmap.sh/ux-design", tag: "Design", tagColor: "#ec4899" },
      { name: "roadmap.sh · Cybersecurity", desc: "A comprehensive path into ethical hacking, networks, and security engineering.", url: "https://roadmap.sh/cyber-security", tag: "Tech", tagColor: "#3b82f6" },
    ],
  },
  {
    category: "Free Learning",
    icon: "fa-solid fa-graduation-cap",
    color: "#3b82f6",
    description: "Learn anything for free — courses, coding, and more",
    items: [
      { name: "freeCodeCamp", desc: "Free coding bootcamp covering HTML, CSS, JavaScript, Python, data science and certifications.", url: "https://www.freecodecamp.org", tag: "Coding", tagColor: "#3b82f6" },
      { name: "CS50 by Harvard", desc: "Harvard's legendary intro to Computer Science — one of the best free courses ever made.", url: "https://cs50.harvard.edu", tag: "Coding", tagColor: "#3b82f6" },
      { name: "Khan Academy", desc: "Free world-class education in Maths, Science, Economics, and more. Great for school students.", url: "https://www.khanacademy.org", tag: "All Subjects", tagColor: "#10b981" },
      { name: "Coursera", desc: "University-level courses from Stanford, Google, IBM and others. Many are free to audit.", url: "https://www.coursera.org", tag: "Courses", tagColor: "#f59e0b" },
      { name: "edX", desc: "Free courses from MIT, Harvard, and top global universities. Certificates available.", url: "https://www.edx.org", tag: "Courses", tagColor: "#f59e0b" },
      { name: "NPTEL", desc: "Free IIT & IISc lectures for engineering, science, and humanities. Great for Indian students.", url: "https://nptel.ac.in", tag: "India", tagColor: "#ef4444" },
      { name: "DIKSHA", desc: "NCERT's official platform with free textbooks, videos, and study material for Class 1–12.", url: "https://diksha.gov.in", tag: "India · School", tagColor: "#ef4444" },
      { name: "YouTube Learning", desc: "Channels like 3Blue1Brown, Kurzgesagt, CrashCourse, and Unacademy are world-class and free.", url: "https://www.youtube.com", tag: "Free", tagColor: "#10b981" },
    ],
  },
  {
    category: "Entrance Exams",
    icon: "fa-solid fa-file-pen",
    color: "#ef4444",
    description: "Official portals and prep resources for major Indian exams",
    items: [
      { name: "NTA — JEE Main & Advanced", desc: "Official site for JEE engineering entrance exams. Check schedules, admit cards, results.", url: "https://jeemain.nta.ac.in", tag: "Engineering", tagColor: "#f59e0b" },
      { name: "NTA — NEET UG", desc: "Official NEET portal for medical admissions. MBBS, BDS, AYUSH and more.", url: "https://neet.nta.nic.in", tag: "Medical", tagColor: "#10b981" },
      { name: "CLAT — Law Entrance", desc: "Common Law Admission Test for NLUs. Official info, syllabus, and dates.", url: "https://consortiumofnlus.ac.in", tag: "Law", tagColor: "#8b5cf6" },
      { name: "CUET — Central Universities", desc: "Common University Entrance Test for UG & PG admissions in central universities.", url: "https://cuet.samarth.ac.in", tag: "University", tagColor: "#3b82f6" },
      { name: "NATA — Architecture", desc: "National Aptitude Test in Architecture. Official guide and sample papers.", url: "https://www.nata.in", tag: "Architecture", tagColor: "#6366f1" },
      { name: "GATE — Engineering PG", desc: "Graduate Aptitude Test in Engineering for M.Tech and PSU job eligibility.", url: "https://gate2025.iitr.ac.in", tag: "Engineering PG", tagColor: "#f59e0b" },
    ],
  },
  {
    category: "Scholarships",
    icon: "fa-solid fa-hand-holding-dollar",
    color: "#10b981",
    description: "Financial support to fund your education",
    items: [
      { name: "National Scholarship Portal (NSP)", desc: "India's central scholarship portal — over 50 government scholarships for school and college students.", url: "https://scholarships.gov.in", tag: "Government", tagColor: "#ef4444" },
      { name: "AICTE Pragati & Saksham", desc: "Scholarships for girl students and students with disability pursuing AICTE-approved courses.", url: "https://www.aicte-india.org/bureaus/pgcs", tag: "Technical", tagColor: "#f59e0b" },
      { name: "Buddy4Study", desc: "India's largest scholarship search engine — find scholarships by state, stream, and income.", url: "https://www.buddy4study.com", tag: "Search Engine", tagColor: "#3b82f6" },
      { name: "Vidyadhan Scholarship", desc: "Need-based scholarships for Class 10 and above students pursuing higher education.", url: "https://www.vidyadhan.org", tag: "Need-based", tagColor: "#8b5cf6" },
      { name: "Inspire Scholarship (DST)", desc: "Govt. scholarship for students in basic sciences — ₹80,000/year for BSc/BS/Int. MSc students.", url: "https://online-inspire.gov.in", tag: "Science", tagColor: "#10b981" },
    ],
  },
  {
    category: "Internships & Jobs",
    icon: "fa-solid fa-briefcase",
    color: "#f59e0b",
    description: "Find real experience and your first opportunity",
    items: [
      { name: "Internshala", desc: "India's #1 internship platform. Work-from-home and in-office internships across all fields.", url: "https://internshala.com", tag: "Internships", tagColor: "#f59e0b" },
      { name: "LinkedIn", desc: "Build your professional profile, connect with mentors, and apply to jobs globally.", url: "https://www.linkedin.com", tag: "Jobs", tagColor: "#3b82f6" },
      { name: "Naukri.com", desc: "India's leading job portal for fresh graduates and experienced professionals.", url: "https://www.naukri.com", tag: "Jobs", tagColor: "#f59e0b" },
      { name: "Unstop (D2C)", desc: "Competitions, hackathons, and internship opportunities for college students.", url: "https://unstop.com", tag: "Competitions", tagColor: "#ec4899" },
      { name: "GitHub Jobs / Careers", desc: "Explore open-source contributions and tech job boards used by top companies worldwide.", url: "https://github.com/explore", tag: "Tech", tagColor: "#3b82f6" },
    ],
  },
  {
    category: "Skill Building",
    icon: "fa-solid fa-wand-magic-sparkles",
    color: "#ec4899",
    description: "Tools and platforms to sharpen specific skills",
    items: [
      { name: "LeetCode", desc: "Practice Data Structures & Algorithms. Essential for cracking software engineering interviews.", url: "https://leetcode.com", tag: "Coding", tagColor: "#3b82f6" },
      { name: "Kaggle", desc: "Data science competitions, free courses, and datasets. Best platform to practice ML skills.", url: "https://www.kaggle.com", tag: "Data Science", tagColor: "#3b82f6" },
      { name: "Figma", desc: "Free design tool for UI/UX. Industry-standard — start designing real interfaces today.", url: "https://www.figma.com", tag: "Design", tagColor: "#ec4899" },
      { name: "Canva Design School", desc: "Free design courses and tutorials. Learn graphic design even without prior experience.", url: "https://www.canva.com/learn/", tag: "Design", tagColor: "#ec4899" },
      { name: "Duolingo", desc: "Learn a new language for free. Great for students looking to work abroad.", url: "https://www.duolingo.com", tag: "Language", tagColor: "#10b981" },
      { name: "Google Digital Garage", desc: "Free digital marketing, data, and career development courses from Google.", url: "https://learndigital.withgoogle.com/digitalgarage", tag: "Digital Skills", tagColor: "#f59e0b" },
    ],
  },
  {
    category: "Career Guidance",
    icon: "fa-solid fa-compass",
    color: "#6366f1",
    description: "Understand yourself and make better career decisions",
    items: [
      { name: "16Personalities (MBTI)", desc: "Free personality test that maps your traits to career strengths. Used by millions worldwide.", url: "https://www.16personalities.com", tag: "Personality", tagColor: "#6366f1" },
      { name: "O*NET Online", desc: "Comprehensive database of occupations, skills, tasks, and salary data. Great for research.", url: "https://www.onetonline.org", tag: "Research", tagColor: "#8b5cf6" },
      { name: "CareerGPT (this site)", desc: "Chat with our AI career assistant for personalised career advice and guidance.", url: "/careerGPT", tag: "AI", tagColor: "#7c3aed", internal: true },
      { name: "Career Exploration (this site)", desc: "Use our 7 interactive tools — roadmap, salary explorer, skills matcher and more.", url: "/careerExploration", tag: "Tools", tagColor: "#7c3aed", internal: true },
      { name: "Shiksha.com", desc: "Comprehensive info on Indian colleges, courses, exams, and career options.", url: "https://www.shiksha.com", tag: "India", tagColor: "#ef4444" },
    ],
  },
]

const ALL_CATS = RESOURCES.map(r => r.category)

export default function ResourceHub() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [search, setSearch] = useState("")

  const displayed = RESOURCES
    .filter(r => activeCategory === "All" || r.category === activeCategory)
    .map(r => ({
      ...r,
      items: r.items.filter(item =>
        !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.desc.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter(r => r.items.length > 0)

  const totalLinks = RESOURCES.reduce((sum, r) => sum + r.items.length, 0)

  return (
    <div style={s.page}>
      {/* Hero */}
      <div style={s.hero}>
        <div style={s.heroBlobA} />
        <div style={s.heroBlobB} />
        <div style={s.heroInner}>
          <div style={s.heroTag}><i className="fa-solid fa-book-open-reader" style={{ marginRight: 7 }} />Resource Hub</div>
          <h1 style={s.heroTitle}>Everything a Student Needs</h1>
          <p style={s.heroSub}>
            Handpicked free resources — roadmaps, courses, scholarships, exam portals, and career tools.
            We've done the searching so you can focus on learning.
          </p>
          <div style={s.heroStats}>
            <div style={s.heroStat}><span style={s.heroStatNum}>{totalLinks}+</span><span>Resources</span></div>
            <div style={s.heroStatDiv} />
            <div style={s.heroStat}><span style={s.heroStatNum}>{RESOURCES.length}</span><span>Categories</span></div>
            <div style={s.heroStatDiv} />
            <div style={s.heroStat}><span style={s.heroStatNum}>Free</span><span>Always</span></div>
          </div>
        </div>
      </div>

      {/* roadmap.sh highlight */}
      <div style={s.featuredBanner}>
        <div style={s.featuredLeft}>
          <div style={s.featuredBadge}>⭐ Editor's Pick</div>
          <div style={s.featuredTitle}>roadmap.sh — The Go-To Resource for Aspiring Tech Students</div>
          <div style={s.featuredDesc}>
            roadmap.sh is a community-driven platform with beautifully structured, visual career roadmaps for software engineers, data scientists, DevOps engineers, UX designers, and more. It's one of the most useful websites ever made for students entering tech — <strong>bookmark it today.</strong>
          </div>
        </div>
        <a href="https://roadmap.sh" target="_blank" rel="noopener noreferrer" style={s.featuredBtn}>
          <i className="fa-solid fa-arrow-up-right-from-square" style={{ marginRight: 8 }} />Open roadmap.sh
        </a>
      </div>

      {/* Toolbar */}
      <div style={s.toolbar}>
        <div style={s.searchWrap}>
          <i className="fa-solid fa-search" style={s.searchIcon} />
          <input
            style={s.searchInput}
            placeholder="Search resources…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={s.catFilters}>
          <button style={{ ...s.catBtn, ...(activeCategory === "All" ? s.catBtnActive : {}) }} onClick={() => setActiveCategory("All")}>All</button>
          {ALL_CATS.map(cat => (
            <button
              key={cat}
              style={{ ...s.catBtn, ...(activeCategory === cat ? s.catBtnActive : {}) }}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resource sections */}
      <div style={s.sections}>
        {displayed.length === 0 ? (
          <div style={s.empty}>
            <i className="fa-solid fa-magnifying-glass" style={{ fontSize: 32, marginBottom: 10 }} />
            <div>No resources found for "<strong>{search}</strong>"</div>
          </div>
        ) : displayed.map(section => (
          <div key={section.category} style={s.section}>
            <div style={s.sectionHead}>
              <div style={{ ...s.sectionIconBox, background: section.color + "18", color: section.color }}>
                <i className={section.icon} />
              </div>
              <div>
                <div style={s.sectionTitle}>{section.category}</div>
                <div style={s.sectionDesc}>{section.description}</div>
              </div>
            </div>
            <div style={s.grid}>
              {section.items.map(item => (
                item.internal ? (
                  <a key={item.name} href={item.url} style={s.card}>
                    <CardContent item={item} />
                  </a>
                ) : (
                  <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" style={s.card}>
                    <CardContent item={item} />
                  </a>
                )
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CardContent({ item }) {
  return (
    <>
      <div style={ch.top}>
        <div style={ch.name}>{item.name}</div>
        <span style={{ ...ch.tag, background: item.tagColor + "18", color: item.tagColor, border: `1px solid ${item.tagColor}30` }}>{item.tag}</span>
      </div>
      <div style={ch.desc}>{item.desc}</div>
      <div style={ch.link}>
        <i className="fa-solid fa-arrow-up-right-from-square" style={{ marginRight: 5, fontSize: 10 }} />
        {item.internal ? "Open on this site" : "Visit website"}
      </div>
    </>
  )
}

const s = {
  page:    { fontFamily: "var(--fontHeading)", minHeight: "100vh", background: "#f7f8ff" },

  hero:    { background: "linear-gradient(135deg,#0f0c29,#1e1b4b,#312e81)", padding: "72px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" },
  heroBlobA: { position: "absolute", top: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(124,58,237,0.2)", filter: "blur(70px)" },
  heroBlobB: { position: "absolute", bottom: -60, right: -60, width: 250, height: 250, borderRadius: "50%", background: "rgba(99,102,241,0.15)", filter: "blur(60px)" },
  heroInner: { maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1 },
  heroTag:   { display: "inline-flex", alignItems: "center", background: "rgba(124,58,237,0.25)", border: "1px solid rgba(124,58,237,0.5)", color: "#c4b5fd", borderRadius: 99, padding: "5px 16px", fontSize: 13, fontWeight: 700, marginBottom: 20 },
  heroTitle: { fontSize: "clamp(28px,5vw,46px)", fontWeight: 900, color: "#fff", margin: "0 0 16px", lineHeight: 1.2 },
  heroSub:   { fontSize: 16, color: "rgba(255,255,255,0.68)", margin: "0 0 32px", lineHeight: 1.65, maxWidth: 580, marginLeft: "auto", marginRight: "auto" },
  heroStats: { display: "flex", alignItems: "center", justifyContent: "center", gap: 24, color: "rgba(255,255,255,0.75)", fontSize: 13 },
  heroStat:  { display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
  heroStatNum:{ fontSize: 26, fontWeight: 800, color: "#a78bfa", display: "block" },
  heroStatDiv:{ width: 1, height: 34, background: "rgba(255,255,255,0.15)" },

  featuredBanner: { background: "linear-gradient(135deg,#4c1d95,#1e1b4b)", margin: "28px 32px 0", borderRadius: 18, padding: "28px 32px", display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap", boxShadow: "0 8px 40px rgba(76,29,149,0.35)" },
  featuredLeft:   { flex: 1, minWidth: 260 },
  featuredBadge:  { display: "inline-block", background: "rgba(250,204,21,0.15)", color: "#fde047", borderRadius: 99, padding: "3px 12px", fontSize: 11, fontWeight: 700, marginBottom: 10, border: "1px solid rgba(250,204,21,0.25)" },
  featuredTitle:  { fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 10, lineHeight: 1.35 },
  featuredDesc:   { fontSize: 13.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.65 },
  featuredBtn:    { display: "inline-flex", alignItems: "center", padding: "12px 22px", borderRadius: 11, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none", fontFamily: "var(--fontHeading)", flexShrink: 0, boxShadow: "0 4px 20px rgba(124,58,237,0.5)" },

  toolbar:    { padding: "24px 32px 0", display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-start" },
  searchWrap: { position: "relative", width: 280 },
  searchIcon: { position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#aaa", fontSize: 13 },
  searchInput:{ width: "100%", padding: "9px 12px 9px 32px", borderRadius: 10, border: "1.5px solid #e8eaf6", fontSize: 13.5, fontFamily: "var(--fontHeading)", outline: "none", background: "#fff", boxSizing: "border-box" },
  catFilters: { display: "flex", gap: 7, flexWrap: "wrap", flex: 1 },
  catBtn:     { padding: "7px 14px", borderRadius: 99, border: "1.5px solid #e8eaf6", background: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--fontHeading)", color: "#666", transition: "all 0.15s" },
  catBtnActive:{ background: "#7c3aed", color: "#fff", borderColor: "#7c3aed" },

  sections:   { padding: "28px 32px 48px", display: "flex", flexDirection: "column", gap: 40 },
  section:    {},
  sectionHead:{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 },
  sectionIconBox:{ width: 44, height: 44, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 },
  sectionTitle:  { fontSize: 17, fontWeight: 800, color: "#1a1a2e" },
  sectionDesc:   { fontSize: 13, color: "#888", marginTop: 2 },

  grid:  { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 },
  card:  { background: "#fff", borderRadius: 14, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 8, border: "1px solid #f0f0f8", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", textDecoration: "none", transition: "box-shadow 0.18s, transform 0.18s", cursor: "pointer" },

  empty: { textAlign: "center", padding: "60px 0", color: "#ccc", fontSize: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
}

const ch = {
  top:  { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 2 },
  name: { fontSize: 14.5, fontWeight: 800, color: "#1a1a2e", lineHeight: 1.3, flex: 1 },
  tag:  { padding: "2px 9px", borderRadius: 99, fontSize: 11, fontWeight: 700, flexShrink: 0 },
  desc: { fontSize: 13, color: "#555", lineHeight: 1.6, flex: 1 },
  link: { fontSize: 11.5, color: "#8b5cf6", fontWeight: 700, marginTop: 4, display: "flex", alignItems: "center" },
}
