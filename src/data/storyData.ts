export type CharacterId = 'pinky' | 'toto' | 'buddy';

export interface CharacterInfo {
  id: CharacterId;
  name: string;
  animal: string;
  displayName: string;
  emoji: string;
  color: string;
  bgLight: string;
  badgeColor: string;
  avatarDesc: string;
}

export const CHARACTERS: Record<CharacterId, CharacterInfo> = {
  pinky: {
    id: 'pinky',
    name: 'Pinky',
    animal: 'Pig',
    displayName: 'Pinky (Pig)',
    emoji: '🐷',
    color: '#ec4899',
    bgLight: '#fdf2f8',
    badgeColor: 'bg-pink-100 text-pink-700 border-pink-300',
    avatarDesc: 'Cheerful and hungry pink piglet',
  },
  toto: {
    id: 'toto',
    name: 'Toto',
    animal: 'Rabbit',
    displayName: 'Toto (Rabbit)',
    emoji: '🐰',
    color: '#0ea5e9',
    bgLight: '#f0f9ff',
    badgeColor: 'bg-sky-100 text-sky-700 border-sky-300',
    avatarDesc: 'Energetic and high-jumping white bunny',
  },
  buddy: {
    id: 'buddy',
    name: 'Buddy',
    animal: 'Bear',
    displayName: 'Buddy (Bear)',
    emoji: '🐻',
    color: '#d97706',
    bgLight: '#fffbeb',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    avatarDesc: 'Big, strong, and caring brown bear',
  },
};

export interface StoryLine {
  id: string;
  text: string;
  underlinedWords: string[];
  speaker?: CharacterId | 'narrator';
  speakerName?: string;
  isDialogue?: boolean;
}

export interface QuestionChoice {
  text: string;
  icon?: string;
  isCorrect: boolean;
}

export interface StoryQuestion {
  type: 'fact_check' | 'fill_in_the_blank' | 'vocabulary';
  questionText: string;
  blankPrefix?: string;
  blankSuffix?: string;
  options: QuestionChoice[];
  hint: string;
  explanation: string;
}

export interface TimedWord {
  word: string;
  start: number; // in seconds
  end: number;   // in seconds
}

export interface StoryPage {
  audioUrl?: string;
  duration?: number;
  pageNumber: number;
  lines: StoryLine[];
  timedWords: TimedWord[];
  rolePlaySpeakers: CharacterId[];
  rolePlayTurnDescription: string;
  question: StoryQuestion;
}

