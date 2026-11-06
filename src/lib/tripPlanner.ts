export type TripType = "leisure" | "business" | "bleisure";
export type DestinationId = "mauritius" | "zanzibar" | "seychelles" | "maldives" | "europe";
export type DestinationChoice = DestinationId | "surprise";
export type Travellers = "solo" | "couple" | "family" | "group";
export type Nights = 3 | 7 | 10;
export type Tier = "comfort" | "premium" | "luxury";

export type PlannerAnswers = {
  tripType: TripType;
  destination: DestinationChoice;
  travellers: Travellers;
  nights: Nights;
  tier: Tier;
};

export type Option<T> = { value: T; label: string; hint: string };

export type Question = {
  [K in keyof PlannerAnswers]: {
    id: K;
    title: string;
    options: Option<PlannerAnswers[K]>[];
  };
}[keyof PlannerAnswers];

export const QUESTIONS: Question[] = [
  {
    id: "tripType",
    title: "What kind of trip is this?",
    options: [
      { value: "leisure", label: "Pure leisure", hint: "Switch off completely" },
      { value: "business", label: "Business", hint: "Meetings, conferences, retreats" },
      { value: "bleisure", label: "Bleisure", hint: "Work first, then play" },
    ],
  },
  {
    id: "destination",
    title: "Where are you dreaming of?",
    options: [
      { value: "mauritius", label: "Mauritius", hint: "Lagoon, resort, a calm week" },
      { value: "zanzibar", label: "Zanzibar", hint: "Stone Town, dhows, spice and sand" },
      { value: "seychelles", label: "Seychelles", hint: "Granite boulders and quiet coves" },
      { value: "maldives", label: "Maldives", hint: "A reef, a villa, very little else" },
      { value: "europe", label: "Europe", hint: "Cities, lakes and a slower countryside" },
      { value: "surprise", label: "Surprise me", hint: "We'll pick the best fit" },
    ],
  },
  {
    id: "travellers",
    title: "Who's travelling?",
    options: [
      { value: "solo", label: "Just me", hint: "Solo traveller" },
      { value: "couple", label: "Two of us", hint: "Partner or friend" },
      { value: "family", label: "Family", hint: "Kids included" },
      { value: "group", label: "A group or team", hint: "8 or more people" },
    ],
  },
  {
    id: "nights",
    title: "How long can you get away?",
    options: [
      { value: 3, label: "Long weekend", hint: "3 nights" },
      { value: 7, label: "One week", hint: "7 nights" },
      { value: 10, label: "Ten nights", hint: "The full reset" },
    ],
  },
  {
    id: "tier",
    title: "How do you like to stay?",
    options: [
      { value: "comfort", label: "Comfort", hint: "Quality 4★ stays" },
      { value: "premium", label: "Premium", hint: "5★ resorts and lodges" },
      { value: "luxury", label: "Ultra luxury", hint: "Villas and iconic properties" },
    ],
  },
];

type Day = { title: string; detail: string };

type DestinationData = {
  name: string;
  region: string;
  tagline: string;
  images: { src: string; alt: string }[];
  /** Per person sharing, per night, by tier. Starting figures until the office replaces them. */
  nightlyRate: Record<Tier, number>;
  /** Per person: return flights or transfers from Johannesburg. */
  transportCost: number;
  transportLabel: string;
  arrival: Day;
  departure: Day;
  pool: Day[];
  evenings: string[];
  extras: Record<Travellers, Day>;
};

