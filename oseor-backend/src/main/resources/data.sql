-- Données initiales OSEOR.
-- Ce script est exécuté à chaque démarrage (spring.sql.init.mode=always) : chaque bloc
-- n'insère ses lignes que si la table est vide, pour ne pas recréer de doublons ni
-- ressusciter ce que l'administrateur a supprimé depuis le tableau de bord.

-- Statistiques
INSERT INTO stat (label, value, icon)
SELECT * FROM (VALUES
  ('+100 entreprises accompagnées', '100+', 'fas fa-building'),
  ('+50 projets financés', '50+', 'fas fa-project-diagram'),
  ('+100 sous secteurs couverts', '100+', 'fas fa-th-large'),
  ('+100 missions réalisées', '100+', 'fas fa-tasks')
) AS v(label, value, icon)
WHERE NOT EXISTS (SELECT 1 FROM stat);

-- Expertises
INSERT INTO service (title, description, icon)
SELECT * FROM (VALUES
  ('Investissements Stratégiques', 'Nous injectons des fonds propres pour soutenir votre croissance et renforcer votre structure financière.', 'fas fa-chart-line'),
  ('Ingénierie financière', 'Conseils experts pour optimiser votre structure de capital et faciliter vos levées de fonds.', 'fas fa-calculator'),
  ('Gouvernance & Performance', 'Accompagnement dans la définition et l''exécution de votre vision à long terme.', 'fas fa-lightbulb'),
  ('Digitalisation & Influence', 'Renforcement de vos capacités opérationnelles et managériales pour une excellence durable.', 'fas fa-tools')
) AS v(title, description, icon)
WHERE NOT EXISTS (SELECT 1 FROM service);

-- Secteurs
INSERT INTO secteur (name, image_url)
SELECT * FROM (VALUES
  ('Énergie', 'assets/images/energie.jpg'),
  ('Industrie', 'assets/images/industrie.jpg'),
  ('Services', 'assets/images/sectors/services/services-1.png')
) AS v(name, image_url)
WHERE NOT EXISTS (SELECT 1 FROM secteur);

-- Entreprises / filiales (16)
INSERT INTO entreprise (name, secteur, description, logo_url, official_site)
SELECT * FROM (VALUES
  -- ÉNERGIE (8)
  ('ZIH — ZENER International Holding', 'Énergie', 'Holding énergie du Groupe ZENER spécialisée dans les investissements, infrastructures de stockage, transport de combustible et solutions énergétiques diversifiées.', 'assets/images/partners/zih.png', NULL),
  ('ZENER TOGO SA', 'Énergie', 'Filiale spécialisée dans l’importation, le stockage et la distribution des produits pétroliers, GPL, lubrifiants et accessoires du gaz.', 'assets/images/partners/zener.png', 'https://zener.tg/'),
  ('POWER LINK SOLUTIONS SA', 'Énergie', 'Entreprise spécialisée dans le trading, le stockage et les infrastructures de gaz butane avec dépôt gazier en zone portuaire.', 'assets/images/partners/pls.png', 'https://pls.tg/'),
  ('POWER & GAS STORAGE SA', 'Énergie', 'Entreprise spécialisée dans le stockage de propane, terminaux gaziers et solutions énergétiques destinées au secteur industriel.', 'assets/images/partners/pgs.png', 'https://pgs.tg/'),
  ('DIWA INDUSTRIES SA', 'Énergie', 'Filiale spécialisée dans la production et commercialisation d’emballages et contenants métalliques certifiée ISO 9001/2025.', 'assets/images/partners/diwa-indus.png', 'https://diwaindustries.tg/'),
  ('BLUEN SA', 'Énergie', 'Filiale de développement de solutions d’énergies renouvelables, solutions solaires et transition énergétique.', 'assets/images/partners/bluen.png', 'https://bluen.tg/'),
  ('ZENER BENIN SA', 'Énergie', 'Filiale créée en 2023 spécialisée dans la distribution de produits pétroliers, GPL et développement énergétique au Bénin.', 'assets/images/partners/zih.png', NULL),
  ('ZEN GRUPO LDA', 'Énergie', 'Acteur dominant du secteur pétrolier et gazier en Guinée-Bissau spécialisé dans le stockage et la distribution énergétique.', 'assets/images/partners/zih.png', NULL),
  -- INDUSTRIE (3)
  ('DIWA INDUSTRIES SA', 'Industrie', 'Spécialiste de l’emballage industriel et du stockage énergétique.', 'assets/images/partners/diwa-indus.png', 'https://diwaindustries.tg/'),
  ('JCEM GROUPE TOGO SAS', 'Industrie', 'Expert en béton prêt à l’emploi et solutions BTP modernes.', 'assets/images/partners/jcem.png', 'https://jcem.tg/'),
  ('DABA SAS', 'Industrie', 'Entreprise agro-industrielle spécialisée dans la transformation de produits d’élevage.', 'assets/images/partners/daba.png', 'https://daba.tg/'),
  -- SERVICES (5)
  ('KAPI CONSULT', 'Services', 'Cabinet spécialisé dans le conseil stratégique et l’assistance technique.', 'assets/images/partners/kapiconsult.png', 'https://kapiconsult.tg/'),
  ('DIWA INTERNATIONAL', 'Services', 'Spécialiste des équipements automobiles et industriels.', 'assets/images/partners/diwa-international.png', NULL),
  ('TRFS', 'Services', 'Référence dans le transport routier et la logistique au Togo.', 'assets/images/partners/trfs.png', 'https://trfs.africa/'),
  ('BONICI', 'Services', 'Entreprise spécialisée dans la restauration rapide et les produits locaux.', 'assets/images/partners/bonici.png', 'https://bonici.africa/'),
  ('@TOGO', 'Services', 'Entreprise innovante spécialisée dans les solutions digitales et la fintech.', 'assets/images/partners/attogo.png', 'https://arobase.tg/')
) AS v(name, secteur, description, logo_url, official_site)
WHERE NOT EXISTS (SELECT 1 FROM entreprise);

-- Projets accompagnés (ceux affichés sur le site)
INSERT INTO projet (title, description, image_url)
SELECT * FROM (VALUES
  ('ZENER SA', 'Mobilisation de 16 milliards FCFA pour développer les activités de distribution de gaz.', 'assets/images/zener-sa.png'),
  ('Radisson Abidjan', 'Étude et mobilisation de ressources pour la construction d’un hôtel 5 étoiles Radisson Blu.', 'assets/images/radisson-abidjan.png'),
  ('Sheraton Bamako', 'Étude et mobilisation de ressources pour le financement de Sheraton Bamako.', 'assets/images/sheraton-bamako.png'),
  ('Aéroport International Gnassingbé Eyadema', 'Contrôle des travaux du système hydrant de l’Aéroport International.', 'assets/images/aeroport-gnassingbe-eyadema.png')
) AS v(title, description, image_url)
WHERE NOT EXISTS (SELECT 1 FROM projet);

-- Administrateur par défaut : admin@oseor.tg / Admin@2026!
-- (créé une seule fois ; un mot de passe modifié depuis le tableau de bord n'est plus écrasé)
INSERT INTO users (email, password, role)
VALUES ('admin@oseor.tg', '$2a$10$5hY3hsf/RMKwjayoZ7TlVO4Dx7DASlPEG3iuF5O63QBeiYqie410y', 'ADMIN')
ON CONFLICT (email) DO NOTHING;
