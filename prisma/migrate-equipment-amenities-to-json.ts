import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateEquipmentAmenitiesToJson() {
  console.log('Starting migration of equipment and amenities to JSON...');

  // Get all rooms with equipment or amenities
  const rooms = await prisma.room.findMany({
    select: {
      id: true,
      equipment: true,
      amenities: true
    }
  });

  console.log(`Found ${rooms.length} rooms to migrate`);

  for (const room of rooms) {
    // Since we're changing from String[] to Json, the existing data should already be compatible
    // as JSON can store arrays. We just need to ensure the data is present.
    // No transformation needed since String[] and JSON arrays are compatible.
    console.log(`Processing room ${room.id}: equipment=${!!room.equipment}, amenities=${!!room.amenities}`);
  }

  console.log('Migration completed successfully!');
}

migrateEquipmentAmenitiesToJson()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });