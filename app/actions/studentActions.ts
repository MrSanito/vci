'use server'

import { clerkClient } from '@clerk/nextjs/server'
import connectToDatabase from '../lib/db';
import Student from '../models/Student';
import { checkRole } from '../utils/roles';
import { revalidatePath } from 'next/cache';

export async function createStudent(formData: FormData) {
  // 1. Verify Admin Role
  const isAdmin = await checkRole('admin');
  if (!isAdmin) {
    return { success: false, message: 'Unauthorized. Only Admins can create students.' };
  }

  // Extract values from FormData
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const course = formData.get('course') as string;
  const rollNumber = formData.get('rollNumber') as string;
  const batch = formData.get('batch') as string | null;

  if (!name || !email || !password || !rollNumber || !course) {
    return { success: false, message: 'All required fields must be filled.' };
  }

  try {
    await connectToDatabase();

    // 2. Check if student already exists in DB
    const existingStudent = await Student.findOne({ $or: [{ email }, { rollNumber }] });
    if (existingStudent) {
      return { success: false, message: 'Student with this email or Roll Number already exists.' };
    }

    // 3. Create User in Clerk
    const client = await clerkClient()
    
    const user = await client.users.createUser({
      emailAddress: [email],
      password: password,
      firstName: name.split(' ')[0],
      lastName: name.split(' ').slice(1).join(' ') || name.split(' ')[0],
      publicMetadata: {
        role: 'student'
      }
    });

    // 4. Create Student in MongoDB
    await Student.create({
      clerkId: user.id,
      name,
      email,
      rollNumber,
      course,
      batch: batch || undefined,
      role: 'student'
    });

    revalidatePath('/admin');
    return { success: true, message: `Student ${name} created successfully!` };

  } catch (error: any) {
    console.error('Create Student Error:', error);
    // Handle Clerk errors (e.g., password too short, email taken)
    const errorMessage = error.errors?.[0]?.message || error.message || 'Failed to create student.';
    return { success: false, message: errorMessage };
  }
}

export async function getStudents() {
  const isAdmin = await checkRole('admin');
  if (!isAdmin) return [];

  await connectToDatabase();
  const students = await Student.find({}).sort({ createdAt: -1 }).lean();
  
  // Convert _id and dates to serializable format for simple passing to client components if needed
  return JSON.parse(JSON.stringify(students));
}
