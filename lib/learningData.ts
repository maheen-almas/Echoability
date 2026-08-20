import type { LearningMode } from './theme';

export type LetterItem = {
  letter: string;
  word: string;
  emoji: string;
};

export const alphabetAM: LetterItem[] = [
  { letter: 'A', word: 'Apple', emoji: '🍎' },
  { letter: 'B', word: 'Ball', emoji: '⚽' },
  { letter: 'C', word: 'Cat', emoji: '🐱' },
  { letter: 'D', word: 'Dog', emoji: '🐶' },
  { letter: 'E', word: 'Egg', emoji: '🥚' },
  { letter: 'F', word: 'Fish', emoji: '🐟' },
  { letter: 'G', word: 'Goat', emoji: '🐐' },
  { letter: 'H', word: 'Hat', emoji: '🎩' },
  { letter: 'I', word: 'Ice', emoji: '🧊' },
  { letter: 'J', word: 'Juice', emoji: '🧃' },
  { letter: 'K', word: 'Kite', emoji: '🪁' },
  { letter: 'L', word: 'Lion', emoji: '🦁' },
  { letter: 'M', word: 'Moon', emoji: '🌙' },
];

export const alphabetNZ: LetterItem[] = [
  { letter: 'N', word: 'Nest', emoji: '🪺' },
  { letter: 'O', word: 'Orange', emoji: '🍊' },
  { letter: 'P', word: 'Pen', emoji: '🖊️' },
  { letter: 'Q', word: 'Queen', emoji: '👑' },
  { letter: 'R', word: 'Rose', emoji: '🌹' },
  { letter: 'S', word: 'Sun', emoji: '☀️' },
  { letter: 'T', word: 'Tree', emoji: '🌳' },
  { letter: 'U', word: 'Umbrella', emoji: '☂️' },
  { letter: 'V', word: 'Van', emoji: '🚐' },
  { letter: 'W', word: 'Watch', emoji: '⌚' },
  { letter: 'X', word: 'Xylophone', emoji: '🎶' },
  { letter: 'Y', word: 'Yarn', emoji: '🧶' },
  { letter: 'Z', word: 'Zebra', emoji: '🦓' },
];

export const alphabet: LetterItem[] = [...alphabetAM, ...alphabetNZ];

export type SentenceItem = { sentence: string; emoji: string };

export const sentences: SentenceItem[] = [
  { sentence: 'This is my pen.', emoji: '🖊️' },
  { sentence: 'I like mango.', emoji: '🥭' },
  { sentence: 'The sun is hot.', emoji: '☀️' },
  { sentence: 'I see a cat.', emoji: '🐱' },
  { sentence: 'We play ball.', emoji: '⚽' },
  { sentence: 'She has a hat.', emoji: '🎩' },
];

export type QuizQuestion = {
  question: string;
  emoji?: string;
  options: string[];
  answer: number;
  speakText?: string;
};

export const alphabetQuiz: QuizQuestion[] = [
  {
    question: 'Which letter comes after A?',
    options: ['B', 'D', 'C', 'E'],
    answer: 0,
    speakText: 'Which letter comes after A?',
  },
  {
    question: 'Which word starts with B?',
    emoji: '⚽',
    options: ['Ball', 'Cat', 'Sun', 'Moon'],
    answer: 0,
    speakText: 'Which word starts with B?',
  },
  {
    question: 'Which letter is this?',
    emoji: '🐱',
    options: ['A', 'C', 'D', 'B'],
    answer: 3,
    speakText: 'Which letter is this? The picture is a cat.',
  },
  {
    question: 'Which word starts with D?',
    emoji: '🐶',
    options: ['Fish', 'Egg', 'Dog', 'Hat'],
    answer: 2,
    speakText: 'Which word starts with D?',
  },
  {
    question: 'Which letter comes after M?',
    options: ['L', 'N', 'O', 'P'],
    answer: 1,
    speakText: 'Which letter comes after M?',
  },
  {
    question: 'Which word starts with S?',
    emoji: '☀️',
    options: ['Sun', 'Moon', 'Star', 'Tree'],
    answer: 0,
    speakText: 'Which word starts with S?',
  },
  {
    question: 'Which letter is this?',
    emoji: '🦓',
    options: ['X', 'Y', 'Z', 'W'],
    answer: 2,
    speakText: 'Which letter is this? The picture is a zebra.',
  },
  {
    question: 'Which word starts with T?',
    emoji: '🌳',
    options: ['Tree', 'Rose', 'Van', 'Kite'],
    answer: 0,
    speakText: 'Which word starts with T?',
  },
];

