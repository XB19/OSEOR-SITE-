// Données de la page d'accueil (identiques au projet d'origine)

// Statistiques — data.sql du backend, libellés traduits via STATS.*
export const STATS = [
  { key: 'STATS.ENTREPRISES', value: 100, icon: 'fa-building' },
  { key: 'STATS.PROJETS', value: 50, icon: 'fa-diagram-project' },
  { key: 'STATS.SECTEURS', value: 100, icon: 'fa-table-cells-large' },
  { key: 'STATS.MISSIONS', value: 100, icon: 'fa-list-check' },
];

// Expertises — titres/images du composant Angular, descriptions du backend
export const EXPERTISES = [
  { titleKey: 'EXPERTISES.STRATEGIC', descKey: 'EXPERTISES.STRATEGIC_DESC', image: 'assets/images/investissement.jpg', icon: 'fa-chart-line' },
  { titleKey: 'EXPERTISES.FINANCIAL', descKey: 'EXPERTISES.FINANCIAL_DESC', image: 'assets/images/ingenierie.jpg', icon: 'fa-calculator' },
  { titleKey: 'EXPERTISES.GOVERNANCE', descKey: 'EXPERTISES.GOVERNANCE_DESC', image: 'assets/images/conseil.jpg', icon: 'fa-lightbulb' },
  { titleKey: 'EXPERTISES.DIGITAL', descKey: 'EXPERTISES.DIGITAL_DESC', image: 'assets/images/assistance.jpg', icon: 'fa-screwdriver-wrench' },
];

// Projets accompagnés — composant projets Angular
export const PROJETS = [
  {
    title: 'ZENER SA',
    description: 'Mobilisation de 16 milliards FCFA pour développer les activités de distribution de gaz.',
    image: 'assets/images/zener-sa.png',
    tag: 'Énergie',
    figure: '16 Mds FCFA',
  },
  {
    title: 'Radisson Abidjan',
    description: 'Étude et mobilisation de ressources pour la construction d’un hôtel 5 étoiles Radisson Blu.',
    image: 'assets/images/radisson-abidjan.png',
    tag: 'Hôtellerie',
    figure: '5 ★',
  },
  {
    title: 'Sheraton Bamako',
    description: 'Étude et mobilisation de ressources pour le financement de Sheraton Bamako.',
    image: 'assets/images/sheraton-bamako.png',
    tag: 'Hôtellerie',
    figure: 'Mali',
  },
  {
    title: 'Aéroport International Gnassingbé Eyadema',
    description: 'Contrôle des travaux du système hydrant de l’Aéroport International.',
    image: 'assets/images/aeroport-gnassingbe-eyadema.png',
    tag: 'Infrastructure',
    figure: 'Lomé',
  },
];

// Pourquoi OSEOR
export const POURQUOI = [
  { titleKey: 'POURQUOI.ITEM1_TITLE', descKey: 'POURQUOI.ITEM1_DESC', icon: 'fa-bullseye' },
  { titleKey: 'POURQUOI.ITEM2_TITLE', descKey: 'POURQUOI.ITEM2_DESC', icon: 'fa-layer-group' },
  { titleKey: 'POURQUOI.ITEM3_TITLE', descKey: 'POURQUOI.ITEM3_DESC', icon: 'fa-network-wired' },
];

// Bon Plan — affiches ZenCard
const BP = 'assets/bon-plan/storage/kapi/';
export const BON_PLANS = [
  { image: BP + 'zencard_pub2.jpg', titleKey: 'BON_PLAN_PAGE.OFFER1' },
  { image: BP + 'zencard_pub3.jpg', titleKey: 'BON_PLAN_PAGE.OFFER2' },
  { image: BP + 'zencard_pub5.jpg', titleKey: 'BON_PLAN_PAGE.OFFER3' },
  { image: BP + 'zencard_pub6.jpg', titleKey: 'BON_PLAN_PAGE.OFFER4' },
  { image: BP + 'zencard_pub7.jpg', titleKey: 'BON_PLAN_PAGE.OFFER5' },
  { image: BP + 'zencard_pub5b.jpg', titleKey: 'BON_PLAN_PAGE.OFFER6' },
  { image: BP + 'zencard_pub6b.jpg', titleKey: 'BON_PLAN_PAGE.OFFER7' },
  { image: BP + 'zencard_product.jpg', titleKey: 'BON_PLAN_PAGE.OFFER8' },
];
