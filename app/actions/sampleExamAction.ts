'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import connectToDatabase from '../lib/db';
import Exam from '../models/Exam';

export async function createSampleExam() {
  const { userId } = await auth();
  
  if (!userId) {
    return { success: false, message: 'Unauthorized' };
  }

  // Check if user is admin
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  // @ts-ignore
  const userRole = user.publicMetadata?.role;
  
  if (userRole !== 'admin') {
    return { success: false, message: 'Only admins can create exams' };
  }

  await connectToDatabase();

  // Check if sample exam already exists
  const existing = await Exam.findOne({ title: 'Computer Hardware Fundamentals' });
  if (existing) {
    return { success: false, message: 'Sample exam already exists', examId: existing._id };
  }

  const questions = [
    { text: "What does CPU stand for?", options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Computer Processing Unit"], correct: 0 },
    { text: "Which component is considered the brain of the computer?", options: ["RAM", "Hard Drive", "CPU", "Motherboard"], correct: 2 },
    { text: "What is the primary function of RAM?", options: ["Permanent storage", "Temporary storage for running programs", "Processing data", "Cooling the system"], correct: 1 },
    { text: "Which type of memory is volatile?", options: ["Hard Disk", "SSD", "RAM", "ROM"], correct: 2 },
    { text: "What does HDD stand for?", options: ["High Definition Drive", "Hard Disk Drive", "Heavy Data Drive", "Hybrid Digital Drive"], correct: 1 },
    { text: "Which is faster: SSD or HDD?", options: ["HDD", "SSD", "Both are same", "Depends on brand"], correct: 1 },
    { text: "What is the main circuit board of a computer called?", options: ["CPU Board", "Motherboard", "RAM Board", "Power Board"], correct: 1 },
    { text: "Which port is commonly used for connecting monitors?", options: ["USB", "HDMI", "Ethernet", "Audio Jack"], correct: 1 },
    { text: "What does GPU stand for?", options: ["General Processing Unit", "Graphics Processing Unit", "Game Performance Unit", "Graphical Program Utility"], correct: 1 },
    { text: "Which component supplies power to the computer?", options: ["Motherboard", "CPU", "Power Supply Unit (PSU)", "Hard Drive"], correct: 2 },
    { text: "What is the standard size of a desktop RAM module?", options: ["SODIMM", "DIMM", "RIMM", "SIMM"], correct: 1 },
    { text: "Which cooling method is most common for CPUs?", options: ["Water cooling", "Air cooling with heat sink and fan", "Passive cooling", "No cooling needed"], correct: 1 },
    { text: "What does BIOS stand for?", options: ["Basic Input Output System", "Binary Input Output System", "Basic Internal Operating System", "Binary Internal Output System"], correct: 0 },
    { text: "Which type of storage uses flash memory?", options: ["HDD", "Magnetic Tape", "SSD", "Optical Disc"], correct: 2 },
    { text: "What is the purpose of a graphics card?", options: ["Store data", "Process visual data and display graphics", "Cool the system", "Connect to internet"], correct: 1 },
    { text: "Which connector is used for modern hard drives?", options: ["IDE", "SATA", "SCSI", "Parallel"], correct: 1 },
    { text: "What does USB stand for?", options: ["Universal System Bus", "Universal Serial Bus", "Unified Serial Bus", "Universal Storage Bus"], correct: 1 },
    { text: "How many bits are in 1 byte?", options: ["4", "8", "16", "32"], correct: 1 },
    { text: "What is cache memory used for?", options: ["Permanent storage", "Speed up CPU access to frequently used data", "Display graphics", "Network communication"], correct: 1 },
    { text: "Which component determines the types of RAM a motherboard can use?", options: ["CPU", "Chipset", "GPU", "BIOS"], correct: 1 },
    { text: "What is the typical voltage for a desktop power supply?", options: ["110V or 220V AC input", "5V DC only", "12V DC only", "24V DC only"], correct: 0 },
    { text: "Which type of RAM is faster?", options: ["DDR3", "DDR4", "DDR2", "DDR"], correct: 1 },
    { text: "What does NVMe stand for?", options: ["New Volatile Memory Express", "Non-Volatile Memory Express", "Network Virtual Memory Express", "New Virtual Memory Extension"], correct: 1 },
    { text: "Which port is fastest for data transfer?", options: ["USB 2.0", "USB 3.0", "Thunderbolt 4", "SATA"], correct: 2 },
    { text: "What is thermal paste used for?", options: ["Gluing components", "Improving heat transfer between CPU and cooler", "Waterproofing", "Electrical insulation"], correct: 1 },
    { text: "Which component stores the BIOS firmware?", options: ["RAM", "Hard Drive", "ROM chip on motherboard", "CPU"], correct: 2 },
    { text: "What does PCIe stand for?", options: ["Personal Computer Interface Express", "Peripheral Component Interconnect Express", "Primary Computer Interface Extension", "Parallel Component Interconnect Express"], correct: 1 },
    { text: "Which is NOT a type of computer case form factor?", options: ["ATX", "Micro-ATX", "Mini-ITX", "MEGA-ATX"], correct: 3 },
    { text: "What is the purpose of a sound card?", options: ["Display images", "Process and output audio", "Store music files", "Cool the system"], correct: 1 },
    { text: "How many pins does a modern CPU typically have?", options: ["50-100", "100-500", "500-2000+", "5000+"], correct: 2 },
    { text: "What does RAID stand for?", options: ["Random Array of Independent Disks", "Redundant Array of Independent Disks", "Rapid Access of Internal Disks", "Remote Array of Integrated Disks"], correct: 1 },
    { text: "Which component is responsible for network connectivity?", options: ["Sound Card", "Graphics Card", "Network Interface Card (NIC)", "RAM"], correct: 2 },
    { text: "What is the clock speed of a CPU measured in?", options: ["Watts", "Hertz (GHz)", "Bytes", "Volts"], correct: 1 },
    { text: "Which type of monitor connection is digital?", options: ["VGA", "DVI-D", "Composite", "S-Video"], correct: 1 },
    { text: "What does ESD stand for in computer hardware?", options: ["Electronic System Drive", "Electrostatic Discharge", "External Storage Device", "Enhanced System Display"], correct: 1 },
    { text: "Which component converts AC power to DC power?", options: ["Motherboard", "Power Supply Unit", "CPU", "RAM"], correct: 1 },
    { text: "What is the purpose of a heat sink?", options: ["Store data", "Dissipate heat from components", "Generate power", "Process information"], correct: 1 },
    { text: "Which is the smallest unit of data?", options: ["Byte", "Bit", "Kilobyte", "Nibble"], correct: 1 },
    { text: "What does LCD stand for?", options: ["Light Crystal Display", "Liquid Crystal Display", "Light Cathode Display", "Liquid Cathode Display"], correct: 1 },
    { text: "Which component stores data permanently?", options: ["RAM", "Cache", "Hard Drive", "Registers"], correct: 2 },
    { text: "What is the maximum data transfer rate of USB 3.0?", options: ["480 Mbps", "5 Gbps", "10 Gbps", "1 Gbps"], correct: 1 },
    { text: "Which type of printer uses ink cartridges?", options: ["Laser Printer", "Dot Matrix Printer", "Inkjet Printer", "Thermal Printer"], correct: 2 },
    { text: "What does LED stand for?", options: ["Light Emitting Diode", "Liquid Electronic Display", "Light Electronic Device", "Low Energy Display"], correct: 0 },
    { text: "Which component determines the maximum RAM capacity?", options: ["CPU", "Motherboard chipset", "Power Supply", "Hard Drive"], correct: 1 },
    { text: "What is the purpose of a CMOS battery?", options: ["Power the CPU", "Maintain BIOS settings when PC is off", "Charge the laptop", "Power the RAM"], correct: 1 },
    { text: "Which interface is used for external hard drives?", options: ["PCIe", "USB", "AGP", "ISA"], correct: 1 },
    { text: "What does RPM stand for in hard drives?", options: ["Random Processing Method", "Revolutions Per Minute", "Read Performance Measure", "Rapid Processing Mode"], correct: 1 },
    { text: "Which component is NOT found on a motherboard?", options: ["BIOS chip", "RAM slots", "Monitor", "CPU socket"], correct: 2 },
    { text: "What is the purpose of a UPS?", options: ["Speed up the computer", "Provide backup power during outages", "Cool the system", "Increase storage"], correct: 1 },
    { text: "Which technology allows multiple cores in a single CPU?", options: ["Hyper-Threading", "Multi-core processing", "Overclocking", "Turbo Boost"], correct: 1 }
  ];

  const examQuestions = questions.map(q => ({
    questionText: q.text,
    questionType: 'single',
    options: q.options,
    correctAnswers: [q.correct],
    marks: 2,
    negativeMarks: 0
  }));

  const examData = {
    title: 'Computer Hardware Fundamentals',
    description: 'Test your knowledge of computer hardware components, specifications, and functionality',
    totalDuration: 60,
    sections: [{
      name: 'Hardware Basics',
      questionCount: 50,
      questions: examQuestions
    }],
    totalMarks: 100,
    passingMarks: 60,
    assignedTo: [],
    startDate: new Date(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    instructions: 'Read each question carefully. Each question carries 2 marks. No negative marking. Total duration is 60 minutes.',
    shuffleQuestions: false,
    shuffleOptions: false,
    showResultsImmediately: true,
    createdBy: userId
  };

  try {
    const exam = await Exam.create(examData);
    return { success: true, message: 'Sample exam created successfully!', examId: exam._id };
  } catch (error: any) {
    console.error('Error creating sample exam:', error);
    return { success: false, message: error.message };
  }
}
