import type { ThemeRegistration } from 'shiki/core';

// The light theme for code blocks: softer tones than an editor theme, more token kinds than the
// CSS-variables theme, every colour at least 4.5:1 on the light code background (#f4f3ef).
export const siteLight: ThemeRegistration = {
	name: 'site-light',
	type: 'light',
	colors: { 'editor.background': '#f4f3ef', 'editor.foreground': '#2e2d2a' },
	tokenColors: [
		{ scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#6b6a63', fontStyle: 'italic' } },
		{ scope: ['keyword', 'storage.type', 'storage.modifier', 'keyword.control', 'keyword.other'], settings: { foreground: '#7a3e9d' } },
		{ scope: ['keyword.operator', 'punctuation'], settings: { foreground: '#5d5b55' } },
		{ scope: ['string', 'string.quoted', 'punctuation.definition.string'], settings: { foreground: '#3d6a29' } },
		{ scope: ['string.regexp', 'constant.character.escape'], settings: { foreground: '#a1381f' } },
		{ scope: ['constant.numeric', 'constant.language', 'constant.other', 'variable.language'], settings: { foreground: '#9c4f17' } },
		{
			scope: ['entity.name.function', 'support.function', 'meta.function-call.generic', 'variable.function'],
			settings: { foreground: '#1f5c99' }
		},
		{
			scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class', 'entity.other.inherited-class'],
			settings: { foreground: '#0e6a6a' }
		},
		{ scope: ['variable.parameter', 'variable.parameter.function-call'], settings: { foreground: '#86512a' } }
	]
};
