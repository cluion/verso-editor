export interface SpecialCharItem {
  char: string
  name: string
  category: string
}

const SPECIAL_CHARS: SpecialCharItem[] = [
  // Math
  { char: '±', name: 'Plus-Minus', category: 'math' },
  { char: '×', name: 'Multiply', category: 'math' },
  { char: '÷', name: 'Division', category: 'math' },
  { char: '≠', name: 'Not Equal', category: 'math' },
  { char: '≤', name: 'Less or Equal', category: 'math' },
  { char: '≥', name: 'Greater or Equal', category: 'math' },
  { char: '∞', name: 'Infinity', category: 'math' },
  { char: '∑', name: 'Summation', category: 'math' },
  { char: '∏', name: 'Product', category: 'math' },
  { char: '√', name: 'Square Root', category: 'math' },
  { char: '∫', name: 'Integral', category: 'math' },
  { char: '≈', name: 'Almost Equal', category: 'math' },
  // Currency
  { char: '$', name: 'Dollar', category: 'currency' },
  { char: '€', name: 'Euro', category: 'currency' },
  { char: '£', name: 'Pound', category: 'currency' },
  { char: '¥', name: 'Yen', category: 'currency' },
  { char: '₩', name: 'Won', category: 'currency' },
  { char: '₹', name: 'Rupee', category: 'currency' },
  { char: '¢', name: 'Cent', category: 'currency' },
  // Arrows
  { char: '→', name: 'Right Arrow', category: 'arrows' },
  { char: '←', name: 'Left Arrow', category: 'arrows' },
  { char: '↑', name: 'Up Arrow', category: 'arrows' },
  { char: '↓', name: 'Down Arrow', category: 'arrows' },
  { char: '↔', name: 'Left-Right Arrow', category: 'arrows' },
  { char: '⇒', name: 'Double Right Arrow', category: 'arrows' },
  { char: '⇐', name: 'Double Left Arrow', category: 'arrows' },
  // Punctuation
  { char: '…', name: 'Ellipsis', category: 'punctuation' },
  { char: '–', name: 'En Dash', category: 'punctuation' },
  { char: '—', name: 'Em Dash', category: 'punctuation' },
  { char: '«', name: 'Left Guillemet', category: 'punctuation' },
  { char: '»', name: 'Right Guillemet', category: 'punctuation' },
  { char: '„', name: 'Double Low Quotation', category: 'punctuation' },
  { char: '「', name: 'Left Corner Bracket', category: 'punctuation' },
  { char: '」', name: 'Right Corner Bracket', category: 'punctuation' },
  // Symbols
  { char: '©', name: 'Copyright', category: 'symbols' },
  { char: '®', name: 'Registered', category: 'symbols' },
  { char: '™', name: 'Trademark', category: 'symbols' },
  { char: '§', name: 'Section', category: 'symbols' },
  { char: '¶', name: 'Pilcrow', category: 'symbols' },
  { char: '†', name: 'Dagger', category: 'symbols' },
  { char: '‡', name: 'Double Dagger', category: 'symbols' },
  { char: '°', name: 'Degree', category: 'symbols' },
  { char: '‰', name: 'Per Mille', category: 'symbols' },
  { char: '№', name: 'Numero', category: 'symbols' },
]

export function getSpecialChars(category?: string): SpecialCharItem[] {
  if (!category) return SPECIAL_CHARS
  return SPECIAL_CHARS.filter((c) => c.category === category)
}

export function getCharCategories(): string[] {
  return [...new Set(SPECIAL_CHARS.map((c) => c.category))]
}
