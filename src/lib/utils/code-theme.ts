import type { ThemeRegistration } from 'shiki/core';

// The light theme for code blocks: softer tones than an editor theme, more token kinds than the
// CSS-variables theme, every colour at least 4.5:1 on the light code background (#ede9df).
export const siteLight: ThemeRegistration = {
	name: 'site-light',
	type: 'light',
	colors: { 'editor.background': '#ede9df', 'editor.foreground': '#2e2a24' },
	tokenColors: [
		{ scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#655f55', fontStyle: 'italic' } },
		{ scope: ['keyword', 'storage.type', 'storage.modifier', 'keyword.control', 'keyword.other'], settings: { foreground: '#743a96' } },
		{ scope: ['keyword.operator', 'punctuation'], settings: { foreground: '#58544c' } },
		{ scope: ['string', 'string.quoted', 'punctuation.definition.string'], settings: { foreground: '#3a6527' } },
		{ scope: ['string.regexp', 'constant.character.escape'], settings: { foreground: '#9a351c' } },
		{ scope: ['constant.numeric', 'constant.language', 'constant.other', 'variable.language'], settings: { foreground: '#944a14' } },
		{
			scope: ['entity.name.function', 'support.function', 'meta.function-call.generic', 'variable.function'],
			settings: { foreground: '#1d5791' }
		},
		{
			scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class', 'entity.other.inherited-class'],
			settings: { foreground: '#0d6464' }
		},
		{ scope: ['variable.parameter', 'variable.parameter.function-call'], settings: { foreground: '#7f4d27' } }
	]
};
