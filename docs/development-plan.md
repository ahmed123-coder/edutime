# SaaS Formation Space Management Platform - Development Plan

## Tech Stack

- **Frontend**: Next.js 14+ with App Router
- **UI Components**: shadcn/ui + Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payment**: Konnect & ClickToPay integration
- **File Storage**: AWS S3 or Cloudinary
- **Email**: Resend or SendGrid
- **SMS**: WinSMS API
- **Maps**: Google Maps API
- **Deployment**: Vercel or AWS

## Project Structure

```
saas-formation/
├── apps/
│   ├── web/                 # Main Next.js application
│   └── admin/               # Admin dashboard (optional separate app)
├── packages/
│   ├── ui/                  # Shared UI components (shadcn/ui)
│   ├── database/            # Prisma schema and migrations
│   ├── auth/                # Authentication logic
│   └── emails/              # Email templates
├── docs/
└── tools/
```

## Phase 1: Foundation & Core Setup (Week 1-2)

### 1.1 Project Initialization

- [ ] Initialize Next.js project with TypeScript
- [ ] Setup shadcn/ui components
- [ ] Configure Tailwind CSS
- [ ] Setup ESLint, Prettier, and Husky
- [ ] Initialize Git repository with proper .gitignore

### 1.2 Database Setup

- [ ] Design Prisma schema for multi-tenant architecture
- [ ] Setup PostgreSQL database
- [ ] Create initial migrations
- [ ] Seed database with test data

### 1.3 Authentication System

- [ ] Setup NextAuth.js with multiple providers
- [ ] Implement role-based access control (RBAC)
- [ ] Create user registration/login flows
- [ ] Setup email verification

## Phase 2: Core Database Schema (Week 2-3)

### 2.1 User Management

```prisma
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String?
  role        UserRole
  verified    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum UserRole {
  ADMIN
  CENTER_OWNER
  TRAINING_MANAGER
  TEACHER
  PARTNER
}
```

### 2.2 Multi-tenant Architecture

```prisma
model Organization {
  id          String @id @default(cuid())
  name        String
  slug        String @unique
  type        OrgType
  subscription SubscriptionPlan
  // ... other fields
}

enum OrgType {
  TRAINING_CENTER
  PARTNER_SERVICE
}
```

### 2.3 Core Entities

- [ ] Training Centers (Organizations)
- [ ] Rooms/Spaces
- [ ] Bookings/Reservations
- [ ] Payments & Transactions
- [ ] Reviews & Ratings
- [ ] Services & Partners

## Phase 3: Core Features Development (Week 3-6)

### 3.1 Training Center Management

- [ ] Center profile creation and management
- [ ] Room/space management (CRUD operations)
- [ ] Photo upload and management
- [ ] Equipment and amenities tracking
- [ ] Pricing configuration

### 3.2 Booking System

- [ ] Calendar component with availability
- [ ] Booking creation workflow
- [ ] Booking validation and approval
- [ ] Conflict detection and prevention
- [ ] Booking status management

### 3.3 Teacher Interface

- [ ] Teacher profile management
- [ ] Center search and filtering
- [ ] Interactive map with centers
- [ ] Booking request submission
- [ ] Booking history and management

## Phase 4: Payment Integration (Week 6-7)

### 4.1 Payment Providers

- [ ] Konnect payment integration
- [ ] ClickToPay integration
- [ ] Payment method management
- [ ] Secure payment processing

### 4.2 Financial Management

- [ ] Invoice generation
- [ ] Receipt creation
- [ ] Commission calculation
- [ ] Subscription billing
- [ ] Refund processing

## Phase 5: Advanced Features (Week 7-10)

### 5.1 Notification System

- [ ] Email notifications (Resend/SendGrid)
- [ ] SMS notifications (WinSMS)
- [ ] Push notifications
- [ ] Notification preferences
- [ ] Template management

### 5.2 Review & Rating System

- [ ] Review submission
- [ ] Rating calculation
- [ ] Review moderation
- [ ] Response management

### 5.3 Promotion System

- [ ] Discount code creation
- [ ] Promotional campaigns
- [ ] Special offers
- [ ] Coupon management

## Phase 6: Partner Services (Week 10-11)

### 6.1 Partner Management

- [ ] Partner registration
- [ ] Service catalog
- [ ] Order management
- [ ] Service delivery tracking

### 6.2 Document Services

