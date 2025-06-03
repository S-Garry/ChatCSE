// /src/app/api/register/route.ts
import { NextResponse } from 'next/server'
import { register } from '@/lib/api/register'

export async function POST(req: Request) {
  try {
    const { email, username, password } = await req.json()
    await register({ email, username, password })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
