import { useState, useMemo } from "react"

// ─── Data ────────────────────────────────────────────────────────────────────

const CAREERS = [
  { id: "software_engineer",   label: "Software Engineer",      icon: "fa-solid fa-code",              industry: "Technology",    salary: [80000, 160000],  growth: 25, edu: "B.Sc Computer Science", interests: ["tech","problem-solving","logical"], skills: ["Python","JavaScript","Algorithms","Databases"], day: ["9am: Stand-up meeting & sprint planning","10am: Code new features / fix bugs","1pm: Lunch break","2pm: Code reviews with teammates","4pm: Documentation & testing","6pm: Push code, update tickets"] },
  { id: "data_scientist",      label: "Data Scientist",         icon: "fa-solid fa-chart-line",        industry: "Technology",    salary: [90000, 170000],  growth: 28, edu: "M.Sc Statistics/CS",    interests: ["tech","analytical","research"],    skills: ["Python","Machine Learning","SQL","Statistics"],  day: ["9am: Review dashboards & KPIs","10am: Clean and analyse datasets","12pm: Build/improve ML models","2pm: Present findings to stakeholders","4pm: Research new techniques","5pm: Write analysis report"] },
  { id: "doctor",              label: "Medical Doctor",         icon: "fa-solid fa-user-doctor",       industry: "Healthcare",    salary: [120000, 300000], growth: 13, edu: "MBBS + Specialisation", interests: ["helping","science","social"],       skills: ["Diagnosis","Patient Care","Medical Knowledge","Empathy"], day: ["7am: Ward rounds & patient check-ins","9am: Outpatient consultations","12pm: Surgeries / procedures","2pm: Review lab reports & imaging","4pm: Case discussions with team","6pm: Documentation & handover"] },
  { id: "nurse",               label: "Nurse",                  icon: "fa-solid fa-heart-pulse",       industry: "Healthcare",    salary: [55000, 100000],  growth: 15, edu: "B.Sc Nursing",          interests: ["helping","social","science"],       skills: ["Patient Care","Clinical Skills","Communication","Empathy"], day: ["6am: Shift handover briefing","7am: Administer medications","9am: Patient assessments & vitals","11am: Wound care & procedures","1pm: Coordinate with doctors","3pm: Patient education & discharge planning"] },
  { id: "teacher",             label: "School Teacher",         icon: "fa-solid fa-chalkboard-user",   industry: "Education",     salary: [40000, 80000],   growth: 8,  edu: "B.Ed",                  interests: ["social","creative","helping"],      skills: ["Communication","Lesson Planning","Patience","Subject Knowledge"], day: ["7am: Lesson preparation","8am: Morning assembly","9am: Teach classes","12pm: Lunch & student queries","1pm: Afternoon classes","3pm: Grade assignments & parent communication"] },
  { id: "architect",           label: "Architect",              icon: "fa-solid fa-building",          industry: "Construction",  salary: [65000, 140000],  growth: 9,  edu: "B.Arch",                interests: ["creative","artistic","tech"],       skills: ["AutoCAD","Design","Structural Knowledge","Creativity"], day: ["9am: Client brief & site review","10am: Design & drafting in AutoCAD","12pm: Team design critique","1pm: Lunch","2pm: Material selection & costing","4pm: Client presentation preparation"] },
  { id: "lawyer",              label: "Lawyer",                 icon: "fa-solid fa-scale-balanced",    industry: "Legal",         salary: [70000, 200000],  growth: 10, edu: "LLB / LLM",             interests: ["logical","research","social"],      skills: ["Legal Research","Argumentation","Writing","Analysis"], day: ["8am: Review case files","9am: Client consultations","11am: Court hearings","1pm: Lunch","2pm: Legal research & drafting","5pm: Correspondence & billing"] },
  { id: "accountant",          label: "Accountant",             icon: "fa-solid fa-calculator",        industry: "Finance",       salary: [50000, 100000],  growth: 7,  edu: "B.Com / CA",            interests: ["analytical","logical","organized"], skills: ["Accounting","Tax Law","Excel","Auditing"], day: ["9am: Review financial statements","10am: Client meetings & advisory","12pm: Reconciliations & entries","1pm: Lunch","2pm: Tax planning & compliance","4pm: Reports & filing"] },
  { id: "graphic_designer",    label: "Graphic Designer",       icon: "fa-solid fa-pen-ruler",         industry: "Creative",      salary: [40000, 90000],   growth: 11, edu: "BFA / Diploma Design",   interests: ["creative","artistic","tech"],       skills: ["Photoshop","Illustrator","Typography","Branding"], day: ["9am: Client brief & mood board","10am: Design concepts","12pm: Client feedback rounds","1pm: Lunch","2pm: Revisions & final artwork","5pm: Asset delivery & invoicing"] },
  { id: "mechanical_engineer", label: "Mechanical Engineer",    icon: "fa-solid fa-gear",              industry: "Engineering",   salary: [60000, 130000],  growth: 7,  edu: "B.E. Mechanical",        interests: ["tech","problem-solving","logical"], skills: ["CAD","Thermodynamics","Manufacturing","Materials Science"], day: ["8am: Production floor walkthrough","9am: Design review with team","11am: CAD modelling","1pm: Lunch","2pm: Testing & quality checks","4pm: Technical report writing"] },
  { id: "psychologist",        label: "Psychologist",           icon: "fa-solid fa-brain",             industry: "Healthcare",    salary: [60000, 120000],  growth: 19, edu: "M.Sc Psychology",        interests: ["helping","research","social"],      skills: ["Counselling","Assessment","Empathy","Research"], day: ["9am: Review session notes","10am: Therapy sessions (1hr each)","12pm: Lunch & admin","1pm: Psychometric assessments","3pm: Report writing","5pm: Supervision / CPD reading"] },
  { id: "journalist",          label: "Journalist",             icon: "fa-solid fa-newspaper",         industry: "Media",         salary: [35000, 85000],   growth: 6,  edu: "B.A. Journalism",        interests: ["creative","social","research"],     skills: ["Writing","Research","Interviewing","Photography"], day: ["8am: Morning briefing with editor","9am: Research & source outreach","11am: Interviews & field reporting","1pm: Lunch","2pm: Writing & editing articles","5pm: File story before deadline"] },
  { id: "pharmacist",          label: "Pharmacist",             icon: "fa-solid fa-pills",             industry: "Healthcare",    salary: [70000, 130000],  growth: 6,  edu: "Pharm.D",               interests: ["science","analytical","helping"],   skills: ["Pharmacology","Patient Counselling","Drug Interactions","Accuracy"], day: ["8am: Inventory & medication checks","9am: Dispense prescriptions","11am: Patient medication counselling","1pm: Lunch","2pm: Clinical pharmacology reviews","4pm: Liaise with doctors & document"] },
  { id: "ux_designer",         label: "UX Designer",            icon: "fa-solid fa-paintbrush",        industry: "Technology",    salary: [65000, 140000],  growth: 22, edu: "B.Design / HCI",         interests: ["creative","tech","analytical"],     skills: ["Figma","User Research","Prototyping","Wireframing"], day: ["9am: Review user feedback & analytics","10am: Sketch wireframes","11am: User interviews","1pm: Lunch","2pm: High-fidelity prototyping in Figma","4pm: Design review with developers"] },
  { id: "civil_engineer",      label: "Civil Engineer",         icon: "fa-solid fa-road",              industry: "Engineering",   salary: [55000, 120000],  growth: 8,  edu: "B.E. Civil",             interests: ["tech","logical","problem-solving"], skills: ["AutoCAD","Structural Analysis","Project Management","Site Supervision"], day: ["7am: Site visit & contractor briefing","9am: Structural drawings review","11am: Quantity surveys & costing","1pm: Lunch","2pm: Municipal approvals & permits","4pm: Progress reports & client updates"] },
  { id: "entrepreneur",        label: "Entrepreneur",           icon: "fa-solid fa-rocket",            industry: "Business",      salary: [0, 500000],      growth: 0,  edu: "Any background",         interests: ["creative","problem-solving","risk-taking"], skills: ["Leadership","Sales","Finance","Product Development"], day: ["7am: Review overnight metrics","8am: Emails & investor updates","10am: Team standup","11am: Product roadmap planning","1pm: Lunch with potential partners","3pm: Sales calls & pitches","6pm: Strategy & reflection"] },
]