export const STORY_PAGES: StoryPage[] = [
  {
    pageNumber: 1,
    lines: [
      {
        id: 'p1-1',
        text: 'Pinky is in the forest.',
        underlinedWords: ['forest'],
        speaker: 'narrator',
      },
      {
        id: 'p1-2',
        text: 'It is a sunny day.',
        underlinedWords: ['sunny'],
        speaker: 'narrator',
      },
      {
        id: 'p1-3',
        text: 'Pinky is hungry.',
        underlinedWords: ['hungry'],
        speaker: 'pinky',
        speakerName: 'Pinky',
      },
    ],
    audioUrl: '/audio/page1.mp3',
    duration: 5.4,
    timedWords: [
      { word: 'Pinky', start: 0.06, end: 0.52 },
      { word: 'is', start: 0.52, end: 0.7 },
      { word: 'in', start: 0.7, end: 0.88 },
      { word: 'the', start: 0.88, end: 1.15 },
      { word: 'forest.', start: 1.15, end: 1.81 },
      { word: 'It', start: 2.15, end: 2.34 },
      { word: 'is', start: 2.34, end: 2.53 },
      { word: 'a', start: 2.53, end: 2.68 },
      { word: 'sunny', start: 2.68, end: 3.16 },
      { word: 'day.', start: 3.16, end: 3.56 },
      { word: 'Pinky', start: 3.9, end: 4.33 },
      { word: 'is', start: 4.33, end: 4.5 },
      { word: 'hungry.', start: 4.5, end: 5.12 },
    ],
    rolePlaySpeakers: ['pinky'],
    rolePlayTurnDescription: "Pinky's tummy is rumbling! Speak Pinky's feeling.",
    question: {
      type: 'fact_check',
      questionText: 'Where is Pinky?',
      options: [
        { text: 'In the forest', icon: '🌲', isCorrect: true },
        { text: 'At home', icon: '🏠', isCorrect: false },
        { text: 'At school', icon: '🏫', isCorrect: false },
      ],
      hint: 'Look at the green trees around Pinky!',
      explanation: 'Pinky is walking outside in the sunny green forest.',
    },
  },
  {
    pageNumber: 2,
    lines: [
      {
        id: 'p2-1',
        text: 'Look at the tree!',
        underlinedWords: ['tree'],
        speaker: 'narrator',
      },
      {
        id: 'p2-2',
        text: 'A big red apple is in the tree.',
        underlinedWords: ['big', 'apple'],
        speaker: 'narrator',
      },
      {
        id: 'p2-3',
        text: '"I want the apple," says Pinky.',
        underlinedWords: ['want', 'apple'],
        speaker: 'pinky',
        speakerName: 'Pinky',
        isDialogue: true,
      },
    ],
    audioUrl: '/audio/page2.mp3',
    duration: 6.36,
    timedWords: [
      { word: 'Look', start: 0.06, end: 0.34 },
      { word: 'at', start: 0.34, end: 0.47 },
      { word: 'the', start: 0.47, end: 0.68 },
      { word: 'tree!', start: 0.68, end: 1.04 },
      { word: 'A', start: 1.38, end: 1.51 },
      { word: 'big', start: 1.51, end: 1.76 },
      { word: 'red', start: 1.76, end: 2.02 },
      { word: 'apple', start: 2.02, end: 2.45 },
      { word: 'is', start: 2.45, end: 2.62 },
      { word: 'in', start: 2.62, end: 2.79 },
      { word: 'the', start: 2.79, end: 3.04 },
      { word: 'tree.', start: 3.04, end: 3.49 },
      { word: '"I', start: 3.83, end: 3.96 },
      { word: 'want', start: 3.96, end: 4.33 },
      { word: 'the', start: 4.33, end: 4.6 },
      { word: 'apple,"', start: 4.6, end: 5.16 },
      { word: 'says', start: 5.16, end: 5.52 },
      { word: 'Pinky.', start: 5.52, end: 6.08 },
    ],
    rolePlaySpeakers: ['pinky'],
    rolePlayTurnDescription: "Pinky spots the apple! Say what Pinky says.",
    question: {
      type: 'fill_in_the_blank',
      questionText: 'What is in the tree?',
      blankPrefix: 'It is a big red',
      blankSuffix: '.',
      options: [
        { text: 'apple', icon: '🍎', isCorrect: true },
        { text: 'banana', icon: '🍌', isCorrect: false },
        { text: 'orange', icon: '🍊', isCorrect: false },
      ],
      hint: 'It is shiny, red, and delicious!',
      explanation: 'A big red apple is hanging high in the tree!',
    },
  },
  {
    pageNumber: 3,
    lines: [
      {
        id: 'p3-1',
        text: 'Pinky jumps and jumps.',
        underlinedWords: ['jumps'],
        speaker: 'narrator',
      },
      {
        id: 'p3-2',
        text: 'Hop! Hop!',
        underlinedWords: ['Hop!'],
        speaker: 'pinky',
        speakerName: 'Pinky',
      },
      {
        id: 'p3-3',
        text: '"Oh, no! It is too high."',
        underlinedWords: ['too', 'high'],
        speaker: 'pinky',
        speakerName: 'Pinky',
        isDialogue: true,
      },
    ],
    audioUrl: '/audio/page3.mp3',
    duration: 5.95,
    timedWords: [
      { word: 'Pinky', start: 0.06, end: 0.5 },
      { word: 'jumps', start: 0.5, end: 0.95 },
      { word: 'and', start: 0.95, end: 1.21 },
      { word: 'jumps.', start: 1.21, end: 1.76 },
      { word: 'Hop!', start: 2.1, end: 2.66 },
      { word: 'Hop!', start: 2.66, end: 3.22 },
      { word: '"Oh,', start: 3.56, end: 3.93 },
      { word: 'no!', start: 3.93, end: 4.29 },
      { word: 'It', start: 4.29, end: 4.52 },
      { word: 'is', start: 4.52, end: 4.74 },
      { word: 'too', start: 4.74, end: 5.08 },
      { word: 'high."', start: 5.08, end: 5.67 },
    ],
    rolePlaySpeakers: ['pinky'],
    rolePlayTurnDescription: "Pinky hops high! Say what Pinky says when she can't reach.",
    question: {
      type: 'fact_check',
      questionText: 'Can Pinky reach the apple?',
      options: [
        { text: "No, she can't.", icon: '❌', isCorrect: true },
        { text: 'Yes, she can.', icon: '✅', isCorrect: false },
      ],
      hint: 'The apple is way up in the high tree branches.',
      explanation: "Pinky jumps and hops, but the apple is too high for her.",
    },
  },
  {
    pageNumber: 4,
    lines: [
      {
        id: 'p4-1',
        text: 'Toto the rabbit comes.',
        underlinedWords: ['rabbit'],
        speaker: 'narrator',
      },
      {
        id: 'p4-2',
        text: '"I can help you!" says Toto.',
        underlinedWords: ['help'],
        speaker: 'toto',
        speakerName: 'Toto',
        isDialogue: true,
      },
      {
        id: 'p4-3',
        text: 'Toto can jump high.',
        underlinedWords: ['jump', 'high'],
        speaker: 'toto',
        speakerName: 'Toto',
      },
    ],
    audioUrl: '/audio/page4.mp3',
    duration: 6.26,
    timedWords: [
      { word: 'Toto', start: 0.06, end: 0.41 },
      { word: 'the', start: 0.41, end: 0.67 },
      { word: 'rabbit', start: 0.67, end: 1.19 },
      { word: 'comes.', start: 1.19, end: 1.74 },
      { word: '"I', start: 2.08, end: 2.22 },
      { word: 'can', start: 2.22, end: 2.52 },
      { word: 'help', start: 2.52, end: 2.91 },
      { word: 'you!"', start: 2.91, end: 3.33 },
      { word: 'says', start: 3.33, end: 3.72 },
      { word: 'Toto.', start: 3.72, end: 4.23 },
      { word: 'Toto', start: 4.57, end: 4.92 },
      { word: 'can', start: 4.92, end: 5.18 },
      { word: 'jump', start: 5.18, end: 5.53 },
      { word: 'high.', start: 5.53, end: 5.98 },
    ],
    rolePlaySpeakers: ['toto'],
    rolePlayTurnDescription: "Toto the rabbit arrives to help! Say Toto's cheer.",
    question: {
      type: 'fact_check',
      questionText: 'Who comes to help Pinky?',
      options: [
        { text: 'Toto the rabbit', icon: '🐰', isCorrect: true },
        { text: 'Buddy the bear', icon: '🐻', isCorrect: false },
        { text: 'Fox', icon: '🦊', isCorrect: false },
      ],
      hint: 'He has long ears and can jump high!',
      explanation: 'Toto the friendly rabbit hops in to offer help.',
    },
  },
  {
    pageNumber: 5,
    lines: [
      {
        id: 'p5-1',
        text: 'Toto jumps very high.',
        underlinedWords: ['very', 'high'],
        speaker: 'narrator',
      },
      {
        id: 'p5-2',
        text: 'Boing! Boing!',
        underlinedWords: ['Boing!'],
        speaker: 'toto',
        speakerName: 'Toto',
      },
      {
        id: 'p5-3',
        text: '"Oh, no! It is still too high."',
        underlinedWords: ['still', 'too', 'high'],
        speaker: 'toto',
        speakerName: 'Toto',
        isDialogue: true,
      },
    ],
    audioUrl: '/audio/page5.mp3',
    duration: 6.53,
    timedWords: [
      { word: 'Toto', start: 0.06, end: 0.42 },
      { word: 'jumps', start: 0.42, end: 0.87 },
      { word: 'very', start: 0.87, end: 1.22 },
      { word: 'high.', start: 1.22, end: 1.69 },
      { word: 'Boing!', start: 2.03, end: 2.69 },
      { word: 'Boing!', start: 2.69, end: 3.34 },
      { word: '"Oh,', start: 3.68, end: 4.03 },
      { word: 'no!', start: 4.03, end: 4.38 },
      { word: 'It', start: 4.38, end: 4.6 },
      { word: 'is', start: 4.6, end: 4.81 },
      { word: 'still', start: 4.81, end: 5.36 },
      { word: 'too', start: 5.36, end: 5.68 },
      { word: 'high."', start: 5.68, end: 6.25 },
    ],
    rolePlaySpeakers: ['toto'],
    rolePlayTurnDescription: "Toto lands after jumping! Say what Toto says.",
    question: {
      type: 'fill_in_the_blank',
      questionText: 'Complete the sentence:',
      blankPrefix: '"Oh, no! It is still too',
      blankSuffix: '."',
      options: [
        { text: 'high', icon: '⬆️', isCorrect: true },
        { text: 'low', icon: '⬇️', isCorrect: false },
        { text: 'heavy', icon: '📦', isCorrect: false },
      ],
      hint: 'The apple is still way up above Toto!',
      explanation: 'Even for a bouncy rabbit, the apple is still too high.',
    },
  },
  {
    pageNumber: 6,
    lines: [
      {
        id: 'p6-1',
        text: 'Buddy the bear comes.',
        underlinedWords: ['bear'],
        speaker: 'narrator',
      },
      {
        id: 'p6-2',
        text: '"I can help you!" says Buddy.',
        underlinedWords: ['help'],
        speaker: 'buddy',
        speakerName: 'Buddy',
        isDialogue: true,
      },
      {
        id: 'p6-3',
        text: 'Buddy is big and strong.',
        underlinedWords: ['big', 'strong'],
        speaker: 'narrator',
      },
    ],
    audioUrl: '/audio/page6.mp3',
    duration: 6.38,
    timedWords: [
      { word: 'Buddy', start: 0.06, end: 0.47 },
      { word: 'the', start: 0.47, end: 0.72 },
      { word: 'bear', start: 0.72, end: 1.05 },
      { word: 'comes.', start: 1.05, end: 1.57 },
      { word: '"I', start: 1.91, end: 2.05 },
      { word: 'can', start: 2.05, end: 2.32 },
      { word: 'help', start: 2.32, end: 2.69 },
      { word: 'you!"', start: 2.69, end: 3.08 },
      { word: 'says', start: 3.08, end: 3.45 },
      { word: 'Buddy.', start: 3.45, end: 4.02 },
      { word: 'Buddy', start: 4.36, end: 4.79 },
      { word: 'is', start: 4.79, end: 4.96 },
      { word: 'big', start: 4.96, end: 5.22 },
      { word: 'and', start: 5.22, end: 5.48 },
      { word: 'strong.', start: 5.48, end: 6.1 },
    ],
    rolePlaySpeakers: ['buddy'],
    rolePlayTurnDescription: "Buddy the big bear steps up! Speak Buddy's line.",
    question: {
      type: 'fact_check',
      questionText: 'Look at Buddy. Is Buddy small or big?',
      options: [
        { text: 'Buddy is big.', icon: '🐻', isCorrect: true },
        { text: 'Buddy is small.', icon: '🐭', isCorrect: false },
      ],
      hint: 'He is a large and strong brown bear!',
      explanation: 'Buddy is big and strong!',
    },
  },
  {
    pageNumber: 7,
    lines: [
      {
        id: 'p7-1',
        text: 'Buddy shakes the tree.',
        underlinedWords: ['shakes', 'tree'],
        speaker: 'narrator',
      },
      {
        id: 'p7-2',
        text: 'Shake! Shake!',
        underlinedWords: ['Shake!'],
        speaker: 'buddy',
        speakerName: 'Buddy',
      },
      {
        id: 'p7-3',
        text: 'The apple does not fall down.',
        underlinedWords: ['does', 'not', 'fall', 'down'],
        speaker: 'narrator',
      },
      {
        id: 'p7-4',
        text: '"We need an idea!"',
        underlinedWords: ['idea'],
        speaker: 'buddy',
        speakerName: 'Buddy',
        isDialogue: true,
      },
    ],
    audioUrl: '/audio/page7.mp3',
    duration: 7.18,
    timedWords: [
      { word: 'Buddy', start: 0.06, end: 0.43 },
      { word: 'shakes', start: 0.43, end: 0.87 },
      { word: 'the', start: 0.87, end: 1.09 },
      { word: 'tree.', start: 1.09, end: 1.47 },
      { word: 'Shake!', start: 1.81, end: 2.45 },
      { word: 'Shake!', start: 2.45, end: 3.08 },
      { word: 'The', start: 3.42, end: 3.67 },
      { word: 'apple', start: 3.67, end: 4.08 },
      { word: 'does', start: 4.08, end: 4.41 },
      { word: 'not', start: 4.41, end: 4.65 },
      { word: 'fall', start: 4.65, end: 4.98 },
      { word: 'down.', start: 4.98, end: 5.41 },
      { word: '"We', start: 5.75, end: 5.92 },
      { word: 'need', start: 5.92, end: 6.27 },
      { word: 'an', start: 6.27, end: 6.44 },
      { word: 'idea!"', start: 6.44, end: 6.9 },
    ],
    rolePlaySpeakers: ['buddy'],
    rolePlayTurnDescription: "The apple didn't fall! Say Buddy's line: We need an idea!",
    question: {
      type: 'fact_check',
      questionText: 'Does the apple fall down?',
      options: [
        { text: "No, it doesn't.", icon: '❌', isCorrect: true },
        { text: 'Yes, it does.', icon: '✅', isCorrect: false },
      ],
      hint: 'Buddy shakes and shakes, but the apple stays firmly attached.',
      explanation: 'The apple stays firmly on the tree branch.',
    },
  },
  {
    pageNumber: 8,
    lines: [
      {
        id: 'p8-1',
        text: "\"Let's do it together!\" says Buddy.",
        underlinedWords: ['together'],
        speaker: 'buddy',
        speakerName: 'Buddy',
        isDialogue: true,
      },
      {
        id: 'p8-2',
        text: 'Buddy stands.',
        underlinedWords: ['stands'],
        speaker: 'buddy',
      },
      {
        id: 'p8-3',
        text: 'Pinky climbs on Buddy.',
        underlinedWords: ['climbs'],
        speaker: 'pinky',
      },
      {
        id: 'p8-4',
        text: 'Toto climbs on Pinky.',
        underlinedWords: ['climbs'],
        speaker: 'toto',
      },
    ],
    audioUrl: '/audio/page8.mp3',
    duration: 8.16,
    timedWords: [
      { word: "\"Let's", start: 0.06, end: 0.41 },
      { word: 'do', start: 0.41, end: 0.58 },
      { word: 'it', start: 0.58, end: 0.76 },
      { word: 'together!"', start: 0.76, end: 1.56 },
      { word: 'says', start: 1.56, end: 1.91 },
      { word: 'Buddy.', start: 1.91, end: 2.46 },
      { word: 'Buddy', start: 2.8, end: 3.28 },
      { word: 'stands.', start: 3.28, end: 3.97 },
      { word: 'Pinky', start: 4.31, end: 4.71 },
      { word: 'climbs', start: 4.71, end: 5.2 },
      { word: 'on', start: 5.2, end: 5.36 },
      { word: 'Buddy.', start: 5.36, end: 5.86 },
      { word: 'Toto', start: 6.2, end: 6.57 },
      { word: 'climbs', start: 6.57, end: 7.12 },
      { word: 'on', start: 7.12, end: 7.31 },
      { word: 'Pinky.', start: 7.31, end: 7.88 },
    ],
    rolePlaySpeakers: ['buddy', 'pinky', 'toto'],
    rolePlayTurnDescription: "A friendship tower! Say your character's action.",
    question: {
      type: 'fact_check',
      questionText: 'Who is on top?',
      options: [
        { text: 'Toto!', icon: '🐰', isCorrect: true },
        { text: 'Pinky!', icon: '🐷', isCorrect: false },
        { text: 'Buddy!', icon: '🐻', isCorrect: false },
      ],
      hint: 'The little rabbit climbed all the way to the very top!',
      explanation: 'Buddy is on the ground, Pinky is in the middle, and Toto is on top!',
    },
  },
  {
    pageNumber: 9,
    lines: [
      {
        id: 'p9-1',
        text: 'Toto reaches up.',
        underlinedWords: ['reaches'],
        speaker: 'narrator',
      },
      {
        id: 'p9-2',
        text: '"I have the apple!"',
        underlinedWords: ['apple'],
        speaker: 'toto',
        speakerName: 'Toto',
        isDialogue: true,
      },
      {
        id: 'p9-3',
        text: '"Hooray! We did it!"',
        underlinedWords: ['Hooray'],
        speaker: 'pinky',
        speakerName: 'All Friends',
        isDialogue: true,
      },
    ],
    audioUrl: '/audio/page9.mp3',
    duration: 4.85,
    timedWords: [
      { word: 'Toto', start: 0.06, end: 0.41 },
      { word: 'reaches', start: 0.41, end: 1.02 },
      { word: 'up.', start: 1.02, end: 1.3 },
      { word: '"I', start: 1.64, end: 1.75 },
      { word: 'have', start: 1.75, end: 2.03 },
      { word: 'the', start: 2.03, end: 2.24 },
      { word: 'apple!"', start: 2.24, end: 2.67 },
      { word: '"Hooray!', start: 3.01, end: 3.74 },
      { word: 'We', start: 3.74, end: 3.94 },
      { word: 'did', start: 3.94, end: 4.24 },
      { word: 'it!"', start: 4.24, end: 4.57 },
    ],
    rolePlaySpeakers: ['toto', 'pinky', 'buddy'],
    rolePlayTurnDescription: "Success! Say: I have the apple! or Hooray!",
    question: {
      type: 'fill_in_the_blank',
      questionText: 'Complete the sentence:',
      blankPrefix: '"I have the',
      blankSuffix: '!"',
      options: [
        { text: 'apple', icon: '🍎', isCorrect: true },
        { text: 'leaf', icon: '🍃', isCorrect: false },
        { text: 'acorn', icon: '🌰', isCorrect: false },
      ],
      hint: 'Toto grabbed the big red fruit from the branch!',
      explanation: 'Toto reaches up and catches the big red apple!',
    },
  },
  {
    pageNumber: 10,
    lines: [
      {
        id: 'p10-1',
        text: 'One, two, three pieces.',
        underlinedWords: ['pieces'],
        speaker: 'narrator',
      },
      {
        id: 'p10-2',
        text: 'Yum! Yum! The apple is sweet.',
        underlinedWords: ['sweet'],
        speaker: 'pinky',
        speakerName: 'All Friends',
      },
      {
        id: 'p10-3',
        text: 'Good friends share together!',
        underlinedWords: ['friends', 'share', 'together'],
        speaker: 'buddy',
        speakerName: 'All Friends',
      },
    ],
    audioUrl: '/audio/page10.mp3',
    duration: 8.21,
    timedWords: [
      { word: 'One,', start: 0.06, end: 0.62 },
      { word: 'two,', start: 0.62, end: 1.17 },
      { word: 'three', start: 1.17, end: 1.84 },
      { word: 'pieces.', start: 1.84, end: 2.79 },
      { word: 'Yum!', start: 3.13, end: 3.62 },
      { word: 'Yum!', start: 3.62, end: 4.11 },
      { word: 'The', start: 4.11, end: 4.46 },
      { word: 'apple', start: 4.46, end: 5.05 },
      { word: 'is', start: 5.05, end: 5.28 },
      { word: 'sweet.', start: 5.28, end: 6.01 },
      { word: 'Good', start: 6.35, end: 6.6 },
      { word: 'friends', start: 6.6, end: 7.04 },
      { word: 'share', start: 7.04, end: 7.35 },
      { word: 'together!', start: 7.35, end: 7.93 },
    ],
    rolePlaySpeakers: ['pinky', 'toto', 'buddy'],
    rolePlayTurnDescription: "Sharing the sweet apple! Say: Good friends share together!",
    question: {
      type: 'fact_check',
      questionText: 'What are they doing?',
      options: [
        { text: 'They share the apple.', icon: '🍎', isCorrect: true },
        { text: 'They run away.', icon: '🏃', isCorrect: false },
        { text: 'They sleep.', icon: '😴', isCorrect: false },
      ],
      hint: 'The three friends cut it into three slices and eat happily!',
      explanation: 'Pinky, Toto, and Buddy share the sweet red apple together.',
    },
  },
];