- [ ] File upload system
- [ ] Print job management
- [ ] Delivery coordination
- [ ] Service billing

## Phase 7: Administration & Analytics (Week 11-12)

### 7.1 Admin Dashboard

- [ ] Platform overview
- [ ] User management
- [ ] Content moderation
- [ ] Financial reporting
- [ ] System monitoring

### 7.2 Analytics & Reporting

- [ ] Booking analytics
- [ ] Revenue tracking
- [ ] User behavior analysis
- [ ] Performance metrics
- [ ] Export functionality

## Phase 8: Mobile Optimization & PWA (Week 12-13)

### 8.1 Mobile Experience

- [ ] Responsive design optimization
- [ ] Touch-friendly interfaces
- [ ] Mobile-specific features
- [ ] Performance optimization

### 8.2 Progressive Web App

- [ ] Service worker implementation
- [ ] Offline functionality
- [ ] App-like experience
- [ ] Push notification support

## Phase 9: Testing & Quality Assurance (Week 13-14)

### 9.1 Testing Strategy

- [ ] Unit tests (Jest/Vitest)
- [ ] Integration tests
- [ ] E2E tests (Playwright)
- [ ] API testing
- [ ] Performance testing

### 9.2 Security & Compliance

- [ ] Security audit
- [ ] GDPR compliance
- [ ] Data encryption
- [ ] Access control validation
- [ ] Penetration testing

## Phase 10: Deployment & Launch (Week 14-15)

### 10.1 Production Setup

- [ ] Production environment configuration
- [ ] Database migration
- [ ] CDN setup
- [ ] Monitoring and logging
- [ ] Backup strategy

### 10.2 Launch Preparation

- [ ] User documentation
- [ ] Admin training materials
- [ ] Support system setup
- [ ] Marketing materials
- [ ] Beta testing program

## Detailed Technical Implementation

### Database Schema Design

#### Core Models

