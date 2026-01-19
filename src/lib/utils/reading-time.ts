/**
 * Calculate reading time for a text string
 * Based on average reading speed of 200-250 words per minute
 */
export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
	// Remove HTML tags to get plain text
	const plainText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

	// Count words (split by whitespace and filter empty strings)
	const words = plainText.split(/\s+/).filter(word => word.length > 0);

	// Calculate minutes (round up)
	const minutes = Math.ceil(words.length / wordsPerMinute);

	return Math.max(1, minutes); // At least 1 minute
}

/**
 * Format reading time as a human-readable string
 */
export function formatReadingTime(minutes: number): string {
	if (minutes === 1) {
		return '1 min read';
	}
	return `${minutes} min read`;
}
