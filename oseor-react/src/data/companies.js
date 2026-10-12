// Source unique des filiales / participations OSEOR.
// Textes repris à l'identique du projet d'origine :
//  - descriptions courtes, logos et sites : Projet-OSEOR-Backend (data.sql)
//  - fiches détaillées : pages secteurs du frontend Angular
//
// Blocs de détail (rendus par <CompanyDetails />) :
//  text        { title|titleKey, paragraphs[] }
//  facts       { title|titleKey, icon, items: [{ label|labelKey, value }] }
//  list        { title|titleKey, icon?, items[], columns? }
//  steps       { title|titleKey, items[] }                (liste à puces « infrastructure »)
//  tags        { title|titleKey, items[] }
//  specialties { title|titleKey, items: [{ icon, label }] }
//  highlights  { items: [{ value, label, icon? }] }
//  quote       { text }

const P = 'assets/images/partners/';

export const SECTORS = [
  {
    slug: 'energie',
    name: 'Énergie',
    labelKey: 'SECTEURS.ENERGIE',
    pageKey: 'ENERGY_PAGE',
    icon: 'fa-bolt',
    image: 'assets/images/energie.jpg',
    hero: 'assets/images/sectors/energie/energie-1.png',
  },
  {
    slug: 'industrie',
    name: 'Industrie',
    labelKey: 'SECTEURS.INDUSTRIE',
    pageKey: 'INDUSTRY_PAGE',
    icon: 'fa-industry',
    image: 'assets/images/industrie.jpg',
    hero: 'assets/images/sectors/industrie/industrie-4.png',
  },
  {
    slug: 'services',
    name: 'Services',
    labelKey: 'SECTEURS.SERVICES',
    pageKey: 'SERVICES_PAGE',
    icon: 'fa-handshake',
    image: 'assets/images/sectors/services/services-1.png',
    hero: 'assets/images/sectors/services/services-1.png',
  },
];

