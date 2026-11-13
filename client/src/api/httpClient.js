export async function getJson(path, { signal } = {}) {
  const response = await fetch(path, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  })
  const payload = await response.json()

  if (!response.ok) {
    const message = payload?.error?.message
      || `Request failed with status ${response.status}.`
    const error = new Error(message)
    error.status = response.status
    throw error
  }

  return payload
}
