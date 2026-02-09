export async function authFetch(
  url: string,
  options: RequestInit = {}
) {
  const raw = localStorage.getItem(
    'sb-uqxuwtrsgwrtptxozxqy-auth-token'
  );

  if (!raw) {
    throw new Error('No auth token found');
  }

  const parsed = JSON.parse(raw);
  const accessToken = parsed.access_token;

  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers || {}),
    },
  });
}