```prisma
// User and Authentication
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  phone         String?
  role          UserRole
  verified      Boolean   @default(false)
  avatar        String?
  speciality    String?   // For teachers
  documents     Json?     // Verification documents
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  organizations OrganizationMember[]
  bookings      Booking[]
  reviews       Review[]
  payments      Payment[]

  @@map("users")
}

enum UserRole {
  ADMIN
  CENTER_OWNER
  TRAINING_MANAGER
  TEACHER
  PARTNER
}

// Multi-tenant Organization
model Organization {
  id              String             @id @default(cuid())
  name            String
  slug            String             @unique
  description     String?
  logo            String?
  type            OrganizationType
  subscription    SubscriptionPlan
  subscriptionEnd DateTime?
  address         Json               // Address object
  coordinates     Json?              // Lat/lng
  hours           Json?              // Operating hours
  phone           String?
  email           String?
  website         String?
  verified        Boolean            @default(false)
  active          Boolean            @default(true)
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  // Relations
  members         OrganizationMember[]
  rooms           Room[]
  bookings        Booking[]
  reviews         Review[]
  promotions      Promotion[]
  services        Service[]

  @@map("organizations")
}

enum OrganizationType {
  TRAINING_CENTER
  PARTNER_SERVICE
}

enum SubscriptionPlan {
  ESSENTIAL
  PRO
  PREMIUM
}

// Organization membership
model OrganizationMember {
  id             String       @id @default(cuid())
  userId         String
  organizationId String
  role           MemberRole
  permissions    Json?
  createdAt      DateTime     @default(now())

  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@unique([userId, organizationId])
  @@map("organization_members")
}

enum MemberRole {
  OWNER
  MANAGER
  STAFF
}

// Rooms and Spaces
model Room {
  id             String       @id @default(cuid())
  organizationId String
  name           String
  description    String?
  capacity       Int
  area           Float?       // Square meters
  hourlyRate     Decimal      @db.Decimal(10,2)
  equipment      Json?        // Array of equipment
  amenities      Json?        // Array of amenities
  photos         Json?        // Array of photo URLs
  active         Boolean      @default(true)
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  // Relations
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  bookings       Booking[]
  availability   RoomAvailability[]

  @@map("rooms")
}

// Room availability and blocking
model RoomAvailability {
  id        String              @id @default(cuid())
  roomId    String
  date      DateTime            @db.Date
  startTime DateTime            @db.Time
  endTime   DateTime            @db.Time
  type      AvailabilityType
  reason    String?
  createdAt DateTime            @default(now())

  room      Room                @relation(fields: [roomId], references: [id], onDelete: Cascade)

  @@unique([roomId, date, startTime, endTime])
  @@map("room_availability")
}

enum AvailabilityType {
  AVAILABLE
  BLOCKED
  MAINTENANCE
}

// Booking System
model Booking {
  id             String        @id @default(cuid())
  organizationId String
  roomId         String
  userId         String        // Teacher who made the booking
  date           DateTime      @db.Date
  startTime      DateTime      @db.Time
  endTime        DateTime      @db.Time
  totalAmount    Decimal       @db.Decimal(10,2)
  commission     Decimal       @db.Decimal(10,2)
  status         BookingStatus
  paymentMethod  PaymentMethod?
  paymentStatus  PaymentStatus @default(PENDING)
  notes          String?
  cancelReason   String?
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  // Relations
  organization   Organization  @relation(fields: [organizationId], references: [id])
  room           Room          @relation(fields: [roomId], references: [id])
  user           User          @relation(fields: [userId], references: [id])
  payments       Payment[]

  @@map("bookings")
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
  NO_SHOW
}

enum PaymentMethod {
  KONNECT
  CLICKTOPAY
  ON_SITE
  BANK_TRANSFER
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
  PARTIAL_REFUND
}

// Payment and Financial
model Payment {
  id              String        @id @default(cuid())
  bookingId       String
  userId          String
  amount          Decimal       @db.Decimal(10,2)
  commission      Decimal       @db.Decimal(10,2)
  method          PaymentMethod
  status          PaymentStatus
  transactionId   String?       // External payment provider ID
  refundAmount    Decimal?      @db.Decimal(10,2)
  refundReason    String?
  metadata        Json?         // Payment provider specific data
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  // Relations
  booking         Booking       @relation(fields: [bookingId], references: [id])
  user            User          @relation(fields: [userId], references: [id])

  @@map("payments")
}

// Reviews and Ratings
model Review {
  id             String       @id @default(cuid())
  organizationId String
  userId         String
  rating         Int          // 1-5 stars
  comment        String?
  response       String?      // Organization response
  responseAt     DateTime?
  verified       Boolean      @default(false)
  reported       Boolean      @default(false)
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  // Relations
  organization   Organization @relation(fields: [organizationId], references: [id])
  user           User         @relation(fields: [userId], references: [id])

  @@unique([organizationId, userId])
  @@map("reviews")
}

// Promotions and Discounts
model Promotion {
  id             String         @id @default(cuid())
  organizationId String
  name           String
  description    String?
  code           String?        @unique
  type           PromotionType
  value          Decimal        @db.Decimal(10,2)
  minAmount      Decimal?       @db.Decimal(10,2)
  maxDiscount    Decimal?       @db.Decimal(10,2)
  startDate      DateTime
  endDate        DateTime
  usageLimit     Int?
  usageCount     Int            @default(0)
  active         Boolean        @default(true)
  createdAt      DateTime       @default(now())

  // Relations
  organization   Organization   @relation(fields: [organizationId], references: [id])

  @@map("promotions")
}

enum PromotionType {
  PERCENTAGE
  FIXED_AMOUNT
  FREE_HOURS
}

// Partner Services
model Service {
  id             String       @id @default(cuid())
  organizationId String       // Partner organization
  name           String
  description    String?
  category       ServiceCategory
  price          Decimal      @db.Decimal(10,2)
  unit           String       // per page, per hour, etc.
  active         Boolean      @default(true)
  createdAt      DateTime     @default(now())

  // Relations
  organization   Organization @relation(fields: [organizationId], references: [id])
  orders         ServiceOrder[]

  @@map("services")
}

enum ServiceCategory {
  PRINTING
  PHOTOCOPYING
  DOCUMENT_DELIVERY
  CATERING
  EQUIPMENT_RENTAL
  OTHER
}

model ServiceOrder {
  id          String            @id @default(cuid())
  serviceId   String
  userId      String
  quantity    Int
  totalAmount Decimal           @db.Decimal(10,2)
  status      ServiceOrderStatus
  notes       String?
  deliveryAddress String?
  deliveryDate    DateTime?
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  // Relations
  service     Service           @relation(fields: [serviceId], references: [id])

  @@map("service_orders")
}

enum ServiceOrderStatus {
  PENDING
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

// Notifications
model Notification {
  id        String           @id @default(cuid())
  userId    String
  type      NotificationType
  title     String
  message   String
  data      Json?            // Additional data
  read      Boolean          @default(false)
  createdAt DateTime         @default(now())

  @@map("notifications")
}

enum NotificationType {
  BOOKING_CONFIRMED
  BOOKING_CANCELLED
  PAYMENT_RECEIVED
  REVIEW_RECEIVED
  PROMOTION_AVAILABLE
  SYSTEM_UPDATE
}
```

