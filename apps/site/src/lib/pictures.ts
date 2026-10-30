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

// Hummingbirds for the Flutter profile: a nod to Dash, Flutter's mascot. Natural-history
// plates and a photograph of real birds, never Flutter's own artwork.
export const flutterPictures = {
  haeckel: {
    src: '/images/flutter/haeckel-trochilidae.webp',
    width: 1400,
    height: 1963,
    alt: 'Ernst Haeckel’s 1904 plate of hummingbirds in flight among ferns and flowers',
    credit: {
      title: 'Trochilidae (Kunstformen der Natur)',
      creator: 'Ernst Haeckel',
      licence: 'public domain',
      licenceUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
      page: 'https://commons.wikimedia.org/wiki/File:Haeckel_Trochilidae.jpg',
    },
  },
  fuertes: {
    src: '/images/flutter/fuertes-ruby-throated.webp',
    width: 900,
    height: 1193,
    alt: 'Painting of two ruby-throated hummingbirds hovering by a nest',
    credit: {
      title: 'Plate 54, Ruby-throated Hummingbird',
      creator: 'Louis Agassiz Fuertes',
      licence: 'public domain',
      licenceUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
      page: 'https://commons.wikimedia.org/wiki/File:Plate_54-_Ruby-throated_Hummingbird_-_DPLA_-_3b72af2e8798c3b844e30cc86a42230a.jpg',
    },
  },
  photo: {
    src: '/images/flutter/ruby-throated-photo.webp',
    width: 1100,
    height: 733,
    alt: 'A ruby-throated hummingbird perched on a wire',
    credit: {
      title: 'Ruby-throated hummingbird, Bafflin Sanctuary',
      creator: 'Paul Danese',
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      page: 'https://commons.wikimedia.org/wiki/File:20260613_ruby_throated_hummingbird_bafflin_audubon_PD06622.jpg',
    },
  },
} satisfies Record<string, Picture>