export type NumberItem = {
  value: number;
  word: string;
  emoji: string;
};

const numberWords = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen', 'twenty', 'thirty', 'forty', 'fifty',
  'sixty', 'seventy', 'eighty', 'ninety', 'one hundred',
];

export const numberWordMap: Record<number, string> = {
  0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five',
  6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten', 11: 'eleven',
  12: 'twelve', 13: 'thirteen', 14: 'fourteen', 15: 'fifteen', 16: 'sixteen',
  17: 'seventeen', 18: 'eighteen', 19: 'nineteen', 20: 'twenty', 30: 'thirty',
  40: 'forty', 50: 'fifty', 60: 'sixty', 70: 'seventy', 80: 'eighty',
  90: 'ninety', 100: 'one hundred',
};

export const numbers0to50: NumberItem[] = Array.from({ length: 51 }, (_, i) => ({
  value: i,
  word: numberWordMap[i] ?? String(i),
  emoji: '🍎',
}));

export const numbers51to100: NumberItem[] = Array.from({ length: 50 }, (_, i) => {
  const v = 51 + i;
  return { value: v, word: numberWordMap[v] ?? String(v), emoji: '🍎' };
});

export const mathsQuiz: QuizQuestion[] = [
  {
    question: 'Which number comes after 5?',
    options: ['4', '6', '7', '8'],
    answer: 1,
    speakText: 'Which number comes after 5?',
  },
  {
    question: 'What is 3 + 2?',
    options: ['4', '5', '6', '7'],
    answer: 1,
    speakText: 'What is 3 plus 2?',
  },
  {
    question: 'What is 10 - 4?',
    options: ['5', '6', '7', '4'],
    answer: 1,
    speakText: 'What is 10 minus 4?',
  },
  {
    question: 'Which number is bigger?',
    options: ['8', '12', '6', '3'],
    answer: 1,
    speakText: 'Which number is bigger?',
  },
  {
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    answer: 1,
    speakText: 'What is 2 plus 2?',
  },
  {
    question: 'What is 7 - 3?',
    options: ['3', '4', '5', '6'],
    answer: 1,
    speakText: 'What is 7 minus 3?',
  },
  {
    question: 'Which number comes after 9?',
    options: ['8', '10', '11', '7'],
    answer: 1,
    speakText: 'Which number comes after 9?',
  },
  {
    question: 'What is 4 + 4?',
    options: ['6', '7', '8', '9'],
    answer: 2,
    speakText: 'What is 4 plus 4?',
  },
];

export type MathLevel = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  range: string;
};

export const mathLevels: MathLevel[] = [
  { id: 'level_0_10', title: 'Numbers 0–10', subtitle: 'Count and recognize', emoji: '🔢', range: '0-10' },
  { id: 'level_11_20', title: 'Numbers 11–20', subtitle: 'Bigger numbers', emoji: '📈', range: '11-20' },
  { id: 'level_21_50', title: 'Numbers 21–50', subtitle: 'Counting higher', emoji: '🚀', range: '21-50' },
  { id: 'level_51_100', title: 'Numbers 51–100', subtitle: 'Big numbers', emoji: '💯', range: '51-100' },
  { id: 'level_addition', title: 'Addition', subtitle: 'Adding numbers', emoji: '➕', range: 'add' },
  { id: 'level_subtraction', title: 'Subtraction', subtitle: 'Taking away', emoji: '➖', range: 'sub' },
  { id: 'level_compare', title: 'Comparing', subtitle: 'More or less', emoji: '⚖️', range: 'compare' },
];

// ---------- Activities ----------
export type ActivityCategory = {
  id: string;
  title: string;
  emoji: string;
  color: string;
  items: { name: string; emoji: string }[];
};

