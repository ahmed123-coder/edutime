import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedEquipmentAndAmenities() {
  // Equipment data
  const equipment = [
    { name: 'Projecteur', description: 'Projecteur HD pour présentations', category: 'Audio-Visuel' },
    { name: 'Écran de projection', description: 'Écran blanc pour projections', category: 'Audio-Visuel' },
    { name: 'Tableau blanc', description: 'Tableau blanc effaçable', category: 'Écriture' },
    { name: 'Flipchart', description: 'Chevalet avec papier', category: 'Écriture' },
    { name: 'Ordinateur portable', description: 'PC portable pour formations', category: 'Informatique' },
    { name: 'Micro sans fil', description: 'Microphone sans fil', category: 'Audio-Visuel' },
    { name: 'Haut-parleurs', description: 'Système audio', category: 'Audio-Visuel' },
    { name: 'Caméra', description: 'Caméra pour enregistrement', category: 'Audio-Visuel' },
  ];

  // Amenities data
  const amenities = [
    { name: 'Wi-Fi gratuit', description: 'Connexion internet haut débit', category: 'Connectivité' },
    { name: 'Climatisation', description: 'Système de climatisation', category: 'Confort' },
    { name: 'Chauffage', description: 'Système de chauffage', category: 'Confort' },
    { name: 'Parking', description: 'Places de parking disponibles', category: 'Accès' },
    { name: 'Accès handicapés', description: 'Accès pour personnes à mobilité réduite', category: 'Accessibilité' },
    { name: 'Cuisine équipée', description: 'Kitchenette avec équipements', category: 'Restauration' },
    { name: 'Machine à café', description: 'Distributeur de café', category: 'Restauration' },
    { name: 'Réfrigérateur', description: 'Réfrigérateur disponible', category: 'Restauration' },
    { name: 'Toilettes', description: 'Sanitaires à proximité', category: 'Sanitaires' },
    { name: 'Éclairage naturel', description: 'Fenêtres avec lumière naturelle', category: 'Éclairage' },
  ];

  // Create equipment
  for (const item of equipment) {
    await prisma.equipment.upsert({
      where: { name: item.name },
      update: {},
      create: item,
    });
  }

  // Create amenities
  for (const item of amenities) {
    await prisma.amenity.upsert({
      where: { name: item.name },
      update: {},
      create: item,
    });
  }

  console.log('Equipment and amenities seeded successfully!');
}

seedEquipmentAndAmenities()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });