import Trakt from 'trakt.tv';

let trakt: Trakt | null = null;

export function getTrakt(): Trakt | null {
  if (trakt) return trakt;

  const clientId = process.env.TRAKT_CLIENT_ID;
  const clientSecret = process.env.TRAKT_SECRET_ID;

  if (clientId && clientSecret) {
    trakt = new Trakt({
      client_id: clientId,
      client_secret: clientSecret,
    });
  }

  return trakt;
}

export default trakt;