export const COMPANIES = [
  // ======================= ÉNERGIE (8) =======================
  {
    id: 'zih',
    sector: 'energie',
    name: 'ZIH — ZENER International Holding',
    category: 'Holding Énergie',
    description:
      'Holding énergie du Groupe ZENER spécialisée dans les investissements, infrastructures de stockage, transport de combustible et solutions énergétiques diversifiées.',
    logo: P + 'zih.png',
    site: null,
    details: [
      {
        kind: 'text',
        titleKey: 'SECTEURS.ENERGY_PAGE.BRIEF',
        paragraphs: [
          'Zener International Holding (ZIH) est la holding ENERGIE du Groupe ZENER. C’est une société à 100% capitaux privés détenus par des investisseurs togolais.',
          'Basée au Togo, elle est en charge des investissements du Groupe, avec un développement principalement axé sur le secteur de l’énergie (gaz, pétrole, électricité, solaire, éolien et hydrogène).',
          'Elle fait partie du réseau de sociétés du Groupe OSEOR, qui opère dans divers secteurs d’activités dont l’Energie, le trading et la distribution de produits pétroliers, le transport et les concessions automobiles, l’industrie, l’agro-alimentaire, le BTP, le conseil et l’ingénierie, le numérique, etc.',
          'D’ici à 2028, ZIH projette son expansion au Burkina-Faso, au Niger, au Mali, au Tchad et en RDC. Nourri de véritables ambitions africaines, le groupe entend se positionner comme un acteur majeur de l’énergie dans la sous-région Afrique de l’Ouest & Centrale.',
        ],
      },
      {
        kind: 'facts',
        titleKey: 'SECTEURS.ENERGY_PAGE.KEY_DATA',
        icon: 'fa-chart-line',
        items: [
          { labelKey: 'SECTEURS.ENERGY_PAGE.FORM', value: 'Société Anonyme avec Conseil d’Administration' },
          { labelKey: 'SECTEURS.ENERGY_PAGE.HEADQUARTERS', value: 'Lomé (Togo)' },
          { labelKey: 'SECTEURS.ENERGY_PAGE.TARGET_SECTORS', value: 'Gaz, Pétrole, Solaire, Electricité, Eolien, Hydrogène' },
          { labelKey: 'SECTEURS.ENERGY_PAGE.GEO_PRESENCE', value: 'Afrique de l’Ouest et Centrale (Togo, Bénin, Guinée Bissau)' },
          { labelKey: 'SECTEURS.ENERGY_PAGE.TARGET_COUNTRIES', value: 'Côte d’Ivoire, Bénin, Burkina Faso, Cap vert, Niger, RDC, Tchad' },
        ],
      },
    ],
  },
  {
    id: 'zener-togo',
    sector: 'energie',
    name: 'ZENER TOGO SA',
    category: 'Produits pétroliers & GPL',
    description:
      'Filiale spécialisée dans l’importation, le stockage et la distribution des produits pétroliers, GPL, lubrifiants et accessoires du gaz.',
    logo: P + 'zener.png',
    site: 'https://zener.tg/',
    details: [],
  },
  {
    id: 'pls',
    sector: 'energie',
    name: 'POWER LINK SOLUTIONS SA',
    category: 'Trading & stockage de gaz',
    description:
      'Entreprise spécialisée dans le trading, le stockage et les infrastructures de gaz butane avec dépôt gazier en zone portuaire.',
    logo: P + 'pls.png',
    site: 'https://pls.tg/',
    details: [
      {
        kind: 'text',
        titleKey: 'SECTEURS.ENERGY_PAGE.BRIEF',
        paragraphs: [
          'POWER LINK SOLUTIONS SA est une société spécialisée dans le trading et le stockage de gaz butane au Togo. Elle opère un dépôt gazier de plus de 5300 m3 situé en zone portuaire et relié au quai pétrolier de Lomé par un pipeline privé.',
          'Basée au Togo, elle offre des services de passage aux pays de l’hinterland.',
        ],
      },
      { kind: 'highlights', items: [{ value: '5 300+ m³', label: 'Dépôt gazier', icon: 'fa-warehouse' }, { value: 'Pipeline', label: 'Relié au quai pétrolier de Lomé', icon: 'fa-route' }] },
    ],
  },
  {
    id: 'pgs',
    sector: 'energie',
    name: 'POWER & GAS STORAGE SA',
    category: 'Stockage de propane',
    description:
      'Entreprise spécialisée dans le stockage de propane, terminaux gaziers et solutions énergétiques destinées au secteur industriel.',
    logo: P + 'pgs.png',
    site: 'https://pgs.tg/',
    details: [
      {
        kind: 'text',
        titleKey: 'SECTEURS.ENERGY_PAGE.ACTIVITY',
        paragraphs: [
          'Société spécialisée dans l’importation, le stockage et la distribution du propane et les autres produits pétroliers et dérivés.',
        ],
      },
      { kind: 'list', items: ['Plateforme multilink', 'Propane et gaz naturel', 'Terminaux gazier', 'Solaire et hydro'], columns: 2 },
      {
        kind: 'steps',
        titleKey: 'SECTEURS.ENERGY_PAGE.INFRASTRUCTURE',
        icon: 'fa-warehouse',
        items: [
          'Construction sur le site d’un stockage exclusivement dédié pour le propane de capacité d’environ 9 600 m3 (16 cuves de 600m3 chacune)',
          'Un stockage tampon (Buffer Tank) d’une capacité 1 200 m3 (2 cuves de 600 m3)',
          'Lignes de transfert entre les stockages principaux et le stockage tampon (situé sur le site de la centrale KEKELI)',
          'Système de pompes performant',
          'Système de vapo-détendeurs (débit 100 000 kg/h ; pression 50 bars ; température 150°C)',
          'Système de sécurité de pointe et lutte contre les incendies',
        ],
      },
    ],
  },
  {
    id: 'diwa-energie',
    sector: 'energie',
    name: 'DIWA INDUSTRIES SA',
    category: 'Emballages métalliques',
    description:
      'Filiale spécialisée dans la production et commercialisation d’emballages et contenants métalliques certifiée ISO 9001/2025.',
    logo: P + 'diwa-indus.png',
    site: 'https://diwaindustries.tg/',
    details: [
      {
        kind: 'text',
        titleKey: 'SECTEURS.ENERGY_PAGE.BRIEF',
        paragraphs: [
          'DIWA Industries est une société togolaise spécialisée dans les solutions de mobilité. A ce titre, elle couvre les secteurs de l’automobile, de la tribologie et des équipements industriels et technologiques.',
          'Elle offre des solutions exclusives d’équipements dans l’industrie, le transport et l’agriculture.',
          'Elle se veut la référence locale en matière de fourniture d’équipements et de services de mobilité.',
          'Les activités de DIWA International ont effectivement démarré entre 2011 et 2013.',
        ],
      },
    ],
  },
  {
    id: 'bluen',
    sector: 'energie',
    name: 'BLUEN SA',
    category: 'Énergies renouvelables',
    description:
      'Filiale de développement de solutions d’énergies renouvelables, solutions solaires et transition énergétique.',
    logo: P + 'bluen.png',
    site: 'https://bluen.tg/',
    details: [
      {
        kind: 'text',
        titleKey: 'SECTEURS.ENERGY_PAGE.BRIEF',
        paragraphs: [
          'Bluen SA est une filiale de développement de solutions d’énergies renouvelables et transition énergétique : solutions solaires résidentielles, industrielles et centrales gas to power. Elle explore également les opportunités dans les solutions éoliennes et hydrogène.',
        ],
      },
    ],
  },
  {
    id: 'zener-benin',
    sector: 'energie',
    name: 'ZENER BENIN SA',
    category: 'Distribution · Bénin',
    description:
      'Filiale créée en 2023 spécialisée dans la distribution de produits pétroliers, GPL et développement énergétique au Bénin.',
    logo: P + 'zih.png',
    site: null,
    details: [
      {
        kind: 'text',
        titleKey: 'SECTEURS.ENERGY_PAGE.BRIEF',
        paragraphs: [
          'Filiale installée au Benin en 2023, ZENER BENIN investit dans la distribution de produits blancs et GPL, HFO, lubrifiants, etc.',
          'Société filiale de ZENER INTERNATIONAL HOLDING (ZIH), elle a été créée dans le cadre de la mise en œuvre de la stratégie d’une expansion sous-régionale des produits de ZENER. Le capital social de la société est de 300 millions de F CFA. L’objectif principal est de devenir un acteur majeur de l’énergie au Bénin.',
          'À sa création, ZENER BENIN a commencé son exploitation avec la création d’une station-service (Oasis) et distribue les produits comme le Gaz et les dérivés des hydrocarbures.',
        ],
      },
      {
        kind: 'facts',
        titleKey: 'SECTEURS.ENERGY_PAGE.KEY_DATA',
        icon: 'fa-circle-info',
        items: [
          { labelKey: 'SECTEURS.ENERGY_PAGE.FORM', value: 'SA' },
          { label: 'Année de création', value: '2023' },
          { label: 'Capital', value: '300 millions' },
          { labelKey: 'SECTEURS.ENERGY_PAGE.HEADQUARTERS', value: 'Cotonou' },
          { label: 'Recettes 2024', value: '636 millions' },
          { label: 'Résultat net 2024', value: '-23 millions' },
        ],
      },
      {
        kind: 'list',
        title: 'Ambitions',
        icon: 'fa-bullseye',
        items: [
          '15 stations-services d’ici 5 ans',
          'Dépôt de gaz et 2 centres emplisseurs',
          'Réseau Enora (gaz en bouteille)',
          'Kits solaires et photovoltaïques',
          'Explorer les projets GtP',
        ],
      },
    ],
  },
  {
    id: 'zen-grupo',
    sector: 'energie',
    name: 'ZEN GRUPO LDA',
    category: 'Oil & Gas · Guinée-Bissau',
    description:
      'Acteur dominant du secteur pétrolier et gazier en Guinée-Bissau spécialisé dans le stockage et la distribution énergétique.',
    logo: P + 'zih.png',
    site: null,
    details: [
      {
        kind: 'text',
        title: 'Zen Grupo Lda',
        paragraphs: [
          'Zen Grupo Lda est la filiale en Guinée-Bissau acquis en 2025 et qui occupe une position dominante sur le marché oil & gas dans le pays. Elle regroupe un stockage de 20 000 m3 de produits blancs jet A1, un stockage de 1200 T de GPL, un réseau de 16 stations services (plus grand réseau), et un parc logistique',
        ],
      },
      {
        kind: 'highlights',
        items: [
          { value: '20 000 m³', label: 'Produits blancs & Jet A1', icon: 'fa-oil-well' },
          { value: '1 200 T', label: 'Stockage GPL', icon: 'fa-fire-flame-simple' },
          { value: '16', label: 'Stations-services', icon: 'fa-gas-pump' },
        ],
      },
      {
        kind: 'text',
        title: 'Présentation de l’activité de Zen Grupo',
        paragraphs: [
          'Zen Grupo, anciennement Petrogal GB, est l’acteur dominant du secteur aval du pétrole et du gaz en Guinée-Bissau. Le groupe occupe une position centrale sur l’ensemble de la chaîne de valeur, notamment dans l’importation, le stockage et la distribution des produits pétroliers, dans un marché fortement dépendant des importations.',
          'Il contrôle une part significative des infrastructures stratégiques du pays et opère à travers plusieurs filiales spécialisées, dont Petromar, Petrogas, ASB et CLC. Le groupe est également leader sur le segment du carburant aviation, via ASB, qui exploite un dépôt en partenariat avec Elton pour l’approvisionnement en Jet A1 à l’aéroport international Osvaldo Vieira.',
        ],
      },
    ],
  },

  // ======================= INDUSTRIE (3) =======================
  {
    id: 'diwa-industrie',
    aliases: ['DIWA INDUSTRIES'],
    sector: 'industrie',
    name: 'DIWA INDUSTRIES SA',
    category: 'Emballage industriel',
    description: 'Spécialiste de l’emballage industriel et du stockage énergétique.',
    logo: P + 'diwa-indus.png',
    image: 'assets/images/sectors/industrie/industrie-1.png',
    site: 'https://diwaindustries.tg/',
    details: [
      {
        kind: 'specialties',
        titleKey: 'SECTEURS.INDUSTRY_PAGE.SPECIALTIES',
        items: [
          { icon: 'fa-box', label: 'Production de contenants' },
          { icon: 'fa-box-archive', label: 'Emballage métallique' },
          { icon: 'fa-gas-pump', label: 'Stockage gaz & énergie' },
        ],
      },
      {
        kind: 'text',
        titleKey: 'SECTEURS.INDUSTRY_PAGE.DETAILED_PRESENTATION',
        paragraphs: [
          'C’est la filiale spécialisée dans la production et commercialisation d’emballages et contenants métalliques au Togo. Elle produit pour le marché togolais et exporte dans la sous région. Elle est certifiée ISO 9001/2025',
        ],
      },
    ],
  },
  {
    id: 'jcem',
    aliases: ['JCEMGROUP TOGO', 'JCEM GROUPE TOGO'],
    sector: 'industrie',
    name: 'JCEM GROUPE TOGO SAS',
    category: 'BTP · Béton prêt à l’emploi',
    description: 'Expert en béton prêt à l’emploi et solutions BTP modernes.',
    logo: P + 'jcem.png',
    image: 'assets/images/sectors/industrie/industrie-2.png',
    site: 'https://jcem.tg/',
    details: [
      {
        kind: 'specialties',
        title: 'Expertise BTP',
        items: [
          { icon: 'fa-fill-drip', label: 'Bétons prêts à l’emploi' },
          { icon: 'fa-link', label: 'Armatures' },
          { icon: 'fa-helmet-safety', label: 'Intrants BTP' },
          { icon: 'fa-palette', label: 'Bétons décoratifs' },
        ],
      },
      { kind: 'highlights', items: [{ value: '120 000 m³/an', label: 'Capacité de la centrale à béton', icon: 'fa-industry' }, { value: '5,4 M m³', label: 'Demande potentielle annuelle au Togo', icon: 'fa-chart-line' }] },
      {
        kind: 'text',
        titleKey: 'SECTEURS.INDUSTRY_PAGE.DETAILED_PRESENTATION',
        paragraphs: [
          'La société JCEM GROUPE TOGO SAS est née des cendres de la société JELCEM. JCEM GROUPE, comme JELCEM, est une société qui fournit du béton prêt à l’emploi pour les travaux de construction de bâtiments et d’infrastructures. Elle exploite une centrale à béton d’une capacité de 120 000 m3/an. Le béton est obtenu par mélange minutieux du ciment et autres matières (sable, gravier, adjuvant, eau) en divers dosages.',
          'Entièrement dépendant du marché de la construction, la fabrication du béton prêt à l’emploi enregistre une forte demande à cause des grands travaux d’infrastructures entrepris non seulement par le Gouvernement mais aussi par le secteur privée (construction de nouveau port de pêche de Gbetsogbé, la construction du siège de la NSIA-Togo, la construction des immeubles pour multiple usages, la construction d’hôtels etc, les habitations, pour ne citer que ceux-là). La demande potentielle de béton au Togo est évaluée à 5,4 millions de m3 par an.',
        ],
      },
      {
        kind: 'list',
        title: 'Avantages du béton prêt à l’emploi',
        icon: 'fa-circle-check',
        columns: 2,
        items: [
          'Gain de temps dans la préparation du béton',
          'Assurance de la qualité du béton (dosage et homogénéité)',
          'Utilisation d’adjuvants adaptés à chaque catégorie',
          'Disponibilité rapide et en quantité suffisante',
          'Assurance d’exécuter les travaux à temps',
          'Prix très compétitifs',
          'Économie d’investissement ou de location de matériel',
          'Gestion simplifiée de la main d’œuvre sur chantier',
        ],
      },
    ],
  },
  {
    id: 'daba',
    aliases: ['DABA'],
    sector: 'industrie',
    name: 'DABA SAS',
    category: 'Agro-Business',
    description: 'Entreprise agro-industrielle spécialisée dans la transformation de produits d’élevage.',
    logo: P + 'daba.png',
    image: 'assets/images/sectors/industrie/industrie-3.png',
    site: 'https://daba.tg/',
    details: [
      {
        kind: 'highlights',
        items: [
          { value: 'Agro-business', label: 'Développement de filières agricoles durables.', icon: 'fa-leaf' },
          { value: 'Transformation', label: 'Valorisation des produits d’élevage.', icon: 'fa-cow' },
          { value: 'Abattoir moderne', label: 'Standard International', icon: 'fa-building-circle-check' },
        ],
      },
      { kind: 'quote', text: 'DABA SAS est une société spécialisée dans l’agro-business, production et transformation de produits agricoles et d’élevage, abattoir moderne, industries de transformation.' },
      {
        kind: 'facts',
        titleKey: 'SECTEURS.INDUSTRY_PAGE.DETAILED_PRESENTATION',
        icon: 'fa-location-dot',
        items: [{ labelKey: 'SECTEURS.ENERGY_PAGE.HEADQUARTERS', value: 'Lomé, BKS, quartier Agoè-nyivé' }],
      },
      {
        kind: 'list',
        title: 'Objet social',
        columns: 2,
        items: [
          'L’agro-industrie',
          'La transformation',
          'L’élevage',
          'L’abattage',
          'Commercialisation viandes',
          'Produits d’abattoirs',
          'Fruits et légumes',
          'Charcuteries',
          'Pisciculture',
          'Produits surgelés/laitiers',
        ],
      },
    ],
  },

  // ======================= SERVICES (5) =======================
  {
    id: 'kapi',
    sector: 'services',
    name: 'KAPI CONSULT',
    category: 'Conseil & Formation',
    description: 'Cabinet spécialisé dans le conseil stratégique et l’assistance technique.',
    logo: P + 'kapiconsult.png',
    site: 'https://kapiconsult.tg/',
    details: [
      {
        kind: 'tags',
        titleKey: 'SECTEURS.SERVICES_PAGE.EXPERTISE',
        items: ['Analyse & Compétitivité', 'Études de faisabilité', 'PPP', 'Formation', 'Management', 'Financement'],
      },
    ],
  },
  {
    id: 'diwa-international',
    sector: 'services',
    name: 'DIWA INTERNATIONAL',
    category: 'Commerce & Représentation',
    description: 'Spécialiste des équipements automobiles et industriels.',
    logo: P + 'diwa-international.png',
    site: null,
    details: [
      {
        kind: 'tags',
        titleKey: 'SECTEURS.SERVICES_PAGE.STRATEGIC_PARTNERS',
        items: ['Petronas', 'ACDelco', 'Continental', 'Chevrolet Isuzu', 'MG', 'Itochu'],
      },
    ],
  },
  {
    id: 'trfs',
    sector: 'services',
    name: 'TRFS',
    category: 'Transport & Logistique',
    description: 'Référence dans le transport routier et la logistique au Togo.',
    logo: P + 'trfs.png',
    site: 'https://trfs.africa/',
    details: [
      { kind: 'highlights', items: [{ value: '24/7', label: 'Suivi', icon: 'fa-satellite-dish' }, { value: 'SAFE', label: 'Transit', icon: 'fa-shield-halved' }] },
    ],
  },
  {
    id: 'bonici',
    sector: 'services',
    name: 'BONICI',
    category: 'Restauration',
    description: 'Entreprise spécialisée dans la restauration rapide et les produits locaux.',
    logo: P + 'bonici.png',
    site: 'https://bonici.africa/',
    details: [],
  },
  {
    id: 'attogo',
    sector: 'services',
    name: '@TOGO',
    category: 'Digital & Fintech',
    description: 'Entreprise innovante spécialisée dans les solutions digitales et la fintech.',
    logo: P + 'attogo.png',
    site: 'https://arobase.tg/',
    details: [],
  },
];

export const companiesBySector = (slug) => COMPANIES.filter((c) => c.sector === slug);
export const sectorBySlug = (slug) => SECTORS.find((s) => s.slug === slug);
