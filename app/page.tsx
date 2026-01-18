export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'

// Root redirects to the learning app
// Marketing landing is at (marketing)/page.tsx which renders at /
export default function RootPage() {
  redirect('/learn')
}