const INDUSTRIES = [...new Set(CAREERS.map(c => c.industry))].sort()
const ALL_SKILLS  = [...new Set(CAREERS.flatMap(c => c.skills))].sort()

const CAREER_PATHS = [
  { title: "Technology", color: "#3b82f6", steps: [
    { level: "Entry",  roles: ["Junior Developer","QA Analyst","IT Support"], years: "0–2 yrs" },
    { level: "Mid",    roles: ["Software Engineer","Data Analyst","DevOps Engineer"], years: "2–5 yrs" },
    { level: "Senior", roles: ["Senior Engineer","Tech Lead","Solution Architect"], years: "5–10 yrs" },
    { level: "Expert", roles: ["VP Engineering","CTO","Principal Architect"], years: "10+ yrs" },
  ]},
  { title: "Healthcare", color: "#10b981", steps: [
    { level: "Entry",  roles: ["Medical Intern","Junior Nurse","Lab Technician"], years: "0–3 yrs" },
    { level: "Mid",    roles: ["Resident Doctor","Staff Nurse","Pharmacist"], years: "3–7 yrs" },
    { level: "Senior", roles: ["Consultant","Head Nurse","Clinical Pharmacist"], years: "7–15 yrs" },
    { level: "Expert", roles: ["Head of Department","Chief Nursing Officer","Medical Director"], years: "15+ yrs" },
  ]},
  { title: "Business & Finance", color: "#f59e0b", steps: [
    { level: "Entry",  roles: ["Junior Accountant","Sales Executive","Business Analyst"], years: "0–2 yrs" },
    { level: "Mid",    roles: ["Finance Manager","Account Manager","Product Manager"], years: "2–6 yrs" },
    { level: "Senior", roles: ["CFO","Director of Sales","VP Product"], years: "6–12 yrs" },
    { level: "Expert", roles: ["CEO","Group CFO","Board Director"], years: "12+ yrs" },
  ]},
  { title: "Creative & Media", color: "#ec4899", steps: [
    { level: "Entry",  roles: ["Junior Designer","Copywriter","Photographer"], years: "0–2 yrs" },
    { level: "Mid",    roles: ["Graphic Designer","Content Strategist","Art Director"], years: "2–5 yrs" },
    { level: "Senior", roles: ["Senior Designer","Creative Director","Brand Strategist"], years: "5–10 yrs" },
    { level: "Expert", roles: ["Chief Creative Officer","Agency Founder","Creative Consultant"], years: "10+ yrs" },
  ]},
  { title: "Law & Government", color: "#8b5cf6", steps: [
    { level: "Entry",  roles: ["Law Clerk","Legal Intern","Junior Civil Servant"], years: "0–2 yrs" },
    { level: "Mid",    roles: ["Associate Lawyer","Policy Analyst","Magistrate"], years: "2–6 yrs" },
    { level: "Senior", roles: ["Senior Counsel","Policy Director","District Judge"], years: "6–12 yrs" },
    { level: "Expert", roles: ["Partner / QC","Secretary General","High Court Judge"], years: "12+ yrs" },
  ]},
]


// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n) { return n >= 1000 ? `₹${(n/100000).toFixed(0)}L` : `₹${n}` }
function fmtRange([lo, hi]) { return `${fmt(lo)} – ${fmt(hi)}/yr` }

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionHeader({ icon, title, subtitle }) {
  return (
    <div style={s.sectionHeader}>
      <div style={s.sectionIcon}><i className={icon} /></div>
      <div>
        <h2 style={s.sectionTitle}>{title}</h2>
        {subtitle && <p style={s.sectionSub}>{subtitle}</p>}
      </div>
    </div>
  )
}

function CareerTag({ label, color = "#8b5cf6" }) {
  return <span style={{ ...s.tag, background: color + "18", color, border: `1px solid ${color}30` }}>{label}</span>
}

// ── Tool 1: Career Roadmap ────────────────────────────────────────────────────