export const DESTINATIONS: Record<DestinationId, DestinationData> = {
  mauritius: {
    name: "Mauritius",
    region: "Indian Ocean",
    tagline: "Turquoise lagoons, barefoot luxury and slow island days.",
    images: [
      { src: "/images/destinations/mauritius-lagoon.jpg", alt: "Aerial view of Le Morne Brabant and the turquoise lagoon in Mauritius" },
      { src: "/images/leisure-pool.jpg", alt: "A palm tree over an infinity pool at sunset" },
      { src: "/images/destinations/indian-ocean.jpg", alt: "Tropical beach at golden hour" },
    ],
    nightlyRate: { comfort: 3400, premium: 5400, luxury: 9800 },
    transportCost: 9500,
    transportLabel: "Return flights ex JNB",
    arrival: {
      title: "Arrive and exhale",
      detail:
        "A direct flight of about five hours from Johannesburg, then the resort transfer. Welcome drink, feet in the sand by sunset.",
    },
    departure: {
      title: "One last swim",
      detail: "Late checkout, a final dip in the lagoon and a private transfer to the airport.",
    },
    pool: [
      {
        title: "Lagoon day",
        detail: "Catamaran cruise to Île aux Cerfs with snorkelling and a barbecue lunch on board.",
      },
      {
        title: "South coast road trip",
        detail: "Chamarel's Seven Coloured Earth, the Chamarel waterfall and a rum distillery tasting.",
      },
      {
        title: "Resort reset",
        detail: "Nothing on the agenda: spa treatment, pool time and sundowners on the beach.",
      },
      {
        title: "Dolphins at dawn",
        detail: "An early boat out of Tamarin Bay to swim with dolphins, then brunch on the west coast.",
      },
      {
        title: "Le Morne",
        detail: "Sunrise hike up Le Morne Brabant, or a kitesurfing lesson in the famous lagoon.",
      },
      {
        title: "Port Louis flavours",
        detail: "Street food at the Central Market, then the Caudan Waterfront for shopping and dinner.",
      },
      {
        title: "Black River Gorges",
        detail: "Guided rainforest hike to viewpoints over the gorges and Alexandra Falls.",
      },
    ],
    evenings: [
      "seafood dinner on the beach",
      "cocktails and live music in Grand Baie",
      "sunset cruise along the coast",
      "chef's table at the resort",
    ],
    extras: {
      solo: {
        title: "Sail and snorkel",
        detail: "Join a small group sailing trip to the northern islets. Easy company, no planning.",
      },
      couple: {
        title: "Dinner for two",
        detail: "A private candlelit dinner set up on the beach, with your own chef and waiter.",
      },
      family: {
        title: "Wild day out",
        detail: "Casela Nature Park for a safari drive, ziplines and giraffe feeding.",
      },
      group: {
        title: "Private catamaran",
        detail: "Charter a catamaran for the whole group, with lunch, drinks and a snorkel stop.",
      },
    },
  },
  zanzibar: {
    name: "Zanzibar",
    region: "Indian Ocean",
    tagline: "Stone Town lanes, a spice farm, and a dhow at the end of the day.",
    images: [
      { src: "/images/destinations/zanzibar-dhow.jpg", alt: "A traditional dhow with a white sail on clear water in Zanzibar" },
      { src: "/images/places/stone-town.jpg", alt: "A narrow lane in Stone Town, Zanzibar" },
      { src: "/images/places/dhow-sunset-u.jpg", alt: "A dhow at sunset off Zanzibar" },
    ],
    nightlyRate: { comfort: 2800, premium: 4600, luxury: 8200 },
    transportCost: 8500,
    transportLabel: "Return flights ex JNB",
    arrival: {
      title: "Into Stone Town",
      detail:
        "Usually one stop from Johannesburg into Abeid Amani Karume airport. A short transfer, then the carved doors and the sea air.",
    },
    departure: {
      title: "A last swim",
      detail: "Morning on the beach, then the transfer back for the flight home.",
    },
    pool: [
      {
        title: "Stone Town",
        detail: "The old town on foot: the House of Wonders quarter, a coffee, and the night market when the heat drops.",
      },
      {
        title: "Spice farm",
        detail: "Vanilla, nutmeg and cloves on a farm inland. You leave knowing what the island actually grows.",
      },
      {
        title: "Prison Island",
        detail: "A boat to the giant tortoises, and a swim off the boat on the way back.",
      },
      {
        title: "Nungwi",
        detail: "The north coast beach. Swim, lunch, and nothing else on the card.",
      },
      {
        title: "Jozani",
        detail: "The red colobus in Jozani forest, then back to the coast before the afternoon is gone.",
      },
      {
        title: "Dhow sunset",
        detail: "A traditional sail as the light goes, which is the picture most people came for.",
      },
      {
        title: "Resort day",
        detail: "Leave the day open. The tide and the heat decide it better than a timetable.",
      },
    ],
    evenings: [
      "seafood at the night market in Stone Town",
      "dinner on the beach",
      "sundowners after the dhow",
      "a quiet meal at the hotel",
    ],
    extras: {
      solo: {
        title: "Stone Town with a guide",
        detail: "A morning walk with someone who knows the lanes, then the afternoon is yours.",
      },
      couple: {
        title: "Dinner on the sand",
        detail: "A table set on the beach for two once the day boats have gone.",
      },
      family: {
        title: "Tortoises and a sandbar",
        detail: "Prison Island in the morning, and a shallow swim the children can stand up in.",
      },
      group: {
        title: "A private dhow",
        detail: "The boat for your group, with lunch on board and a snorkel stop.",
      },
    },
  },
  seychelles: {
    name: "Seychelles",
    region: "Indian Ocean",
    tagline: "Granite boulders, powder sand, and islands that take a boat to reach.",
    images: [
      { src: "/images/destinations/seychelles-digue.jpg", alt: "Granite boulders and clear water at Anse Source d'Argent, La Digue" },
      { src: "/images/places/anse-lazio-u.jpg", alt: "A pale beach and granite boulders on Praslin" },
      { src: "/images/places/vallee-de-mai-u.jpg", alt: "Large coconuts hanging from a palm in the Seychelles" },
    ],
    nightlyRate: { comfort: 4200, premium: 6800, luxury: 12000 },
    transportCost: 14000,
    transportLabel: "Return flights ex JNB",
    arrival: {
      title: "Land on Mahé",
      detail:
        "Direct when the schedule allows, about six hours, or one stop. The ferry or island flight is booked with the international ticket.",
    },
    departure: {
      title: "Back to Mahé",
      detail: "The inter island hop in the morning, then the flight home. We do not leave that connection tight.",
    },
    pool: [
      {
        title: "Anse Source d'Argent",
        detail: "La Digue, early, before the day boats. The boulders and the water are the reason for this island.",
      },
      {
        title: "Anse Lazio",
        detail: "The north beach on Praslin. Go in the morning and leave when the sand fills up.",
      },
      {
        title: "Vallée de Mai",
        detail: "The coco de mer forest on Praslin. A shaded walk when you want a day off the beach.",
      },
      {
        title: "Beau Vallon",
        detail: "Mahé's easy swimming beach, with Victoria close enough for the market afterwards.",
      },
      {
        title: "Victoria market",
        detail: "Fish, fruit and spice in the morning, then out of town before the heat.",
      },
      {
        title: "Mahé hills",
        detail: "A drive over the island for the view of coves you do not have time to swim in.",
      },
      {
        title: "Nothing booked",
        detail: "A cove, a book, and lunch wherever you are staying. Seychelles is better with space in it.",
      },
    ],
    evenings: [
      "dinner at the lodge as the boulders go dark",
      "a quiet grill on Mahé",
      "sundowners on Praslin",
      "a table facing the water on La Digue",
    ],
    extras: {
      solo: {
        title: "A guided cove walk",
        detail: "Someone who knows which beach is worth the path, and which one is only famous.",
      },
      couple: {
        title: "A boat for two",
        detail: "A skippered boat to a cove that the ferry does not serve, and back before dark.",
      },
      family: {
        title: "Shallow water day",
        detail: "A beach with a gentle entry, and the forest walk kept short enough for children.",
      },
      group: {
        title: "Charter between islands",
        detail: "One boat for the group, so the ferry timetable is not running the holiday.",
      },
    },
  },
  maldives: {
    name: "Maldives",
    region: "Indian Ocean",
    tagline: "A house reef, a sandbank, and a villa with the lagoon at the door.",
    images: [
      { src: "/images/destinations/maldives-card.jpg", alt: "Overwater villas and the reef in the Maldives" },
      { src: "/images/places/sandbank-u.jpg", alt: "A white sandbank in a turquoise Maldives lagoon" },
      { src: "/images/places/manta-u.jpg", alt: "A manta ray with divers in the Maldives" },
    ],
    nightlyRate: { comfort: 5500, premium: 9000, luxury: 16000 },
    transportCost: 18000,
    transportLabel: "Return flights ex JNB",
    arrival: {
      title: "Through Malé",
      detail:
        "One stop is the normal route, into Velana. Seaplanes stop at dark, so the arrival time decides whether you reach the island tonight or sleep in Malé.",
    },
    departure: {
      title: "Off the island",
      detail: "The speedboat or seaplane back to Malé, timed so the international flight is not a sprint.",
    },
    pool: [
      {
        title: "House reef",
        detail: "Masks on and off the beach. The reef in front of the villa is the day.",
      },
      {
        title: "Sandbank",
        detail: "A boat to a bank of sand in the lagoon, with lunch and the ride back before the light goes.",
      },
      {
        title: "Baa Atoll",
        detail: "When the season is right, a boat to see mantas. We only put this on the plan if the dates allow it.",
      },
      {
        title: "Overwater day",
        detail: "Stay on the deck. The water under the villa is the activity.",
      },
      {
        title: "A local island",
        detail: "Maafushi or a similar inhabited island, for a few hours that are not another resort.",
      },
      {
        title: "Malé",
        detail: "Only if the flight times leave you there. The harbour and the fish market, then on to the island.",
      },
      {
        title: "Unplanned water",
        detail: "A free day on the reef. The best Maldives days are the ones with nothing written down.",
      },
    ],
    evenings: [
      "dinner over the water",
      "a sandbank supper at sunset",
      "the resort cinema or a quiet bar",
      "a table on the beach",
    ],
    extras: {
      solo: {
        title: "A guided snorkel",
        detail: "A house reef guide for the first morning, so the rest of the week you know the entry.",
      },
      couple: {
        title: "Dinner on the deck",
        detail: "A private table on the villa deck, which is the Maldives version of going out.",
      },
      family: {
        title: "Reef at standing depth",
        detail: "A lagoon shallow enough for children, and a sandbank picnic rather than a long dive boat.",
      },
      group: {
        title: "A boat for the group",
        detail: "One charter for the sandbank day, instead of joining a mixed boat.",
      },
    },
  },
  europe: {
    name: "Europe",
    region: "Europe",
    tagline: "A city to arrive into, a lake or a village, and days that are not a coach tour.",
    images: [
      { src: "/images/destinations/europe-sharp.jpg", alt: "Hallstatt church and its reflection in the lake, Austria" },
      { src: "/images/places/rome-u.jpg", alt: "The Roman Forum in Rome" },
      { src: "/images/places/alps-u.jpg", alt: "Lake Como and the mountains behind it" },
    ],
    nightlyRate: { comfort: 2200, premium: 3800, luxury: 7200 },
    transportCost: 14000,
    transportLabel: "Return flights ex JNB",
    arrival: {
      title: "Land in the right city",
      detail:
        "Direct or one stop into the hub you will actually start from. London, Amsterdam, Paris, Frankfurt, Zurich or Rome, chosen for the route, not the cheapest fare into the wrong side of the map.",
    },
    departure: {
      title: "Homeward",
      detail: "A last morning in the city you fly from, with the hotel close enough that the transfer is simple.",
    },
    pool: [
      {
        title: "The first city",
        detail: "One neighbourhood properly, rather than a list of landmarks. Walk, lunch, and one thing worth queuing for.",
      },
      {
        title: "A lake or a village",
        detail: "Hallstatt, Lake Como or a town like Colmar. One base, not three countries in a day.",
      },
      {
        title: "Rome, if it is on the route",
        detail: "The Forum and the centre on foot. We do not add it unless the flights already put you there.",
      },
      {
        title: "A match or a race",
        detail: "When the trip is for a fixture, the hotel is near the ground and the flights sit around the kickoff.",
      },
      {
        title: "Christmas market",
        detail: "Only in season. A city that does it properly, with the hotel in walking distance of the square.",
      },
      {
        title: "A free day",
        detail: "Museums or nothing. Europe is better when one day has no booking on it.",
      },
      {
        title: "Train to the next place",
        detail: "A daytime train we have already chosen, with the seats and the hotel at the other end arranged.",
      },
    ],
    evenings: [
      "dinner in the neighbourhood you are staying in",
      "a table with a view of the lake",
      "an early night before a train",
      "the square after the market closes",
    ],
    extras: {
      solo: {
        title: "A walking tour that ends",
        detail: "A short guided walk on the first morning, then you are on your own with a proper map of the meals.",
      },
      couple: {
        title: "One booked table",
        detail: "A dinner we reserve before you fly, and the other evenings left open.",
      },
      family: {
        title: "A pace children can keep",
        detail: "Shorter walks, a park or a lake swim in season, and hotels that can put you in one place.",
      },
      group: {
        title: "One coach, one plan",
        detail: "Private transport for the group between the city and the countryside day, with dinner reserved together.",
      },
    },
  },
};