### API Structure (Next.js App Router)

#### Authentication Routes

```typescript
// app/api/auth/[...nextauth]/route.ts
// app/api/auth/register/route.ts
// app/api/auth/verify/route.ts
// app/api/auth/forgot-password/route.ts
```

#### Core API Routes

```typescript
// Organizations
// app/api/organizations/route.ts - GET, POST
// app/api/organizations/[id]/route.ts - GET, PUT, DELETE
// app/api/organizations/[id]/rooms/route.ts - GET, POST
// app/api/organizations/[id]/bookings/route.ts - GET
// app/api/organizations/[id]/reviews/route.ts - GET, POST

// Rooms
// app/api/rooms/route.ts - GET (with filters)
// app/api/rooms/[id]/route.ts - GET, PUT, DELETE
// app/api/rooms/[id]/availability/route.ts - GET, POST
// app/api/rooms/[id]/bookings/route.ts - GET

// Bookings
// app/api/bookings/route.ts - GET, POST
// app/api/bookings/[id]/route.ts - GET, PUT, DELETE
// app/api/bookings/[id]/cancel/route.ts - POST
// app/api/bookings/[id]/confirm/route.ts - POST

// Payments
// app/api/payments/route.ts - GET, POST
// app/api/payments/[id]/route.ts - GET
// app/api/payments/webhooks/konnect/route.ts - POST
// app/api/payments/webhooks/clicktopay/route.ts - POST

// Search and Discovery
// app/api/search/organizations/route.ts - GET
// app/api/search/rooms/route.ts - GET
// app/api/map/organizations/route.ts - GET

// Reviews
// app/api/reviews/route.ts - GET, POST
// app/api/reviews/[id]/route.ts - GET, PUT, DELETE
// app/api/reviews/[id]/respond/route.ts - POST

// Services
// app/api/services/route.ts - GET, POST
// app/api/services/[id]/route.ts - GET, PUT, DELETE
// app/api/services/orders/route.ts - GET, POST

// Admin
// app/api/admin/users/route.ts - GET, POST
// app/api/admin/organizations/route.ts - GET
// app/api/admin/analytics/route.ts - GET
```

### Component Architecture

#### Shared UI Components (packages/ui)

```typescript
// Authentication
-LoginForm -
  RegisterForm -
  PasswordResetForm -
  EmailVerification -
  // Layout
  Header -
  Sidebar -
  Footer -
  Navigation -
  Breadcrumbs -
  // Data Display
  DataTable -
  Calendar -
  Map -
  Charts -
  Statistics -
  ReviewCard -
  RoomCard -
  OrganizationCard -
  // Forms
  BookingForm -
  RoomForm -
  OrganizationForm -
  PaymentForm -
  ReviewForm -
  // Feedback
  Toast -
  Modal -
  ConfirmDialog -
  LoadingSpinner -
  EmptyState -
  ErrorBoundary -
  // Navigation
  Pagination -
  Tabs -
  Steps -
  Filters;
```

#### Page Components Structure

```typescript
// app/(auth)/
├── login/page.tsx
├── register/page.tsx
├── verify/page.tsx
└── forgot-password/page.tsx

// app/(dashboard)/
├── dashboard/
│   ├── page.tsx                    # Main dashboard
│   ├── bookings/
│   │   ├── page.tsx               # Bookings list
│   │   ├── [id]/page.tsx          # Booking details
│   │   └── new/page.tsx           # Create booking
│   ├── organizations/
│   │   ├── page.tsx               # Organizations list
│   │   ├── [id]/page.tsx          # Organization details
│   │   └── new/page.tsx           # Create organization
│   ├── rooms/
│   │   ├── page.tsx               # Rooms list
│   │   ├── [id]/page.tsx          # Room details
│   │   └── new/page.tsx           # Create room
│   ├── payments/page.tsx          # Payment history
│   ├── reviews/page.tsx           # Reviews management
│   ├── analytics/page.tsx         # Analytics dashboard
│   └── settings/page.tsx          # User settings

// app/(public)/
├── page.tsx                       # Landing page
├── search/page.tsx                # Search results
├── organizations/
│   └── [slug]/page.tsx           # Public organization page
├── about/page.tsx
├── pricing/page.tsx
└── contact/page.tsx

// app/(admin)/
└── admin/
    ├── page.tsx                   # Admin dashboard
    ├── users/page.tsx             # User management
    ├── organizations/page.tsx     # Organization management
    ├── payments/page.tsx          # Payment management
    ├── reviews/page.tsx           # Review moderation
    └── analytics/page.tsx         # Platform analytics
```

