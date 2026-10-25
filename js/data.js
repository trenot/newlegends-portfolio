/**
 * NewLegends: Jodie Devine's Concert Photography Journal & Review Archive
 * Core Database of Logged Concerts, Setlists, Reviews, Photos, and Stats
 */

// Standard filename mapping for real photography placed in assets/photos/
const LOCAL_PHOTO_MAP = {
  "the-strike-boston-2026": "assets/photos/the-strike-boston.jpg",
  "5sos-camino-mohegan-2026": "assets/photos/5sos-camino-mohegan.jpg",
  "5sos-camino-td-boston-2026": "assets/photos/5sos-camino-boston.jpg",
  "5sos-camino-msg-night-1": "assets/photos/5sos-camino-msg-1.jpg",
  "5sos-camino-msg-night-2": "assets/photos/5sos-camino-msg-2.jpg",
  "5sos-camino-forum-la": "assets/photos/5sos-camino-la.jpg",
  "tbcamino-nantucket-muse": "assets/photos/camino-nantucket.jpg",
  "tbcamino-memphis-night-1": "assets/photos/camino-memphis-1.jpg",
  "tbcamino-memphis-night-2": "assets/photos/camino-memphis-2.jpg",
  "5sos-camino-haiden-buffalo": "assets/photos/5sos-camino-buffalo.jpg",
  "5sos-camino-haiden-pine-knob": "assets/photos/5sos-camino-pineknob.jpg",
  "5sos-camino-haiden-raleigh": "assets/photos/5sos-camino-raleigh.jpg",
  "incolor-wilt-jutes-detroit": "assets/photos/incolor-detroit.jpg",
  "incolor-wilt-jutes-toledo": "assets/photos/incolor-toledo.jpg",
  "incolor-wilt-jutes-irving-plaza": "assets/photos/incolor-irvingplaza.jpg",
  "jonas-brothers-msg-aug20": "assets/photos/jonas-msg.jpg",
  "jonas-brothers-td-garden-sept25": "assets/photos/jonas-boston.jpg",
  "teddy-swims-td-garden-oct9": "assets/photos/teddy-swims-boston.jpg"
};

