import { nextTick, onScopeDispose } from 'vue'
import { type NavigationGuardNext, type RouteLocationNormalized, useRouter } from 'vue-router'

export default function useOnBack(
  cb: (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => void
): void {
  let popped: boolean = false
  const router = useRouter()
  let removeBefore: (() => void) | undefined

  nextTick(() => {
    addEventListener('popstate', onpopstate)
    removeBefore = router?.beforeEach((to, from, next) => {
      popped ? cb(to, from, next) : next()
    })
  })

  onScopeDispose(() => {
    removeEventListener('popstate', onpopstate)
    removeBefore?.()
  })

  const onpopstate = () => {
    popped = true

    setTimeout(() => (popped = false))
  }
}