export interface VocabItem {
  id: string;
  word: string;
  phonetic: string;
  korean: string;
  sentence: string;
  category: 'noun' | 'verb' | 'adjective';
  emoji: string;
  visualColor: string;
}

export const VOCAB_DICTIONARY: Record<string, { korean: string; emoji: string; phonetic: string; partOfSpeech?: string }> = {
  apple: { korean: '사과', emoji: '🍎', phonetic: '[ǽpl]', partOfSpeech: '명사 (noun)' },
  forest: { korean: '숲', emoji: '🌲', phonetic: '[fɔ́ːrist]', partOfSpeech: '명사 (noun)' },
  sunny: { korean: '화창한, 맑은', emoji: '☀️', phonetic: '[sʌ́ni]', partOfSpeech: '형용사 (adjective)' },
  hungry: { korean: '배고픈', emoji: '🤤', phonetic: '[hʌ́ŋgri]', partOfSpeech: '형용사 (adjective)' },
  tree: { korean: '나무', emoji: '🌳', phonetic: '[triː]', partOfSpeech: '명사 (noun)' },
  big: { korean: '큰', emoji: '🐘', phonetic: '[big]', partOfSpeech: '형용사 (adjective)' },
  red: { korean: '빨간색의', emoji: '🔴', phonetic: '[red]', partOfSpeech: '형용사 (adjective)' },
  want: { korean: '원하다', emoji: '✨', phonetic: '[wɑnt]', partOfSpeech: '동사 (verb)' },
  jump: { korean: '뛰다, 점프하다', emoji: '🦘', phonetic: '[dʒʌmp]', partOfSpeech: '동사 (verb)' },
  jumps: { korean: '뛰다, 점프하다', emoji: '🦘', phonetic: '[dʒʌmps]', partOfSpeech: '동사 (verb)' },
  hop: { korean: '깡충깡충 뛰다', emoji: '🐇', phonetic: '[hɑp]', partOfSpeech: '동사 (verb)' },
  high: { korean: '높은', emoji: '🏔️', phonetic: '[hai]', partOfSpeech: '형용사 (adjective)' },
  rabbit: { korean: '토끼', emoji: '🐰', phonetic: '[rǽbit]', partOfSpeech: '명사 (noun)' },
  help: { korean: '도와주다', emoji: '🤝', phonetic: '[help]', partOfSpeech: '동사 (verb)' },
  bear: { korean: '곰', emoji: '🐻', phonetic: '[bɛər]', partOfSpeech: '명사 (noun)' },
  strong: { korean: '힘이 센, 강한', emoji: '💪', phonetic: '[strɔːŋ]', partOfSpeech: '형용사 (adjective)' },
  shake: { korean: '흔들다', emoji: '🍃', phonetic: '[ʃeik]', partOfSpeech: '동사 (verb)' },
  shakes: { korean: '흔들다', emoji: '🍃', phonetic: '[ʃeiks]', partOfSpeech: '동사 (verb)' },
  fall: { korean: '떨어지다', emoji: '🍂', phonetic: '[fɔːl]', partOfSpeech: '동사 (verb)' },
  idea: { korean: '생각, 아이디어', emoji: '💡', phonetic: '[aidíːə]', partOfSpeech: '명사 (noun)' },
  together: { korean: '함께', emoji: '🤝', phonetic: '[təgɛ́ðər]', partOfSpeech: '부사 (adverb)' },
  stands: { korean: '일어서다', emoji: '🧍', phonetic: '[stændz]', partOfSpeech: '동사 (verb)' },
  climb: { korean: '올라가다', emoji: '🧗', phonetic: '[klaim]', partOfSpeech: '동사 (verb)' },
  climbs: { korean: '올라가다', emoji: '🧗', phonetic: '[klaimz]', partOfSpeech: '동사 (verb)' },
  reaches: { korean: '손을 뻗다, 닿다', emoji: '🖐️', phonetic: '[ríːtʃiz]', partOfSpeech: '동사 (verb)' },
  pieces: { korean: '조각들', emoji: '🧩', phonetic: '[píːsiz]', partOfSpeech: '명사 (noun)' },
  sweet: { korean: '달콤한', emoji: '🍯', phonetic: '[swiːt]', partOfSpeech: '형용사 (adjective)' },
  friends: { korean: '친구들', emoji: '👫', phonetic: '[frendz]', partOfSpeech: '명사 (noun)' },
  share: { korean: '나누다, 함께 쓰다', emoji: '🤲', phonetic: '[ʃɛər]', partOfSpeech: '동사 (verb)' },
};

