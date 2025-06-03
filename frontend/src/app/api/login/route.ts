// /src/app/api/login/route.ts
import { NextResponse } from 'next/server'
import { login } from '@/lib/api/login'

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()
    const result = await login({ username, password })
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
