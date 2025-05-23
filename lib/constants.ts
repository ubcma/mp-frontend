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

export const EVENT_FIELDS_OLD = [
  { name: 'title', label: 'Title', type: 'text' },
  { name: 'slug', label: 'Slug', type: 'text' },
  { name: 'description', label: 'Description', type: 'text' },
  { name: 'imageUrl', label: 'Image URL', type: 'text' },
  { name: 'price', label: 'Price', type: 'number' },
  { name: 'location', label: 'Location', type: 'text' },
  { name: 'startsAt', label: 'Start Date', type: 'datetime-local' },
  { name: 'endsAt', label: 'End Date', type: 'datetime-local' },
] as const;