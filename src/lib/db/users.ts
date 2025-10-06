import bcrypt from "bcryptjs";

import { UserRole } from "../../generated/prisma";
import { prisma } from "../prisma";

export interface CreateUserData {
  email: string;
  name?: string;
  phone?: string;
  role: UserRole;
  password?: string;
  speciality?: string;
  verified?: boolean;
}

export async function createUser(data: CreateUserData) {
  const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : undefined;

  return await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: data.role,
      speciality: data.speciality,
      verified: data.verified ?? false,
    },
  });
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      organizations: {
        include: {
          organization: true,
        },
      },
    },
  });
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      organizations: {
        include: {
          organization: true,
        },
      },
    },
  });
}

export async function updateUser(id: string, data: Partial<CreateUserData>) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

export async function verifyUser(id: string) {
  return await prisma.user.update({
    where: { id },
    data: { verified: true },
  });
}

export async function getUsersByRole(role: UserRole) {
  return await prisma.user.findMany({
    where: { role },
    orderBy: { createdAt: "desc" },
  });
}
