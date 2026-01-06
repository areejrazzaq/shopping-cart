/**
 * Get CSRF token from meta tag or cookie
 */
export function getCsrfToken(): string | null {
    // Try to get from meta tag first
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
        const token = metaTag.getAttribute('content');
        if (token) {
            return token;
        }
    }

    // Fallback: try to get from XSRF-TOKEN cookie
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'XSRF-TOKEN' && value) {
            return decodeURIComponent(value);
        }
    }

    // Last resort: try to get from Laravel's default cookie name
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'laravel_session' && value) {
            // Laravel CSRF token is usually in the session, but we can't extract it directly
            // Return null and let the server handle it
            break;
        }
    }

    return null;
}

