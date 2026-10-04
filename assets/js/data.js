/* Taracine demo data. Everything here is fictional: films, cinemas, prices, perks.
   Authored for a portfolio study; not a claim about any real cinema.

   Course reference (IPT): Inheritance and Polymorphism.
   Screen is the parent class. StandardScreen, GrandScreen, WraparoundScreen and SalonScreen
   extend it with super(), and each one overrides perks() so the same method name gives a
   different result per screen type (method overriding = polymorphism). */
window.TARACINE = (function () {
  // ---------- Inheritance: parent class ----------
  class Screen {
    constructor(id, name, short, price, blurb) {
      this.id = id; this.name = name; this.short = short; this.price = price; this.blurb = blurb;
    }
    perks() { return ["Reserved seating", "Digital projection"]; }
    priceFor(seats) { return this.price * seats; }
    describe() { return `${this.name} · ₱${this.price.toLocaleString("en-PH")} per seat`; }
  }
  // ---------- Inheritance: child classes with extends + super() ----------
  class StandardScreen extends Screen {
    constructor() { super("standard", "Standard", "STD", 350, "Laser projection, surround sound, the everyday big screen."); }
    perks() { return ["Laser projection", "7.1 surround sound", "Reserved seating"]; }
  }
  class GrandScreen extends Screen {
    constructor() { super("grand", "Grand Screen", "GRAND", 550, "Our largest screens, wall to wall, with immersive audio."); }
    perks() { return ["Wall-to-wall screen", "Immersive object audio", "Extra-wide rows"]; }
  }
  class WraparoundScreen extends Screen {
    constructor() { super("wrap", "Wraparound", "WRAP", 600, "Three walls of picture. Key scenes extend to your peripheral vision."); }
    perks() { return ["270° picture on three walls", "Immersive object audio", "Centre-block seating"]; }
  }
  class SalonScreen extends Screen {
    constructor() { super("salon", "Salon", "SALON", 900, "Forty leather recliners, blankets, and seat-side service."); }
    perks() { return ["Leather recliners", "Blanket and pillow", "Seat-side food service", "Only 40 seats"]; }
  }

  // Polymorphism in use: the same perks() call, a different answer from each subclass.
  const screens = [new StandardScreen(), new GrandScreen(), new WraparoundScreen(), new SalonScreen()];
  const formats = {};
  screens.forEach(screen => { formats[screen.id] = screen; });

  /* Films currently showing at SM Cinema (smcinema.com, captured 2026-10-04). Titles, ratings, runtimes, cast and
     synopses are from the SM Cinema listing; posters are hotlinked from SM Cinema's media CDN and belong to the films'
     studios. They appear in this study to show the booking flow with real releases; Taracine does not screen them. */
  const realFilms = [
      {
          "id": "always-yours-never-mine",
          "title": "Always Yours, Never Mine",
          "status": "now",
          "rating": "PG",
          "runtime": 112,
          "release": "2026-09-30",
          "genres": [
              "Drama"
          ],
          "formats": [
              "standard",
              "grand"
          ],
          "cast": [
              "Julia Barretto",
              "Joshua Garcia",
              "Bianca Umali"
          ],
          "director": "",
          "tagline": "",
          "synopsis": [
              "Across thirty years, several almosts, and timing that is never quite right, two people keep crossing paths – always on the verge of being together, but never quite making it. But when life finally offers them one last chance to rewrite their story, will they finally make the one choice they have spent a lifetime avoiding?"
          ],
          "palette": [
              "#111111",
              "#333333",
              "#EEEEEE"
          ],
          "motif": "reel",
          "source": "smcinema",
          "poster": "https://smcine-digital-cdn.app.vista.co/media/entity/get/FilmPosterGraphic/HO00001652?width=600",
          "sourceUrl": "https://www.smcinema.com/films/Always-Yours-Never-Mine/HO00001652"
      },
      {
          "id": "avengers-endgame-encore",
          "title": "Avengers Endgame: Encore",
          "status": "now",
          "rating": "PG",
          "runtime": 183,
          "release": "2026-09-23",
          "genres": [
              "Action",
              "Adventure"
          ],
          "formats": [
              "standard",
              "grand",
              "wrap"
          ],
          "cast": [
              "Chris Evans",
              "Chris Hemsworth",
              "Mark Ruffalo",
              "Robert Downey Jr."
          ],
          "director": "",
          "tagline": "",
          "synopsis": [
              "After the devastating events of Avengers: Infinity War (2018), the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe."
          ],
          "palette": [
              "#111111",
              "#333333",
              "#EEEEEE"
          ],
          "motif": "reel",
          "source": "smcinema",
          "poster": "https://smcine-digital-cdn.app.vista.co/media/entity/get/FilmPosterGraphic/HO00001643?width=600",
          "sourceUrl": "https://www.smcinema.com/films/Avengers-Endgame-Encore/HO00001643"
      },
      {
          "id": "chiikawa-the-movie-the-secret-of-mermaid-island",
          "title": "Chiikawa the Movie: The Secret of Mermaid Island",
          "status": "now",
          "rating": "PG",
          "runtime": 99,
          "release": "2026-09-30",
          "genres": [
              "Anime"
          ],
          "formats": [
              "standard"
          ],
          "cast": [
              "Tsuguo Mogami",
              "Minori Suzuki",
              "Haruka Aoki"
          ],
          "director": "",
          "tagline": "",
          "synopsis": [
              "Chiikawa and friends suddenly find an invitation to a \"Special Island\" with promises of rewards and free food. Lured by its temptations, the group set sail for the island alongside Rakko, who remains suspicious of the brochure's claims."
          ],
          "palette": [
              "#111111",
              "#333333",
              "#EEEEEE"
          ],
          "motif": "reel",
          "source": "smcinema",
          "poster": "https://smcine-digital-cdn.app.vista.co/media/entity/get/FilmPosterGraphic/HO00001658?width=600",
          "sourceUrl": "https://www.smcinema.com/films/Chiikawa-the-Movie-The-Secret-of-Mermaid-Island/HO00001658"
      },
      {
          "id": "digger",
          "title": "Digger",
          "status": "now",
          "rating": "R-13",
          "runtime": 131,
          "release": "2026-10-02",
          "genres": [
              "Comedy"
          ],
          "formats": [
              "standard"
          ],
          "cast": [
              "Tom Cruise",
              "John Goodman",
              "Riz Ahmed"
          ],
          "director": "",
          "tagline": "",
          "synopsis": [
              "The most powerful man in the world embarks on a frantic mission to prove he is humanity's savior before the disaster he's unleashed destroys everything."
          ],
          "palette": [
              "#111111",
              "#333333",
              "#EEEEEE"
          ],
          "motif": "reel",
          "source": "smcinema",
          "poster": "https://smcine-digital-cdn.app.vista.co/media/entity/get/FilmPosterGraphic/HO00001610?width=600",
          "sourceUrl": "https://www.smcinema.com/films/Digger/HO00001610"
      },
      {
          "id": "forgotten-island",
          "title": "Forgotten Island",
          "status": "now",
          "rating": "PG",
          "runtime": 109,
          "release": "2026-09-19",
          "genres": [
              "Animation"
          ],
          "formats": [
              "standard",
              "grand"
          ],
          "cast": [
              "Dolly De Leon",
              "Liza Soberano",
              "Dave Franco",
              "Lea Salonga"
          ],
          "director": "",
          "tagline": "",
          "synopsis": [
              "Two best friends become stranded on the mystical world of Nakali, where their only escape might cost them their shared lifetime of memories."
          ],
          "palette": [
              "#111111",
              "#333333",
              "#EEEEEE"
          ],
          "motif": "reel",
          "source": "smcinema",
          "poster": "https://smcine-digital-cdn.app.vista.co/media/entity/get/FilmPosterGraphic/HO00001606?width=600",
          "sourceUrl": "https://www.smcinema.com/films/Forgotten-Island/HO00001606"
      },
      {
          "id": "heart-of-the-beast",
          "title": "Heart of the Beast",
          "status": "now",
          "rating": "R-13",
          "runtime": 101,
          "release": "2026-09-19",
          "genres": [
              "Action"
          ],
          "formats": [
              "standard",
              "grand"
          ],
          "cast": [
              "Brad Pitt",
              "J.K. Simmons",
              "Anna Lambe"
          ],
          "director": "",
          "tagline": "",
          "synopsis": [
              "After a harrowing plane crash, a Special Forces officer and his combat dog find themselves stranded deep in the Alaskan wilderness. Together, they are forced into a brutal fight for survival against the elements."
          ],
          "palette": [
              "#111111",
              "#333333",
              "#EEEEEE"
          ],
          "motif": "reel",
          "source": "smcinema",
          "poster": "https://smcine-digital-cdn.app.vista.co/media/entity/get/FilmPosterGraphic/HO00001611?width=600",
          "sourceUrl": "https://www.smcinema.com/films/Heart-of-the-Beast/HO00001611"
      },
      {
          "id": "primetime",
          "title": "Primetime",
          "status": "now",
          "rating": "R-16",
          "runtime": 109,
          "release": "2026-09-30",
          "genres": [
              "Drama"
          ],
          "formats": [
              "standard",
              "salon"
          ],
          "cast": [
              "Robert Pattinson",
              "Merritt Wever",
              "Skyler Gisondo"
          ],
          "director": "",
          "tagline": "",
          "synopsis": [
              "In 2006, To Catch a Predator host Chris Hansen sets out to make television history."
          ],
          "palette": [
              "#111111",
              "#333333",
              "#EEEEEE"
          ],
          "motif": "reel",
          "source": "smcinema",
          "poster": "https://smcine-digital-cdn.app.vista.co/media/entity/get/FilmPosterGraphic/HO00001664?width=600",
          "sourceUrl": "https://www.smcinema.com/films/Primetime/HO00001664"
      },
      {
          "id": "resident-evil",
          "title": "Resident Evil",
          "status": "now",
          "rating": "R-16",
          "runtime": 96,
          "release": "2026-09-16",
          "genres": [
              "Horror"
          ],
          "formats": [
              "standard",
              "salon"
          ],
          "cast": [
              "Paul Walter Hauser",
              "Austin Abrams",
              "Zach Cherry"
          ],
          "director": "",
          "tagline": "",
          "synopsis": [
              "From the mind of visionary filmmaker Zach Cregger (Weapons, Barbarian) comes a thrilling — and terrifying — reinvention of the Resident Evil franchise. In an all-new story, Resident Evil follows Bryan, a medical courier who unwittingly finds himself in an action-packed, non-stop race for survival as one fateful, horrifying night collapses around him in chaos."
          ],
          "palette": [
              "#111111",
              "#333333",
              "#EEEEEE"
          ],
          "motif": "reel",
          "source": "smcinema",
          "poster": "https://smcine-digital-cdn.app.vista.co/media/entity/get/FilmPosterGraphic/HO00001626?width=600",
          "sourceUrl": "https://www.smcinema.com/films/Resident-Evil/HO00001626"
      },
      {
          "id": "verity",
          "title": "Verity",
          "status": "now",
          "rating": "R-16",
          "runtime": 117,
          "release": "2026-09-30",
          "genres": [
              "Thriller"
          ],
          "formats": [
              "standard",
              "salon"
          ],
          "cast": [
              "Josh Harnett",
              "Dakota Johnson",
              "Anne Hathaway"
          ],
          "director": "",
          "tagline": "",
          "synopsis": [
              "Lowen Ashleigh gets hired by Jeremy Crawford to ghostwrite novels for his bestselling author wife Verity, who's unable to finish after an accident. Lowen uncovers Verity's disturbing truths while residing at the Crawfords' home to work."
          ],
          "palette": [
              "#111111",
              "#333333",
              "#EEEEEE"
          ],
          "motif": "reel",
          "source": "smcinema",
          "poster": "https://smcine-digital-cdn.app.vista.co/media/entity/get/FilmPosterGraphic/HO00001628?width=600",
          "sourceUrl": "https://www.smcinema.com/films/Verity/HO00001628"
      }
  ];

  const fictionalFilms = [
    { id: "sa-dulo-ng-dagat", title: "Sa Dulo ng Dagat", status: "now", rating: "PG", runtime: 118, release: "2026-09-17", genres: ["Romance", "Drama"], formats: ["standard", "grand"], cast: ["Mara Villanueva", "Jerome Dizon", "Celeste Abad"], director: "Lia Trinidad", tagline: "Some tides only return once.", synopsis: ["A marine biologist returns to the fishing town she left at seventeen to close her late father's boatyard, and finds the boy who stayed behind now runs the only ferry out.", "Shot across one monsoon season in Quezon province, the film follows two people deciding whether home is a place or a person."], palette: ["#0F3A5F", "#F2A65A", "#F6EBDC"], motif: "sea" },
    { id: "lakbay-bituin", title: "Lakbay Bituin", status: "now", rating: "G", runtime: 96, release: "2026-09-24", genres: ["Animation", "Adventure"], formats: ["standard", "grand", "wrap"], cast: ["Voices of Ana Reyes", "Kiko Manalo", "Dolores Ong"], director: "Paolo Santiago", tagline: "Ten-year-old Tala builds a rocket out of a tricycle.", synopsis: ["When the town's last streetlight burns out, Tala decides the stars are simply too far away and sets out to bring one home, with her grandfather's tricycle, a kite, and a very reluctant goat.", "A hand-drawn animated adventure about distance, light, and the engineering of hope."], palette: ["#1B2550", "#F6C945", "#F28A2E"], motif: "rocket" },
    { id: "manila-static", title: "Manila Static", status: "now", rating: "R-16", runtime: 127, release: "2026-09-10", genres: ["Thriller"], formats: ["standard", "salon"], cast: ["Diego Alcantara", "Rhea Buenaventura", "Oscar Lim"], director: "Carlo Ventura", tagline: "Every frequency in the city is listening.", synopsis: ["A night-shift radio engineer intercepts a numbers broadcast that predicts a kidnapping three hours before it happens. Then another. The station's owner wants it quiet; the kidnappers want it quieter.", "A tight procedural set across one week of Metro Manila static."], palette: ["#121212", "#E8352B", "#D9D4C7"], motif: "wave" },
    { id: "harana-sa-hulyo", title: "Harana sa Hulyo", status: "now", rating: "PG", runtime: 109, release: "2026-09-03", genres: ["Musical", "Romantic Comedy"], formats: ["standard"], cast: ["Nico Salcedo", "Bea Marquez", "Tito Boy Ramos"], director: "Isabel Cruz", tagline: "He has one song. She has a very loud dog.", synopsis: ["A failed music student bets his band's last gig that he can serenade the barangay captain's daughter in the rain without getting arrested. The dog has other plans.", "An original musical with eleven songs in Tagalog and Bikol."], palette: ["#3B1F5E", "#F6EBDC", "#F2A65A"], motif: "guitar" },
    { id: "the-lantern-keeper", title: "The Lantern Keeper", status: "now", rating: "PG", runtime: 134, release: "2026-08-27", genres: ["Fantasy", "Adventure"], formats: ["standard", "grand", "wrap"], cast: ["Elijah Madrigal", "Sofia de Guzman", "Aurora Bautista"], director: "Rowan Tan", tagline: "Light the last parol or lose the island.", synopsis: ["On an island where the Christmas lanterns are the only thing holding back the dark, the keeper's apprentice loses the master lantern two nights before the longest night.", "A large-format fantasy built on Pampanga's giant-lantern craft, with practical lanterns twelve metres wide."], palette: ["#102A2E", "#F6C945", "#E8452C"], motif: "lantern" },
    { id: "barangay-dynamo", title: "Barangay Dynamo", status: "now", rating: "PG", runtime: 112, release: "2026-09-17", genres: ["Comedy", "Sports"], formats: ["standard"], cast: ["Bong Castillo", "Mika Serrano", "Lito Flores"], director: "Ren Aquino", tagline: "Five players. One hoop. No electricity.", synopsis: ["A brownout cancels the inter-barangay basketball finals, so a retired electrician wires the court to a jeepney alternator. The league commissioner is not impressed.", "A sports comedy about street courts, improvised power, and a town that refuses to forfeit."], palette: ["#F28A2E", "#1C1A1F", "#F6EBDC"], motif: "hoop" },
    { id: "night-market", title: "Night Market", status: "now", rating: "R-16", runtime: 101, release: "2026-09-24", genres: ["Horror"], formats: ["standard", "salon"], cast: ["Luna Esguerra", "Marco Villar"], director: "Teo Agbayani", tagline: "Everything is for sale after midnight.", synopsis: ["A food vlogger films the last stall of a Divisoria night market that only appears when the power is cut. The stall sells memories. Hers are selling fast.", "A slow-burn horror built from street lights, string bulbs, and a very long alley."], palette: ["#0B0B0E", "#E8352B", "#F6C945"], motif: "eye" },
    { id: "taal", title: "Taal", status: "now", rating: "R-13", runtime: 141, release: "2026-08-20", genres: ["Drama", "Disaster"], formats: ["standard", "grand"], cast: ["Carmen Lagdameo", "Rafael Ocampo", "Nina Gomez"], director: "Isabel Cruz", tagline: "Twelve hours before the lake boiled.", synopsis: ["Three families on Volcano Island argue about whether to evacuate while the seismologist who grew up among them tries to make a government listen.", "Shot on location around Taal Lake with a documentary crew's restraint."], palette: ["#2E1A14", "#E8452C", "#8E8A82"], motif: "volcano" },
    { id: "kuya-robot", title: "Kuya Robot", status: "now", rating: "G", runtime: 93, release: "2026-09-10", genres: ["Family", "Science Fiction"], formats: ["standard", "grand"], cast: ["Zach Ibarra", "Pia Santos", "Voice of Jun Palomar"], director: "Paolo Santiago", tagline: "He was built to fix air-cons. He fixed a family.", synopsis: ["An eight-year-old inherits a repair robot from her uncle's shop and discovers it was programmed with every lullaby he ever sang.", "A family film about care, circuitry, and what gets handed down."], palette: ["#1F6F63", "#F6EBDC", "#F28A2E"], motif: "robot" },
    { id: "ang-huling-jeepney", title: "Ang Huling Jeepney", status: "now", rating: "PG", runtime: 122, release: "2026-09-03", genres: ["Drama"], formats: ["standard"], cast: ["Manuel Reyes", "Ligaya Torres", "Dindo Pascual"], director: "Lia Trinidad", tagline: "One route. Forty years. Last trip.", synopsis: ["On the final day before his route is phased out, a Cubao–Quiapo driver takes his regular passengers on one more loop and refuses to stop until the city says goodbye properly.", "A love letter to the chrome, the stickers, and the people who sat behind the driver."], palette: ["#D8302B", "#1B4FA6", "#F2C230"], motif: "jeepney" },
    { id: "tidewater", title: "Tidewater", status: "now", rating: "R-13", runtime: 131, release: "2026-09-17", genres: ["Action", "Adventure"], formats: ["standard", "grand", "wrap", "salon"], cast: ["Ava Sinclair", "Dante Mercado", "Hugo Lindqvist"], director: "Mia Halvorsen", tagline: "The ocean keeps what it takes.", synopsis: ["A salvage crew racing a typhoon to a sunken freighter in the Sulu Sea discovers the cargo is still alive.", "An international action feature shot largely at sea, presented in large format and wraparound."], palette: ["#06283D", "#1F6F63", "#F6EBDC"], motif: "wavebig" },
    { id: "sampaguita-sessions", title: "Sampaguita Sessions", status: "now", rating: "G", runtime: 88, release: "2026-09-26", genres: ["Concert Film", "Music"], formats: ["standard", "grand"], cast: ["Featuring twelve OPM artists"], director: "Various", tagline: "One stage. One night. Twelve voices.", synopsis: ["A single-night concert filmed in an open-air amphitheatre in Tagaytay, cut as one continuous set from sunset to the last encore.", "Mixed in immersive audio for the Grand and Salon screens."], palette: ["#F6EBDC", "#1C1A1F", "#1F6F63"], motif: "flower" },
    { id: "escolta-1951", title: "Escolta 1951", status: "soon", rating: "PG", runtime: 126, release: "2026-10-15", genres: ["Romance", "Period"], formats: ["standard", "grand"], cast: ["Mara Villanueva", "Diego Alcantara"], director: "Rowan Tan", tagline: "The street that lit up Manila.", synopsis: ["A theater usherette and a sign painter fall in love under the marquees of post-war Escolta, as the neon goes up and the old city comes down.", "A period romance built around the cinemas of Rizal Avenue."], palette: ["#E58C74", "#1F6F63", "#B8893A"], motif: "deco" },
    { id: "pasig-noir", title: "Pasig Noir", status: "soon", rating: "R-16", runtime: 115, release: "2026-10-22", genres: ["Crime", "Mystery"], formats: ["standard", "salon"], cast: ["Rhea Buenaventura", "Oscar Lim"], director: "Carlo Ventura", tagline: "The river remembers every bridge.", synopsis: ["A river-ferry conductor finds a briefcase under the Jones Bridge and spends one rainy week learning why three people want it back.", "A black-and-white crime mystery along the Pasig."], palette: ["#1C1A1F", "#8E8A82", "#F6EBDC"], motif: "bridge" },
    { id: "habagat", title: "Habagat", status: "soon", rating: "R-13", runtime: 108, release: "2026-10-29", genres: ["Survival", "Drama"], formats: ["standard", "grand"], cast: ["Rafael Ocampo", "Nina Gomez"], director: "Teo Agbayani", tagline: "Seventy-two hours of rain.", synopsis: ["Two strangers trapped on the roof of a flooded Marikina warehouse wait out the longest southwest monsoon on record.", "A two-hander survival drama."], palette: ["#2F4858", "#1F6F63", "#F6EBDC"], motif: "rain" },
    { id: "carnival-of-ghosts", title: "Carnival of Ghosts", status: "soon", rating: "PG", runtime: 99, release: "2026-11-05", genres: ["Animation", "Fantasy"], formats: ["standard", "grand", "wrap"], cast: ["Voices of Kiko Manalo", "Ana Reyes"], director: "Paolo Santiago", tagline: "Every ride remembers who rode it.", synopsis: ["A perya closes for the season and its rides come alive to search for the one child who never got her turn on the ferris wheel.", "An animated fantasy set in the travelling carnivals of the provinces."], palette: ["#3B1F5E", "#F6C945", "#E8352B"], motif: "ferris" },
    { id: "the-second-screening", title: "The Second Screening", status: "soon", rating: "PG", runtime: 119, release: "2026-11-12", genres: ["Mystery"], formats: ["standard"], cast: ["Celeste Abad", "Jerome Dizon"], director: "Mia Halvorsen", tagline: "The reel changed. Nobody left.", synopsis: ["A projectionist notices the second screening of a film is three minutes longer than the first. The extra scene shows her booth.", "A mystery set inside a single-screen provincial cinema."], palette: ["#1C1A1F", "#B8893A", "#F6EBDC"], motif: "reel" },
    { id: "bayanihan", title: "Bayanihan", status: "soon", rating: "G", runtime: 104, release: "2026-11-19", genres: ["Comedy", "Ensemble"], formats: ["standard", "grand"], cast: ["Bong Castillo", "Ligaya Torres", "Tito Boy Ramos"], director: "Ren Aquino", tagline: "They moved the house. They forgot the lola.", synopsis: ["An entire barangay volunteers to carry a nipa hut across town for a wedding, and discovers halfway there that grandmother is still inside, asleep, and not pleased.", "An ensemble comedy about carrying things together."], palette: ["#F2C230", "#1F6F63", "#1C1A1F"], motif: "house" },
    { id: "signal-no-5", title: "Signal No. 5", status: "soon", rating: "R-13", runtime: 123, release: "2026-11-26", genres: ["Thriller", "Disaster"], formats: ["standard", "grand", "wrap", "salon"], cast: ["Dante Mercado", "Carmen Lagdameo"], director: "Carlo Ventura", tagline: "There is no higher number.", synopsis: ["A weather bureau forecaster realises the storm model is wrong by one category and has six hours to convince a city already asleep.", "A large-format thriller about the night the signals ran out."], palette: ["#06283D", "#E8352B", "#F6EBDC"], motif: "spiral" },
    { id: "luzviminda", title: "Luzviminda", status: "soon", rating: "PG", runtime: 138, release: "2026-12-03", genres: ["Anthology", "Drama"], formats: ["standard", "grand"], cast: ["Ensemble cast"], director: "Lia Trinidad, Isabel Cruz, Teo Agbayani", tagline: "Three islands. Three directors. One night.", synopsis: ["Three stories set on the same night in Luzon, Visayas and Mindanao, each by a different director, each ending at the same sunrise.", "An anthology for the holiday season."], palette: ["#1F6F63", "#E58C74", "#F6C945"], motif: "islands" }
  ];

  const films = realFilms.concat(fictionalFilms);

  const cinemas = [
    { id: "cubao", name: "Taracine Cubao", city: "Quezon City", region: "Metro Manila", address: "Araneta City, General Roxas Ave, Cubao", formats: ["standard", "grand", "wrap", "salon"], screens: 10 },
    { id: "ortigas", name: "Taracine Ortigas", city: "Pasig", region: "Metro Manila", address: "Ortigas Center, Emerald Ave corner Garnet Rd", formats: ["standard", "grand", "salon"], screens: 8 },
    { id: "bgc", name: "Taracine High Street", city: "Taguig", region: "Metro Manila", address: "Bonifacio High Street, 9th Ave, BGC", formats: ["standard", "grand", "wrap", "salon"], screens: 9 },
    { id: "alabang", name: "Taracine Alabang", city: "Muntinlupa", region: "Metro Manila", address: "Alabang Town Center, Alabang-Zapote Rd", formats: ["standard", "grand"], screens: 6 },
    { id: "quezon-ave", name: "Taracine Quezon Avenue", city: "Quezon City", region: "Metro Manila", address: "Quezon Ave corner Scout Borromeo", formats: ["standard", "salon"], screens: 6 },
    { id: "cebu", name: "Taracine Cebu IT Park", city: "Cebu City", region: "Visayas", address: "Cebu IT Park, Lahug", formats: ["standard", "grand", "wrap"], screens: 8 },
    { id: "davao", name: "Taracine Lanang", city: "Davao City", region: "Mindanao", address: "J.P. Laurel Ave, Lanang", formats: ["standard", "grand"], screens: 6 },
    { id: "baguio", name: "Taracine Session Road", city: "Baguio", region: "Luzon", address: "Session Rd corner Calderon St", formats: ["standard"], screens: 4 },
    { id: "iloilo", name: "Taracine Esplanade", city: "Iloilo City", region: "Visayas", address: "Diversion Rd, Mandurriao", formats: ["standard", "grand"], screens: 6 },
    { id: "clark", name: "Taracine Clark", city: "Pampanga", region: "Luzon", address: "M.A. Roxas Highway, Clark Freeport", formats: ["standard", "grand", "wrap"], screens: 7 }
  ];

  const ratingDescriptions = {
    "G": "General Patronage. Suitable for all ages.",
    "PG": "Parental Guidance. Viewers below 13 must be accompanied by a parent or adult.",
    "R-13": "Restricted 13. Only viewers 13 and above may be admitted.",
    "R-16": "Restricted 16. Only viewers 16 and above may be admitted.",
    "R-18": "Restricted 18. Only viewers 18 and above may be admitted."
  };

  // deterministic pseudo-random from a string
  function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let s = seed || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

  // Showtimes for a film at a cinema on a date (YYYY-MM-DD). Returns [{format, times:[{h,m,seats}]}]
  function sessions(filmId, cinemaId, dateStr) {
    const film = films.find(f => f.id === filmId); const cinema = cinemas.find(c => c.id === cinemaId);
    if (!film || !cinema) return [];
    const common = film.formats.filter(f => cinema.formats.includes(f));
    const r = rng(hash(filmId + cinemaId + dateStr));
    const out = [];
    common.forEach(fid => {
      const n = fid === "standard" ? 4 + Math.floor(r() * 3) : 2 + Math.floor(r() * 2);
      let start = 10 * 60 + Math.floor(r() * 4) * 15 + (fid === "salon" ? 60 : 0);
      const gap = film.runtime + 20 + Math.floor(r() * 3) * 5;
      const times = [];
      for (let i = 0; i < n; i++) {
        const t = start + i * gap; if (t > 23 * 60) break;
        times.push({ h: Math.floor(t / 60), m: Math.round((t % 60) / 5) * 5 % 60, seats: Math.floor(r() * 120) + (fid === "salon" ? 2 : 6) });
      }
      out.push({ format: fid, times });
    });
    return out;
  }

  /* Course reference (IPT): Asynchronous JavaScript — Promises, async/await, fetch, try...catch.
     Accounts are real calls to dummyjson.com (a public demo API with ~200 sample users, e.g. emilys / emilyspass).
     Nothing here is a real Taracine account: DummyJSON does not persist new users, so "Create account" returns the
     record it would have created and the page signs you in with it for this browser only. */
  const API = "https://dummyjson.com";
  async function loginUser(usernameOrEmail, password) {
    let username = usernameOrEmail.trim();
    if (username.includes("@")) {
      // DummyJSON logs in by username, so an email is looked up first
      const r = await fetch(`${API}/users/filter?key=email&value=${encodeURIComponent(username)}&select=username`);
      const data = await r.json();
      if (!data.users || !data.users.length) throw new Error("No account uses that email. Try a DummyJSON user such as emilys / emilyspass, or create an account.");
      username = data.users[0].username;
    }
    const r = await fetch(`${API}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password, expiresInMins: 60 }) });
    const data = await r.json();
    if (!r.ok) throw new Error(data.message === "Invalid credentials" ? "That username or password is not correct." : (data.message || "Could not sign in."));
    return { id: data.id, username: data.username, name: data.firstName, lastName: data.lastName, email: data.email, image: data.image, token: data.accessToken, source: "dummyjson" };
  }
  async function registerUser({ firstName, lastName, email, password }) {
    const username = (firstName + lastName).toLowerCase().replace(/[^a-z0-9]/g, "") || email.split("@")[0];
    const r = await fetch(`${API}/users/add`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ firstName, lastName, email, username, password }) });
    const data = await r.json();
    if (!r.ok) throw new Error(data.message || "Could not create the account.");
    return { id: data.id, username: data.username, name: data.firstName, lastName: data.lastName, email: data.email, image: "", token: null, source: "dummyjson-new" };
  }
  // The seat hold and the payment are simulated with a Promise and a timer, as in the lesson's login example.
  function holdSeats(seats) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!seats.length) reject("Pick at least one seat.");
        else resolve({ seats: [...seats], minutes: 10 });
      }, 1200);
    });
  }
  function payBooking(booking, method) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (method !== "bypass") reject(`${method} is not wired in this study. Choose "Bypass (demo)" to see the receipt.`);
        else resolve({ ...booking, ref: makeRef(booking), paidAt: new Date().toISOString(), method: "Bypass (demo)" });
      }, 1300);
    });
  }
  function makeRef(b) { const h = hash(JSON.stringify([b.filmId, b.cinemaId, b.date, b.time, b.seats, Date.now()])); return "TRC-" + h.toString(36).toUpperCase().slice(0, 6).padStart(6, "0"); }

  // bookings and the signed-in user live in this browser only
  const store = {
    user() { try { return JSON.parse(localStorage.getItem("taracine.user") || sessionStorage.getItem("taracine.user") || "null"); } catch (e) { return null; } },
    setUser(u, remember) { try { (remember ? localStorage : sessionStorage).setItem("taracine.user", JSON.stringify(u)); (remember ? sessionStorage : localStorage).removeItem("taracine.user"); } catch (e) {} },
    clearUser() { try { localStorage.removeItem("taracine.user"); sessionStorage.removeItem("taracine.user"); } catch (e) {} },
    bookings() { try { return JSON.parse(localStorage.getItem("taracine.bookings") || "[]"); } catch (e) { return []; } },
    addBooking(b) { const all = store.bookings(); all.unshift(b); try { localStorage.setItem("taracine.bookings", JSON.stringify(all)); } catch (e) {} },
    removeBooking(ref) { try { localStorage.setItem("taracine.bookings", JSON.stringify(store.bookings().filter(b => b.ref !== ref))); } catch (e) {} },
    pending() { try { return JSON.parse(sessionStorage.getItem("taracine.pending") || "null"); } catch (e) { return null; } },
    setPending(p) { try { if (p) sessionStorage.setItem("taracine.pending", JSON.stringify(p)); else sessionStorage.removeItem("taracine.pending"); } catch (e) {} }
  };

  function fmtTime(h, m) { const hh = ((h + 11) % 12) + 1; return `${hh}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`; }
  function pad(n) { return String(n).padStart(2, "0"); }
  function isoDate(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
  function peso(n) { return "₱" + n.toLocaleString("en-PH"); }

  return { Screen, screens, films, formats, cinemas, ratingDescriptions, sessions, loginUser, registerUser, holdSeats, payBooking, makeRef, store, fmtTime, isoDate, peso, hash };
})();
