import { HeaderDesktop } from '@/components/layout/HeaderDesktop'
import { HeaderMobile } from '@/components/layout/HeaderMobile'
import { Footer } from '@/components/layout/Footer'
import { BottomNavBar } from '@/components/layout/BottomNavBar'

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderDesktop />
      <HeaderMobile />
      <main className="flex-grow pb-24 md:pb-0">
        {children}
      </main>
      <Footer />
      <BottomNavBar />
    </div>
  )
}
