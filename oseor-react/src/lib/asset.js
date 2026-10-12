// Chemins absolus vers /public, valables quelle que soit la profondeur de la route
export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