export const activityCategories: ActivityCategory[] = [
  {
    id: 'colors',
    title: 'Colors',
    emoji: '🎨',
    color: '#EF476F',
    items: [
      { name: 'Red', emoji: '🍎' },
      { name: 'Blue', emoji: '🫐' },
      { name: 'Green', emoji: '🥦' },
      { name: 'Yellow', emoji: '🍌' },
      { name: 'Orange', emoji: '🍊' },
      { name: 'Purple', emoji: '🍇' },
      { name: 'Pink', emoji: '🌸' },
      { name: 'Brown', emoji: '🐻' },
    ],
  },
  {
    id: 'shapes',
    title: 'Shapes',
    emoji: '🔷',
    color: '#4F86F7',
    items: [
      { name: 'Circle', emoji: '⭕' },
      { name: 'Square', emoji: '⬜' },
      { name: 'Triangle', emoji: '🔺' },
      { name: 'Star', emoji: '⭐' },
      { name: 'Heart', emoji: '❤️' },
      { name: 'Diamond', emoji: '🔷' },
    ],
  },
  {
    id: 'emotions',
    title: 'Emotions',
    emoji: '😊',
    color: '#FF9F1C',
    items: [
      { name: 'Happy', emoji: '😊' },
      { name: 'Sad', emoji: '😢' },
      { name: 'Angry', emoji: '😠' },
      { name: 'Surprised', emoji: '😮' },
      { name: 'Scared', emoji: '😨' },
      { name: 'Silly', emoji: '😜' },
    ],
  },
  {
    id: 'animals',
    title: 'Animals',
    emoji: '🦁',
    color: '#06D6A0',
    items: [
      { name: 'Lion', emoji: '🦁' },
      { name: 'Elephant', emoji: '🐘' },
      { name: 'Monkey', emoji: '🐵' },
      { name: 'Rabbit', emoji: '🐰' },
      { name: 'Cow', emoji: '🐮' },
      { name: 'Frog', emoji: '🐸' },
    ],
  },
  {
    id: 'fruits',
    title: 'Fruits',
    emoji: '🍎',
    color: '#EF476F',
    items: [
      { name: 'Apple', emoji: '🍎' },
      { name: 'Banana', emoji: '🍌' },
      { name: 'Mango', emoji: '🥭' },
      { name: 'Grapes', emoji: '🍇' },
      { name: 'Orange', emoji: '🍊' },
      { name: 'Strawberry', emoji: '🍓' },
    ],
  },
  {
    id: 'days',
    title: 'Days',
    emoji: '📅',
    color: '#4F86F7',
    items: [
      { name: 'Monday', emoji: '📅' },
      { name: 'Tuesday', emoji: '📅' },
      { name: 'Wednesday', emoji: '📅' },
      { name: 'Thursday', emoji: '📅' },
      { name: 'Friday', emoji: '📅' },
      { name: 'Saturday', emoji: '📅' },
      { name: 'Sunday', emoji: '📅' },
    ],
  },
  {
    id: 'months',
    title: 'Months',
    emoji: '🗓️',
    color: '#2EC4B6',
    items: [
      { name: 'January', emoji: '🗓️' },
      { name: 'February', emoji: '🗓️' },
      { name: 'March', emoji: '🗓️' },
      { name: 'April', emoji: '🗓️' },
      { name: 'May', emoji: '🗓️' },
      { name: 'June', emoji: '🗓️' },
      { name: 'July', emoji: '🗓️' },
      { name: 'August', emoji: '🗓️' },
      { name: 'September', emoji: '🗓️' },
      { name: 'October', emoji: '🗓️' },
      { name: 'November', emoji: '🗓️' },
      { name: 'December', emoji: '🗓️' },
    ],
  },
];

// ---------- Videos ----------
export type VideoItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  emoji: string;
};

