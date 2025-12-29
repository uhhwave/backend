// Shared metrics authentication helper
// Usage: import { validateMetricsAccess } from './auth';

export function validateMetricsAccess(event: any): boolean {
    const secret = process.env.METRICS_SECRET;
    if (!secret) return true; // No secret = open access (backwards compatible)

    const token = getQuery(event).token;
    return token === secret;
}

export function requireMetricsAccess(event: any): void {
    if (!validateMetricsAccess(event)) {
        throw createError({
            statusCode: 404,
            message: 'Not Found',
        });
    }
}
