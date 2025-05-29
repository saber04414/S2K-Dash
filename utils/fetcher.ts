// @ts-nocheck
export const fetcher = (...args) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 65_000); // 65s timeout

    return fetch(...args, { signal: controller.signal })
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        })
        .finally(() => clearTimeout(timeout));
};
