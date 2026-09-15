export const TRIAGE_ISSUES = [
  {
    number: 1,
    title: "Add a search box to find games by title",
    state: "OPEN",
    priority: "HIGH",
    rank: 1,
    isTopPriority: true,
    category: "Discoverability / Core UX",
    justification: "Primary title search is the most direct and highest-frequency discovery mechanism for backers navigating an expanding game catalog. Implementing this first delivers immediate user-facing value, unblocks core navigation, and establishes the search/filtering UI structure without requiring database schema changes.",
    description: "Players who already know what they're looking for shouldn't have to scan the whole catalog. Adding a simple search box on the game list page lets users quickly narrow the list by title, improving discoverability alongside planned category and publisher filters. Builds on existing data layer.",
    acceptanceCriteria: [
      "The game list page includes a search input that filters games by title",
      "Matching is case-insensitive and updates the visible list as the user types or submits",
      "An appropriate empty state is shown when no games match the search",
      "Search input follows accessibility guidelines (ARIA, visible focus) with data-testid attributes",
      "Unit tests cover helper and Playwright e2e tests cover search behavior"
    ],
    labels: ["enhancement", "frontend", "search"]
  },
  {
    number: 5,
    title: "Show a catalog summary on the home page",
    state: "OPEN",
    priority: "HIGH",
    rank: 2,
    isTopPriority: true,
    category: "Landing Page / Vitality",
    justification: "The landing page is the primary entry point for all visitors. Surfacing key platform stats (total game count and average star rating) immediately conveys catalog scale and community vitality with minimal complexity. It utilizes existing data layer tables, requires zero schema migrations, and provides a quick, high-visibility win.",
    description: "The home page jumps straight into the featured games grid without giving visitors a sense of the catalog's size or quality. Adding a summary with total games and average star rating gives backers useful at-a-glance context and makes the landing page feel alive.",
    acceptanceCriteria: [
      "Home page displays total number of games in the catalog",
      "Home page displays average star rating across rated games",
      "Summary handles edge cases gracefully (no games, no rated games)",
      "Follows styling and accessibility guidelines with data-testid attributes",
      "Data-access helper computes summary deterministically with unit and e2e test coverage"
    ],
    labels: ["enhancement", "home-page", "data-layer"]
  },
  {
    number: 7,
    title: "Allow users to filter games by category and publisher",
    state: "OPEN",
    priority: "HIGH",
    rank: 3,
    isTopPriority: true,
    category: "Catalog / Discovery",
    justification: "Category and publisher relational metadata already exist in the database schema. Exposing faceted filtering empowers backers to explore specific genres or studios, directly supporting backer conversion and catalog exploration. It naturally complements title search.",
    description: "As the game catalog grows, players need a faster way to find titles relevant to them. Adding the ability to filter the game list by category and by publisher improves discoverability and builds directly on existing relational data structures.",
    acceptanceCriteria: [
      "Users can filter game list by one or more categories",
      "Users can filter game list by publisher, and combine category and publisher filters",
      "Data-access helpers in src/lib/ support filtering by category and publisher",
      "Filter controls follow accessibility guidelines with data-testid attributes",
      "Vitest unit tests and Playwright e2e tests cover filtering behavior"
    ],
    labels: ["enhancement", "catalog", "filtering"]
  },
  {
    number: 2,
    title: "Allow users to sort the game list",
    state: "OPEN",
    priority: "MEDIUM",
    rank: 4,
    isTopPriority: false,
    category: "Catalog Browsing",
    description: "Different players browse in different ways (highest-rated first, alphabetical). Adding sorting options gives backers more control over exploration, building on existing title and star rating fields.",
    acceptanceCriteria: [
      "Users can sort game list by title (A–Z and Z–A)",
      "Users can sort game list by star rating (highest first)",
      "Sensible handling for games without star ratings",
      "Accessible sort controls with data-testid attributes and unit/e2e test coverage"
    ],
    labels: ["enhancement", "catalog"]
  },
  {
    number: 3,
    title: "Show category and publisher descriptions on the game detail page",
    state: "OPEN",
    priority: "MEDIUM",
    rank: 5,
    isTopPriority: false,
    category: "Game Details",
    description: "The categories and publishers tables already include description fields, but the game detail page only shows names. Surfacing these descriptions gives backers helpful background context with zero schema changes.",
    acceptanceCriteria: [
      "Game detail page displays category and publisher descriptions when available",
      "Missing descriptions are hidden gracefully",
      "Data-access helpers updated with unit test and e2e test coverage"
    ],
    labels: ["enhancement", "game-detail"]
  },
  {
    number: 4,
    title: "Add a publisher page listing that publisher's games",
    state: "OPEN",
    priority: "MEDIUM",
    rank: 6,
    isTopPriority: false,
    category: "Publisher Profile",
    description: "When a backer likes a game, they want to see what else that publisher made. Adding a dedicated prerendered dynamic route for each publisher improves catalog navigation using existing game cards.",
    acceptanceCriteria: [
      "Prerendered publisher pages using getStaticPaths() + export const prerender = true",
      "Shows publisher name, description, and list of games",
      "Publisher links on game cards link to publisher page",
      "Unit and e2e test coverage"
    ],
    labels: ["enhancement", "routes"]
  },
  {
    number: 6,
    title: "Implement pagination on the game list page",
    state: "OPEN",
    priority: "MEDIUM",
    rank: 7,
    isTopPriority: false,
    category: "Scalability",
    description: "As the catalog grows, loading all games on a single page hurts performance. Adding pagination keeps the catalog fast and manageable.",
    acceptanceCriteria: [
      "Data-access helpers support pagination (page/limit or cursor)",
      "Game list page includes accessible pagination controls",
      "Unit and e2e test coverage"
    ],
    labels: ["enhancement", "performance"]
  },
  {
    number: 8,
    title: "Update our repository coding standards",
    state: "CLOSED",
    priority: "COMPLETED",
    rank: 8,
    isTopPriority: false,
    category: "Documentation",
    description: "Updated repository coding standards and guidelines for all contributors.",
    acceptanceCriteria: ["Repository standards documented and committed"],
    labels: ["documentation"]
  },
  {
    number: 11,
    title: "Show star ratings on game cards",
    state: "CLOSED",
    priority: "COMPLETED",
    rank: 9,
    isTopPriority: false,
    category: "UI Components",
    description: "Star rating visualization added to individual game cards in the catalog.",
    acceptanceCriteria: ["Star ratings rendered visually on game cards"],
    labels: ["enhancement", "ui"]
  }
];
