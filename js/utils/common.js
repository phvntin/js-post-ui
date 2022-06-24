export function setTextContent(parent, selector, text) {
  if (!parent) return

  const element = parent.querySelector(selector)
  if (element) element.textContent = text
}

export function setFieldValue(parent, selector, value) {
  if (!parent) return

  const field = parent.querySelector(selector)
  if (field) field.value = value
}

export function setBackgroundImage(parent, selector, imageUrl) {
  if (!parent) return

  const element = parent.querySelector(selector)
  if (element) element.style.backgroundImage = `url("${imageUrl}")`
}

export function randomNumber(n) {
  if (n <= 0) return -1

  const random = Math.random() * n

  return Math.round(random)
}
