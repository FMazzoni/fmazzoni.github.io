// Post dates are calendar dates (YYYY-MM-DD). Format them in UTC so no time zone shifts the day.
const long = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
// en-GB writes September as "Sept"; build the short form from parts so every month has three letters.
const shortMonth = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' });

const asDate = (iso: string): Date => new Date(`${iso}T00:00:00Z`);

/** 17 November 2025 */
export const longDate = (iso: string): string => long.format(asDate(iso));
/** 17 Nov 2025 */
export const shortDate = (iso: string): string => {
	const d = asDate(iso);
	return `${d.getUTCDate()} ${shortMonth.format(d)} ${d.getUTCFullYear()}`;
};
