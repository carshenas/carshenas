export default {
	invalid: {
		default: 'Input is invalid.',
		labeled: '{label} is invalid.'
	},
	required: {
		default: 'This field is required.',
		labeled: '{label} is required.'
	},
	length: {
		default: "Field's value must be exactly {length} characters.",
		labeled: "{label}'s value must be exactly {length} characters."
	},
	minLength: {
		default: "Field's value must be at least {length} characters.",
		labeled: "{label}'s value must be at least {length} characters."
	},
	maxLength: {
		default: "Field's value must be a maximum of {length} characters.",
		labeled: "{label}'s value must be a maximum of {length} characters."
	},
	equalTo: {
		default: "Field's value must be equal to {otherLabel}'s value.",
		labeled: "{label}'s value must be equal to {otherLabel}'s value."
	},
	min: {
		default: "Field's value must be greater than or equal to {min}.",
		labeled: "{label}'s value must be greater than or equal to {min}."
	},
	max: {
		default: "Field's value must be less than or equal to {max}.",
		labeled: "{label}'s value must be less than or equal to {max}."
	}
}