const ROADMAP_DATA = {
  software_engineer:   { roadmapSh: "https://roadmap.sh/full-stack",       steps: ["Learn programming basics (Python / JS)","Build 2–3 portfolio projects","Earn a B.Sc CS or equivalent degree","Apply for internships & junior roles","Grow into Senior → Tech Lead → CTO"], resources: ["freeCodeCamp","CS50 (Harvard)","LeetCode","GitHub Portfolio","LinkedIn Jobs"] },
  data_scientist:      { roadmapSh: "https://roadmap.sh/ai-data-scientist", steps: ["Master statistics & Python/R","Learn pandas, NumPy, scikit-learn","Work on Kaggle datasets & competitions","Complete M.Sc or specialised certification","Land a data analyst role, then move to scientist"], resources: ["Kaggle Learn","Coursera ML (Andrew Ng)","Towards Data Science","Fast.ai","DataCamp"] },
  doctor:              { roadmapSh: null, steps: ["Score well in Biology & Chemistry (Class 10–12)","Clear NEET / medical entrance exam","Complete MBBS (5.5 years)","One-year internship in a hospital","Optional: Specialisation via MD/MS"], resources: ["NCERT Biology","NEET Prep Apps","Medical textbooks","PubMed for research","Medical Council guidelines"] },
  nurse:               { roadmapSh: null, steps: ["Pursue B.Sc Nursing after Class 12","Complete clinical placements during degree","Register with the State Nursing Council","Start as a Staff Nurse in a hospital","Specialise (ICU, OT, Oncology, etc.)"], resources: ["INC Nursing Council","Nursing textbooks","Hospital internship portals","Nursing Today journal","SkillsForHealth"] },
  teacher:             { roadmapSh: null, steps: ["Complete graduation in chosen subject","Earn a B.Ed (1–2 years)","Clear CTET / State TET exam","Apply to government or private schools","Pursue M.Ed for higher positions"], resources: ["NCTE guidelines","DIKSHA platform","CTET prep material","CBSE teacher resources","National Education Policy 2020"] },
  architect:           { roadmapSh: null, steps: ["Score in Maths & Art (Class 12 PCM)","Clear NATA / JEE Paper 2","Complete 5-year B.Arch degree","One-year internship under a registered architect","Register with the Council of Architecture"], resources: ["NATA practice tests","AutoCAD tutorials","Dezeen Magazine","ArchDaily","Council of Architecture India"] },
  lawyer:              { roadmapSh: null, steps: ["Complete Class 12 in any stream","Clear CLAT / AILET for top NLUs","Study 5-year integrated LLB","Enrol with the Bar Council of India","Practise as a junior, then build your own practice"], resources:["CLAT prep books","Bar Council of India","SCC Online","Manupatra","Law School Admission resources"] },
  accountant:          { roadmapSh: null, steps: ["Study Commerce in Class 11–12","Enrol in B.Com or CA Foundation","Clear CA Intermediate & Final exams","Complete 3-year articleship","Specialise in Tax, Audit, or Finance"], resources: ["ICAI official portal","CA study material","TaxGuru","Accounting Coach","GST & Income Tax portals"] },
  graphic_designer:    { roadmapSh: null, steps: ["Build a strong eye for design & typography","Learn Photoshop, Illustrator, Figma","Complete a BFA or short design diploma","Build a Behance/Dribbble portfolio","Freelance → Agency → Creative Director"], resources: ["Adobe tutorials","Figma Academy","Behance","Dribbble","Canva Design School"] },
  mechanical_engineer: { roadmapSh: null, steps: ["Strong foundation in Maths & Physics","Clear JEE / state engineering entrance","Complete 4-year B.E. Mechanical","Internship in manufacturing or design","Join core companies or pursue M.Tech/MBA"], resources: ["NPTEL Mechanical courses","GATEonline","SolidWorks/CAD tutorials","Engineers India portal","Manufacturing Today"] },
  psychologist:        { roadmapSh: null, steps: ["Study Psychology in B.A./B.Sc","Earn M.Sc / M.A. in Psychology","Complete a supervised clinical internship","Register with the Rehabilitation Council (if clinical)","Specialise in Clinical, Organisational, or Child Psychology"], resources: ["APA Psychology","RCI India","Coursera Psychology courses","PsychologyToday","IndianPsychologist journal"] },
  journalist:          { roadmapSh: null, steps: ["Develop strong writing & research skills","Earn a B.A. in Journalism or Mass Communication","Intern at a news outlet or magazine","Build a published clips portfolio","Grow from reporter → editor → bureau chief"], resources: ["Press Trust of India","IIMC Delhi","Reuters Training","MojoPojo","Poynter online journalism"] },
  pharmacist:          { roadmapSh: null, steps: ["Science stream with Chemistry & Biology","Clear NEET (for some states) or D.Pharm entrance","Complete Pharm.D or B.Pharm (4 years)","Internship in a hospital or retail pharmacy","Register with the Pharmacy Council of India"], resources: ["PCI India portal","Pharmacy textbooks","Drugs & Cosmetics Act","Clinical pharmacology journals","Hospital pharmacy training"] },
  ux_designer:         { roadmapSh: "https://roadmap.sh/ux-design",         steps: ["Understand design thinking & human behaviour","Learn Figma, Sketch, Adobe XD","Study HCI or design courses online","Build a portfolio with case studies","Junior UX role → Senior → Lead → Head of Design"], resources: ["Google UX Design Certificate","NN/g Nielsen Norman","Figma Community","UX Collective","Interaction Design Foundation"] },
  civil_engineer:      { roadmapSh: null, steps: ["Score in Maths & Physics (PCM)","Clear JEE / state CET for Civil Engineering","Complete 4-year B.E. Civil","Internship on a construction site","Join PWD, NHAI, or private infrastructure firms"], resources: ["NPTEL Civil courses","Bureau of Indian Standards","AutoCAD Civil 3D","GATE prep for PSU jobs","Infrastructure Today magazine"] },
  entrepreneur:        { roadmapSh: null, steps: ["Develop a problem-solving mindset","Read widely (business, tech, psychology)","Identify a real problem in your community","Build an MVP and validate with real users","Seek mentorship, incubators (IIT TBI, NASSCOM, etc.)"], resources: ["YCombinator Startup School","Startup India portal","Paul Graham essays","Indian Startup ecosystem (Inc42)","NASSCOM / Atal Innovation Mission"] },
}

