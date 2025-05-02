// Comprehensive validation script for students.ts
const { z } = require("zod");

// Define the schema directly from lib/schema/student.ts
const STUDENT_ID_PATTERN = /^[sS][0-9]{1,6}$/;

const studentSchema = z.object({
    id: z.string().regex(STUDENT_ID_PATTERN, "Invalid student ID format"),
    name: z.string().min(1, "Name is required"),
});

// Get the complete raw student data from lib/students.ts
const rawStudents = [
    { id: 's1', name: 'Aidan Wang' },
    { id: 's2', name: 'Alek Karagozyan' },
    { id: 's3', name: 'Alexander Ong' },
    { id: 's4', name: 'Alexander Vertikov' },
    { id: 's5', name: 'Aminata Davis' },
    { id: 's6', name: 'Andrew Zhong' },
    { id: 's7', name: 'Ashley Ganesh' },
    { id: 's8', name: 'Bennett Galin' },
    { id: 's9', name: 'Braydon Brewster' },
    { id: 's10', name: 'Brennon DeMeritt' },
    { id: 's11', name: 'Christopher Ho' },
    { id: 's12', name: 'Christopher Nguyen' },
    { id: 's13', name: 'Ciaran Henry' },
    { id: 's14', name: 'Darian Jones' },
    { id: 's15', name: 'David Person' },
    { id: 's16', name: 'Derrick Pennix' },
    { id: 's17', name: 'Efe Alpay' },
    { id: 's18', name: 'Eleonor Zok' },
    { id: 's19', name: 'Emily Cha' },
    { id: 's20', name: 'Emily Figueroa' },
    { id: 's21', name: 'Emily Mueller' },
    { id: 's22', name: 'Eric Hu' },
    { id: 's23', name: 'Ethan Davis' },
    { id: 's24', name: 'Gustavo Trope Mayer' },
    { id: 's25', name: 'Halleluiah Girum' },
    { id: 's26', name: 'Hannah Partigianoni' },
    { id: 's27', name: 'Hans Xu' },
    { id: 's28', name: 'Harrison Powe' },
    { id: 's29', name: 'Helen Horangic' },
    { id: 's30', name: 'Henry Shan' },
    { id: 's31', name: 'Ikenna Odimegwu' },
    { id: 's32', name: 'Isabella Banyasz' },
    { id: 's33', name: 'Jackson Munro' },
    { id: 's34', name: 'Jeffrey Liang' },
    { id: 's35', name: 'Jeremy Lum' },
    { id: 's36', name: 'Jessica Lin' },
    { id: 's37', name: 'John Starman' },
    { id: 's38', name: 'Jonathan Lee' },
    { id: 's39', name: 'Jules de Beauport' },
    { id: 's40', name: 'Julian Cronin' },
    { id: 's41', name: 'Larissa Flora' },
    { id: 's42', name: 'Leah Derenge' },
    { id: 's43', name: 'Leanna Le' },
    { id: 's44', name: 'Lily Zamora' },
    { id: 's45', name: 'Luc Azar-Tanguay' },
    { id: 's46', name: 'Luis Gomez' },
    { id: 's47', name: 'Maksym Temnosagatyi' },
    { id: 's48', name: 'Masha Trifonova' },
    { id: 's49', name: 'Michael Renoit' },
    { id: 's50', name: 'Miora Andriamahefa' },
    { id: 's51', name: 'Mizuki Kai' },
    { id: 's52', name: 'Nanami Hasegawa' },
    { id: 's53', name: 'Natalie Chen' },
    { id: 's54', name: 'Nate Schneider' },
    { id: 's55', name: 'Nathaniel Rodden' },
    { id: 's56', name: 'Neni Alvarado' },
    { id: 's57', name: 'Nicholson Kanefield' },
    { id: 's58', name: 'Nicolas Rombaut-Enriquez' },
    { id: 's59', name: 'Nina Yuan Zhong' },
    { id: 's60', name: 'Oliver Villanueva' },
    { id: 's61', name: 'Paula Suarez' },
    { id: 's62', name: 'Raquelle Barasa' },
    { id: 's63', name: 'Rina Shinozaki' },
    { id: 's64', name: 'Samuel Carrillo' },
    { id: 's65', name: 'Skye Stewart' },
    { id: 's66', name: 'Sophia Healey' },
    { id: 's67', name: 'Sophia Li' },
    { id: 's68', name: 'Sophia Ordonez' },
    { id: 's69', name: 'Sujith Pakala' },
    { id: 's70', name: 'Sydney Fritz' },
    { id: 's71', name: 'Taher Vahanvaty' },
    { id: 's72', name: 'Tanvi Anand' },
    { id: 's73', name: 'Tatum Muller' },
    { id: 's74', name: 'Theodore Carroll' },
    { id: 's75', name: 'Trent Smart' },
    { id: 's76', name: 'Tyler Forman' },
    { id: 's77', name: 'Wei Yang Chan' },
    { id: 's78', name: 'Wenyu Xiong' },
    { id: 's79', name: 'William Wang' },
    { id: 's80', name: 'Zorian Facey' }
];

// Validate and check each student
console.log(`Total students: ${rawStudents.length}`);

// Individual validation
const individualResults = rawStudents.map((student, index) => {
    const result = studentSchema.safeParse(student);
    return {
        index,
        id: student.id,
        name: student.name,
        valid: result.success,
        errors: result.success ? null : result.error.errors
    };
});

const validStudents = individualResults.filter(r => r.valid);
const invalidStudents = individualResults.filter(r => !r.valid);

console.log(`\n✅ Valid students: ${validStudents.length}`);
console.log(`❌ Invalid students: ${invalidStudents.length}`);

if (invalidStudents.length > 0) {
    console.log('\nInvalid student entries:');
    invalidStudents.forEach(invalid => {
        console.log(`- Student #${invalid.index} (${invalid.id}: ${invalid.name})`);
        console.log('  Errors:');
        invalid.errors.forEach(err => {
            console.log(`  - ${err.path.join('.')}: ${err.message}`);
        });
    });
}

// Check for duplicated IDs
const idCounts = {};
rawStudents.forEach(student => {
    idCounts[student.id] = (idCounts[student.id] || 0) + 1;
});

const duplicateIds = Object.entries(idCounts)
    .filter(([_, count]) => count > 1)
    .map(([id]) => id);

console.log(`\nDuplicate IDs: ${duplicateIds.length > 0 ? duplicateIds.join(', ') : 'None'}`);

// Check for duplicated names (case-insensitive)
const nameCounts = {};
rawStudents.forEach(student => {
    const lowerName = student.name.toLowerCase();
    nameCounts[lowerName] = (nameCounts[lowerName] || 0) + 1;
});

const duplicateNames = Object.entries(nameCounts)
    .filter(([_, count]) => count > 1)
    .map(([name]) => name);

console.log(`Duplicate names: ${duplicateNames.length > 0 ? duplicateNames.join(', ') : 'None'}`);

// Validation summary
console.log('\n===== VALIDATION SUMMARY =====');
console.log(`Schema validation: ${invalidStudents.length === 0 ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Duplicate ID check: ${duplicateIds.length === 0 ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Duplicate name check: ${duplicateNames.length === 0 ? '✅ PASS' : '❌ FAIL'}`);

// Final result
if (invalidStudents.length === 0 && duplicateIds.length === 0) {
    console.log('\n✅ ALL STUDENTS PASS VALIDATION');
} else {
    console.log('\n❌ VALIDATION FAILED - See issues above');
} 