export type Itinerary = {
  destinationId: DestinationId;
  destination: DestinationData;
  recommended: boolean;
  days: Day[];
  includes: string[];
  priceLow: number;
  priceHigh: number;
  priceNote: string;
};

const TIER_STAY: Record<Tier, string> = {
  comfort: "Quality 4★ accommodation",
  premium: "5★ resort or lodge",
  luxury: "Villa or iconic 5★ property",
};

export type DestinationRates = {
  nightlyRate: Record<Tier, number>;
  transportCost: number;
};

export type RateTable = Record<DestinationId, DestinationRates>;

export const DESTINATION_IDS: DestinationId[] = [
  "mauritius",
  "zanzibar",
  "seychelles",
  "maldives",
  "europe",
];

export function defaultRateTable(): RateTable {
  return DESTINATION_IDS.reduce((table, id) => {
    const dest = DESTINATIONS[id];
    table[id] = {
      nightlyRate: { ...dest.nightlyRate },
      transportCost: dest.transportCost,
    };
    return table;
  }, {} as RateTable);
}

function pickDestination(answers: PlannerAnswers): DestinationId {
  if (answers.destination !== "surprise") return answers.destination;
  if (answers.tripType === "business") return "europe";
  return answers.nights >= 7 ? "mauritius" : "zanzibar";
}

