export const COORDONNEES_VILLES: Record<string, [number, number]> = {
  ABIDJAN: [5.3599, -4.0083],
  COCODY: [5.3667, -3.9833],
  YOPOUGON: [5.3333, -4.0833],
  ABOBO: [5.4167, -4.0167],
  MARCORY: [5.3, -3.9833],
  KOUMASSI: [5.2833, -3.95],
  TREICHVILLE: [5.2833, -4.0167],
  PLATEAU: [5.3167, -4.0167],
  PORT_BOUET: [5.25, -3.9333],
  ANYAMA: [5.4956, -4.0517],
  BINGERVILLE: [5.3547, -3.8886],
  DABOU: [5.3167, -4.3833],
  GRAND_BASSAM: [5.2119, -3.7386],
  AGBOVILLE: [5.9264, -4.2094],
  BOUAKE: [7.6906, -5.0303],
  YAMOUSSOUKRO: [6.8206, -5.2767],
  DALOA: [6.8781, -6.4503],
  KORHOGO: [9.4578, -5.6297],
  SAN_PEDRO: [4.7485, -6.6363],
  ABENGOUROU: [6.7297, -3.4964],
  DEFAULT: [7.54, -5.5471], // Centre approximatif de la Côte d'Ivoire
};

export function getCoordonneesVille(nomVille: string): [number, number] {
  const key = nomVille
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z]/g, "_");
  return COORDONNEES_VILLES[key] ?? COORDONNEES_VILLES.DEFAULT;
}