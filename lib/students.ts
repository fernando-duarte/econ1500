/**
 * Student roster data for ECON1500
 * Provides student data for login and selection
 */

export interface Student {
    id: string;
    name: string;
}

export const students: Student[] = [
    { id: '1', name: 'Aidan Wang' },
    { id: '2', name: 'Alek Karagozyan' },
    { id: '3', name: 'Alexander Ong' },
    { id: '4', name: 'Alexander Vertikov' },
    { id: '5', name: 'Aminata Davis' },
    { id: '6', name: 'Andrew Zhong' },
    { id: '7', name: 'Ashley Ganesh' },
    { id: '8', name: 'Bennett Galin' },
    { id: '9', name: 'Braydon Brewster' },
    { id: '10', name: 'Brennon DeMeritt' },
    { id: '11', name: 'Christopher Ho' },
    { id: '12', name: 'Christopher Nguyen' },
    { id: '13', name: 'Ciaran Henry' },
    { id: '14', name: 'Darian Jones' },
    { id: '15', name: 'David Person' },
    { id: '16', name: 'Derrick Pennix' },
    { id: '17', name: 'Efe Alpay' },
    { id: '18', name: 'Eleonor Zok' },
    { id: '19', name: 'Emily Cha' },
    { id: '20', name: 'Emily Figueroa' },
    { id: '21', name: 'Emily Mueller' },
    { id: '22', name: 'Eric Hu' },
    { id: '23', name: 'Ethan Davis' },
    { id: '24', name: 'Gustavo Trope Mayer' },
    { id: '25', name: 'Halleluiah Girum' },
    { id: '26', name: 'Hannah Partigianoni' },
    { id: '27', name: 'Hans Xu' },
    { id: '28', name: 'Harrison Powe' },
    { id: '29', name: 'Helen Horangic' },
    { id: '30', name: 'Henry Shan' },
    { id: '31', name: 'Ikenna Odimegwu' },
    { id: '32', name: 'Isabella Banyasz' },
    { id: '33', name: 'Jackson Munro' },
    { id: '34', name: 'Jeffrey Liang' },
    { id: '35', name: 'Jeremy Lum' },
    { id: '36', name: 'Jessica Lin' },
    { id: '37', name: 'John Starman' },
    { id: '38', name: 'Jonathan Lee' },
    { id: '39', name: 'Jules de Beauport' },
    { id: '40', name: 'Julian Cronin' },
    { id: '41', name: 'Larissa Flora' },
    { id: '42', name: 'Leah Derenge' },
    { id: '43', name: 'Leanna Le' },
    { id: '44', name: 'Lily Zamora' },
    { id: '45', name: 'Luc Azar-Tanguay' },
    { id: '46', name: 'Luis Gomez' },
    { id: '47', name: 'Maksym Temnosagatyi' },
    { id: '48', name: 'Masha Trifonova' },
    { id: '49', name: 'Michael Renoit' },
    { id: '50', name: 'Miora Andriamahefa' },
    { id: '51', name: 'Mizuki Kai' },
    { id: '52', name: 'Nanami Hasegawa' },
    { id: '53', name: 'Natalie Chen' },
    { id: '54', name: 'Nate Schneider' },
    { id: '55', name: 'Nathaniel Rodden' },
    { id: '56', name: 'Neni Alvarado' },
    { id: '57', name: 'Nicholson Kanefield' },
    { id: '58', name: 'Nicolas Rombaut-Enriquez' },
    { id: '59', name: 'Nina Yuan Zhong' },
    { id: '60', name: 'Oliver Villanueva' },
    { id: '61', name: 'Paula Suarez' },
    { id: '62', name: 'Raquelle Barasa' },
    { id: '63', name: 'Rina Shinozaki' },
    { id: '64', name: 'Samuel Carrillo' },
    { id: '65', name: 'Skye Stewart' },
    { id: '66', name: 'Sophia Healey' },
    { id: '67', name: 'Sophia Li' },
    { id: '68', name: 'Sophia Ordonez' },
    { id: '69', name: 'Sujith Pakala' },
    { id: '70', name: 'Sydney Fritz' },
    { id: '71', name: 'Taher Vahanvaty' },
    { id: '72', name: 'Tanvi Anand' },
    { id: '73', name: 'Tatum Muller' },
    { id: '74', name: 'Theodore Carroll' },
    { id: '75', name: 'Trent Smart' },
    { id: '76', name: 'Tyler Forman' },
    { id: '77', name: 'Wei Yang Chan' },
    { id: '78', name: 'Wenyu Xiong' },
    { id: '79', name: 'William Wang' },
    { id: '80', name: 'Zorian Facey' }
];

/**
 * Get a student's name by their ID
 * @param id Student ID
 * @returns The student's name or empty string if not found
 */
export function getStudentName(id: string): string {
    const student = students.find(s => s.id === id);
    return student ? student.name : '';
}

/**
 * Get all student names as an array
 * @returns Array of student names
 */
export function getAllStudentNames(): string[] {
    return students.map(student => student.name);
}

/**
 * Find a student by their name
 * @param name Student name to search for
 * @returns Student object or undefined if not found
 */
export function findStudentByName(name: string): Student | undefined {
    return students.find(s => s.name.toLowerCase() === name.toLowerCase());
} 