function roundTo(value: number, step: number) {
  return Math.round(value / step) * step;
}

export function buildItinerary(answers: PlannerAnswers, rates: RateTable = defaultRateTable()): Itinerary {
  const destinationId = pickDestination(answers);
  const dest = DESTINATIONS[destinationId];
  const quote = rates[destinationId] ?? defaultRateTable()[destinationId];
  const middleDays = answers.nights - 1;

  const workDays =
    answers.tripType === "business"
      ? Math.max(1, Math.ceil(middleDays * 0.6))
      : answers.tripType === "bleisure"
        ? Math.min(2, middleDays - 1)
        : 0;

  const work: Day[] = Array.from({ length: workDays }, (_, i) => ({
    title: answers.travellers === "group" ? "Team sessions" : "Meetings and sessions",
    detail: `Venue, transport and AV handled for you. Evening: ${
      dest.evenings[i % dest.evenings.length]
    }.`,
  }));

  const leisure = [...dest.pool];
  leisure.splice(1, 0, dest.extras[answers.travellers]);

  const middle = [...work, ...leisure].slice(0, middleDays);
  while (middle.length < middleDays) {
    middle.push({
      title: "Your day, your call",
      detail: "Keep it free, or let us book anything that caught your eye.",
    });
  }

  const accommodationPerNight =
    quote.nightlyRate[answers.tier] * (answers.travellers === "solo" ? 1.35 : 1);
  let total = quote.transportCost + accommodationPerNight * answers.nights;
  if (answers.travellers === "group") total *= 0.95;

  const includes = [
    dest.transportLabel,
    TIER_STAY[answers.tier],
    answers.tier === "luxury" && destinationId !== "europe"
      ? "All meals included"
      : "Daily breakfast",
    "Airport and resort transfers",
    "Experiences chosen for you",
  ];
  if (workDays > 0) includes.push("Meeting venue and logistics");

  return {
    destinationId,
    destination: dest,
    recommended: answers.destination === "surprise",
    days: [dest.arrival, ...middle, dest.departure],
    includes,
    priceLow: roundTo(total * 0.95, 500),
    priceHigh: roundTo(total * 1.15, 500),
    priceNote:
      answers.travellers === "solo"
        ? "per person, solo"
        : answers.travellers === "family"
          ? "per adult sharing, child rates are usually lower"
          : "per person sharing",
  };
}

export function formatRand(value: number) {
  return `R ${value.toLocaleString("en-US")}`;
}

export function summariseForEnquiry(answers: PlannerAnswers, itinerary: Itinerary) {
  const label = <K extends keyof PlannerAnswers>(id: K) => {
    const question = QUESTIONS.find((q) => q.id === id);
    return question?.options.find((o) => o.value === answers[id])?.label ?? String(answers[id]);
  };

  return [
    `Hi Travel More! I planned a trip on your website and would love a quote.`,
    ``,
    `Destination: ${itinerary.destination.name}`,
    `Trip type: ${label("tripType")}`,
    `Travellers: ${label("travellers")}`,
    `Length: ${answers.nights} nights`,
    `Style: ${label("tier")}`,
    `Estimate shown: TBD ${itinerary.priceNote}`,
    ``,
    `Itinerary:`,
    ...itinerary.days.map((day, i) => `Day ${i + 1}: ${day.title}`),
  ].join("\n");
}
