import { Degree } from "./types";

export const INTEREST_OPTIONS = [
  'Digital Marketing',
  'Brand Management',
  'Entrepreneurship',
  'UI/UX',
  'Graphic Design',
  'Consulting',
  'Product Management',
  'Sales',
];

export const DIETARY_RESTRICTIONS = [
  'Vegetarian',
  'Vegan',
  'Pescetarian',
  'Halal',
  'Kosher',
  'Gluten',
  'Dairy',
  'Peanuts',
  'Nuts',
  'Fish / Shellfish',
];

export const YEAR_OPTIONS = [
    '1',
    '2',
    '3',
    '4',
    '5+',
]

export enum Faculty {
  Commerce = "Commerce",
  Arts = "Arts",
  Science = "Science",
  AppliedScience = "Applied Science",
  Other = "Other",
}

export const FACULTIES = Object.values(Faculty);

export const FacultyMajors: Record<Faculty, string[]> = {
  [Faculty.Commerce]: [
    "Accounting",
    "BUCS",
    "BTM",
    "Entrepreneurship",
    "Finance",
    "Global Supply Chain",
    "Marketing",
    "OBHR",
    "Operations & Logistics",
    "Real Estate",
    "Other",
  ].sort((a, b) => a.localeCompare(b)),

  [Faculty.Arts]: [
    "Anthropology",
    "COGS",
    "Economics",
    "Journalism",
    "Media Studies",
    "Philosophy",
    "Political Science",
    "Psychology",
    "Other",
  ].sort((a, b) => a.localeCompare(b)),

  [Faculty.Science]: [
    "COGS",
    "Computer Science",
    "Other",
  ].sort((a, b) => a.localeCompare(b)),

  [Faculty.AppliedScience]: [
    "Biomedical Engineering",
    "Chemical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Materials Engineering",
    "Mechanical Engineering",
    "Other",
  ].sort((a, b) => a.localeCompare(b)),

  [Faculty.Other]: ["Other"],
};

export function getMajorsForFaculty(faculty: Faculty) {
  return FacultyMajors[faculty];
}


// export const DEGREES: Degree[] = [
//   {
//     faculty: 'Commerce',
//     majors: [
//       'Accounting',
//       'Business & Computer Science (BUCS)',
//       'Business Technology Management (BTM)',
//       'Entrepreneurship',
//       'Finance',
//       'Global Supply Chain',
//       'Marketing',
//       'OBHR',
//       'Operations & Logistics',
//       'Other',
//       'Real Estate',
//     ].sort((a, b) => a.localeCompare(b)),
//   },
//   {
//     faculty: 'Arts',
//     majors: [
//       'Anthropology',
//       'COGS',
//       'Economics',
//       'Journalism',
//       'Media Studies',
//       'Philosophy',
//       'Political Science',
//       'Psychology',
//       'Other',
//     ].sort((a, b) => a.localeCompare(b)),
//   },
//   {
//     faculty: 'Science',
//     majors: ['COGS', 'Computer Science', 'Other'].sort((a, b) =>
//       a.localeCompare(b)
//     ),
//   },
//   {
//     faculty: 'Applied Science',
//     majors: [
//       'Biomedical Engineering',
//       'Chemical Engineering',
//       'Civil Engineering',
//       'Electrical Engineering',
//       'Materials Engineering',
//       'Mechanical Engineering',
//       'Other',
//     ].sort((a, b) => a.localeCompare(b)),
//   },
//   {
//     faculty: 'Other',
//     majors: [],
//   },
// ];

// export const FACULTIES: string[] = DEGREES.map((degree) => degree.faculty)