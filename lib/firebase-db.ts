import { getDatabaseInstance } from "./firebase"
import {
  ref,
  push,
  set,
  update,
  remove,
  onValue,
  off,
  get,
  query,
  orderByChild,
  equalTo,
  limitToFirst,
  startAt,
  runTransaction,
} from "firebase/database"

const db = getDatabaseInstance()

export function dbRef(path: string) {
  return ref(db, path)
}

export async function writeData(path: string, value: unknown) {
  await set(dbRef(path), value)
}

export async function pushData(path: string, value: unknown) {
  const p = push(dbRef(path))
  await set(p, value)
  return p.key
}

export async function updateData(path: string, value: Record<string, unknown>) {
  await update(dbRef(path), value)
}

export async function removeData(path: string) {
  await remove(dbRef(path))
}

export function subscribe(path: string, cb: (val: any) => void) {
  const r = dbRef(path)
  const listener = (snap: any) => cb(snap.val())
  onValue(r, listener)
  return () => off(r, "value", listener)
}

export async function readOnce(path: string) {
  const snap = await get(dbRef(path))
  return snap.exists() ? snap.val() : null
}

export async function findMatchmakingByComposite(gameTypeStake: string, limit = 10) {
  const q = query(dbRef("matchmakingQueue"), orderByChild("gameTypeStake"), equalTo(gameTypeStake), limitToFirst(limit))
  const snap = await get(q)
  return snap.exists() ? snap.val() : null
}

export async function transactionIncrement(path: string, delta = 1) {
  const r = dbRef(path)
  return runTransaction(r, (curr: any) => {
    if (curr === null) return delta
    return (Number(curr) || 0) + delta
  })
}
