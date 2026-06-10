import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// ALLOWLIST ESTRICTA
const ALLOWED_EMAILS = [
  'jacontulianoc@gmail.com',
  'usjose85@gmail.com',
  'jose.contuliano@stn.saesa.cl'
]

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any Client Components or Non-middleware routing logic here.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isLoginPage = request.nextUrl.pathname.startsWith('/login')
  const isUnauthorizedPage = request.nextUrl.pathname.startsWith('/unauthorized')

  if (!user && !isLoginPage) {
    // Si NO hay usuario y NO está en la página de login -> redirigir a login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user) {
    const userEmail = user.email || ''
    const isAuthorized = ALLOWED_EMAILS.includes(userEmail)

    if (!isAuthorized && !isUnauthorizedPage) {
        // Si el usuario existe pero NO está en la allowlist -> redirigir a unauthorized
        const url = request.nextUrl.clone()
        url.pathname = '/unauthorized'
        return NextResponse.redirect(url)
    }

    if (isAuthorized && (isLoginPage || isUnauthorizedPage)) {
        // Si el usuario está autorizado y trata de entrar al login -> mandarlo al dashboard
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
