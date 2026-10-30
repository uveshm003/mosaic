// Pictures of Ahmedabad from open collections, each credited on the page.
// They show the city, never Uvesh or his work. Share-alike photos are shown unaltered.

export interface Picture {
  src: string
  width: number
  height: number
  alt: string
  credit: {
    title: string
    creator: string
    licence: string
    licenceUrl: string | null
    page: string
  }
}

export const pictures = {
  jali: {
    src: '/images/ahmedabad/jali.webp',
    width: 1600,
    height: 1189,
    alt: 'Carved stone lattice window (jali) at the Sidi Saiyyed Mosque, Ahmedabad',
    credit: {
      title: 'Jali at Sidi Saiyyed Mosque 01',
      creator: 'Bernard Gagnon',
      licence: 'CC BY-SA 3.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
      page: 'https://commons.wikimedia.org/wiki/File:Jali_at_Sidi_Saiyyed_Mosque_01.jpg',
    },
  },
  stepwell: {
    src: '/images/ahmedabad/stepwell.webp',
    width: 1200,
    height: 1600,
    alt: 'Looking up through the carved storeys of the Adalaj stepwell near Ahmedabad',
    credit: {
      title: 'Stepwell of adalaj',
      creator: 'Rahilarious',
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      page: 'https://commons.wikimedia.org/wiki/File:Stepwell_of_adalaj.jpg',
    },
  },
  kite: {
    src: '/images/ahmedabad/kite.webp',
    width: 1200,
    height: 800,
    alt: 'A kite and its long tail against a blue sky during the Ahmedabad kite festival',
    credit: {
      title: 'Kite festival-Ahmedabad 03',
      creator: 'Shailya',
      licence: 'CC BY-SA 3.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
      page: 'https://commons.wikimedia.org/wiki/File:Kite_festival-Ahmedabad_03.jpg',
    },
  },
  polHouse: {
    src: '/images/ahmedabad/pol-house.webp',
    width: 1200,
    height: 1600,
    alt: 'A wooden pol house in the old city of Ahmedabad',
    credit: {
      title: 'Pol House of Ahmedabad 01',
      creator: 'Riyas16',
      licence: 'CC BY 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by/4.0',
      page: 'https://commons.wikimedia.org/wiki/File:Pol_House_of_Ahmedabad_01.jpg',
    },
  },
  map1855: {
    src: '/images/ahmedabad/map-1855.webp',
    width: 1920,
    height: 1309,
    alt: 'Map of the walled city of Ahmedabad from 1855',
    credit: {
      title: 'Ahmedabad 1855',
      creator: 'Various',
      licence: 'public domain',
      licenceUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
      page: 'https://commons.wikimedia.org/wiki/File:Ahmedabad_1855.jpg',
    },
  },
} satisfies Record<string, Picture>