export const VOCABULARY_LIST: VocabItem[] = [
  {
    id: 'v1',
    word: 'apple',
    phonetic: '[ǽpl]',
    korean: '사과',
    sentence: 'A big red apple is in the tree.',
    category: 'noun',
    emoji: '🍎',
    visualColor: 'bg-red-50 text-red-600 border-red-200',
  },
  {
    id: 'v2',
    word: 'forest',
    phonetic: '[fɔ́ːrist]',
    korean: '숲',
    sentence: 'Pinky is in the green forest.',
    category: 'noun',
    emoji: '🌲',
    visualColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 'v3',
    word: 'hungry',
    phonetic: '[hʌ́ŋgri]',
    korean: '배고픈',
    sentence: 'Pinky is very hungry today.',
    category: 'adjective',
    emoji: '🤤',
    visualColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    id: 'v4',
    word: 'tree',
    phonetic: '[triː]',
    korean: '나무',
    sentence: 'Look at the tall green tree!',
    category: 'noun',
    emoji: '🌳',
    visualColor: 'bg-green-50 text-green-700 border-green-200',
  },
  {
    id: 'v5',
    word: 'jump',
    phonetic: '[dʒʌmp]',
    korean: '뛰다, 점프하다',
    sentence: 'Toto can jump very high.',
    category: 'verb',
    emoji: '🦘',
    visualColor: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  {
    id: 'v6',
    word: 'high',
    phonetic: '[hai]',
    korean: '높은',
    sentence: 'The shiny apple is too high.',
    category: 'adjective',
    emoji: '🏔️',
    visualColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    id: 'v7',
    word: 'rabbit',
    phonetic: '[rǽbit]',
    korean: '토끼',
    sentence: 'Toto the rabbit comes to help.',
    category: 'noun',
    emoji: '🐰',
    visualColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    id: 'v8',
    word: 'bear',
    phonetic: '[bɛər]',
    korean: '곰',
    sentence: 'Buddy the bear is big and kind.',
    category: 'noun',
    emoji: '🐻',
    visualColor: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  {
    id: 'v9',
    word: 'strong',
    phonetic: '[strɔːŋ]',
    korean: '힘이 센',
    sentence: 'Buddy is big and strong.',
    category: 'adjective',
    emoji: '💪',
    visualColor: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  {
    id: 'v10',
    word: 'shake',
    phonetic: '[ʃeik]',
    korean: '흔들다',
    sentence: 'Buddy shakes the apple tree.',
    category: 'verb',
    emoji: '🍃',
    visualColor: 'bg-lime-50 text-lime-700 border-lime-200',
  },
  {
    id: 'v11',
    word: 'climb',
    phonetic: '[klaim]',
    korean: '올라가다',
    sentence: 'Pinky climbs on Buddy.',
    category: 'verb',
    emoji: '🧗',
    visualColor: 'bg-teal-50 text-teal-700 border-teal-200',
  },
  {
    id: 'v12',
    word: 'together',
    phonetic: '[təgɛ́ðər]',
    korean: '함께',
    sentence: 'Let us do it together!',
    category: 'adjective',
    emoji: '🤝',
    visualColor: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    id: 'v13',
    word: 'sweet',
    phonetic: '[swiːt]',
    korean: '달콤한',
    sentence: 'The big red apple is sweet.',
    category: 'adjective',
    emoji: '🍯',
    visualColor: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    id: 'v14',
    word: 'share',
    phonetic: '[ʃɛər]',
    korean: '나누다',
    sentence: 'Good friends share together!',
    category: 'verb',
    emoji: '🤲',
    visualColor: 'bg-pink-50 text-pink-700 border-pink-200',
  },
];
