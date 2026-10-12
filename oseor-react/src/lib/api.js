// Client pour l'API Spring Boot (Projet-OSEOR-Backend).
// En développement, /api est relayé vers http://localhost:8080 par Vite (voir vite.config.js).
export const API_URL = import.meta.env.VITE_API_URL || '/api';

const TOKEN_KEY = 'oseor_admin_token';

export const tokenStore = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (token) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* stockage indisponible */
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* stockage indisponible */
    }
  },
};

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

// Appelé quand le jeton est refusé (expiré, révoqué…) : le tableau de bord renvoie vers la connexion
let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = tokenStore.get();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  } catch {
    throw new ApiError('Le serveur est injoignable. Vérifiez que le backend est démarré.', 0);
  }

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    if (auth && (res.status === 401 || res.status === 403)) onUnauthorized();
    // Le proxy Vite renvoie 500/502/504 quand le backend est arrêté
    if (res.status >= 502 || (res.status === 500 && !text)) {
      throw new ApiError('Le serveur est injoignable. Vérifiez que le backend est démarré.', 0);
    }
    const message =
      (data && typeof data === 'object' && (data.message || data.error || Object.values(data).join(' · '))) ||
      `Erreur ${res.status}`;
    throw new ApiError(message, res.status, data);
  }
  return data;
}

/** CRUD générique sur /api/admin/<resource> */
const resource = (path) => ({
  list: () => request(`/admin/${path}`, { auth: true }),
  create: (item) => request(`/admin/${path}`, { method: 'POST', body: item, auth: true }),
  update: (id, item) => request(`/admin/${path}/${id}`, { method: 'PUT', body: item, auth: true }),
  remove: (id) => request(`/admin/${path}/${id}`, { method: 'DELETE', auth: true }),
});

/**
 * Envoi d'un fichier au backend (POST multipart /api/admin/uploads).
 * XMLHttpRequest plutôt que fetch pour suivre la progression. Renvoie { url, name, size, contentType }.
 */
export function uploadFile(file, onProgress = () => {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}/admin/uploads`);
    const token = tokenStore.get();
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      let data = null;
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        /* réponse vide */
      }
      if (xhr.status >= 200 && xhr.status < 300) return resolve(data);
      if (xhr.status === 401 || xhr.status === 403) onUnauthorized();
      if (xhr.status >= 502 || (xhr.status === 500 && !xhr.responseText)) return reject(new ApiError('Le serveur est injoignable. Vérifiez que le backend est démarré.', 0));
      reject(new ApiError(data?.message || `Erreur ${xhr.status}`, xhr.status));
    };
    xhr.onerror = () => reject(new ApiError('Le serveur est injoignable. Vérifiez que le backend est démarré.', 0));
    const body = new FormData();
    body.append('file', file);
    xhr.send(body);
  });
}

export const api = {
  // Public
  getEntreprises: () => request('/entreprises'),
  getProjets: () => request('/projets'),
  getServices: () => request('/services'),
  getStats: () => request('/stats'),
  getSecteurs: () => request('/secteurs'),
  getAppelsOffres: () => request('/appels-offres'),
  getOffresEmploi: () => request('/offres-emploi'),
  getActualites: () => request('/actualites'),
  sendContact: (contact) => request('/contact', { method: 'POST', body: contact }),

  // Authentification
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  me: () => request('/auth/me', { auth: true }),

  // Administration
  admin: {
    entreprises: resource('entreprises'),
    projets: resource('projets'),
    services: resource('services'),
    stats: resource('stats'),
    secteurs: resource('secteurs'),
    actualites: resource('actualites'),
    offres: resource('offres'),
    appelsOffres: resource('appels-offres'),
    users: resource('users'),
    messages: {
      list: () => request('/admin/messages', { auth: true }),
      remove: (id) => request(`/admin/messages/${id}`, { method: 'DELETE', auth: true }),
    },
    candidatures: {
      list: () => request('/admin/candidatures', { auth: true }),
      archive: (id) => request(`/admin/candidatures/${id}/archive`, { method: 'POST', auth: true }),
      remove: (id) => request(`/admin/candidatures/${id}`, { method: 'DELETE', auth: true }),
    },
  },
};