### Key Feature Implementations

#### 1. Multi-tenant Architecture

```typescript
// lib/tenant.ts
export async function getTenantFromRequest(request: Request) {
  const url = new URL(request.url);
  const subdomain = url.hostname.split(".")[0];

  if (subdomain && subdomain !== "www") {
    return await prisma.organization.findUnique({
      where: { slug: subdomain },
    });
  }

  return null;
}

// middleware.ts
export async function middleware(request: NextRequest) {
  const tenant = await getTenantFromRequest(request);

  if (tenant) {
    // Add tenant context to headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-tenant-id", tenant.id);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}
```

#### 2. Booking System with Conflict Detection

```typescript
// lib/booking.ts
export async function checkAvailability(
  roomId: string,
  date: Date,
  startTime: string,
  endTime: string,
): Promise<boolean> {
  const existingBookings = await prisma.booking.findMany({
    where: {
      roomId,
      date,
      status: { in: ["PENDING", "CONFIRMED"] },
      OR: [
        {
          AND: [{ startTime: { lte: startTime } }, { endTime: { gt: startTime } }],
        },
        {
          AND: [{ startTime: { lt: endTime } }, { endTime: { gte: endTime } }],
        },
        {
          AND: [{ startTime: { gte: startTime } }, { endTime: { lte: endTime } }],
        },
      ],
    },
  });

  return existingBookings.length === 0;
}

export async function createBooking(data: BookingCreateInput) {
  return await prisma.$transaction(async (tx) => {
    // Check availability again within transaction
    const isAvailable = await checkAvailability(data.roomId, data.date, data.startTime, data.endTime);

    if (!isAvailable) {
      throw new Error("Time slot is no longer available");
    }

    // Create booking
    const booking = await tx.booking.create({
      data: {
        ...data,
        status: "PENDING",
      },
    });

    // Send notification
    await sendBookingNotification(booking);

    return booking;
  });
}
```

#### 3. Payment Integration

```typescript
// lib/payments/konnect.ts
export class KonnectPaymentProvider {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.KONNECT_API_KEY!;
    this.baseUrl = process.env.KONNECT_BASE_URL!;
  }

  async createPayment(amount: number, bookingId: string) {
    const response = await fetch(`${this.baseUrl}/payments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to cents
        currency: "TND",
        reference: bookingId,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhooks/konnect`,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/${bookingId}/success`,
      }),
    });

    return await response.json();
  }

  async handleWebhook(payload: any) {
    // Verify webhook signature
    // Update payment status
    // Send confirmation notifications
  }
}

// lib/payments/clicktopay.ts
export class ClickToPayProvider {
  // Similar implementation for ClickToPay
}
```

#### 4. Notification System

```typescript
// lib/notifications/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmation(booking: Booking) {
  await resend.emails.send({
    from: "noreply@yourplatform.com",
    to: booking.user.email,
    subject: "Booking Confirmation",
    react: BookingConfirmationEmail({ booking }),
  });
}

// lib/notifications/sms.ts
export async function sendSMS(phone: string, message: string) {
  const response = await fetch("https://api.winsms.co.za/api/rest/v1/sms/outbound/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WINSMS_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [
        {
          to: phone,
          text: message,
        },
      ],
    }),
  });

  return await response.json();
}

