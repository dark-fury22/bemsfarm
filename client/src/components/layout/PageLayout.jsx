import BottomNav from './BottomNav'

export default function PageLayout({ children, noPadding = false }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5EFE6' }}>
      <div style={{ paddingBottom: noPadding ? 0 : '90px' }}>
        {children}
      </div>
      <BottomNav />
    </div>
  )
}