const endpoint = "https://api.magicthegathering.io/v1";

export const getCards = async (page: number = 1, pageSize: number = 10, name?: string, id?: string) => {
    const url = new URL(`${endpoint}/cards`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('pageSize', pageSize.toString());
    if (name) {
        url.searchParams.append('name', name);
    }
    if (id) {
        url.searchParams.append('id', id);
    }

    try {
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const totalCount = response.headers.get('Total-Count');
        const rateLimit = response.headers.get('Ratelimit-Limit');
        const rateLimitRemaining = response.headers.get('Ratelimit-Remaining');
        const count = response.headers.get('Count');

        return {
            cards: data.cards,
            pagination: {
                currentPage: page,
                pageSize,
                totalCount: totalCount,
                count: count,
            },
            rateLimit: {
                limit: rateLimit,
                remaining: rateLimitRemaining,
            }
        };
    } catch (error) {
        console.error('Error fetching cards:', error);
        throw new Error('Failed to fetch cards. Please try again later.');
    }
}