// lib/notifications/push.ts
export async function sendPushNotification(userId: string, notification: any) {
  // Implementation for web push notifications
  // Store in database for in-app notifications
  await prisma.notification.create({
    data: {
      userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
    },
  });
}
```

#### 5. Search and Filtering

```typescript
// lib/search.ts
export async function searchOrganizations(params: SearchParams) {
  const { query, location, priceRange, amenities, rating, page = 1, limit = 20 } = params;

  const where: Prisma.OrganizationWhereInput = {
    active: true,
    verified: true,
    ...(query && {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    }),
    ...(location &&
      {
        // Implement geospatial search
      }),
    ...(amenities?.length && {
      rooms: {
        some: {
          amenities: {
            array_contains: amenities,
          },
        },
      },
    }),
  };

  const organizations = await prisma.organization.findMany({
    where,
    include: {
      rooms: {
        where: { active: true },
        take: 3,
      },
      reviews: {
        select: { rating: true },
      },
      _count: {
        select: { reviews: true },
      },
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: [{ verified: "desc" }, { createdAt: "desc" }],
  });

  return organizations.map((org) => ({
    ...org,
    averageRating: org.reviews.length > 0 ? org.reviews.reduce((sum, r) => sum + r.rating, 0) / org.reviews.length : 0,
    reviewCount: org._count.reviews,
  }));
}
```

#### 6. Map Integration

```typescript
// components/Map.tsx
'use client';

import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

interface MapProps {
  organizations: Organization[];
  center?: { lat: number; lng: number };
  onMarkerClick?: (org: Organization) => void;
}

export function Map({ organizations, center, onMarkerClick }: MapProps) {
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '400px' }}
      center={center || { lat: 36.8065, lng: 10.1815 }} // Tunis default
      zoom={12}
    >
      {organizations.map((org) => (
        <Marker
          key={org.id}
          position={{
            lat: org.coordinates.lat,
            lng: org.coordinates.lng
          }}
          onClick={() => {
            setSelectedOrg(org);
            onMarkerClick?.(org);
          }}
        />
      ))}

      {selectedOrg && (
        <InfoWindow
          position={{
            lat: selectedOrg.coordinates.lat,
            lng: selectedOrg.coordinates.lng
          }}
          onCloseClick={() => setSelectedOrg(null)}
        >
          <div className="p-2">
            <h3 className="font-semibold">{selectedOrg.name}</h3>
            <p className="text-sm text-gray-600">{selectedOrg.description}</p>
            <Button
              size="sm"
              className="mt-2"
              onClick={() => router.push(`/organizations/${selectedOrg.slug}`)}
            >
              View Details
            </Button>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
```

### Security Implementation

#### 1. Authentication & Authorization

```typescript
// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
};

// lib/permissions.ts
export function hasPermission(userRole: UserRole, action: string, resource: string): boolean {
  const permissions = {
    ADMIN: ["*"],
    CENTER_OWNER: [
      "organization:read",
      "organization:update",
      "room:create",
      "room:read",
      "room:update",
      "room:delete",
      "booking:read",
      "booking:confirm",
      "booking:cancel",
    ],
    TRAINING_MANAGER: ["organization:read", "room:read", "booking:read", "booking:confirm"],
    TEACHER: ["organization:read", "room:read", "booking:create", "booking:read", "booking:cancel", "review:create"],
    PARTNER: ["service:create", "service:read", "service:update", "order:read", "order:update"],
  };

  const userPermissions = permissions[userRole] || [];
  return userPermissions.includes("*") || userPermissions.includes(`${resource}:${action}`);
}
```

#### 2. Data Validation & Sanitization

```typescript
// lib/validation.ts
import { z } from "zod";

export const createBookingSchema = z
  .object({
    roomId: z.string().cuid(),
    date: z.string().datetime(),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    notes: z.string().max(500).optional(),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export const createOrganizationSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(1000).optional(),
  address: z.object({
    street: z.string().min(5),
    city: z.string().min(2),
    postalCode: z.string().min(4),
    country: z.string().min(2),
  }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  email: z.string().email(),
});
```

### Testing Strategy

#### 1. Unit Tests

```typescript
// __tests__/lib/booking.test.ts
import { checkAvailability, createBooking } from "@/lib/booking";
import { prismaMock } from "@/lib/prisma-mock";

describe("Booking System", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("checkAvailability", () => {
    it("should return true when no conflicts exist", async () => {
      prismaMock.booking.findMany.mockResolvedValue([]);

      const result = await checkAvailability("room-1", new Date("2024-01-15"), "09:00", "11:00");

      expect(result).toBe(true);
    });

    it("should return false when time slot conflicts", async () => {
      prismaMock.booking.findMany.mockResolvedValue([
        {
          id: "booking-1",
          startTime: "10:00",
          endTime: "12:00",
          status: "CONFIRMED",
        },
      ]);

      const result = await checkAvailability("room-1", new Date("2024-01-15"), "09:00", "11:00");

      expect(result).toBe(false);
    });
  });
});
```

#### 2. Integration Tests

```typescript
// __tests__/api/bookings.test.ts
import { POST } from "@/app/api/bookings/route";
import { getServerSession } from "next-auth";

jest.mock("next-auth");

describe("/api/bookings", () => {
  it("should create a booking successfully", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "user-1", role: "TEACHER" },
    });

    const request = new Request("http://localhost:3000/api/bookings", {
      method: "POST",
      body: JSON.stringify({
        roomId: "room-1",
        date: "2024-01-15T00:00:00Z",
        startTime: "09:00",
        endTime: "11:00",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.booking).toBeDefined();
  });
});
```

#### 3. E2E Tests

```typescript
// e2e/booking-flow.spec.ts
import { test, expect } from "@playwright/test";

