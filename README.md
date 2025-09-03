# ClaimSnap

ClaimSnap is a web application that automatically organizes, tags, and categorizes property damage photos with insurance-specific labels for insurance adjusters, reducing claims processing time.

## Features

- **Automated Photo Sorting & Tagging**: Upload a batch of property damage photos, and ClaimSnap uses AI to automatically categorize and tag each image by damage type and location within the property.
- **Duplicate & Quality Detection**: The system intelligently identifies and flags duplicate photos or images that are too blurry or poorly lit to be useful, cleaning up the dataset before report generation.
- **Standardized Photo Report Generation**: Generate compliance-ready photo reports with standardized layouts, captions, and metadata, tailored to insurance industry requirements. Reports can be exported in various formats (PDF, CSV).
- **AI-Powered Damage Assessment**: Leverages AI to provide a preliminary assessment of damage severity based on image analysis, aiding adjusters in faster initial evaluations.

## Tech Stack

- **Frontend**: React, React Router, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **AI**: OpenAI API for image analysis
- **Storage**: Pinata Cloud for decentralized storage on IPFS
- **Payments**: Stripe for subscription management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- OpenAI API key
- Pinata Cloud API key
- Stripe API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/claimsnap.git
   cd claimsnap
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_PINATA_API_KEY=your_pinata_api_key
   VITE_PINATA_SECRET_API_KEY=your_pinata_secret_api_key
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
claimsnap/
├── docs/                  # Documentation
├── public/                # Public assets
├── src/                   # Source code
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main App component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── .env                   # Environment variables
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
└── vite.config.js         # Vite configuration
```

## Documentation

- [API Documentation](docs/API.md)
- [Component Documentation](docs/COMPONENTS.md)
- [User Flows](docs/USER_FLOWS.md)

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production version
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Folder Structure

- **components**: Reusable UI components
- **contexts**: React context providers for state management
- **hooks**: Custom React hooks
- **pages**: Page components for each route
- **services**: API services for external integrations
- **utils**: Utility functions and helpers

## Deployment

1. Build the production version:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Deploy the `dist` folder to your hosting provider of choice.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [OpenAI](https://openai.com/) for the AI image analysis
- [Supabase](https://supabase.io/) for the backend services
- [Pinata Cloud](https://pinata.cloud/) for IPFS storage
- [Stripe](https://stripe.com/) for payment processing
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React](https://reactjs.org/) for the UI framework

