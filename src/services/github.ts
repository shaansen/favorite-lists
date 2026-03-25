import type { AppData, GitHubFileResponse } from '../types'
import { storage } from './storage'

const DATA_PATH = 'data/data.json'
const API_BASE = 'https://api.github.com'

function headers(token: string, etag?: string | null): HeadersInit {
  const h: HeadersInit = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
  }
  if (etag) h['If-None-Match'] = etag
  return h
}

function apiUrl(owner: string, repo: string) {
  return `${API_BASE}/repos/${owner}/${repo}/contents/${DATA_PATH}`
}

export interface FetchResult {
  data: AppData
  sha: string
  changed: boolean
}

export async function fetchDataFile(
  token: string,
  owner: string,
  repo: string,
  useEtag = true
): Promise<FetchResult | null> {
  const etag = useEtag ? storage.getEtag() : null
  const res = await fetch(apiUrl(owner, repo), { headers: headers(token, etag) })

  if (res.status === 304) return null
  if (res.status === 404) return null

  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)

  const newEtag = res.headers.get('etag')
  if (newEtag) storage.setEtag(newEtag)

  const json: GitHubFileResponse = await res.json()
  const content = JSON.parse(atob(json.content))
  return { data: content, sha: json.sha, changed: true }
}

export async function writeDataFile(
  token: string,
  owner: string,
  repo: string,
  data: AppData,
  sha: string
): Promise<string> {
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))))
  const res = await fetch(apiUrl(owner, repo), {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify({
      message: 'Update favorite lists',
      content,
      sha,
    }),
  })

  if (res.status === 409) throw new ConflictError()
  if (!res.ok) throw new Error(`GitHub write error: ${res.status}`)

  const json = await res.json()
  const newSha = json.content.sha
  storage.setEtag('')
  return newSha
}

export async function createDataFileIfMissing(
  token: string,
  owner: string,
  repo: string
): Promise<string> {
  const empty: AppData = { lists: [] }
  const content = btoa(JSON.stringify(empty, null, 2))
  const res = await fetch(apiUrl(owner, repo), {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify({
      message: 'Initialize data.json',
      content,
    }),
  })

  if (res.status === 422) {
    const result = await fetchDataFile(token, owner, repo, false)
    if (result) return result.sha
    throw new Error('File exists but cannot be read')
  }

  if (!res.ok) throw new Error(`GitHub create error: ${res.status}`)
  const json = await res.json()
  return json.content.sha
}

export async function testConnection(
  token: string,
  owner: string,
  repo: string
): Promise<boolean> {
  const res = await fetch(`${API_BASE}/repos/${owner}/${repo}`, {
    headers: headers(token),
  })
  return res.ok
}

export class ConflictError extends Error {
  constructor() {
    super('Conflict: SHA mismatch')
    this.name = 'ConflictError'
  }
}
