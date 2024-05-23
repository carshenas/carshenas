import { SYSTEM_KEYS } from '@/constants/keyboard'
import { fixNumericInput, getFirstInputElement } from '@/helpers/document'
import { toEnglishNumbers } from '@/helpers/number'
import type { DirectiveBinding, ObjectDirective } from 'vue'

// ignore some special keys to prevent entering characters that is not suitable based on directive modifiers
function keydownHandler(event: KeyboardEvent, binding: DirectiveBinding) {
  const target = event.target as HTMLInputElement
  const { keyCode, ctrlKey, metaKey } = event
  const value = toEnglishNumbers(target.value) || ''
  const key = toEnglishNumbers(event.key) || ''

  if (
    !(
      // is numeric
      (
        (key >= '0' && key <= '9') ||
        // is special symbol allowed (. and -)
        (((key === '.' && binding.modifiers.decimal) ||
          (key === '-' && binding.modifiers.signed)) &&
          !~value.indexOf(key)) ||
        // is system key
        SYSTEM_KEYS.includes(key) ||
        // is ctrl + a, c, x, v
        ((ctrlKey || metaKey) && [65, 67, 86, 88].includes(keyCode))
      )
    )
  ) {
    event.preventDefault()
  }
}

function inputHandler(event: Event, binding: DirectiveBinding) {
  const target = event.target as HTMLInputElement

  const isDecimal = binding.modifiers.decimal
  let value = toEnglishNumbers(target.value)
  if (!value) {
    return
  }
  // is it a negative number and is it allowed?
  const isNegative = /^\s*-/.test(value) && binding.modifiers.signed

  // remove invalid digits (if it's a decimal, then allows "," and "." to stay)
  value = value.replace(isDecimal ? /[^\d,.]/g : /\D/g, '')
  if (isDecimal) {
    // naive adjustment for decimal values, breaks the number by ",." and considers the last group as the decimal part
    const pieces = value.split(/[,.]/)
    // removes useless zeroes on the right
    const poppedPiece = pieces.pop()
    const decimal = poppedPiece && poppedPiece.replace(/0+$/, '')
    if (pieces.length) {
      value = `${pieces.join('') || (decimal ? '0' : '')}${decimal ? `.${decimal}` : '.'}`
    }
  }
  // removes useless zeroes on the left if not allowed
  const allowLeftZeroes = binding.modifiers.allowLeftZeroes
  value = allowLeftZeroes ? value : value.replace(/^(?:0(?!\b))+/, '')

  if (isNegative) {
    value = value ? `-${value}` : '-'
  }
  // raise a fake event to signal others that we've updated the field
  if (target.value !== value) {
    target.value = toEnglishNumbers(value) || ''

    const fakeEvent = new Event('input')
    target.dispatchEvent(fakeEvent)
  }
}

const vNumberInput: ObjectDirective = {
  mounted(el: Element, binding: DirectiveBinding) {
    const input = getFirstInputElement(el)

    input.addEventListener('keydown', (event) => keydownHandler(event, binding))
    input.addEventListener('input', (event) => inputHandler(event, binding))

    fixNumericInput(input)
  }
}

export default vNumberInput
