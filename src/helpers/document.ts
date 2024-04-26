export const getFirstInputElement = (parent: Element): HTMLInputElement => {
  const input = parent.querySelector('input')

  if (!input) throw new Error("Can't find any <input/> element")

  return input
}

export const fixNumericInput = (input: HTMLInputElement) => {
  // add mobile related attributes for better ux
  input.setAttribute('inputmode', 'numeric')
  input.setAttribute('pattern', '[0-9]*')

  // if application language is rtl, set numeric inputs dir to ltr to handle special symbols like '-' and '.' properly
  // set 'text-right' class to follow rtl direction
  // then fix padding on ltr input by using vuetify css variables
  if (document.documentElement.hasAttribute('rtl-lang')) {
    input.setAttribute('dir', 'ltr')
    input.classList.add('text-right')
    input.style.paddingInline = 'var(--v-field-padding-end) var(--v-field-padding-start)'
  }
}
