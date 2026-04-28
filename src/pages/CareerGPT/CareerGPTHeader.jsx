export default function CareerGPTHeader() {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontFamily: 'var(--fontHeading)',
        }}>
            <i className="fa-solid fa-robot" style={{ color: '#fdd835', fontSize: '20px' }}></i>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '18px' }}>CareerGPT</span>
            <span style={{
                marginLeft: 'auto',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.5)',
                background: 'rgba(253,216,53,0.15)',
                border: '1px solid rgba(253,216,53,0.3)',
                borderRadius: '99px',
                padding: '2px 10px',
                fontWeight: 600,
            }}>AI Online</span>
        </div>
    )
}
