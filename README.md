
# Spades Scorecard

A modern, interactive web application for tracking Spades card game scores with beautiful themes, real-time scoring, and comprehensive game management.

## 🎮 Features

### Game Management
- **Create New Games**: Set up games with custom team names and up to 10 players per team
- **Game History**: View all your games with complete statistics and timestamps
- **Real-time Scoring**: Live score calculation with automatic bag tracking and penalties
- **Game Persistence**: All games are saved and can be resumed later

### Scoring System
- **Accurate Spades Rules**: Proper implementation of Spades scoring mechanics
  - 10 points per successful bid
  - -10 points per bid for failed bids
  - Bag tracking with 50-point penalties every 5 bags
  - Support for nil bids (0 bids)
- **Input Validation**: Smart constraints ensuring bids and tricks won don't exceed round limits
- **Error Indicators**: Visual warnings for invalid inputs

### Themes & Customization
- **Multiple Theme Categories**: Beautiful, Animals, Nature, and Vehicles
- **40+ Unique Themes**: Light, transparent designs that maintain readability
- **Theme Persistence**: Themes are saved per game and restored when viewing
- **Live Preview**: Hover to preview themes before applying
- **Team Restrictions**: Each team must select different themes

### User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Intuitive Interface**: Clean, modern UI with clear navigation
- **Game Celebrations**: Beautiful animated victory screen with fireworks
- **Time Tracking**: Start and finish times for all games
- **Delete Protection**: Confirmation dialogs for destructive actions

## 🚀 Technologies Used

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS for responsive, utility-first styling
- **UI Components**: Shadcn/UI for consistent, accessible components
- **Backend**: Supabase for authentication and database
- **Database**: PostgreSQL with Row Level Security (RLS)
- **State Management**: React hooks with custom game management
- **Icons**: Lucide React for beautiful, consistent icons

## 🏗️ Architecture

### Frontend Structure
```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Game dashboard and history
│   ├── game/          # Game-specific components
│   └── ui/            # Reusable UI components
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── utils/             # Utility functions and game logic
└── integrations/      # External service integrations
```

### Database Schema

#### Games Table
- Stores game metadata, team information, and final scores
- Tracks game status (active/completed) and timestamps
- Supports up to 10 players per team

#### Rounds Table
- Stores individual round data for each game
- Tracks bids, tricks won, bags, and scores for both teams
- 13 rounds per game (standard Spades format)

#### Profiles Table
- User profile information
- Links to Supabase authentication

## 🔒 Security

- **Row Level Security (RLS)**: Users can only access their own games
- **Authentication**: Secure user registration and login via Supabase
- **Input Validation**: Client and server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries throughout

## 🎯 Game Rules Implementation

### Spades Scoring Rules
1. **Successful Bid**: Score = Bid × 10 points
2. **Failed Bid**: Score = -(Bid × 10) points
3. **Bags**: Extra tricks beyond bid count as bags
4. **Bag Penalty**: Every 5 bags = -50 points
5. **Nil Bids**: 0 bid supported with proper scoring

### Validation Rules
- Bids cannot exceed the round number
- Tricks won cannot exceed the round number
- Both bids and tricks won must be ≥ 0
- Visual error indicators for invalid inputs

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd spades-scorecard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example env file
   cp .env.example .env.local
   
   # Add your Supabase credentials
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   - The database migrations are included in the `supabase/migrations/` folder
   - These will be automatically applied when you connect to Supabase

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

### Production Deployment

The application can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `dist` folder after running `npm run build`
- **GitHub Pages**: Use the included GitHub Actions workflow

## 🎨 Customization

### Adding New Themes
1. Add theme definitions to `src/components/game/ThemeSelector.tsx`
2. Include background, text, and accent colors
3. Ensure themes use light colors with transparency for readability

### Modifying Game Rules
- Update scoring logic in `src/utils/gameLogic.ts`
- Modify validation rules in the Scorecard component
- Adjust database schema if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you encounter any issues or have questions:

1. Check the existing [Issues](https://github.com/your-username/spades-scorecard/issues)
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

## 🎉 Acknowledgments

- **Shadcn/UI** for the beautiful component library
- **Supabase** for the robust backend infrastructure
- **Tailwind CSS** for the utility-first styling approach
- **Lucide React** for the comprehensive icon set

---

**Built with ❤️ for Spades enthusiasts everywhere!**
