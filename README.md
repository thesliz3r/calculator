# VAT Calculator

A modern web application built with React and TypeScript that converts numerical amounts into words in multiple languages (Russian, Azerbaijani, and English) with currency support.

## Features

- Convert numerical amounts to words in multiple languages:
  - Russian
  - Azerbaijani
  - English
- Support for multiple currencies:
  - USD (Dollars)
  - EUR (Euros)
  - RUB (Rubles)
  - AZN (Manats)
- Real-time conversion
- Clean and modern user interface
- Type-safe implementation with TypeScript

## Technologies Used

- React 18
- TypeScript
- Vite
- TailwindCSS
- Lucide React (for icons)

## Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Usage Example

```typescript
import { getAmountInWords } from './utils';

// Convert 125.50 USD to words in Russian
const result = getAmountInWords(125.50, 'USD', 'ru');
// Output: "сто двадцать пять долларов пятьдесят копеек"

// Convert 99.99 EUR to words in Azerbaijani
const result = getAmountInWords(99.99, 'EUR', 'az');
// Output: "doxsan doqquz avro doxsan doqquz qəpik"
```

## Project Structure

```
src/
├── App.tsx           # Main application component
├── main.tsx          # Application entry point
├── types.ts          # TypeScript type definitions
├── utils.ts          # Utility functions for number conversion
├── translations.ts   # Language translations
└── index.css         # Global styles
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.