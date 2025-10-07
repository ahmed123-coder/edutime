import bcrypt from "bcryptjs";

import { PrismaClient, UserRole, OrganizationType, SubscriptionPlan, MemberRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@saasformation.com" },
    update: {
      password: adminPassword,
      verified: true,
    },
    create: {
      email: "admin@saasformation.com",
      name: "System Administrator",
      password: adminPassword,
      role: UserRole.ADMIN,
      verified: true,
    },
  });

  // Create a sample training center owner
  const centerOwnerPassword = await bcrypt.hash("owner123", 12);
  const centerOwner = await prisma.user.upsert({
    where: { email: "owner@trainingcenter.com" },
    update: {
      password: centerOwnerPassword,
      verified: true,
    },
    create: {
      email: "owner@trainingcenter.com",
      name: "Training Center Owner",
      password: centerOwnerPassword,
      role: UserRole.CENTER_OWNER,
      verified: true,
      phone: "+216 12 345 678",
    },
  });

  // Create a sample teacher
  const teacherPassword = await bcrypt.hash("teacher123", 12);
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@example.com" },
    update: {
      password: teacherPassword,
      verified: true,
    },
    create: {
      email: "teacher@example.com",
      name: "John Doe",
      password: teacherPassword,
      role: UserRole.TEACHER,
      verified: true,
      phone: "+216 98 765 432",
      speciality: "Mathematics",
    },
  });

  // Create a sample training center
  const trainingCenter = await prisma.organization.upsert({
    where: { slug: "excellence-training-center" },
    update: {},
    create: {
      name: "Excellence Training Center",
      slug: "excellence-training-center",
      description: "A modern training center with state-of-the-art facilities for professional development.",
      type: OrganizationType.TRAINING_CENTER,
      subscription: SubscriptionPlan.PRO,
      address: {
        street: "123 Avenue Habib Bourguiba",
        city: "Tunis",
        postalCode: "1000",
        country: "Tunisia",
      },
      coordinates: {
        lat: 36.8065,
        lng: 10.1815,
      },
      hours: {
        monday: { open: "08:00", close: "18:00" },
        tuesday: { open: "08:00", close: "18:00" },
        wednesday: { open: "08:00", close: "18:00" },
        thursday: { open: "08:00", close: "18:00" },
        friday: { open: "08:00", close: "18:00" },
        saturday: { open: "09:00", close: "16:00" },
        sunday: { closed: true },
      },
      phone: "+216 71 123 456",
      email: "contact@excellencetraining.tn",
      website: "https://excellencetraining.tn",
      verified: true,
      active: true,
    },
  });

  // Add center owner as organization member
  await prisma.organizationMember.upsert({
    where: {
      userId_organizationId: {
        userId: centerOwner.id,
        organizationId: trainingCenter.id,
      },
    },
    update: {},
    create: {
      userId: centerOwner.id,
      organizationId: trainingCenter.id,
      role: MemberRole.OWNER,
    },
  });

  // Create sample rooms
  const room1 = await prisma.room.create({
    data: {
      organizationId: trainingCenter.id,
      name: "Conference Room A",
      description: "Large conference room with projector and whiteboard",
      capacity: 30,
      area: 45.5,
      hourlyRate: 25.0,
      equipment: ["Projector", "Whiteboard", "Sound System", "WiFi"],
      amenities: ["Air Conditioning", "Coffee Machine", "Parking"],
      photos: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
      ],
      active: true,
    },
  });

  const room2 = await prisma.room.create({
    data: {
      organizationId: trainingCenter.id,
      name: "Workshop Room B",
      description: "Interactive workshop space with flexible seating",
      capacity: 20,
      area: 35.0,
      hourlyRate: 20.0,
      equipment: ["Interactive Whiteboard", "Tablets", "WiFi"],
      amenities: ["Air Conditioning", "Natural Light", "Parking"],
      photos: ["https://images.unsplash.com/photo-1497366754035-f200968a6e72"],
      active: true,
    },
  });

  // Create a sample partner service organization
  const partnerService = await prisma.organization.upsert({
    where: { slug: "quickprint-services" },
    update: {},
    create: {
      name: "QuickPrint Services",
      slug: "quickprint-services",
      description: "Professional printing and document services",
      type: OrganizationType.PARTNER_SERVICE,
      subscription: SubscriptionPlan.ESSENTIAL,
      address: {
        street: "456 Rue de la République",
        city: "Tunis",
        postalCode: "1001",
        country: "Tunisia",
      },
      phone: "+216 71 987 654",
      email: "contact@quickprint.tn",
      verified: true,
      active: true,
    },
  });

  // Create a partner user
  const partner = await prisma.user.upsert({
    where: { email: "partner@quickprint.tn" },
    update: {},
    create: {
      email: "partner@quickprint.tn",
      name: "QuickPrint Manager",
      role: UserRole.PARTNER,
      verified: true,
      phone: "+216 71 987 654",
    },
  });

  // Add partner as organization member
  await prisma.organizationMember.upsert({
    where: {
      userId_organizationId: {
        userId: partner.id,
        organizationId: partnerService.id,
      },
    },
    update: {},
    create: {
      userId: partner.id,
      organizationId: partnerService.id,
      role: MemberRole.OWNER,
    },
  });

  // Create sample services
  await prisma.service.createMany({
    data: [
      {
        organizationId: partnerService.id,
        name: "Document Printing",
        description: "High-quality document printing service",
        category: "PRINTING",
        price: 0.1,
        unit: "per page",
        active: true,
      },
      {
        organizationId: partnerService.id,
        name: "Document Photocopying",
        description: "Fast photocopying service",
        category: "PHOTOCOPYING",
        price: 0.05,
        unit: "per page",
        active: true,
      },
      {
        organizationId: partnerService.id,
        name: "Document Delivery",
        description: "Same-day document delivery to training centers",
        category: "DOCUMENT_DELIVERY",
        price: 5.0,
        unit: "per delivery",
        active: true,
      },
    ],
  });

  // Create default subscription packages
  const essentialPackage = await prisma.subscriptionPackage.upsert({
    where: { id: "essential-monthly" },
    update: {},
    create: {
      id: "essential-monthly",
      name: "Essential Plan",
      plan: "ESSENTIAL",
      description: "Perfect for small training centers getting started",
      price: 99,
      billingPeriod: "MONTHLY",
      features: [
        "Up to 5 rooms",
        "Up to 50 bookings per month",
        "Up to 3 team members",
        "Basic analytics",
        "Email support",
      ],
      limits: {
        maxRooms: 5,
        maxBookingsPerMonth: 50,
        maxMembers: 3,
      },
    },
  });

  const proPackage = await prisma.subscriptionPackage.upsert({
    where: { id: "pro-monthly" },
    update: {},
    create: {
      id: "pro-monthly",
      name: "Pro Plan",
      plan: "PRO",
      description: "Ideal for growing training centers",
      price: 199,
      billingPeriod: "MONTHLY",
      features: [
        "Up to 15 rooms",
        "Up to 200 bookings per month",
        "Up to 10 team members",
        "Advanced analytics",
        "Priority support",
        "Custom branding",
      ],
      limits: {
        maxRooms: 15,
        maxBookingsPerMonth: 200,
        maxMembers: 10,
      },
    },
  });

  const premiumPackage = await prisma.subscriptionPackage.upsert({
    where: { id: "premium-monthly" },
    update: {},
    create: {
      id: "premium-monthly",
      name: "Premium Plan",
      plan: "PREMIUM",
      description: "For large training centers with advanced needs",
      price: 399,
      billingPeriod: "MONTHLY",
      features: [
        "Unlimited rooms",
        "Unlimited bookings",
        "Unlimited team members",
        "Advanced analytics & reporting",
        "24/7 priority support",
        "Custom branding",
        "API access",
        "White-label solution",
      ],
      limits: {
        maxRooms: 999,
        maxBookingsPerMonth: 9999,
        maxMembers: 999,
      },
    },
  });

  // Assign essential subscription to the training center
  await prisma.subscription.create({
    data: {
      organizationId: trainingCenter.id,
      packageId: essentialPackage.id,
      status: "ACTIVE",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      autoRenew: true,
    },
  });

  console.log("✅ Database seeding completed successfully!");
  console.log("📧 Admin: admin@saasformation.com (password: admin123)");
  console.log("🏢 Center Owner: owner@trainingcenter.com (password: owner123)");
  console.log("👨‍🏫 Teacher: teacher@example.com (password: teacher123)");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
