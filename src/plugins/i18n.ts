import { createI18n } from 'vue-i18n'
import { fa, en } from 'vuetify/locale'

import i18nFa from '@/i18n/fa'
import i18nEn from '@/i18n/en'

const messages = {
	fa: {
		...i18nFa,
		$vuetify: fa
	},
	en: {
		...i18nEn,
		$vuetify: en
	}
}

const i18n = new (createI18n as any)({
	legacy: false,
	locale: 'fa',
	fallbackLocale: 'en',
	messages
})

export default i18n