function CareerRoadmap() {
  const [selected, setSelected] = useState("")
  const career = CAREERS.find(c => c.id === selected)
  const roadmap = selected ? ROADMAP_DATA[selected] : null

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#555", marginBottom: 8 }}>Choose a career to see the roadmap</label>
        <select style={s.select} value={selected} onChange={e => setSelected(e.target.value)}>
          <option value="">— Select a career —</option>
          {CAREERS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>

      {!career && (
        <div style={{ textAlign: "center", padding: "40px 0 24px", color: "#bbb" }}>
          <i className="fa-solid fa-map" style={{ fontSize: 40, marginBottom: 12, display: "block" }} />
          <div style={{ fontSize: 14 }}>Select a career above to see the step-by-step roadmap</div>
        </div>
      )}

      {/* roadmap.sh callout — only for careers that have one */}
      {career && roadmap?.roadmapSh && (
        <div style={s.roadmapShBanner}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
            <div style={s.roadmapShIcon}><i className="fa-solid fa-map-location-dot" /></div>
            <div>
              <div style={s.roadmapShTitle}>A detailed roadmap for {career.label} is available on roadmap.sh</div>
              <div style={s.roadmapShSub}>
                <strong>roadmap.sh</strong> has a free, visual step-by-step roadmap specifically for <strong>{career.label}</strong> — one of the best resources you'll find online.
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexShrink: 0, flexWrap: "wrap" }}>
            <a href={roadmap.roadmapSh} target="_blank" rel="noopener noreferrer" style={s.roadmapShBtnPrimary}>
              <i className="fa-solid fa-arrow-up-right-from-square" style={{ marginRight: 7 }} />
              Open {career.label} Roadmap
            </a>
            <a href="https://roadmap.sh" target="_blank" rel="noopener noreferrer" style={s.roadmapShBtnSecondary}>
              <i className="fa-solid fa-globe" style={{ marginRight: 7 }} />
              All Roadmaps
            </a>
          </div>
        </div>
      )}

      {career && roadmap && (
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginTop: 24 }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={s.roadmapSectionTitle}><i className="fa-solid fa-stairs" style={{ marginRight: 8, color: "#8b5cf6" }} />Your Roadmap</div>
            <div style={s.roadmapTrack}>
              {roadmap.steps.map((step, i) => (
                <div key={i} style={s.roadmapStep}>
                  <div style={{ ...s.roadmapNum, background: `hsl(${260 + i * 15},80%,${58 - i * 4}%)` }}>{i + 1}</div>
                  <div style={s.roadmapStepCard}>
                    <div style={s.roadmapStepText}>{step}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ width: 260, flexShrink: 0 }}>
            <div style={s.roadmapSectionTitle}><i className="fa-solid fa-circle-info" style={{ marginRight: 8, color: "#3b82f6" }} />Career Snapshot</div>
            <div style={s.roadmapSnap}>
              <div style={s.snapRow}><span style={s.snapLabel}>Salary Range</span><span style={s.snapVal}>{fmtRange(career.salary)}</span></div>
              <div style={s.snapRow}><span style={s.snapLabel}>Job Growth</span><span style={{ ...s.snapVal, color: "#10b981", fontWeight: 700 }}>+{career.growth}%</span></div>
              <div style={s.snapRow}><span style={s.snapLabel}>Education</span><span style={s.snapVal}>{career.edu}</span></div>
              <div style={s.snapRow}><span style={s.snapLabel}>Industry</span><span style={s.snapVal}>{career.industry}</span></div>
            </div>

            <div style={{ ...s.roadmapSectionTitle, marginTop: 20 }}><i className="fa-solid fa-book-open" style={{ marginRight: 8, color: "#ec4899" }} />Learning Resources</div>
            <div style={s.roadmapResources}>
              {roadmap.resources.map((r, i) => (
                <div key={i} style={s.resourcePill}><i className="fa-solid fa-circle-dot" style={{ marginRight: 6, fontSize: 9 }} />{r}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Tool 2: Career Comparison ─────────────────────────────────────────────────

function CareerComparison() {
  const [a, setA] = useState("")
  const [b, setB] = useState("")
  const careerA = CAREERS.find(c => c.id === a)
  const careerB = CAREERS.find(c => c.id === b)

  const Row = ({ label, va, vb }) => (
    <tr>
      <td style={s.cmpLabel}>{label}</td>
      <td style={s.cmpCell}>{va}</td>
      <td style={s.cmpCell}>{vb}</td>
    </tr>
  )

  return (
    <div>
      <div style={s.cmpPickers}>
        {[{ val: a, set: setA, other: b }, { val: b, set: setB, other: a }].map((p, i) => (
          <select key={i} value={p.val} onChange={e => p.set(e.target.value)} style={s.select}>
            <option value="">— Select Career {i + 1} —</option>
            {CAREERS.filter(c => c.id !== p.other).map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        ))}
      </div>

      {careerA && careerB ? (
        <div style={s.cmpTableWrap}>
          <table style={s.cmpTable}>
            <thead>
              <tr>
                <th style={s.cmpTh}></th>
                <th style={{ ...s.cmpTh, color: "#3b82f6" }}><i className={careerA.icon} style={{ marginRight: 6 }} />{careerA.label}</th>
                <th style={{ ...s.cmpTh, color: "#8b5cf6" }}><i className={careerB.icon} style={{ marginRight: 6 }} />{careerB.label}</th>
              </tr>
            </thead>
            <tbody>
              <Row label="Industry"       va={careerA.industry}          vb={careerB.industry} />
              <Row label="Salary Range"   va={fmtRange(careerA.salary)}  vb={fmtRange(careerB.salary)} />
              <Row label="Job Growth"     va={`${careerA.growth}% / yr`} vb={`${careerB.growth}% / yr`} />
              <Row label="Education"      va={careerA.edu}               vb={careerB.edu} />
              <Row label="Key Skills"     va={careerA.skills.join(", ")} vb={careerB.skills.join(", ")} />
            </tbody>
          </table>
        </div>
      ) : (
        <div style={s.cmpEmpty}>Select two careers above to compare them side by side</div>
      )}
    </div>
  )
}

// ── Tool 3: Salary Explorer ───────────────────────────────────────────────────

function SalaryExplorer() {
  const [industry, setIndustry] = useState("All")
  const [sort, setSort]         = useState("salary")

  const filtered = useMemo(() => {
    let list = industry === "All" ? CAREERS : CAREERS.filter(c => c.industry === industry)
    return [...list].sort((a, b) =>
      sort === "salary" ? b.salary[1] - a.salary[1] : b.growth - a.growth
    )
  }, [industry, sort])

  const maxSal = Math.max(...CAREERS.map(c => c.salary[1]))

  return (
    <div>
      <div style={s.salaryToolbar}>
        <select value={industry} onChange={e => setIndustry(e.target.value)} style={s.select}>
          <option value="All">All Industries</option>
          {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} style={s.select}>
          <option value="salary">Sort by Salary</option>
          <option value="growth">Sort by Growth</option>
        </select>
      </div>
      <div style={s.salaryList}>
        {filtered.map(c => (
          <div key={c.id} style={s.salaryRow}>
            <div style={s.salaryLeft}>
              <i className={c.icon} style={{ fontSize: 20, color: "#8b5cf6", width: 24 }} />
              <div>
                <div style={s.salaryCareer}>{c.label}</div>
                <div style={s.salaryIndustry}>{c.industry}</div>
              </div>
            </div>
            <div style={s.salaryRight}>
              <div style={s.salaryGrowthBadge}>↑ {c.growth}%</div>
              <div style={s.salaryRange}>{fmtRange(c.salary)}</div>
            </div>
            <div style={s.salaryBarWrap}>
              <div style={{ ...s.salaryBarLo, width: `${(c.salary[0] / maxSal) * 100}%` }} />
              <div style={{ ...s.salaryBarHi, width: `${((c.salary[1] - c.salary[0]) / maxSal) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Tool 4: Career Path Visualizer ────────────────────────────────────────────

function CareerPathVisualizer() {
  const [selected, setSelected] = useState(0)
  const path = CAREER_PATHS[selected]

  return (
    <div>
      <div style={s.pathTabs}>
        {CAREER_PATHS.map((p, i) => (
          <button key={i}
            style={{ ...s.pathTab, background: selected === i ? p.color : "#f5f5ff", color: selected === i ? "#fff" : "#555", borderColor: selected === i ? p.color : "#e8eaf6" }}
            onClick={() => setSelected(i)}>{p.title}</button>
        ))}
      </div>
      <div style={s.pathTrack}>
        {path.steps.map((step, i) => (
          <div key={i} style={s.pathStep}>
            <div style={{ ...s.pathDot, background: path.color }}>
              {i + 1}
              {i < path.steps.length - 1 && <div style={{ ...s.pathLine, background: path.color + "50" }} />}
            </div>
            <div style={s.pathCard}>
              <div style={{ ...s.pathLevel, color: path.color }}>{step.level}</div>
              <div style={s.pathYears}>{step.years}</div>
              <div style={s.pathRoles}>
                {step.roles.map(r => <div key={r} style={s.pathRole}><i className="fa-solid fa-circle-dot" style={{ fontSize: 7, marginRight: 7, color: path.color }} />{r}</div>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Tool 5: Skills Matcher ────────────────────────────────────────────────────

function SkillsMatcher() {
  const [selected, setSelected] = useState([])

  const toggle = (skill) => setSelected(prev =>
    prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
  )

  const matches = useMemo(() => {
    if (selected.length === 0) return []
    return [...CAREERS].map(c => {
      const matched = c.skills.filter(s => selected.includes(s))
      return { ...c, matched, score: matched.length }
    }).filter(c => c.score > 0).sort((a, b) => b.score - a.score).slice(0, 6)
  }, [selected])

  return (
    <div>
      <p style={s.skillsHint}>Select skills you already have or are learning:</p>
      <div style={s.skillsGrid}>
        {ALL_SKILLS.map(skill => (
          <button key={skill}
            style={{ ...s.skillBtn, background: selected.includes(skill) ? "#8b5cf6" : "#f5f5ff", color: selected.includes(skill) ? "#fff" : "#555", borderColor: selected.includes(skill) ? "#8b5cf6" : "#e8eaf6" }}
            onClick={() => toggle(skill)}>{skill}</button>
        ))}
      </div>

      {selected.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div style={s.skillsResultTitle}>
            {matches.length > 0 ? `${matches.length} matching career${matches.length > 1 ? "s" : ""} found` : "No exact matches — try adding more skills"}
          </div>
          <div style={s.skillMatchGrid}>
            {matches.map(c => (
              <div key={c.id} style={s.skillMatchCard}>
                <i className={c.icon} style={{ fontSize: 24, color: "#8b5cf6", marginBottom: 8 }} />
                <div style={s.skillMatchLabel}>{c.label}</div>
                <div style={s.skillMatchBar}>
                  {c.skills.map(sk => (
                    <span key={sk} style={{ ...s.skillMatchPill, background: selected.includes(sk) ? "#8b5cf6" : "#f0f0f8", color: selected.includes(sk) ? "#fff" : "#aaa" }}>{sk}</span>
                  ))}
                </div>
                <div style={s.skillMatchScore}>{c.matched.length}/{c.skills.length} skills matched</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Tool 6: Day in the Life ───────────────────────────────────────────────────

function DayInLife() {
  const [selected, setSelected] = useState(CAREERS[0].id)
  const career = CAREERS.find(c => c.id === selected)
  const hours = ["🌅", "🌄", "☀️", "🌤️", "🌥️", "🌇"]

  return (
    <div>
      <select value={selected} onChange={e => setSelected(e.target.value)} style={{ ...s.select, marginBottom: 24, maxWidth: 340 }}>
        {CAREERS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
      </select>

      {career && (
        <div style={s.dayWrap}>
          <div style={s.dayHeader}>
            <i className={career.icon} style={{ fontSize: 32, color: "#8b5cf6" }} />
            <div>
              <div style={s.dayTitle}>A Day in the Life of a {career.label}</div>
              <div style={s.dayMeta}>{career.industry} · {career.edu}</div>
            </div>
          </div>
          <div style={s.dayTimeline}>
            {career.day.map((entry, i) => (
              <div key={i} style={s.dayEntry}>
                <div style={s.dayEmoji}>{hours[i] || "⏰"}</div>
                <div style={s.dayDot} />
                <div style={s.dayText}>{entry}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Tool 7: Industry Explorer ─────────────────────────────────────────────────

function IndustryExplorer() {
  const [active, setActive] = useState(null)

  const byIndustry = useMemo(() =>
    INDUSTRIES.reduce((acc, ind) => {
      acc[ind] = CAREERS.filter(c => c.industry === ind)
      return acc
    }, {}), []
  )

  const industryColors = {
    Technology: "#3b82f6", Healthcare: "#10b981", Education: "#f59e0b",
    Engineering: "#6366f1", Finance: "#f97316", Legal: "#8b5cf6",
    Creative: "#ec4899", Business: "#14b8a6", Construction: "#84cc16",
    Media: "#ef4444",
  }

  return (
    <div>
      <div style={s.industryGrid}>
        {INDUSTRIES.map(ind => {
          const color = industryColors[ind] || "#8b5cf6"
          const isActive = active === ind
          return (
            <button key={ind}
              style={{ ...s.industryBtn, borderColor: isActive ? color : "#e8eaf6", background: isActive ? color : "#fafbff" }}
              onClick={() => setActive(isActive ? null : ind)}
            >
              <div style={{ ...s.industryCount, color: isActive ? "#fff" : color, background: isActive ? "rgba(255,255,255,0.2)" : color + "18" }}>
                {byIndustry[ind].length}
              </div>
              <div style={{ ...s.industryLabel, color: isActive ? "#fff" : "#333" }}>{ind}</div>
              <i className={`fa-solid fa-chevron-${isActive ? "up" : "down"}`} style={{ fontSize: 11, color: isActive ? "rgba(255,255,255,0.7)" : "#bbb", marginTop: 4 }} />
            </button>
          )
        })}
      </div>

      {active && (
        <div style={s.industryCareerList}>
          <div style={s.industryCareerTitle}>
            <i className="fa-solid fa-briefcase" style={{ marginRight: 8, color: industryColors[active] || "#8b5cf6" }} />
            {active} Careers
          </div>
          <div style={s.industryCareerGrid}>
            {byIndustry[active].map(c => (
              <div key={c.id} style={s.industryCareerCard}>
                <i className={c.icon} style={{ fontSize: 22, color: industryColors[active] || "#8b5cf6", marginBottom: 8 }} />
                <div style={s.industryCareerLabel}>{c.label}</div>
                <div style={s.industryCareerSalary}>{fmtRange(c.salary)}</div>
                <div style={s.industryCareerEdu}>{c.edu}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TOOLS = [
  { id: "roadmap",    icon: "fa-solid fa-map",               label: "Career Roadmap",         subtitle: "Step-by-step guide to reach any career",    color: "#f59e0b", component: CareerRoadmap },
  { id: "compare",    icon: "fa-solid fa-code-compare",       label: "Career Comparison",      subtitle: "Compare two careers side by side",           color: "#3b82f6", component: CareerComparison },
  { id: "salary",     icon: "fa-solid fa-indian-rupee-sign",  label: "Salary Explorer",        subtitle: "Explore earnings & job growth by career",    color: "#10b981", component: SalaryExplorer },
  { id: "path",       icon: "fa-solid fa-sitemap",            label: "Career Path Visualiser", subtitle: "See the full progression from intern → exec", color: "#8b5cf6", component: CareerPathVisualizer },
  { id: "skills",     icon: "fa-solid fa-wand-magic-sparkles", label: "Skills Matcher",        subtitle: "Select your skills → see matching careers",  color: "#ec4899", component: SkillsMatcher },
  { id: "day",        icon: "fa-solid fa-clock",              label: "Day in the Life",        subtitle: "What does a typical workday actually look like?", color: "#6366f1", component: DayInLife },
  { id: "industry",   icon: "fa-solid fa-industry",           label: "Industry Explorer",      subtitle: "Browse careers grouped by sector",           color: "#14b8a6", component: IndustryExplorer },
]

export default function CareerExploration() {
  const [activeTool, setActiveTool] = useState("roadmap")
  const Tool = TOOLS.find(t => t.id === activeTool)

  return (
    <div style={s.page}>
      {/* Hero */}
      <div style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.heroTag}><i className="fa-solid fa-compass" style={{ marginRight: 6 }} />Career Exploration Hub</div>
          <h1 style={s.heroTitle}>Discover Your Perfect Career Path</h1>
          <p style={s.heroSub}>Roadmap · Compare · Salary · Career Paths · Skills · Day-in-Life · Industry — all in one place.</p>
          <div style={s.heroStats}>
            <div style={s.heroStat}><span style={s.heroStatNum}>{CAREERS.length}+</span> Careers</div>
            <div style={s.heroStatDiv} />
            <div style={s.heroStat}><span style={s.heroStatNum}>{INDUSTRIES.length}</span> Industries</div>
            <div style={s.heroStatDiv} />
            <div style={s.heroStat}><span style={s.heroStatNum}>7</span> Tools</div>
          </div>
        </div>
      </div>

      <div style={s.body}>
        {/* Tool selector */}
        <div style={s.toolNav}>
          {TOOLS.map(t => (
            <button key={t.id}
              style={{ ...s.toolNavBtn, borderColor: activeTool === t.id ? t.color : "transparent", background: activeTool === t.id ? t.color + "12" : "transparent" }}
              onClick={() => setActiveTool(t.id)}
            >
              <i className={t.icon} style={{ fontSize: 18, color: activeTool === t.id ? t.color : "#aaa" }} />
              <span style={{ ...s.toolNavLabel, color: activeTool === t.id ? t.color : "#666", fontWeight: activeTool === t.id ? 700 : 500 }}>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Active tool panel */}
        <div style={s.toolPanel}>
          <SectionHeader
            icon={Tool.icon}
            title={Tool.label}
            subtitle={Tool.subtitle}
          />
          <div style={s.toolBody}>
            <Tool.component />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
  page: { fontFamily: "var(--fontHeading)", minHeight: "100vh", background: "#f7f8ff" },

  hero: { background: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)", padding: "72px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" },
  heroInner: { maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 1 },
  heroTag:   { display: "inline-flex", alignItems: "center", background: "rgba(139,92,246,0.25)", border: "1px solid rgba(139,92,246,0.5)", color: "#c4b5fd", borderRadius: 99, padding: "5px 16px", fontSize: 13, fontWeight: 700, marginBottom: 20 },
  heroTitle: { fontSize: 42, fontWeight: 900, color: "#fff", margin: "0 0 16px", lineHeight: 1.2 },
  heroSub:   { fontSize: 17, color: "rgba(255,255,255,0.7)", margin: "0 0 32px", lineHeight: 1.6 },
  heroStats: { display: "flex", alignItems: "center", justifyContent: "center", gap: 24 },
  heroStat:  { textAlign: "center", color: "rgba(255,255,255,0.8)", fontSize: 13 },
  heroStatNum:{ display: "block", fontSize: 28, fontWeight: 800, color: "#a78bfa" },
  heroStatDiv:{ width: 1, height: 36, background: "rgba(255,255,255,0.15)" },

  body: { maxWidth: 1200, margin: "0 auto", padding: "36px 24px", display: "flex", gap: 28, alignItems: "flex-start" },

  toolNav: { width: 220, flexShrink: 0, display: "flex", flexDirection: "column", gap: 4, position: "sticky", top: 24 },
  toolNavBtn: { display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12, border: "1.5px solid", cursor: "pointer", transition: "all 0.15s", textAlign: "left" },
  toolNavLabel: { fontSize: 13.5, fontFamily: "var(--fontHeading)" },

  toolPanel: { flex: 1, minWidth: 0, background: "#fff", borderRadius: 20, boxShadow: "0 4px 24px rgba(0,0,0,0.07)", border: "1px solid #f0f0f8", overflow: "hidden" },
  toolBody:  { padding: "0 28px 32px" },

  sectionHeader: { display: "flex", alignItems: "center", gap: 16, padding: "24px 28px 20px", borderBottom: "1px solid #f0f0f8", marginBottom: 4 },
  sectionIcon:   { width: 46, height: 46, borderRadius: 13, background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 },
  sectionTitle:  { fontSize: 18, fontWeight: 800, color: "#1a1a2e", margin: 0 },
  sectionSub:    { fontSize: 13, color: "#888", margin: "3px 0 0" },

  tag: { display: "inline-block", padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600 },

  // Quiz
  quizWrap:    { padding: "8px 0" },
  quizProgress:{ height: 5, background: "#f0f0f8", borderRadius: 99, marginBottom: 20, overflow: "hidden" },
  quizBar:     { height: "100%", background: "linear-gradient(90deg,#8b5cf6,#6d28d9)", borderRadius: 99, transition: "width 0.4s" },
  quizStep:    { fontSize: 12, color: "#aaa", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 },
  quizQ:       { fontSize: 20, fontWeight: 800, color: "#1a1a2e", marginBottom: 24, lineHeight: 1.4 },
  quizOptions: { display: "flex", flexDirection: "column", gap: 12 },
  quizOpt:     { display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", border: "1.5px solid #e8eaf6", borderRadius: 12, cursor: "pointer", fontSize: 14, fontFamily: "var(--fontHeading)", background: "#fafbff", transition: "all 0.15s", textAlign: "left" },
  quizOptLetter:{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 },
  quizResult:  { padding: "8px 0" },
  resultTitle: { fontSize: 18, fontWeight: 800, color: "#1a1a2e", marginBottom: 20 },
  resultGrid:  { display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 24 },
  resultCard:  { background: "#fafbff", borderRadius: 14, padding: "16px 12px", display: "flex", flexDirection: "column", alignItems: "center", border: "1px solid #f0f0f8", gap: 6 },
  resultRank:  { fontSize: 11, fontWeight: 700, color: "#bbb", alignSelf: "flex-start" },
  resultLabel: { fontWeight: 700, fontSize: 13, color: "#1a1a2e", textAlign: "center" },
  resultSalary:{ fontSize: 11, color: "#888" },
  retakeBtn:   { padding: "10px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "var(--fontHeading)" },

  // Comparison
  cmpPickers:   { display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" },
  cmpTableWrap: { overflowX: "auto" },
  cmpTable:     { width: "100%", borderCollapse: "collapse" },
  cmpTh:        { padding: "12px 16px", fontSize: 14, fontWeight: 700, borderBottom: "2px solid #f0f0f8", textAlign: "left" },
  cmpLabel:     { padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 0.4, borderBottom: "1px solid #f7f7fc", background: "#fafbff" },
  cmpCell:      { padding: "12px 16px", fontSize: 14, color: "#333", borderBottom: "1px solid #f7f7fc" },
  cmpEmpty:     { textAlign: "center", color: "#bbb", padding: "48px 0", fontSize: 14 },

  // Salary
  salaryToolbar: { display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" },
  salaryList:    { display: "flex", flexDirection: "column", gap: 10 },
  salaryRow:     { background: "#fafbff", border: "1px solid #f0f0f8", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" },
  salaryLeft:    { display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 180 },
  salaryCareer:  { fontWeight: 700, fontSize: 14, color: "#1a1a2e" },
  salaryIndustry:{ fontSize: 11, color: "#aaa", marginTop: 2 },
  salaryRight:   { textAlign: "right", flexShrink: 0 },
  salaryRange:   { fontWeight: 700, fontSize: 13, color: "#333" },
  salaryGrowthBadge: { background: "#d1fae5", color: "#065f46", borderRadius: 99, padding: "2px 8px", fontSize: 11, fontWeight: 700, marginBottom: 4, display: "inline-block" },
  salaryBarWrap: { width: "100%", height: 6, background: "#f0f0f8", borderRadius: 99, display: "flex", overflow: "hidden", marginTop: 8 },
  salaryBarLo:   { height: "100%", background: "#c4b5fd", borderRadius: "99px 0 0 99px" },
  salaryBarHi:   { height: "100%", background: "#8b5cf6" },

  // Career path
  pathTabs:  { display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" },
  pathTab:   { padding: "8px 16px", borderRadius: 99, border: "1.5px solid", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "var(--fontHeading)", transition: "all 0.2s" },
  pathTrack: { display: "flex", flexDirection: "column", gap: 0 },
  pathStep:  { display: "flex", gap: 20, alignItems: "flex-start", position: "relative" },
  pathDot:   { width: 36, height: 36, borderRadius: "50%", color: "#fff", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative", zIndex: 1 },
  pathLine:  { position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", width: 3, height: 80, borderRadius: 99 },
  pathCard:  { background: "#fafbff", border: "1px solid #f0f0f8", borderRadius: 14, padding: "14px 18px", marginBottom: 24, flex: 1 },
  pathLevel: { fontWeight: 800, fontSize: 16, marginBottom: 2 },
  pathYears: { fontSize: 11, color: "#aaa", fontWeight: 600, marginBottom: 10 },
  pathRoles: { display: "flex", flexDirection: "column", gap: 5 },
  pathRole:  { fontSize: 13.5, color: "#444", display: "flex", alignItems: "center" },

  // Skills
  skillsHint:      { fontSize: 14, color: "#888", marginBottom: 16 },
  skillsGrid:      { display: "flex", flexWrap: "wrap", gap: 8 },
  skillBtn:        { padding: "7px 14px", borderRadius: 99, border: "1.5px solid", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "var(--fontHeading)", transition: "all 0.15s" },
  skillsResultTitle:{ fontSize: 14, fontWeight: 700, color: "#555", marginBottom: 14 },
  skillMatchGrid:  { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 },
  skillMatchCard:  { background: "#fafbff", border: "1px solid #f0f0f8", borderRadius: 14, padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 },
  skillMatchLabel: { fontWeight: 700, fontSize: 14, color: "#1a1a2e", textAlign: "center" },
  skillMatchBar:   { display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" },
  skillMatchPill:  { padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 600 },
  skillMatchScore: { fontSize: 12, color: "#888", marginTop: 4 },

  // Day in life
  dayWrap:     { background: "#fafbff", border: "1px solid #f0f0f8", borderRadius: 14, padding: "22px" },
  dayHeader:   { display: "flex", alignItems: "center", gap: 16, marginBottom: 22, paddingBottom: 16, borderBottom: "1px solid #f0f0f8" },
  dayTitle:    { fontWeight: 800, fontSize: 17, color: "#1a1a2e" },
  dayMeta:     { fontSize: 12, color: "#aaa", marginTop: 3 },
  dayTimeline: { display: "flex", flexDirection: "column", gap: 14 },
  dayEntry:    { display: "flex", alignItems: "center", gap: 14 },
  dayEmoji:    { fontSize: 20, width: 28, textAlign: "center", flexShrink: 0 },
  dayDot:      { width: 8, height: 8, borderRadius: "50%", background: "#8b5cf6", flexShrink: 0 },
  dayText:     { fontSize: 14, color: "#444", lineHeight: 1.5 },

  // Industry
  industryGrid:       { display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginBottom: 24 },
  industryBtn:        { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 10px", borderRadius: 14, border: "1.5px solid", cursor: "pointer", transition: "all 0.18s", fontFamily: "var(--fontHeading)" },
  industryCount:      { width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15 },
  industryLabel:      { fontSize: 12, fontWeight: 700, textAlign: "center" },
  industryCareerList: { background: "#fafbff", border: "1px solid #f0f0f8", borderRadius: 16, padding: "20px" },
  industryCareerTitle:{ fontWeight: 800, fontSize: 16, color: "#1a1a2e", marginBottom: 16, display: "flex", alignItems: "center" },
  industryCareerGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 },
  industryCareerCard: { background: "#fff", border: "1px solid #f0f0f8", borderRadius: 12, padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  industryCareerLabel:{ fontWeight: 700, fontSize: 13, color: "#1a1a2e", textAlign: "center" },
  industryCareerSalary:{ fontSize: 11, color: "#888" },
  industryCareerEdu:  { fontSize: 11, color: "#bbb", textAlign: "center" },

  select: { padding: "9px 14px", borderRadius: 10, border: "1.5px solid #e8eaf6", fontSize: 14, fontFamily: "var(--fontHeading)", outline: "none", background: "#fff", cursor: "pointer" },

  // roadmap.sh banner
  roadmapShBanner:      { display: "flex", alignItems: "center", gap: 18, background: "linear-gradient(135deg,#0f172a,#1e1b4b)", borderRadius: 14, padding: "18px 20px", marginTop: 8, flexWrap: "wrap" },
  roadmapShIcon:        { width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 },
  roadmapShTitle:       { fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 4 },
  roadmapShSub:         { fontSize: 12.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.55 },
  roadmapShBtnPrimary:  { display: "inline-flex", alignItems: "center", padding: "9px 16px", borderRadius: 9, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "#fff", fontSize: 12.5, fontWeight: 700, textDecoration: "none", fontFamily: "var(--fontHeading)", whiteSpace: "nowrap" },
  roadmapShBtnSecondary:{ display: "inline-flex", alignItems: "center", padding: "9px 16px", borderRadius: 9, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 12.5, fontWeight: 700, textDecoration: "none", fontFamily: "var(--fontHeading)", whiteSpace: "nowrap" },

  // Roadmap
  roadmapSectionTitle: { fontSize: 13, fontWeight: 800, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 14 },
  roadmapTrack:  { display: "flex", flexDirection: "column", gap: 12 },
  roadmapStep:   { display: "flex", gap: 14, alignItems: "flex-start" },
  roadmapNum:    { width: 30, height: 30, borderRadius: "50%", color: "#fff", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 },
  roadmapStepCard: { flex: 1, background: "#fafbff", border: "1px solid #f0f0f8", borderRadius: 10, padding: "10px 14px" },
  roadmapStepText: { fontSize: 14, color: "#333", lineHeight: 1.5 },
  roadmapSnap:   { background: "#fafbff", border: "1px solid #f0f0f8", borderRadius: 12, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 },
  snapRow:       { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 },
  snapLabel:     { fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 0.4 },
  snapVal:       { fontSize: 13, color: "#333", fontWeight: 600, textAlign: "right" },
  roadmapResources: { display: "flex", flexDirection: "column", gap: 7 },
  resourcePill:  { background: "#f3e8ff", color: "#6d28d9", borderRadius: 8, padding: "7px 12px", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center" },

  // Quiz (kept for style keys referenced by quizResult, used nowhere now but harmless)
  quizWrap:    { padding: "8px 0" },
  quizProgress:{ height: 5, background: "#f0f0f8", borderRadius: 99, marginBottom: 20, overflow: "hidden" },
  quizBar:     { height: "100%", background: "linear-gradient(90deg,#8b5cf6,#6d28d9)", borderRadius: 99, transition: "width 0.4s" },
  quizStep:    { fontSize: 12, color: "#aaa", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 },
  quizQ:       { fontSize: 20, fontWeight: 800, color: "#1a1a2e", marginBottom: 24, lineHeight: 1.4 },
  quizOptions: { display: "flex", flexDirection: "column", gap: 12 },
  quizOpt:     { display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", border: "1.5px solid #e8eaf6", borderRadius: 12, cursor: "pointer", fontSize: 14, fontFamily: "var(--fontHeading)", background: "#fafbff", transition: "all 0.15s", textAlign: "left" },
  quizOptLetter:{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 },
  quizResult:  { padding: "8px 0" },
  resultTitle: { fontSize: 18, fontWeight: 800, color: "#1a1a2e", marginBottom: 20 },
  resultGrid:  { display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 24 },
  resultCard:  { background: "#fafbff", borderRadius: 14, padding: "16px 12px", display: "flex", flexDirection: "column", alignItems: "center", border: "1px solid #f0f0f8", gap: 6 },
  resultRank:  { fontSize: 11, fontWeight: 700, color: "#bbb", alignSelf: "flex-start" },
  resultLabel: { fontWeight: 700, fontSize: 13, color: "#1a1a2e", textAlign: "center" },
  resultSalary:{ fontSize: 11, color: "#888" },
  retakeBtn:   { padding: "10px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "var(--fontHeading)" },
}