test("complete booking flow", async ({ page }) => {
  // Login as teacher
  await page.goto("/login");
  await page.fill("[data-testid=email]", "teacher@example.com");
  await page.fill("[data-testid=password]", "password123");
  await page.click("[data-testid=login-button]");

  // Search for centers
  await page.goto("/search");
  await page.fill("[data-testid=search-input]", "Training Center");
  await page.click("[data-testid=search-button]");

  // Select a center
  await page.click("[data-testid=center-card]:first-child");

  // Select a room and time
  await page.click("[data-testid=room-card]:first-child");
  await page.click("[data-testid=date-picker]");
  await page.click("[data-testid=time-slot-9-11]");

  // Complete booking
  await page.click("[data-testid=book-now-button]");
  await page.fill("[data-testid=notes]", "Test booking");
  await page.click("[data-testid=confirm-booking]");

  // Verify success
  await expect(page.locator("[data-testid=booking-success]")).toBeVisible();
});
```

### Deployment Configuration

#### 1. Environment Variables

```bash
# .env.example
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/saas_formation"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Payment Providers
KONNECT_API_KEY="your-konnect-api-key"
KONNECT_BASE_URL="https://api.konnect.network"
CLICKTOPAY_API_KEY="your-clicktopay-api-key"

# Email Service
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@yourplatform.com"

# SMS Service
WINSMS_API_KEY="your-winsms-api-key"

# File Storage
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_S3_BUCKET="your-s3-bucket"
AWS_REGION="us-east-1"

# Maps
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Formation Space"
```

#### 2. Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### 3. CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run test:e2e

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: "--prod"
```

### Development Workflow

#### 1. Git Workflow

```bash
# Feature development
git checkout -b feature/booking-system
git add .
git commit -m "feat: implement booking conflict detection"
git push origin feature/booking-system

# Create PR and merge after review
# Deploy to staging automatically
# Deploy to production after approval
```

#### 2. Database Migrations

```bash
# Create migration
npx prisma migrate dev --name add_booking_table

# Deploy to production
npx prisma migrate deploy

# Generate client
npx prisma generate
```

#### 3. Monitoring & Logging

```typescript
// lib/monitoring.ts
import { Sentry } from "@sentry/nextjs";

export function logError(error: Error, context?: any) {
  console.error(error);
  Sentry.captureException(error, { extra: context });
}

export function logEvent(event: string, data?: any) {
  console.log(`Event: ${event}`, data);
  // Send to analytics service
}
```

## Next Steps

1. **Setup Development Environment**
   - Initialize Next.js project with TypeScript
   - Configure shadcn/ui and Tailwind CSS
   - Setup PostgreSQL database
   - Configure Prisma ORM

2. **Implement Core Authentication**
   - Setup NextAuth.js
   - Create user registration/login flows
   - Implement role-based access control

3. **Build Database Schema**
   - Create Prisma models
   - Run initial migrations
   - Seed test data

4. **Start with MVP Features**
   - Organization management
   - Room management
   - Basic booking system
   - Simple payment integration

5. **Iterate and Expand**
   - Add advanced features
   - Implement integrations
   - Optimize performance
   - Add comprehensive testing

This development plan provides a comprehensive roadmap for building the SaaS formation space management platform with all the features specified in the PRD.

```

```

```

```
