import { pushData, readOnce, removeData } from "@/lib/firebase-db"

function normalizeAddress(a: string) {
  return a.toLowerCase()
}

export async function sendNotification(toAddress: string, message: string) {
  const now = Date.now()
  const payload = { message, timestamp: now, isRead: false }
  const key = await pushData(`notifications/${normalizeAddress(toAddress)}`, payload)
  return { key, payload }
}

export async function cleanupOldNotifications(days = 7) {
  // This should run as a scheduled Cloud Function. Here is a client fallback utility.
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  // naive: read all notifications root and remove old ones
  const all = await readOnce("notifications")
  if (!all) return
  for (const addr of Object.keys(all)) {
    const list = all[addr]
    for (const id of Object.keys(list)) {
      const item = list[id]
      if (item.timestamp && item.timestamp < cutoff) {
        await removeData(`notifications/${addr}/${id}`)
      }
    }
  }
}
