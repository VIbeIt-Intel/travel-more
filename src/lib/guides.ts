export type GuideFact = { label: string; detail: string };

export type GuidePlace = {
  name: string;
  detail: string;
  image: string;
  alt: string;
  objectPosition?: string;
};

export type Guide = {
  slug: string;
  name: string;
  image: string;
  alt: string;
  objectPosition: string;
  lead: string;
  feel: string[];
  facts: GuideFact[];
  places: GuidePlace[];
  trip: string;
};

export const GUIDES: Guide[] = [
  {
    slug: "mauritius",
    name: "Mauritius",
    image: "/images/destinations/mauritius-lagoon.jpg",
    alt: "Aerial view of Le Morne Brabant and the turquoise lagoon in Mauritius",
    objectPosition: "object-[center_42%]",
    lead: "A volcanic island inside its own lagoon. Most South African holidays here are a resort, a boat day, and one drive into the green interior.",
    feel: [
      "Once you are inside the reef the water stays shallow and clear, and the days are simple: beach, lunch, a swim before dinner. It is the most polished of the islands we plan. Roads are good, resorts run their own transfers, and English is widely spoken alongside French and Creole.",
      "The coast you choose changes the holiday. Le Morne and the west sit in the lee of the mountain, so the lagoon is calmer. The east is a long open beach with more wind. Port Louis is a working capital, worth a morning for the market, and not where you base the week.",
    ],
    facts: [
      {
        label: "Flights from Johannesburg",
        detail:
          "Direct, about five hours. The resort transfer is booked with the room, so you are not sorting a taxi after a night flight.",
      },
      {
        label: "When to go",
        detail:
          "May to December is the drier, more settled stretch. January to March is hotter, wetter, and the months when a cyclone can rearrange a beach week. We say so before you lock a honeymoon into those weeks.",
      },
      {
        label: "How long",
        detail:
          "Seven nights is the trip that fits. Five works when the flights are kind. Ten if you want golf or a catamaran day without giving up the beach.",
      },
      {
        label: "Getting around",
        detail:
          "You can stay on the resort the entire time. A car for two days covers Chamarel, the Black River gorges, and lunch on the west coast. Driving is on the left.",
      },
      {
        label: "Money",
        detail:
          "Mauritian rupee. Cards are accepted in resorts and larger restaurants. Take a little cash for the market and beach stalls.",
      },
      {
        label: "Entry",
        detail:
          "South African passport holders are normally visa-exempt for a holiday. We confirm the length of stay, and any health certificate tied to your routing, before the tickets are issued.",
      },
    ],
    places: [
      {
        name: "Le Morne Brabant",
        detail:
          "The mountain at the south-west tip, with the lagoon and the resort coast in front of it. Stay on this side if calm water is the point of the trip.",
        image: "/images/destinations/mauritius-lagoon.jpg",
        alt: "Le Morne mountain and the lagoon on the south-west coast of Mauritius",
      },
      {
        name: "Chamarel",
        detail:
          "Coloured earth, a waterfall, and a rum estate. An easy half day from the west coast, and the inland drive people are glad they made.",
        image: "/images/places/chamarel-u.jpg",
        alt: "The coloured earth at Chamarel in Mauritius",
      },
      {
        name: "Black River Gorges",
        detail:
          "The green centre of the island. Viewpoints and short walks when you want a day that is not another beach.",
        image: "/images/places/gorges-u.jpg",
        alt: "A waterfall dropping into the forested gorges of Mauritius",
      },
      {
        name: "Île aux Cerfs",
        detail:
          "A sand island off the east coast, reached by boat. Beautiful early, busy once the tour groups land. We time it that way.",
        image: "/images/places/cerfs-u.jpg",
        alt: "Loungers under palm trees on a white beach in Mauritius",
      },
      {
        name: "Port Louis market",
        detail:
          "Vanilla, spices, and an hour in the capital. Go in the morning and then leave the city to the people who work there.",
        image: "/images/places/port-louis-u.jpg",
        alt: "Pots of spices and grains at a busy market stall",
      },
      {
        name: "Belle Mare",
        detail:
          "The long east-coast beach. Ask for this side if a wide lagoon in front of the hotel matters more than shelter from the wind.",
        image: "/images/places/belle-mare-u.jpg",
        alt: "The long beach and lagoon at Belle Mare, Mauritius",
      },
    ],
    trip: "A week on the west for couples who want quieter water, or the east if the long beach is the picture you have in mind. One inland day, one boat, and the rest at the resort. Golf fits this island properly. Families do well where there is a kids’ club and rooms that connect.",
  },
  {
    slug: "zanzibar",
    name: "Zanzibar",
    image: "/images/destinations/zanzibar-beach.jpg",
    alt: "White sand, palm trees and turquoise water on the coast of Zanzibar",
    objectPosition: "object-center",
    lead: "Stone Town first, then a beach where the dhows sit in the shallows. Slower and less polished than Mauritius, which is the reason most people choose it.",
    feel: [
      "The holiday is two moods. Stone Town is a coral-stone city of narrow lanes, carved doors, and a waterfront that fills at sunset. The night food market is the meal you came for. The beaches, especially on the north coast, are a different island: pale sand, boats, and days that do not run to a schedule.",
      "Plan for that pace. Transfers take longer than the map suggests, and town asks for modest dress even when the resort beach does not. It is a generous place if you let it be slightly inconvenient.",
    ],
    facts: [
      {
        label: "Flights from Johannesburg",
        detail:
          "Usually one stop, often via Nairobi, Dar es Salaam, or Addis Ababa, into Abeid Amani Karume airport. We choose the routing that does not spend your first day in a terminal.",
      },
      {
        label: "When to go",
        detail:
          "June to October is dry and the easier beach season. December to February is hot, with short rains. March to May is the long rains. We still travel then, and we tell you it will not be beach every day.",
      },
      {
        label: "How long",
        detail:
          "Seven to nine nights. A few nights in Stone Town, the rest on a beach. Shorter than a week and the trip is mostly airports.",
      },
      {
        label: "Getting around",
        detail:
          "Pre-booked drivers and taxis. The north coast is about ninety minutes from Stone Town. Agree the fare before you get in, and do not plan to walk from one resort to the next.",
      },
      {
        label: "Money",
        detail:
          "Tanzanian shilling, with US dollars taken at many hotels. Cards work in the larger hotels and fail often enough elsewhere that you want cash.",
      },
      {
        label: "Entry",
        detail:
          "Zanzibar is part of Tanzania, and South African travellers need a Tanzania visa, usually an e-visa or a visa on arrival. We line it up with the flights. We also check the yellow-fever rule for your exact route.",
      },
    ],
    places: [
      {
        name: "Stone Town",
        detail:
          "A UNESCO old town. Wander in the late afternoon, then eat at Forodhani Gardens when the grill stalls light up.",
        image: "/images/places/stone-town.jpg",
        alt: "A narrow lane in Stone Town, Zanzibar, with a stone tower at the end",
      },
      {
        name: "A spice farm",
        detail:
          "Clove, vanilla, and nutmeg, on a half-morning tour. This is the trade the island was fought over, and it makes the market smell make sense.",
        image: "/images/places/spice-u.jpg",
        alt: "A guide showing a fresh spice plant on a farm in Zanzibar",
      },
      {
        name: "Prison Island",
        detail:
          "Giant tortoises and a short boat ride from town. Go early, before the day heats up and the boats stack.",
        image: "/images/places/tortoise-u.jpg",
        alt: "An Aldabra giant tortoise on the grass",
      },
      {
        name: "Nungwi and Kendwa",
        detail:
          "The north-coast beaches. Dhows in the shallows, and the side of the island where a sunset swim is actually possible.",
        image: "/images/places/nungwi-u.jpg",
        alt: "White sand and clear water at Nungwi beach, Zanzibar",
      },
      {
        name: "Jozani forest",
        detail:
          "Red colobus monkeys, and a natural stop on the drive between Stone Town and the coast.",
        image: "/images/places/jozani-u.jpg",
        alt: "A Zanzibar red colobus monkey with its young in Jozani forest",
        objectPosition: "object-[center_24%]",
      },
      {
        name: "A dhow at sunset",
        detail:
          "The hour people talk about afterwards. Put it on a calm evening of its own, not the same night as a late dinner in town.",
        image: "/images/places/dhow-sunset-u.jpg",
        alt: "A traditional dhow on the water at sunset in Zanzibar",
      },
    ],
    trip: "Stone Town while you still have the energy for lanes and markets, then a beach hotel with the transfer included. One spice and forest day, one boat, evenings on the sand. Honeymoons work if the hotel is the quiet one, not the busiest north-coast strip.",
  },
  {
    slug: "seychelles",
    name: "Seychelles",
    image: "/images/destinations/seychelles-digue.jpg",
    alt: "Granite boulders and clear water at Anse Source d'Argent, La Digue",
    objectPosition: "object-[center_62%]",
    lead: "Granite coves rather than a resort strip. Mahé, Praslin, and La Digue are three different islands, and the trip is better when you treat them that way.",
    feel: [
      "The beaches you have seen are real, and they are smaller than a postcard suggests: boulders, a curve of sand, and water that drops from pale to deep a few strokes out. Mahé has the airport, Victoria, and the hills. Praslin is quieter, with the ancient palm forest in its centre. La Digue is bicycles and a dirt path down to Anse Source d’Argent.",
      "It costs more than Mauritius or Zanzibar. The return is how few people are on a good beach in the morning, if you are staying on that island rather than visiting it for an hour.",
    ],
    facts: [
      {
        label: "Flights from Johannesburg",
        detail:
          "Direct when the schedule allows, around six hours, or one stop via the Gulf or Addis Ababa. Ferries and inter-island flights have to sit in the same plan as the international ticket.",
      },
      {
        label: "When to go",
        detail:
          "Year-round. May to September is a little cooler, with a livelier sea. November to March is warmer and greener. Neither season is a reason to stay home.",
      },
      {
        label: "How long",
        detail:
          "Nine or ten nights for Mahé, Praslin, and La Digue. A week is right for two islands. One island if the aim is to stop moving.",
      },
      {
        label: "Getting around",
        detail:
          "Drive on Mahé and Praslin, on the left. Cycle on La Digue. The ferry between Praslin and La Digue is a short hop. A domestic flight is worth it when the ferry would cost you half a day.",
      },
      {
        label: "Money",
        detail:
          "Seychelles rupee. Cards in hotels and many restaurants. Meals and boat days add up. We price them before you go.",
      },
      {
        label: "Entry",
        detail:
          "Most holiday visitors, including South African passport holders, are given a visitor’s permit on arrival. You need a passport, a return ticket, and proof of where you are staying. We recheck this before you fly.",
      },
    ],
    places: [
      {
        name: "Anse Source d’Argent, La Digue",
        detail:
          "The granite boulders and the pale shallows. Stay on La Digue if you want it in the morning, before the day boats arrive.",
        image: "/images/destinations/seychelles-digue.jpg",
        alt: "Granite boulders and pale water at Anse Source d’Argent, La Digue",
      },
      {
        name: "Anse Lazio, Praslin",
        detail:
          "The beach people cross Praslin to swim at. A short drive, and worth being there early.",
        image: "/images/places/anse-lazio-u.jpg",
        alt: "A pale beach and granite boulders on Praslin",
      },
      {
        name: "Vallée de Mai",
        detail:
          "The coco de mer forest in the middle of Praslin, a UNESCO site. An hour on the paths is the right amount of time.",
        image: "/images/places/vallee-de-mai-u.jpg",
        alt: "Large coconuts hanging from a palm in the Seychelles",
      },
      {
        name: "Beau Vallon, Mahé",
        detail:
          "The straightforward swimming beach near Victoria. A practical first or last night when the flight times demand it.",
        image: "/images/places/beau-vallon-u.jpg",
        alt: "A sandy beach and green hills on Mahé",
      },
      {
        name: "Victoria market",
        detail:
          "Sir Selwyn Selwyn-Clarke market. Fish, fruit, and a feel for the capital without spending the day in town.",
        image: "/images/places/victoria-market-u.jpg",
        alt: "Tropical fruit piled high on a market stall",
      },
      {
        name: "The hills of Mahé",
        detail:
          "Morne Blanc, or a stop in the interior. The islands are mountains as well as coves, and the views are the part photos of the beach leave out.",
        image: "/images/places/mahe-hills-u.jpg",
        alt: "Palm trees and the green hills of the Seychelles behind a beach",
      },
    ],
    trip: "Land on Mahé, move to Praslin, cycle La Digue for two or three nights, and sleep the last night back on Mahé. That last night is the one people try to cut. A delayed ferry should not be what decides whether you catch the flight home.",
  },
  {
    slug: "maldives",
    name: "Maldives",
    image: "/images/destinations/maldives-card.jpg",
    alt: "Overwater villas above a coral reef in the Maldives",
    objectPosition: "object-center",
    lead: "One island, one resort, and the reef at the end of the jetty. You fly into Malé and then leave it. The holiday is the lagoon.",
    feel: [
      "There is no town to wander and no strip of restaurants to compare. Villas stand on the beach or over the water, meals are on the island, and the snorkel is a walk down the jetty. It is the most private of these trips, and the most contained. If you want to explore a country, this is the wrong map.",
      "The transfer is part of the arrival. A speedboat reaches the nearer atolls. A seaplane does the further ones, and only in daylight. Land too late and the resort keeps you in Malé overnight, then flies you out in the morning. We put that night in the plan instead of letting it surprise you.",
    ],
    facts: [
      {
        label: "Flights from Johannesburg",
        detail:
          "One stop is the normal route, via the Gulf or Addis Ababa, into Velana airport. Seaplanes do not fly after dark, so the arrival time decides whether you sleep on the resort island or in Malé.",
      },
      {
        label: "When to go",
        detail:
          "November to April is the drier season. May to October is wetter, often better value, and still has long clear breaks. Some resorts close to renovate then. We check before we suggest one.",
      },
      {
        label: "How long",
        detail:
          "Seven nights. Five can work on a speedboat island close to Malé. A seaplane resort wants the full week.",
      },
      {
        label: "The transfer",
        detail:
          "Booked with the room. Speedboats take roughly twenty to sixty minutes. A seaplane is a day-time flight over the atolls. You do not hail either of them on arrival.",
      },
      {
        label: "Money",
        detail:
          "US dollars are what resorts actually run on. The rufiyaa exists, and you may not touch it if you never leave the island. Most spending is charged to the room.",
      },
      {
        label: "Entry and island rules",
        detail:
          "A tourist stay is normally granted on arrival when your passport, return flight, and resort booking are in place. Bikinis belong on the resort beach. A local island is a different dress code and a different day. We confirm the entry rule for your passport before ticketing.",
      },
    ],
    places: [
      {
        name: "The house reef",
        detail:
          "The question to ask before the brochure. A good reef means you are in the water from the jetty, which is the holiday.",
        image: "/images/places/maldives-coral-u.jpg",
        alt: "Fish swimming over coral on a reef",
      },
      {
        name: "A sandbank",
        detail:
          "An hour by boat and an afternoon of lagoon. The resort runs it. Once is the right number of times.",
        image: "/images/places/sandbank-u.jpg",
        alt: "A strip of white sand in a turquoise Maldives lagoon",
      },
      {
        name: "Baa Atoll",
        detail:
          "A UNESCO biosphere, and the area people ask about for manta rays. It only matters if the resort is in that atoll, and only in the months the rays are there. We will tell you if the timing is wrong.",
        image: "/images/places/manta-u.jpg",
        alt: "A manta ray with divers in the Maldives",
      },
      {
        name: "Overwater and beach villas",
        detail:
          "Over water is the picture. A beach villa is often the better snorkel. We choose from the reef, not from the photograph alone.",
        image: "/images/destinations/maldives-card.jpg",
        alt: "Overwater villas above a coral reef in the Maldives",
      },
      {
        name: "A local island",
        detail:
          "Places like Maafushi are guesthouse islands: busier, cheaper, and not the private-resort trip. We keep the two styles apart.",
        image: "/images/places/maafushi-u.jpg",
        alt: "The beach and guesthouses of a local island in the Maldives",
      },
      {
        name: "Malé",
        detail:
          "The capital you pass through. A short look if you have a spare morning. It is not the reason for the flight.",
        image: "/images/places/male-u.jpg",
        alt: "The dense waterfront of Malé in the Maldives",
      },
    ],
    trip: "One island and one resort, with the boat or seaplane included and the villa picked for the reef. It suits honeymoons and anyone who wants to be left alone. Families do well where the kids’ club is real and the reef is safe to enter from the beach.",
  },
  {
    slug: "europe",
    name: "Europe",
    image: "/images/destinations/europe-sharp.jpg",
    alt: "Hallstatt church and village reflected in the lake in Austria",
    objectPosition: "object-[center_38%]",
    lead: "Not one country and not a list of capitals. A city, a train, and a landscape you actually want to wake up in. The lakeside village in the photograph is Hallstatt, in Austria.",
    feel: [
      "For a South African traveller, Europe is a routing problem before it is a dream. Which city you fly into decides the holiday. A lake district, a coast, or a match only works if the flights and the trains face the same direction. Two countries is a trip. Three is how it turns into a timetable.",
      "Hallstatt is the scale we like for the quiet half of a European journey: a church on the water, mountains behind it, and a village small enough that a coach stop does not do it justice. The same thinking applies to a Roman week, a ski resort, or two cities and a stretch of countryside.",
    ],
    facts: [
      {
        label: "Flights from Johannesburg",
        detail:
          "Direct and one-stop services into the hubs: London, Amsterdam, Paris, Frankfurt, Zurich, Rome. We use the city you will actually start in, not the cheapest fare into the wrong side of the map.",
      },
      {
        label: "Visas",
        detail:
          "A South African passport needs a Schengen visa for most of Europe, and a separate visa for the United Kingdom. Appointments fill months ahead in season, so this starts before the hotels. We prepare the file with you. The embassy decides, and we do not promise an approval.",
      },
      {
        label: "How long",
        detail:
          "Ten to fourteen nights for a first trip that pairs a city with a region. A long weekend is a single city. Tell us which of those you want before we draw a route.",
      },
      {
        label: "When to go",
        detail:
          "April to June and September to October suit cities and lakes. July and August are hot and booked out. December is markets and short days. Ski weeks follow the northern winter, matched to how you actually ski.",
      },
      {
        label: "Trains and cars",
        detail:
          "Trains between cities. A car in lake country, Tuscany, or a rural stretch where the point is the drive. We say which, so you are not parking in a centre that did not want your car.",
      },
      {
        label: "Money",
        detail:
          "Euro in most of the countries we plan, pounds in the UK, francs in Switzerland. Cards are widely accepted. Tell your bank before you fly.",
      },
    ],
    places: [
      {
        name: "Hallstatt and the Salzkammergut",
        detail:
          "The lakeside village in the photograph. Stay nearby if the village itself is full, and do not try to see it from a two-hour coach.",
        image: "/images/destinations/europe-sharp.jpg",
        alt: "Hallstatt church and the village reflected in the lake in Austria",
      },
      {
        name: "One city, chosen for a reason",
        detail:
          "Rome if food and walking are the point, Paris for a first Europe, Barcelona if you want the sea in the same week as the city. One of these, not a circuit of all three.",
        image: "/images/places/rome-u.jpg",
        alt: "The ruins of the Roman Forum in Rome",
      },
      {
        name: "Lakes or the Alps",
        detail:
          "Northern Italy, Austria, or Switzerland after the city, when the trip should slow down. This is also where a ski week lives, at a resort suited to your level.",
        image: "/images/places/alps-u.jpg",
        alt: "Lake Como and the mountains of northern Italy",
      },
      {
        name: "A town you sleep in",
        detail:
          "Somewhere smaller than the capital, with a hotel you are glad to come back to. This is the night people remember more than the museum list.",
        image: "/images/places/town-u.jpg",
        alt: "The old town and canals of Colmar in France",
      },
      {
        name: "A match or a race",
        detail:
          "Formula 1, rugby, tennis, or football, when the ticket is the reason for the trip. The hotel goes near the ground, and the flights follow the fixture.",
        image: "/images/places/stadium-u.jpg",
        alt: "A packed football stadium in Europe",
      },
      {
        name: "Christmas markets",
        detail:
          "Late November into December, in one or two cities. Cold and crowded, and worth doing if that is the trip you asked for rather than a stop we squeezed in.",
        image: "/images/places/christmas-u.jpg",
        alt: "A Christmas market lit up at night",
      },
    ],
    trip: "Visa date first, then flights into the right city, then a rail or a drive, then hotels for the evenings. Tell us whether you want lakes, cities, snow, or a ticketed event. The route is built around that.",
  },
];

export function getGuide(slug: string) {
  return GUIDES.find((guide) => guide.slug === slug);
}
