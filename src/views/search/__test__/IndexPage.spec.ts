import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchPage from '../IndexPage.vue'

describe('Content', () => {
  it('should contain search page', async () => {
    const wrapper = mount(SearchPage)
    expect(wrapper.html()).toContain('Search Page')
  })
})
