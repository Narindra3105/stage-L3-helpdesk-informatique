const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

export const genererMotDePasse = (longueur = 12): string => {
  const octets = new Uint8Array(longueur);
  crypto.getRandomValues(octets);
  return Array.from(octets, (octet) => ALPHABET[octet % ALPHABET.length]).join('');
};