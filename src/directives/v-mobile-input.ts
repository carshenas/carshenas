import type { ObjectDirective } from 'vue'
import { fixNumericInput, getFirstInputElement } from '@/helpers/document'
import { SYSTEM_KEYS } from '@/constants/keyboard'
import type { Nullable } from '@/types/utilities'
import { toEnglishNumbers } from '@/helpers/number'

// this directive works based on regex below:
// /^(0|+98|0098)9[0-9]{9}$/

function getLengthBasedOnPattern(value: Nullable<string>) {
  if (value?.length) {
    if (value.startsWith('+98')) return 13
    if (value.startsWith('0098')) return 14
  }

  return 11
}

// ignore some special keys to prevent entering characters that is not suitable for mobile input
function keydown(event: KeyboardEvent) {
  const target = event.target as HTMLInputElement
  const { keyCode, ctrlKey, metaKey } = event
  const key = toEnglishNumbers(event.key) || ''
  const value = toEnglishNumbers(target.value) || ''

  const isSystemKeyOrShortcut = // is system key
    SYSTEM_KEYS.includes(key) ||
    // is ctrl + a, c, x, v
    ((ctrlKey || metaKey) && [65, 67, 86, 88].includes(keyCode))

  if (
    // is first digit invalid
    (!isSystemKeyOrShortcut &&
      value.length < 1 &&
      !['+', '0', '9'].includes(key)) ||
    // is reach the max length
    (!isSystemKeyOrShortcut &&
      value.length === getLengthBasedOnPattern(value)) ||
    !(
      // is numeric
      (
        (key >= '0' && key <= '9') ||
        // '+' symbol allowed at first of mobile number
        (key === '+' && value.length < 1) ||
        isSystemKeyOrShortcut
      )
    )
  ) {
    event.preventDefault()
  }
}

function inputHandler(event: Event) {
  const target = event.target as HTMLInputElement

  let value = toEnglishNumbers(target.value)
  if (!value) {
    return
  }

  // remove invalid digits except first "+"
  value = `${value.startsWith('+') ? '+' : ''}${value.replace(/[^\d]/g, '')}`

  const userInserting = ![
    'deleteContentBackward',
    'deleteContentForward',
    'deleteWordBackward',
    'deleteWordForward'
  ].includes((event as InputEvent).inputType)

  if (value.length === 1 && value === '9') value = '09'

  if (userInserting && value.length === 1 && value === '+') value = '+989'

  if (userInserting && value.length === 2 && value === '00') value = '00989'

  // raise a fake event to signal others that we've updated the field
  if (target.value !== value) {
    target.value = toEnglishNumbers(value) || ''

    const fakeEvent = new Event('input')
    target.dispatchEvent(fakeEvent)
  }
}

const vMobileInput: ObjectDirective = {
  mounted(el: Element) {
    const input = getFirstInputElement(el)

    input.addEventListener('keydown', (event) => keydown(event))
    input.addEventListener('input', (event) => inputHandler(event))

    fixNumericInput(input)
  }
}

export default vMobileInput
