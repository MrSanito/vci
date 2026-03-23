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
  const course = formData.get('course') as string;
  const batch = formData.get('batch') as string | null;

  if (!name || !email || !course) {
    return { success: false, message: 'All required fields must be filled.' };
  }

  try {
    await connectToDatabase();

    // 2. Check if student already exists in DB
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return { success: false, message: 'A student with this email already exists.' };
    }

    // 3. Generate Sequential Roll Number
    const year = new Date().getFullYear();
    const studentsThisYear = await Student.countDocuments({ 
        createdAt: { 
            $gte: new Date(`${year}-01-01`), 
            $lte: new Date(`${year}-12-31`) 
        } 
    });
    const rollNumber = `VCI-${year}-${(studentsThisYear + 1).toString().padStart(3, '0')}`;

    // 4. Create User in Clerk (with random password since they use Google)
    const client = await clerkClient()
    
    // Generate a long random password that satisfies all requirements
    const randomPassword = Array(20).fill(0).map(() => Math.random().toString(36).charAt(2)).join('') + 'A1!a';

    const user = await client.users.createUser({
      emailAddress: [email],
      password: randomPassword,
      firstName: name.split(' ')[0],
      lastName: name.split(' ').slice(1).join(' ') || name.split(' ')[0],
      publicMetadata: {
        role: 'student'
      }
    });

    // 5. Create Student in MongoDB
    const newStudent = await Student.create({
      clerkId: user.id,
      name,
      email,
      rollNumber,
      course,
      batch: batch || undefined,
      role: 'student'
    });

    revalidatePath('/admin');
    return { success: true, message: `Student ${name} created successfully! Roll No: ${rollNumber}`, studentId: newStudent._id.toString() };

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
