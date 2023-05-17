import ColorTools from './tools/color'
const _color = new ColorTools()
export { _color }

import DateTools from './tools/date'
const _date = new DateTools()
export { _date }

export { getIcon as _icon } from './tools/icon'
export { getLocal as _local } from './tools/local'
export { useFetchWrapper as _fetch } from './tools/fetch'

export function isValidEmail(email: String | null | undefined) {
  if (!email) return false

  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email.replaceAll(/\s/g, '')).toLowerCase())
}

export function logout() {
  useCookie('userId').value = null
  useCookie('token').value = null
  useCookie('eventId').value = null

  navigateTo('/')
}

export function slugify(str: String) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function closeDialog(event: any, dialogNode: any) {
  const rect = dialogNode.getBoundingClientRect()
  if (
    event.clientY < rect.top ||
    event.clientY > rect.bottom ||
    event.clientX < rect.left ||
    event.clientX > rect.right
  ) {
    dialogNode.close()
  }
}