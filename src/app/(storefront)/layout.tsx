import { HeaderDesktop } from '@/components/layout/HeaderDesktop'
import { HeaderMobile } from '@/components/layout/HeaderMobile'
import { Footer } from '@/components/layout/Footer'

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderDesktop />
      <HeaderMobile />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}