const DEFAULT_CONCERTS = [
  {
    id: "the-strike-boston-2026",
    artist: "The Strike",
    supporting: "Sumsun",
    date: "July 10, 2026",
    dateIso: "2026-07-10",
    venue: "Brighton Music Hall",
    city: "Boston",
    state: "MA",
    coords: [42.3524, -71.1345],
    tourRun: "Summer Indie Showcase",
    perspective: "Barrier Center",
    gear: "Sony A7IV · FE 35mm f/1.4 GM · Portra 400 Warm Profile",
    ratings: {
      energy: 9.6,
      vocals: 9.8,
      crowdVibe: 9.2,
      acoustics: 8.9,
      overall: 9.4
    },
    standoutQuote: "Chris Hurd's falsetto cut straight through the humid Boston night, turning a packed room into a 1980s synth-pop cathedral.",
    review: "Brighton Music Hall is legendary for its unforgiving sightlines, but being dead center on the barrier made the entire room vanish. From the moment The Strike launched into 'Nothing Left to Lose', the energy was intoxicating. Chris Hurd doesn't just sing; he physically commands every cubic inch of air. Watching Sumsun warm up the room with dreamy synth textures laid the perfect foundation. Through the viewfinder, Hurd's silhouettes against the backlit violet strobes gave every frame a timeless cinematic grain. The band's brass hooks pierced clean through the mix, and by the time they hit 'Overtime', the pit was an ecstatic, bouncing wave of sweat and neon nostalgia. A masterclass in modern pop-funk showmanship.",
    setlist: [
      { song: "Nothing Left to Lose", highlight: true },
      { song: "Miles Ahead", highlight: false },
      { song: "Faint of Heart", highlight: false },
      { song: "Devils in the Canyon", highlight: true },
      { song: "American Dream", highlight: false },
      { song: "I Wish I Hadn't Seen That", highlight: false },
      { song: "Painkillers", highlight: true },
      { song: "Overtime", highlight: true },
      { song: "Looking for Love (Encore)", highlight: false }
    ],
    coverPhoto: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600&auto=format&fit=crop&q=80",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600&auto=format&fit=crop&q=80",
        caption: "Chris Hurd catching backlights at the barrier during 'Devils in the Canyon'.",
        exif: "35mm · f/1.4 · 1/400s · ISO 2500",
        perspective: "Barrier Center"
      },
      {
        url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1600&auto=format&fit=crop&q=80",
        caption: "Brighton Music Hall crowd euphoria under warm amber wash.",
        exif: "24mm · f/2.0 · 1/250s · ISO 3200",
        perspective: "Pit Wide"
      },
      {
        url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&auto=format&fit=crop&q=80",
        caption: "Sumsun opening groove bathed in deep ultraviolet mist.",
        exif: "50mm · f/1.8 · 1/320s · ISO 1600",
        perspective: "Stage Right"
      }
    ],
    badge: "Indie Synth Gold",
    favorite: true
  },
  {
    id: "5sos-camino-mohegan-2026",
    artist: "5 Seconds of Summer & The Band CAMINO",
    supporting: "The Band CAMINO",
    date: "May 29, 2026",
    dateIso: "2026-05-29",
    venue: "Mohegan Sun Arena",
    city: "Uncasville",
    state: "CT",
    coords: [41.4912, -72.0911],
    tourRun: "North American Arena Run",
    perspective: "Pit Stage Left",
    gear: "Sony A7IV · FE 24-70mm f/2.8 GM II · Kodak Tri-X Monochrome Profile",
    ratings: {
      energy: 9.7,
      vocals: 9.4,
      crowdVibe: 9.5,
      acoustics: 9.3,
      overall: 9.5
    },
    standoutQuote: "Kicking off the arena run where Jeffrey Jordan's opening riff on 'Daphne Blue' echoed off 10,000 screaming voices under the arena rafters.",
    review: "The opening night of this co-headlining monster run at Mohegan Sun was nothing short of an explosion. The Band CAMINO took the arena stage like they'd owned it for decades. Hearing Jeffrey Jordan strike the opening chords of 'Daphne Blue' with 10,000 fans already screaming every syllable gave me goosebumps behind the lens. The transition between Spencer Stewart's driving synths and Garrison Burgess's thunderous kick shook the subwoofers under my boots in the pit. When 5SOS followed, Luke Hemmings and Michael Clifford traded scorching guitar riffs with effortless charisma. Mohegan's acoustics are surprisingly crisp for an arena of this size, letting Ashton Irwin's snare cut through like artillery fire.",
    setlist: [
      { song: "CAMINO: Daphne Blue", highlight: true },
      { song: "CAMINO: 1 Last Cigarette", highlight: true },
      { song: "CAMINO: Roses", highlight: false },
      { song: "CAMINO: What Am I Missing?", highlight: false },
      { song: "CAMINO: See Through", highlight: true },
      { song: "5SOS: Complete Mess", highlight: false },
      { song: "5SOS: She's Kinda Hot", highlight: false },
      { song: "5SOS: Teeth", highlight: true },
      { song: "5SOS: Youngblood", highlight: true }
    ],
    coverPhoto: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1600&auto=format&fit=crop&q=80",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1600&auto=format&fit=crop&q=80",
        caption: "Jeffrey Jordan leaning into the pit during 'Daphne Blue'.",
        exif: "24mm · f/2.8 · 1/500s · ISO 3200",
        perspective: "Pit Stage Left"
      },
      {
        url: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1600&auto=format&fit=crop&q=80",
        caption: "Ashton Irwin's drum riser illuminated by pyro cannons.",
        exif: "70mm · f/2.8 · 1/640s · ISO 2000",
        perspective: "Stage Center"
      }
    ],
    badge: "Arena Opener",
    favorite: false
  },
  {
    id: "5sos-camino-td-boston-2026",
    artist: "5 Seconds of Summer & The Band CAMINO",
    supporting: "The Band CAMINO",
    date: "June 05, 2026",
    dateIso: "2026-06-05",
    venue: "TD Garden",
    city: "Boston",
    state: "MA",
    coords: [42.3662, -71.0621],
    tourRun: "North American Arena Run",
    perspective: "Barrier Stage Right",
    gear: "Sony A7IV · FE 70-200mm f/2.8 GM II · CineStill 800T Mood",
    ratings: {
      energy: 9.9,
      vocals: 9.5,
      crowdVibe: 9.8,
      acoustics: 9.1,
      overall: 9.6
    },
    standoutQuote: "Home-turf Boston energy hits different. Michael Clifford and Luke Hemmings traded harmonized shredding while CAMINO warmed the room like headliners.",
    review: "There is an unspoken ferocity to Boston arena crowds, and tonight TD Garden was on absolute fire. Standing pressed against the stage right barrier with camera straps locked, I watched The Band CAMINO turn an arena into their personal playground. Spencer Stewart's backing vocals resonated with an ethereal clarity, and when Jeffrey took the catwalk, the floor shook. 5SOS delivered what felt like the most polished, dynamic set of their careers. 'Teeth' had the entire bowl shaking violently, the industrial bass rattle reverberating in the camera lens barrel. The connection between the barrier fans and the stage was raw, emotional, and unforgettable.",
    setlist: [
      { song: "CAMINO: Know It All", highlight: false },
      { song: "CAMINO: Daphne Blue", highlight: true },
      { song: "CAMINO: Song About You", highlight: true },
      { song: "CAMINO: I Think I Like You", highlight: false },
      { song: "5SOS: Bad Omens", highlight: false },
      { song: "5SOS: Blender", highlight: true },
      { song: "5SOS: Ghost of You", highlight: true },
      { song: "5SOS: Teeth", highlight: true },
      { song: "5SOS: Youngblood", highlight: true }
    ],
    coverPhoto: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80",
        caption: "Luke Hemmings bathed in golden spotlights at TD Garden.",
        exif: "70mm · f/2.8 · 1/640s · ISO 1600",
        perspective: "Barrier Stage Right"
      },
      {
        url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&auto=format&fit=crop&q=80",
        caption: "Confetti burst raining down across 17,000 Boston fans.",
        exif: "24mm · f/3.2 · 1/400s · ISO 2500",
        perspective: "Pit Risers"
      }
    ],
    badge: "Hometown Fire",
    favorite: true
  },
  {
    id: "5sos-camino-msg-night-1",
    artist: "5 Seconds of Summer & The Band CAMINO",
    supporting: "The Band CAMINO",
    date: "June 13, 2026",
    dateIso: "2026-06-13",
    venue: "Madison Square Garden",
    city: "New York",
    state: "NY",
    coords: [40.7505, -73.9934],
    tourRun: "MSG 2-Night Residency",
    perspective: "Barrier Dead Center",
    gear: "Sony A7IV · FE 24-70mm f/2.8 GM II · Ilford HP5+ High Contrast",
    ratings: {
      energy: 10.0,
      vocals: 9.7,
      crowdVibe: 10.0,
      acoustics: 9.6,
      overall: 9.8
    },
    standoutQuote: "Night 1 at The World's Most Famous Arena: you could feel the floor vibrating through your combat boots during 'Teeth' and '1 Last Cigarette'.",
    review: "Walking into Madison Square Garden with a photo pass is a sacred milestone, and Night 1 proved why this building holds its mythical status. The Band CAMINO came out with the swagger of a band destined for their own MSG headliner. Jeffrey Jordan was airborne for half the set; his telecaster was spitting sparks on '1 Last Cigarette'. 5SOS matched that electric tempo with relentless precision. The lighting design at MSG was breathtaking—towering amber columns cutting through thick theatrical haze, creating golden silhouettes that were absolute perfection for high-contrast analog grain. When 20,000 people sing every single harmony in unison, the air inside MSG feels electrified.",
    setlist: [
      { song: "CAMINO: Daphne Blue", highlight: true },
      { song: "CAMINO: 1 Last Cigarette", highlight: true },
      { song: "CAMINO: Berenstein", highlight: true },
      { song: "CAMINO: Never a Good Time", highlight: false },
      { song: "5SOS: Complete Mess", highlight: false },
      { song: "5SOS: Amnesia", highlight: true },
      { song: "5SOS: Teeth", highlight: true },
      { song: "5SOS: Jet Black Heart", highlight: true },
      { song: "5SOS: Youngblood", highlight: true }
    ],
    coverPhoto: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1600&auto=format&fit=crop&q=80",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1600&auto=format&fit=crop&q=80",
        caption: "The Garden in full roar under the overhead spotlight truss.",
        exif: "28mm · f/2.8 · 1/500s · ISO 2000",
        perspective: "Barrier Dead Center"
      },
      {
        url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1600&auto=format&fit=crop&q=80",
        caption: "Michael Clifford leaning back into the spotlight beam.",
        exif: "50mm · f/2.0 · 1/800s · ISO 1600",
        perspective: "Barrier Center"
      }
    ],
    badge: "MSG Residency #1",
    favorite: true
  },
  {
    id: "5sos-camino-msg-night-2",
    artist: "5 Seconds of Summer & The Band CAMINO",
    supporting: "The Band CAMINO",
    date: "June 14, 2026",
    dateIso: "2026-06-14",
    venue: "Madison Square Garden",
    city: "New York",
    state: "NY",
    coords: [40.7505, -73.9934],
    tourRun: "MSG 2-Night Residency",
    perspective: "Pit & Elevated Side Stage",
    gear: "Sony A7IV · FE 85mm f/1.4 GM · Portra 400 Warmth",
    ratings: {
      energy: 9.9,
      vocals: 9.8,
      crowdVibe: 9.9,
      acoustics: 9.7,
      overall: 9.8
    },
    standoutQuote: "MSG Night 2 tore up the script. CAMINO brought out a surprise acoustic transition and 5SOS delivered an emotional encore that brought half the pit to tears.",
    review: "Back-to-back nights at MSG can sometimes feel like routine repetition for artists, but Night 2 was a total elevation. The Band CAMINO altered their mid-set flow, slipping into a stripped-back acoustic version of 'Fools' that had the whole room waving phone lights like a sky full of stars. 5SOS seemed looser, banter was sharper, and Luke's vocals soared into upper octaves effortlessly. From the elevated side-stage photo pen, I had an unobstructed view of Ashton Irwin attacking the cymbals with feral joy. The sweat was flying, the analog grain in the frame was authentic, and the finale of 'Youngblood' was so visceral you could taste the adrenaline.",
    setlist: [
      { song: "CAMINO: Daphne Blue", highlight: true },
      { song: "CAMINO: Fools (Acoustic Strip)", highlight: true },
      { song: "CAMINO: See Through", highlight: false },
      { song: "CAMINO: 1 Last Cigarette", highlight: true },
      { song: "5SOS: She Looks So Perfect", highlight: true },
      { song: "5SOS: Ghost of You", highlight: true },
      { song: "5SOS: Bad Omens", highlight: false },
      { song: "5SOS: Teeth", highlight: true },
      { song: "5SOS: Youngblood (Extended Outro)", highlight: true }
    ],
    coverPhoto: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&auto=format&fit=crop&q=80",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&auto=format&fit=crop&q=80",
        caption: "Elevated angle capturing the ocean of fans during 'Youngblood'.",
        exif: "85mm · f/1.8 · 1/640s · ISO 1600",
        perspective: "Elevated Side Stage"
      }
    ],
    badge: "MSG Residency #2",
    favorite: false
  },
  {
    id: "5sos-camino-forum-la",
    artist: "5 Seconds of Summer & The Band CAMINO",
    supporting: "The Band CAMINO",
    date: "July 11, 2026",
    dateIso: "2026-07-11",
    venue: "Kia Forum",
    city: "Inglewood",
    state: "CA",
    coords: [33.9583, -118.3419],
    tourRun: "The West Coast Swing",
    perspective: "Pit Perimeter",
    gear: "Sony A7IV · FE 24-70mm f/2.8 GM II · Golden Hour Warm Tone",
    ratings: {
      energy: 9.5,
      vocals: 9.6,
      crowdVibe: 9.4,
      acoustics: 9.8,
      overall: 9.6
    },
    standoutQuote: "Under the golden Forum arches, California haze met explosive alt-pop swagger. The lighting rig bathed Spencer Stewart in deep amber.",
    review: "The Kia Forum is legendary for having the cleanest acoustic reproduction of any major US arena, and tonight every single guitar pluck was immaculate. As the sun set over Southern California, the energy inside shifted to full overdrive. The Band CAMINO's harmonies on 'Roses' floated effortlessly up to the forum's iconic red columns. Calum Hood's bass lines during 'Teeth' shook the concrete floor with velvety low-end punch. Shooting at the Forum is always special—the way the haze hangs in the air diffuses backlights into a painterly glow that feels made for 35mm film emulation.",
    setlist: [
      { song: "CAMINO: Daphne Blue", highlight: true },
      { song: "CAMINO: Roses", highlight: true },
      { song: "CAMINO: 1 Last Cigarette", highlight: false },
      { song: "CAMINO: See Through", highlight: true },
      { song: "5SOS: Complete Mess", highlight: false },
      { song: "5SOS: Me Myself & I", highlight: true },
      { song: "5SOS: Teeth", highlight: true },
      { song: "5SOS: Youngblood", highlight: true }
    ],
    coverPhoto: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1600&auto=format&fit=crop&q=80",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1600&auto=format&fit=crop&q=80",
        caption: "Golden California haze catching Jeffrey's guitar headstock.",
        exif: "50mm · f/2.8 · 1/500s · ISO 2000",
        perspective: "Pit Perimeter"
      }
    ],
    badge: "West Coast Classic",
    favorite: false
  },
  {
    id: "tbcamino-nantucket-muse",
    artist: "The Band CAMINO",
    supporting: "Special Headline Stop",
    date: "July 31, 2026",
    dateIso: "2026-07-31",
    venue: "The Muse",
    city: "Nantucket",
    state: "MA",
    coords: [41.2835, -70.0995],
    tourRun: "Island & Dive Bar Special",
    perspective: "Sweaty Front Row / 2 Feet from Stage",
    gear: "Sony A7IV · FE 35mm f/1.4 GM · Push +2 Ev Push / Grain Heavy",
    ratings: {
      energy: 10.0,
      vocals: 9.5,
      crowdVibe: 10.0,
      acoustics: 8.5,
      overall: 9.7
    },
    standoutQuote: "No barricade, salt air in the room, 200 people screaming every lyric back into Jeffrey's face. The rawest, most intimate CAMINO show ever staged.",
    review: "If you ever wondered what The Band CAMINO sounded like playing crowded basement house parties before they packed arenas, this was it. The Muse on Nantucket is an intimate, gritty island institution. No barricade. No security line between the lens and the microphone. My knuckles were practically resting on the monitors. With sweat dripping from the low ceiling and salt air blowing through the cracked side door, the band tore through 90 minutes of pure unadulterated rock 'n roll. Jeffrey broke a string two songs in and laughed it off, screaming the vocals acapella while the crowd carried the chorus. Easily one of the most unforgettable nights of live music I will ever document in my life.",
    setlist: [
      { song: "Daphne Blue (Fast Punk Tempo)", highlight: true },
      { song: "2 / 14", highlight: true },
      { song: "My Thoughts On You", highlight: true },
      { song: "Berenstein", highlight: true },
      { song: "Less Than I Do", highlight: false },
      { song: "Honest", highlight: true },
      { song: "See Through", highlight: false },
      { song: "1 Last Cigarette (Extended)", highlight: true }
    ],
    coverPhoto: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&auto=format&fit=crop&q=80",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&auto=format&fit=crop&q=80",
        caption: "Raw sweat and mic grit at The Muse. Two feet away from Jeffrey.",
        exif: "35mm · f/1.4 · 1/320s · ISO 6400",
        perspective: "Front Row / Monitor Edge"
      },
      {
        url: "https://images.unsplash.com/photo-1520523839898-507125cd53c1?w=1600&auto=format&fit=crop&q=80",
        caption: "Packed island crowd screaming the chorus of '2 / 14'.",
        exif: "24mm · f/2.0 · 1/200s · ISO 5000",
        perspective: "Crowd Level"
      }
    ],
    badge: "Holy Grail Dive Show",
    favorite: true
  },
  {
    id: "tbcamino-memphis-night-1",
    artist: "The Band CAMINO",
    supporting: "Special Headline Homecoming",
    date: "September 04, 2026",
    dateIso: "2026-09-04",
    venue: "Satellite Music Hall",
    city: "Memphis",
    state: "TN",
    coords: [35.1495, -90.0490],
    tourRun: "Memphis Homecoming Residency",
    perspective: "Pit Barrier",
    gear: "Sony A7IV · FE 50mm f/1.2 GM · Warm Amber Film Emulation",
    ratings: {
      energy: 9.8,
      vocals: 9.7,
      crowdVibe: 10.0,
      acoustics: 9.2,
      overall: 9.8
    },
    standoutQuote: "Coming back to where it all began. The humidity, the Memphis soul roots, and an unreleased deep cut performed with tears in their eyes.",
    review: "There's nothing on earth like a hometown band returning to Memphis. When The Band CAMINO stepped onto the stage at Satellite Music Hall for Night 1 of their 2-night residency, the decibel level in the room was deafening. You could see the raw emotion across Jeffrey and Spencer's faces as they looked out at childhood friends, early fans, and family in the balcony. They played deep cuts from their earliest EPs that they haven't touched in years. The warmth of the lighting, the humidity of a Memphis late summer night, and the palpable love in the room translated into some of the most emotionally charged portraits in this entire archive.",
    setlist: [
      { song: "My Thoughts On You", highlight: true },
      { song: "Freefall", highlight: true },
      { song: "Berenstein", highlight: true },
      { song: "Know It All", highlight: false },
      { song: "I Think I Like You", highlight: true },
      { song: "Daphne Blue", highlight: true },
      { song: "The Black & White", highlight: true }
    ],
    coverPhoto: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&auto=format&fit=crop&q=80",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&auto=format&fit=crop&q=80",
        caption: "Jeffrey Jordan singing to his hometown crowd in Memphis.",
        exif: "50mm · f/1.2 · 1/800s · ISO 1250",
        perspective: "Pit Barrier"
      }
    ],
    badge: "Memphis Homecoming #1",
    favorite: true
  },
  {
    id: "tbcamino-memphis-night-2",
    artist: "The Band CAMINO",
    supporting: "Special Headline Homecoming",
    date: "September 05, 2026",
    dateIso: "2026-09-05",
    venue: "Satellite Music Hall",
    city: "Memphis",
    state: "TN",
    coords: [35.1495, -90.0490],
    tourRun: "Memphis Homecoming Residency",
    perspective: "Stage Right Wings",
    gear: "Sony A7IV · FE 24-70mm f/2.8 GM II · Film Sprocket Frame",
    ratings: {
      energy: 9.9,
      vocals: 9.6,
      crowdVibe: 10.0,
      acoustics: 9.3,
      overall: 9.8
    },
    standoutQuote: "Night 2 was pure catharsis. An extended drum solo by Garrison Burgess and a 3-song encore that felt like a family reunion.",
    review: "Night 2 of the Memphis residency closed out CAMINO's summer with an exclamation mark. The energy felt loose and celebratory. Garrison Burgess gave a masterclass on the drum kit during 'Song About You', with rimshots echoing through the rafters. Having access to the stage wings gave me an angle over the band's shoulders looking out at the illuminated sea of faces singing back every word. There is a sacred purity to a band in their element, surrounded by the streets that raised them. As the final chords of 'Daphne Blue' rang out, Jeffrey raised his glass to the crowd and didn't leave the stage for ten minutes.",
    setlist: [
      { song: "Roses", highlight: false },
      { song: "Song About You", highlight: true },
      { song: "Underneath My Skin", highlight: false },
      { song: "Fools", highlight: true },
      { song: "1 Last Cigarette", highlight: true },
      { song: "See Through", highlight: false },
      { song: "Daphne Blue (Extended Jam)", highlight: true }
    ],
    coverPhoto: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&auto=format&fit=crop&q=80",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&auto=format&fit=crop&q=80",
        caption: "Stage wings perspective looking out into the sold out Memphis hall.",
        exif: "24mm · f/2.8 · 1/400s · ISO 2500",
        perspective: "Stage Right Wings"
      }
    ],
    badge: "Memphis Homecoming #2",
    favorite: false
  },
  {
    id: "5sos-camino-haiden-buffalo",
    artist: "5 Seconds of Summer, The Band CAMINO & Haiden Henderson",
    supporting: "The Band CAMINO & Haiden Henderson",
    date: "August 03, 2026",
    dateIso: "2026-08-03",
    venue: "Darien Lake Amphitheater",
    city: "Buffalo",
    state: "NY",
    coords: [42.9287, -78.3847],
    tourRun: "Everyone's A Star! Summer Amphitheater Run",
    perspective: "Pit Center",
    gear: "Sony A7IV · FE 24-70mm f/2.8 GM II · Kodak Ektar Colors",
    ratings: {
      energy: 9.4,
      vocals: 9.3,
      crowdVibe: 9.3,
      acoustics: 9.0,
      overall: 9.3
    },
    standoutQuote: "Haiden Henderson set the lawn on fire before CAMINO & 5SOS turned the open-air pavilion into an electric thunderstorm.",
    review: "Summer amphitheater tours have an intoxicating aura all their own: the scent of cedar grass, the summer heat cooling into twilight, and thousands of fans running from the roller coasters straight into the pit. Haiden Henderson kicked off the bill with swaggering pop-rock hooks that instantly won over early arrivals. When CAMINO hit the stage right as dusk settled, their amber and sapphire lighting rig cut through the cooling air with razor-sharp drama. 5SOS closed out the night with a thunderous rendition of 'Easier' that echoed over the lake. Capturing the motion blur of Ashton Irwin's drumsticks against the darkening sky remains one of my personal favorite shots from the run.",
    setlist: [
      { song: "Haiden: Hell of a Good Time", highlight: true },
      { song: "Haiden: Fresh Eyes", highlight: false },
      { song: "CAMINO: Daphne Blue", highlight: true },
      { song: "CAMINO: I Think I Like You", highlight: false },
      { song: "CAMINO: 1 Last Cigarette", highlight: true },
      { song: "5SOS: Teeth", highlight: true },
      { song: "5SOS: Easier", highlight: true },
      { song: "5SOS: Youngblood", highlight: true }
    ],
    coverPhoto: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1600&auto=format&fit=crop&q=80",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1600&auto=format&fit=crop&q=80",
        caption: "Amphitheater lawn hands raised against the summer twilight.",
        exif: "24mm · f/2.8 · 1/250s · ISO 1600",
        perspective: "Pit Center"
      }
    ],
    badge: "Amphitheater Run",
    favorite: false
  },
  {
    id: "5sos-camino-haiden-pine-knob",
    artist: "5 Seconds of Summer, The Band CAMINO & Haiden Henderson",
    supporting: "The Band CAMINO & Haiden Henderson",
    date: "August 06, 2026",
    dateIso: "2026-08-06",
    venue: "Pine Knob Music Theatre",
    city: "Clarkston",
    state: "MI",
    coords: [42.7447, -83.3986],
    tourRun: "Everyone's A Star! Summer Amphitheater Run",
    perspective: "Lawn & Pit Access",
    gear: "Sony A7IV · FE 70-200mm f/2.8 GM II · CineStill 800T Halation",
    ratings: {
      energy: 9.7,
      vocals: 9.4,
      crowdVibe: 9.6,
      acoustics: 9.4,
      overall: 9.5
    },
    standoutQuote: "Pine Knob's iconic hillside went berserk when Ashton Irwin launched into his drum solo with the Michigan sunset behind him.",
    review: "Pine Knob is storied concert ground, and you can feel the rock pedigree in the very soil of the hillside. Haiden Henderson commanded the massive pavilion with the charisma of an established arena star. The Band CAMINO brought pure fire; Spencer and Jeffrey engaged in dual guitar harmonies that ricocheted through the canopy of surrounding trees. 5SOS put on one of the tightest sets of the entire tour. From the top of the lawn looking down into the amphitheater, the sea of phone flashlights during 'Ghost of You' looked like a constellation of stars grounded in Michigan woods.",
    setlist: [
      { song: "Haiden: Bad Advice", highlight: false },
      { song: "CAMINO: Daphne Blue", highlight: true },
      { song: "CAMINO: What Am I Missing?", highlight: true },
      { song: "CAMINO: Roses", highlight: false },
      { song: "5SOS: Complete Mess", highlight: false },
      { song: "5SOS: Amnesia", highlight: true },
      { song: "5SOS: Teeth (Drum Solo Outro)", highlight: true },
      { song: "5SOS: Youngblood", highlight: true }
    ],
    coverPhoto: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1600&auto=format&fit=crop&q=80",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1600&auto=format&fit=crop&q=80",
        caption: "Ashton Irwin silhouetted by the Pine Knob stage backlight arrays.",
        exif: "70mm · f/2.8 · 1/640s · ISO 2000",
        perspective: "Pit Access"
      }
    ],
    badge: "Iconic Lawn Energy",
    favorite: false
  },
  {
    id: "5sos-camino-haiden-raleigh",
    artist: "5 Seconds of Summer, The Band CAMINO & Haiden Henderson",
    supporting: "The Band CAMINO & Haiden Henderson",
    date: "August 14, 2026",
    dateIso: "2026-08-14",
    venue: "Coastal Credit Union Music Park",
    city: "Raleigh",
    state: "NC",
    coords: [35.7533, -78.5639],
    tourRun: "Everyone's A Star! Summer Amphitheater Run",
    perspective: "Barrier Left",
    gear: "Sony A7IV · FE 35mm f/1.4 GM · Portra 400 Warmth",
    ratings: {
      energy: 9.5,
      vocals: 9.2,
      crowdVibe: 9.5,
      acoustics: 9.1,
      overall: 9.3
    },
    standoutQuote: "Southern heatwave meet stadium hooks. Haiden Henderson proved he belongs on massive stages, while CAMINO tore through 'I Think I Like You'.",
    review: "Raleigh was sweltering—95 degrees at 8 PM with 80% humidity—and the bands turned the heat right back into kinetic energy. Haiden Henderson brought high-voltage swagger to kick off the triple bill, warming up an already electric crowd. The Band CAMINO gave everything they had; Jeffrey's shirt was soaked three songs in as he sprinted across the stage wings. 5SOS capitalized on the sultry Southern night with heavy synth bass on 'Teeth' that rattled through your ribs. Standing barrier left, I captured incredible sweat-beaded profiles with rich analog grain that feels like classic 1970s stadium tour reportage.",
    setlist: [
      { song: "Haiden: Fresh Eyes", highlight: false },
      { song: "CAMINO: Daphne Blue", highlight: true },
      { song: "CAMINO: 1 Last Cigarette", highlight: true },
      { song: "CAMINO: I Think I Like You", highlight: true },
      { song: "5SOS: She Looks So Perfect", highlight: true },
      { song: "5SOS: Teeth", highlight: true },
      { song: "5SOS: Youngblood", highlight: true }
    ],
    coverPhoto: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600&auto=format&fit=crop&q=80",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600&auto=format&fit=crop&q=80",
        caption: "Sweat, strobe light flare, and raw barrier adrenaline in Raleigh.",
        exif: "35mm · f/1.4 · 1/500s · ISO 2500",
        perspective: "Barrier Left"
      }
    ],
    badge: "Southern Heatwave",
    favorite: false
  },
  {
    id: "incolor-wilt-jutes-detroit",
    artist: "In Color",
    supporting: "Wilt & Jutes",
    date: "August 16, 2026",
    dateIso: "2026-08-16",
    venue: "The Majestic Theatre",
    city: "Detroit",
    state: "MI",
    coords: [42.3528, -83.0617],
    tourRun: "Midwest Underground Tour",
    perspective: "Front Pit",
    gear: "Sony A7IV · FE 24-70mm f/2.8 GM II · Ilford HP5+ High Grain",
    ratings: {
      energy: 9.3,
      vocals: 9.1,
      crowdVibe: 9.4,
      acoustics: 9.2,
      overall: 9.3
    },
    standoutQuote: "Detroit grunge grit meets shimmering indie melody. Wilt brought jagged guitar hooks that shook the vintage wood floorboards.",
    review: "The Majestic Theatre is one of the historic gems of Detroit, with its vintage bowling alley attached and weathered wooden stage floor. Wilt kicked off the bill with angular post-punk guitars that immediately grabbed the crowd by the collar. Jutes delivered an emotional, raw alt-rock set that had the front row in tears. When In Color stepped up, the chemistry was electric. The Detroit crowd didn't hold back; the mosh pit at the center opened up during the breakdown of 'Fade Away', allowing me to slip low and shoot upwards into the swirling dust and stage strobe lights.",
    setlist: [
      { song: "Wilt: Gilded", highlight: true },
      { song: "Jutes: Hollywood Valentine", highlight: false },
      { song: "In Color: Silhouette", highlight: true },
      { song: "In Color: Fade Away", highlight: true },
      { song: "In Color: Velvet Night", highlight: false },
      { song: "In Color: Static Dreams (Encore)", highlight: true }
    ],
    coverPhoto: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1600&auto=format&fit=crop&q=80",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1600&auto=format&fit=crop&q=80",
        caption: "Raw post-punk guitar riffing at Detroit's historic Majestic Theatre.",
        exif: "28mm · f/2.8 · 1/400s · ISO 3200",
        perspective: "Front Pit"
      }
    ],
    badge: "Midwest Indie Grit",
    favorite: false
  },
  {
    id: "incolor-wilt-jutes-toledo",
    artist: "In Color",
    supporting: "Wilt & Jutes",
    date: "August 18, 2026",
    dateIso: "2026-08-18",
    venue: "Frankie's Bar",
    city: "Toledo",
    state: "OH",
    coords: [41.6528, -83.5379],
    tourRun: "Midwest Underground Tour",
    perspective: "Barrier / Monitor Edge",
    gear: "Sony A7IV · FE 35mm f/1.4 GM · Push +2 EV Gritty Monochrome",
    ratings: {
      energy: 9.8,
      vocals: 8.9,
      crowdVibe: 9.7,
      acoustics: 8.2,
      overall: 9.2
    },
    standoutQuote: "Frankie's is pure dive heaven. Red neon, beer-slick floors, and Jutes screaming his lungs out three inches from my 35mm lens.",
    review: "Frankie's Inner-City Bar in East Toledo is a rite of passage for every independent touring rock act. It's dark, sticky, lit almost entirely by crimson neon and two amber par cans, and louder than a jet engine. There is zero separation between artist and spectator. Jutes leaned all the way over the stage lip into my lens hood during his most confessional lyric, and the shot captured every drop of sweat and raw vocal cord strain. In Color played with ferocious intimacy. What the venue lacked in acoustic fidelity it made up for in pure unpasteurized punk rock spirit.",
    setlist: [
      { song: "Wilt: Overcast", highlight: false },
      { song: "Jutes: Out of the Blue", highlight: true },
      { song: "In Color: Silhouette", highlight: true },
      { song: "In Color: Bleach", highlight: true },
      { song: "In Color: Broken Glass", highlight: true }
    ],
    coverPhoto: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&auto=format&fit=crop&q=80",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&auto=format&fit=crop&q=80",
        caption: "Red neon wash at Frankie's Bar in Toledo. Raw, sweaty, intimate.",
        exif: "35mm · f/1.4 · 1/250s · ISO 6400",
        perspective: "Monitor Edge"
      }
    ],
    badge: "Underground Dive Gem",
    favorite: true
  },
  {
    id: "incolor-wilt-jutes-irving-plaza",
    artist: "In Color",
    supporting: "Wilt & Jutes",
    date: "August 27, 2026",
    dateIso: "2026-08-27",
    venue: "Irving Plaza",
    city: "New York",
    state: "NY",
    coords: [40.7349, -73.9884],
    tourRun: "Midwest Underground Tour Finale",
    perspective: "Balcony & Pit",
    gear: "Sony A7IV · FE 85mm f/1.4 GM · CineStill 800T Mood",
    ratings: {
      energy: 9.6,
      vocals: 9.3,
      crowdVibe: 9.6,
      acoustics: 9.4,
      overall: 9.5
    },
    standoutQuote: "The tour finale at Irving Plaza felt like a victory lap. In Color proved why they're the next breakout alt-rock powerhouse.",
    review: "Capping off the run at Irving Plaza in Union Square was the ultimate payoff. From sweaty dive bars in Toledo to this historic NYC ballroom, the growth in the band's stage presence was staggering. The lighting rig at Irving bathed the stage in cyan and magenta backlight. Wilt's opening set had the floor vibrating, and Jutes delivered an incendiary performance. When In Color stepped up for their final bow of the tour, the entire room erupted. I split time between the pit and the classic wrought-iron balcony to capture wide sweeping views of the crowd singing every word.",
    setlist: [
      { song: "Wilt: Gilded", highlight: false },
      { song: "Jutes: Hollywood Valentine", highlight: true },
      { song: "In Color: Silhouette", highlight: true },
      { song: "In Color: Fade Away", highlight: true },
      { song: "In Color: Static Dreams", highlight: true }
    ],
    coverPhoto: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1600&auto=format&fit=crop&q=80",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1600&auto=format&fit=crop&q=80",
        caption: "Irving Plaza crowd under cyan spotlights during the tour finale.",
        exif: "85mm · f/1.8 · 1/500s · ISO 2000",
        perspective: "Balcony & Pit"
      }
    ],
    badge: "Tour Finale Triumphant",
    favorite: false
  },
  {
    id: "jonas-brothers-msg-aug20",
    artist: "Jonas Brothers",
    supporting: "Lawrence",
    date: "August 20, 2026",
    dateIso: "2026-08-20",
    venue: "Madison Square Garden",
    city: "New York",
    state: "NY",
    coords: [40.7505, -73.9934],
    tourRun: "The Tour: 5 Albums. One Night.",
    perspective: "Pit Perimeter",
    gear: "Sony A7IV · FE 70-200mm f/2.8 GM II · Portra 400 Color Grade",
    ratings: {
      energy: 9.6,
      vocals: 9.5,
      crowdVibe: 9.7,
      acoustics: 9.5,
      overall: 9.6
    },
    standoutQuote: "Nick, Joe, and Kevin commanding MSG like an empire. A marathon 3-hour set covering their entire catalog with unmatched pop precision.",
    review: "Covering five complete studio albums in a single evening is an audacious feat of endurance, but the Jonas Brothers turned Madison Square Garden into a non-stop pop-rock celebration. Nick's falsetto on 'Jealous' hit the ceiling with razor sharpness, while Joe ran the diamond-shaped catwalk whipping the floor into hysteria. The stage production was colossal: tiered brass sections, full string accompaniment, and massive synchronized LED ribbons. Shooting from the perimeter pit allowed me to capture Joe's high-energy jumps against the towering backdrop of the MSG ceiling. A masterclass in veteran arena pop royalty.",
    setlist: [
      { song: "Celebrate!", highlight: false },
      { song: "S.O.S.", highlight: true },
      { song: "Burnin' Up", highlight: true },
      { song: "Lovebug", highlight: true },
      { song: "Jealous", highlight: true },
      { song: "Cake by the Ocean", highlight: true },
      { song: "Sucker", highlight: true },
      { song: "Leave Before You Love Me", highlight: false }
    ],
    coverPhoto: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80",
        caption: "Joe and Nick Jonas harmonizing on the MSG catwalk extension.",
        exif: "70mm · f/2.8 · 1/640s · ISO 1600",
        perspective: "Pit Perimeter"
      }
    ],
    badge: "5 Albums Arena Spectacle",
    favorite: false
  },
  {
    id: "jonas-brothers-td-garden-sept25",
    artist: "Jonas Brothers",
    supporting: "Lawrence",
    date: "September 25, 2026",
    dateIso: "2026-09-25",
    venue: "TD Garden",
    city: "Boston",
    state: "MA",
    coords: [42.3662, -71.0621],
    tourRun: "The Tour: 5 Albums. One Night.",
    perspective: "Floor Risers",
    gear: "Sony A7IV · FE 24-70mm f/2.8 GM II · CineStill 800T Warm",
    ratings: {
      energy: 9.7,
      vocals: 9.6,
      crowdVibe: 9.8,
      acoustics: 9.3,
      overall: 9.6
    },
    standoutQuote: "Boston brass section and stadium fireworks. Joe Jonas leaning off the catwalk right into the camera during 'Sucker'.",
    review: "Returning to TD Garden for the Boston leg of the Jonas marathon was pure joy. Having Lawrence open with their dynamic horn-driven soul set set the musical bar sky high. When the Jonas trio hit the stage in sleek tailored suits, the roar in the Garden rattled the camera sensors. The energy on 'Burnin' Up' had real flames erupting from the back line, warming the pit up by ten degrees instantly. Joe caught my lens during the breakdown of 'Sucker', giving that iconic theatrical smirk that makes live concert photography so rewarding. Boston showed up in full force, singing every teen nostalgia anthem at full lung capacity.",
    setlist: [
      { song: "Waffle House", highlight: false },
      { song: "S.O.S.", highlight: true },
      { song: "Hold On", highlight: false },
      { song: "Burnin' Up (Pyro Cannon)", highlight: true },
      { song: "When You Look Me in the Eyes", highlight: true },
      { song: "Sucker", highlight: true },
      { song: "Leave Before You Love Me", highlight: true }
    ],
    coverPhoto: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&auto=format&fit=crop&q=80",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&auto=format&fit=crop&q=80",
        caption: "Pyro explosion framing the trio during 'Burnin Up' at TD Garden.",
        exif: "50mm · f/2.8 · 1/800s · ISO 1250",
        perspective: "Floor Risers"
      }
    ],
    badge: "Boston Pop Royalty",
    favorite: false
  },
  {
    id: "teddy-swims-td-garden-oct9",
    artist: "Teddy Swims",
    supporting: "Freak Freely",
    date: "October 09, 2026",
    dateIso: "2026-10-09",
    venue: "TD Garden",
    city: "Boston",
    state: "MA",
    coords: [42.3662, -71.0621],
    tourRun: "I've Tried Everything But Therapy Arena Tour",
    perspective: "Barrier Center",
    gear: "Sony A7IV · FE 50mm f/1.2 GM · Cinematic Kodak Gold 200",
    ratings: {
      energy: 9.8,
      vocals: 10.0,
      crowdVibe: 9.9,
      acoustics: 9.6,
      overall: 9.8
    },
    standoutQuote: "Teddy's vocal resonance isn't just sound—it's a physical vibration in your chest. When he sang 'Lose Control', the entire arena fell dead silent before exploding.",
    review: "There are great live vocalists, and then there is Jaten Dimsdale (Teddy Swims). Seeing his meteoric rise from viral soul covers to headlining TD Garden has been one of the greatest stories in modern music. Standing directly on the barrier dead center, his voice hit with a physical force that moved the fabric of my camera strap. He possesses a gravel-laced, gospel-infused power that doesn't waver for a millisecond. During 'Lose Control', the stage stripped back to a single spotlight. When he hit the climactic falsetto belt, 18,000 people collectively held their breath before erupting into a deafening standing ovation. An unforgettable vocal tour de force.",
    setlist: [
      { song: "Goodbye's Been Good to You", highlight: false },
      { song: "What More Can I Say", highlight: true },
      { song: "Broke", highlight: false },
      { song: "911", highlight: true },
      { song: "Some Things I'll Never Know", highlight: true },
      { song: "The Door", highlight: true },
      { song: "Lose Control", highlight: true },
      { song: "Bed on Fire (Encore)", highlight: true }
    ],
    coverPhoto: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600&auto=format&fit=crop&q=80",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600&auto=format&fit=crop&q=80",
        caption: "Teddy Swims pouring pure soul into the microphone under warm spotlight.",
        exif: "50mm · f/1.2 · 1/640s · ISO 1600",
        perspective: "Barrier Center"
      },
      {
        url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1600&auto=format&fit=crop&q=80",
        caption: "Teddy reaching out to the front row fans at TD Garden.",
        exif: "35mm · f/1.4 · 1/400s · ISO 2000",
        perspective: "Barrier Left"
      }
    ],
    badge: "Vocal Perfection (10/10)",
    favorite: true
  }
];

