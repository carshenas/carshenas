import { defineStore } from 'pinia'
import { nextTick, ref, watch } from 'vue'
import i18n from '@/plugins/i18n'

const { t } = i18n.global
type OnClick = (dismiss: () => void) => void
interface SnackbarAction {
  text?: string
  variant?: NonNullable<
    'outlined' | 'flat' | 'text' | 'elevated' | 'tonal' | 'plain'
  >
  color?: string
  class?: string
  dismissOnClick?: boolean
  onClick?: OnClick
}
interface SnackbarConfig {
  action?: true | SnackbarAction
  location?: 'top' | 'bottom'
  timeout?: number
  timer?: boolean
  color?: string
  textClass?: string
  vertical?: boolean
  maxWidth?: number | string
  dismissOnClick?: boolean
  onDismiss?: () => void
  onClick?: OnClick
}

interface Snackbar {
  text: string
  config?: SnackbarConfig
}

type MergedConfig = Omit<SnackbarConfig, 'action'> & { action?: SnackbarAction }
interface NormalizedSnackbar extends Snackbar {
  config: MergedConfig
}

const mergeConfig = (config?: SnackbarConfig): MergedConfig => {
  let action: SnackbarAction | undefined = undefined

  if (config && config.action) {
    const defaultAction = {
      text: t('$vuetify.dismiss'),
      variant: 'text',
      color: 'inverse-primary'
    } as SnackbarAction

    if (typeof config.action === 'boolean') {
      action = { ...defaultAction, dismissOnClick: true }
    } else {
      action = {
        ...defaultAction,
        ...config.action
      }
    }
  }

  const _config = {
    ...({
      location: 'top',
      timeout: 4000,
      timer: false,
      color: 'inverse-surface',
      vertical: false,
      textClass: config && config.vertical ? undefined : 'd-block text-center',
      maxWidth: '90%',
      dismissOnClick: true
    } as SnackbarConfig),
    ...config,
    action
  }

  return _config
}

export const useSnackbar = defineStore('snackbar', () => {
  const stack = ref<NormalizedSnackbar[]>([])
  const current = ref<NormalizedSnackbar | null>(null)
  const isVisible = ref(false)

  watch(
    () => stack.value.length,
    (value, oldValue) => {
      if (!isVisible.value && value > oldValue) showNext()
    }
  )

  function show(text: string, config?: SnackbarConfig) {
    // prevent duplicated messages
    if (
      (current.value && current.value.text === text) ||
      (stack.value.length && stack.value.find((item) => item.text === text))
    )
      return

    const snackbar: NormalizedSnackbar = {
      text,
      config: mergeConfig(config)
    }

    stack.value.push(snackbar)
  }

  function showNext() {
    const [next, ...rest] = stack.value
    stack.value = rest
    current.value = next

    nextTick(() => {
      isVisible.value = true
    })
  }

  function onAfterLeave() {
    if (current.value?.config && current.value.config.onDismiss)
      current.value.config.onDismiss()

    if (stack.value.length) {
      showNext()
    } else {
      isVisible.value = false
      current.value = null
    }
  }

  function onClick() {
    if (isVisible.value && current.value) {
      if (current.value.config?.onClick) {
        current.value.config.onClick(dismiss)
      }

      if (current.value.config?.dismissOnClick) dismiss()
    }
  }

  function onActionClick() {
    if (current.value && current.value.config.action) {
      if (current.value.config.action.dismissOnClick) dismiss()
      if (current.value.config.action.onClick)
        current.value.config.action.onClick(dismiss)
    }
  }

  function dismiss() {
    if (isVisible.value) isVisible.value = false
  }

  return {
    show,
    isVisible,
    current,
    stack,
    onAfterLeave,
    onClick,
    onActionClick,
    dismiss
  }
})