export const videos: VideoItem[] = [
  { id: 'v1', title: 'ABC Song', category: 'Alphabet', description: 'Sing along and learn A to Z!', emoji: '🔤' },
  { id: 'v2', title: 'Counting 1 to 10', category: 'Numbers', description: 'Learn numbers with fun animations.', emoji: '🔢' },
  { id: 'v3', title: 'Colors of the Rainbow', category: 'Colors', description: 'Discover all the beautiful colors.', emoji: '🌈' },
  { id: 'v4', title: 'Shape Adventure', category: 'Shapes', description: 'Meet circles, squares, and triangles.', emoji: '🔷' },
  { id: 'v5', title: 'Animal Friends', category: 'Animals', description: 'Say hello to farm and jungle animals.', emoji: '🦁' },
  { id: 'v6', title: 'Days of the Week', category: 'Days', description: 'Learn the seven days of the week.', emoji: '📅' },
  { id: 'v7', title: 'Months of the Year', category: 'Months', description: 'Sing the twelve months of the year.', emoji: '🗓️' },
  { id: 'v8', title: 'Feelings Song', category: 'Emotions', description: 'Learn about happy, sad, and more.', emoji: '😊' },
  { id: 'v9', title: 'The Tortoise and the Hare', category: 'Stories', description: 'A classic story about slow and steady.', emoji: '🐢' },
  { id: 'v10', title: 'Twinkle Twinkle Little Star', category: 'Rhymes', description: 'A soothing bedtime rhyme.', emoji: '⭐' },
  { id: 'v11', title: 'Times Tables 1 to 5', category: 'Tables', description: 'Learn multiplication the easy way.', emoji: '✖️' },
  { id: 'v12', title: 'Phonics Fun', category: 'Learning', description: 'Practice letter sounds and blending.', emoji: ' phonics' },
];

export const videoCategories = [
  'All', 'Alphabet', 'Numbers', 'Colors', 'Shapes', 'Animals',
  'Days', 'Months', 'Emotions', 'Stories', 'Rhymes', 'Tables', 'Learning',
];

// ---------- Achievements ----------
export type Achievement = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  requirement: string;
};

export const achievements: Achievement[] = [
  { id: 'first_lesson', title: 'First Lesson', description: 'Complete your first lesson', emoji: '🌱', requirement: 'first_lesson' },
  { id: 'alphabet_explorer', title: 'Alphabet Explorer', description: 'Learn all 26 letters', emoji: '🔤', requirement: 'alphabet_explorer' },
  { id: 'number_explorer', title: 'Number Explorer', description: 'Learn numbers 0 to 50', emoji: '🔢', requirement: 'number_explorer' },
  { id: 'math_whiz', title: 'Math Whiz', description: 'Complete a math quiz', emoji: '🧮', requirement: 'math_whiz' },
  { id: 'activity_star', title: 'Activity Star', description: 'Complete 5 activities', emoji: '⭐', requirement: 'activity_star' },
  { id: 'learning_champion', title: 'Learning Champion', description: 'Complete 10 lessons', emoji: '🏆', requirement: 'learning_champion' },
];

// ---------- Autism-specific content ----------
export type VocabCategory = {
  id: string;
  title: string;
  emoji: string;
  items: { word: string; emoji: string }[];
};

export const autismVocabulary: VocabCategory[] = [
  {
    id: 'animals',
    title: 'Animals',
    emoji: '🐾',
    items: [
      { word: 'Cat', emoji: '🐱' },
      { word: 'Dog', emoji: '🐶' },
      { word: 'Rabbit', emoji: '🐰' },
    ],
  },
  {
    id: 'food',
    title: 'Food',
    emoji: '🍽️',
    items: [
      { word: 'Apple', emoji: '🍎' },
      { word: 'Banana', emoji: '🍌' },
      { word: 'Milk', emoji: '🥛' },
    ],
  },
  {
    id: 'objects',
    title: 'Objects',
    emoji: '📦',
    items: [
      { word: 'Ball', emoji: '⚽' },
      { word: 'Book', emoji: '📚' },
      { word: 'Pencil', emoji: '✏️' },
    ],
  },
  {
    id: 'places',
    title: 'Places',
    emoji: '📍',
    items: [
      { word: 'Home', emoji: '🏠' },
      { word: 'School', emoji: '🏫' },
      { word: 'Park', emoji: '🌳' },
    ],
  },
  {
    id: 'people',
    title: 'People',
    emoji: '👥',
    items: [
      { word: 'Mother', emoji: '👩' },
      { word: 'Father', emoji: '👨' },
      { word: 'Boy', emoji: '👦' },
      { word: 'Girl', emoji: '👧' },
    ],
  },
];

export type EmotionItem = { name: string; emoji: string };

