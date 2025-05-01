// Script to check student validation
const { z } = require("zod");

// Define the schema directly in this script
const STUDENT_ID_PATTERN = /^[sS][0-9]{1,6}$/;

const studentSchema = z.object({
    id: z.string().regex(STUDENT_ID_PATTERN, "Invalid student ID format"),
    name: z.string().min(1, "Name is required"),
});

// Get the raw student data
const rawStudents = [
    { id: 's1', name: 'Aidan Wang' },
    { id: 's2', name: 'Alek Karagozyan' },
    { id: 's3', name: 'Alexander Ong' },
    { id: 's4', name: 'Alexander Vertikov' },
    { id: 's5', name: 'Aminata Davis' },
    // ... same data as in lib/students.ts
    { id: 's80', name: 'Zorian Facey' }
];

// Validate each student
let validCount = 0;
let invalidCount = 0;
const invalidEntries = [];

rawStudents.forEach((s, index) => {
    const result = studentSchema.safeParse(s);
    if (result.success) {
        validCount++;
    } else {
        invalidCount++;
        invalidEntries.push({
            index,
            entry: s,
            errors: result.error.errors
        });
    }
});

console.log(`Valid entries: ${validCount}`);
console.log(`Invalid entries: ${invalidCount}`);

if (invalidEntries.length > 0) {
    console.log('Invalid entries:');
    console.log(JSON.stringify(invalidEntries, null, 2));
} 