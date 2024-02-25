import HttpClientError from '@/lib/http-client/HttpClientError'
import { useSnackbar } from '@/store/snackbar'
import { HandledError, ApiError } from '@/types/handled-error'
import i18n from '@/plugins/i18n'
const { t } = i18n.global

interface ExceptionHandlerOptions {
	showSnackbar?: boolean
	ignoredStatusCodes?: number[]
}

export default function useExceptionHandler(
	error: any,
	options: ExceptionHandlerOptions = {
		showSnackbar: true,
		ignoredStatusCodes: [401, 406]
	}
) {
	const handledError: HandledError = {
		unknownError: false,
		networkError: false,
		apiError: false,
		message: '',
		detail: null
	}

	if (error instanceof HttpClientError) {
		// this means request reached server bud response has error
		if (error.response) {
			handledError.apiError = true
			const apiError: ApiError = {
				status: error.response.status,
				errorCode: error.response.data.errorCode || null,
				error: error.response.data.error || null,
				description: error.response.data.description || null,
				request : {
					url: error.url,
					config: error.config
				}
			}
			handledError.detail = apiError
			handledError.message =
				apiError.description || t('messages.anErrorAccoutred')
		} else {
			if (error.message === 'ERR_NETWORK') {
				handledError.networkError = true
				handledError.message = t('messages.connectionError')
			} else {
				handledError.unknownError = true
				handledError.message = t('messages.anErrorAccoutred')
			}
		}
	}

	const showSnackbar =
		handledError.message.trim().length &&
		options.showSnackbar &&
		(handledError.apiError
			? handledError.detail?.status &&
				!options.ignoredStatusCodes?.includes(handledError.detail.status)
			: true)

	if (showSnackbar) {
		useSnackbar().show(handledError.message)
	}

	return handledError
}
