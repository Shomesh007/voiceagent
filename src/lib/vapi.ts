import Vapi from '@vapi-ai/web'

const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY as string

// Defensive constructor identification
const getVapiConstructor = (mod: any) => {
  if (typeof mod === 'function') return mod
  if (mod && typeof mod.default === 'function') return mod.default
  return mod
}

const VapiConstructor = getVapiConstructor(Vapi)

export const vapi = new VapiConstructor(publicKey)

export const ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID as string
