# The Gathering

A web application for browsing and filtering Magic: The Gathering cards.

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/masko-vl/the-gathering.git
cd the-gathering
npm install
```

## Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Features

- **Card List**: Browse through Magic: The Gathering cards with pagination
- **Card Details**: View detailed information about a specific card
- **Search & Filtering**: Filter cards by name
- **Responsive Design**: Optimized for both desktop and mobile devices

## Technical Decisions

### Architecture

- **Next.js**: Chosen for its server-side rendering capabilities and optimized image handling
- **Redux**: Used for global state management, particularly for card data and filtering state
- **TypeScript**: Implemented for type safety and better developer experience

### Key Implementation Details

- **Card Filtering**: Implemented with debounced search to minimize API calls while typing
- **API Integration**: Created reusable API helper functions that handle pagination and error states
- **Component Structure**: Used a modular approach with reusable components like `CardItem`
- **Image Handling**: Configured Next.js to properly handle remote images from the Magic API

### Performance Considerations

- Used Next.js Image component for optimized image loading
- Implemented pagination to limit the number of cards loaded at once
- Added debouncing for search functionality to reduce API calls

## Testing

The application uses Jest and React Testing Library for testing. To run the tests:

```bash
npm run test
```

For watching test files during development:

```bash
npm run test:watch
```