// Photographer & Site Profile
const JODIE_PROFILE = {
  name: "Jodie Devine",
  siteTitle: "NewLegends",
  tagline: "Concert Photography Journal & Review Archive",
  bio: "Concert photographer and music journalist chasing the raw kinetic energy between the barrier and the stage. Documenting tours across North American arenas, sweaty island dive bars, and historic music halls with an organic analog film sensibility.",
  statement: "Live music is ephemeral—a 90-minute lightning strike that leaves you breathless in the dark. My goal with NewLegends is to preserve that adrenaline through honest editorial critiques, detailed setlists, and high-contrast, film-inspired imagery captured right at the barricade.",
  links: {
    wordpress: "https://jumbleofnotes.wordpress.com/",
    instagramArt: "https://www.instagram.com/jodiedevineart/",
    instagramPersonal: "https://www.instagram.com/jodiejodiejo/",
    tiktok: "https://www.tiktok.com/@jodiejodiejo1",
    folio: "https://jodiedevinef.wixsite.com/jodiefolio"
  },
  gear: [
    { item: "Sony Alpha A7 IV", detail: "Primary 33MP Full-Frame Body for low-light dynamic range" },
    { item: "Sony FE 35mm f/1.4 GM", detail: "The pit workhorse: fast, sharp, barrier-level immersion" },
    { item: "Sony FE 24-70mm f/2.8 GM II", detail: "Versatile zoom for rapid focal transitions" },
    { item: "Sony FE 70-200mm f/2.8 GM II", detail: "Drum riser reach, catwalk isolation, arena lighting compression" },
    { item: "Sony FE 50mm f/1.2 GM", detail: "Creamy bokeh, low-light vocal portrait isolation" },
    { item: "Custom Earasers Hi-Fi Earplugs", detail: "-19dB flat-response hearing protection for barrier decibels" }
  ],
  statsOverview: {
    totalShows: 18,
    uniqueCities: 11,
    uniqueVenues: 11,
    statesVisited: ["MA", "CT", "NY", "CA", "TN", "MI", "OH", "NC"]
  }
};
