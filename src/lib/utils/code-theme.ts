import type { ThemeRegistration } from 'shiki/core';

// The light theme for code blocks: softer tones than an editor theme, more token kinds than the
// CSS-variables theme, every colour at least 4.5:1 on the light code background (#d6d8dd).
export const siteLight: ThemeRegistration = {
	name: 'site-light',
	type: 'light',
	colors: { 'editor.background': '#d6d8dd', 'editor.foreground': '#1b2230' },
	tokenColors: [
		{ scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#565d69', fontStyle: 'italic' } },
		{ scope: ['keyword', 'storage.type', 'storage.modifier', 'keyword.control', 'keyword.other'], settings: { foreground: '#6a2f8e' } },
		{ scope: ['keyword.operator', 'punctuation'], settings: { foreground: '#4f5868' } },
		{ scope: ['string', 'string.quoted', 'punctuation.definition.string'], settings: { foreground: '#2f6224' } },
		{ scope: ['string.regexp', 'constant.character.escape'], settings: { foreground: '#9c2438' } },
		{ scope: ['constant.numeric', 'constant.language', 'constant.other', 'variable.language'], settings: { foreground: '#9c2438' } },
		{
			scope: ['entity.name.function', 'support.function', 'meta.function-call.generic', 'variable.function'],
			settings: { foreground: '#1d4a93' }
		},
		{
			scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class', 'entity.other.inherited-class'],
			settings: { foreground: '#0d5f66' }
		},
		{ scope: ['variable.parameter', 'variable.parameter.function-call'], settings: { foreground: '#7a3a48' } }
	]
};