export const autismEmotions: EmotionItem[] = [
  { name: 'Happy', emoji: '😊' },
  { name: 'Sad', emoji: '😢' },
  { name: 'Angry', emoji: '😠' },
  { name: 'Worried', emoji: '😟' },
  { name: 'Tired', emoji: '😴' },
  { name: 'Excited', emoji: '🤩' },
  { name: 'Calm', emoji: '😌' },
  { name: 'Scared', emoji: '😨' },
];

export type RoutineStep = { step: string; emoji: string };
export type Routine = { id: string; title: string; emoji: string; steps: RoutineStep[] };

export const autismRoutines: Routine[] = [
  {
    id: 'getting_ready',
    title: 'Getting Ready',
    emoji: '🌅',
    steps: [
      { step: 'Wake up', emoji: '⏰' },
      { step: 'Brush teeth', emoji: '🪥' },
      { step: 'Get dressed', emoji: '👕' },
      { step: 'Eat breakfast', emoji: '🥣' },
      { step: 'Pack bag', emoji: '🎒' },
      { step: 'Go to school', emoji: '🏫' },
    ],
  },
  {
    id: 'hand_washing',
    title: 'Hand Washing',
    emoji: '🧼',
    steps: [
      { step: 'Turn on water', emoji: '🚰' },
      { step: 'Wet hands', emoji: '💧' },
      { step: 'Add soap', emoji: '🧼' },
      { step: 'Rub hands', emoji: '🙌' },
      { step: 'Rinse', emoji: '💦' },
      { step: 'Dry hands', emoji: ' towel' },
    ],
  },
  {
    id: 'bedtime',
    title: 'Bedtime',
    emoji: '🌙',
    steps: [
      { step: 'Put toys away', emoji: '🧸' },
      { step: 'Brush teeth', emoji: '🪥' },
      { step: 'Put on pajamas', emoji: ' pajamas' },
      { step: 'Read', emoji: '📖' },
      { step: 'Sleep', emoji: '😴' },
    ],
  },
];

export type MatchingItem = { emoji: string; word: string };

export const autismMatchingSets: { title: string; items: MatchingItem[] }[] = [
  {
    title: 'Match the Fruit',
    items: [
      { emoji: '🍎', word: 'Apple' },
      { emoji: '🐶', word: 'Dog' },
      { emoji: '🔵', word: 'Blue' },
      { emoji: '3️⃣', word: 'Three' },
    ],
  },
];

export const autismSortingSets: {
  title: string;
  prompt: string;
  items: { emoji: string; name: string; group: string }[];
  groups: string[];
}[] = [
  {
    title: 'Sort the Animals',
    prompt: 'Put the animals together.',
    groups: ['Animals', 'Food'],
    items: [
      { emoji: '🐶', name: 'Dog', group: 'Animals' },
      { emoji: '🐱', name: 'Cat', group: 'Animals' },
      { emoji: '🍎', name: 'Apple', group: 'Food' },
      { emoji: '🚗', name: 'Car', group: 'Food' },
    ],
  },
];

export const autismPatternSets: {
  title: string;
  sequence: string[];
  options: string[];
  answer: string;
}[] = [
  {
    title: 'Red Blue Pattern',
    sequence: ['🔴', '🔵', '🔴', '🔵'],
    options: ['🔴', '🔵', '🟢'],
    answer: '🔴',
  },
  {
    title: 'Shape Pattern',
    sequence: ['⭐', '⭕', '⭐', '⭕'],
    options: ['🔺', '⭐', '⭕'],
    answer: '⭐',
  },
];

export const autismCountingSets: {
  prompt: string;
  emojis: string[];
  options: string[];
  answer: string;
  speakText: string;
}[] = [
  {
    prompt: 'Count the apples.',
    emojis: ['🍎', '🍎', '🍎'],
    options: ['2', '3', '4'],
    answer: '3',
    speakText: 'Count the apples. How many?',
  },
  {
    prompt: 'Count the stars.',
    emojis: ['⭐', '⭐', '⭐', '⭐', '⭐'],
    options: ['4', '5', '6'],
    answer: '5',
    speakText: 'Count the stars. How many?',
  },
];

export const lessonId = (mode: LearningMode, subject: string, lesson: string) =>
  `${mode}_${subject}_${lesson}`;
