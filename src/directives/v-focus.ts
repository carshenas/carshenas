import { getFirstInputElement } from '@/helpers/document'
import type { ObjectDirective } from 'vue'

const vFocus: ObjectDirective = {
  mounted: (el: Element) => {
    const input: HTMLInputElement = getFirstInputElement(el)

    input.focus()
  }
}

export default vFocus
