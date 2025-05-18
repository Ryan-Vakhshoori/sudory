# Sudory

Sudory is a daily Sudoku puzzle web app built with [Next.js](https://nextjs.org) and React. It features three difficulties (easy, medium, hard), persistent progress for each puzzle, and a clean, mobile-friendly interface.

## Features

- **Daily Puzzles:** New Sudoku puzzles every day for each difficulty.
- **Difficulty Levels:** Easy, Medium, and Hard puzzles available.
- **Progress Persistence:** Your progress and completion status are saved for each difficulty.
- **Timer & Move Counter:** Track your solve time and moves.
- **Completion Popup:** See your stats and quickly jump to another puzzle.
- **Responsive Design:** Works great on desktop and mobile.
- **Countdown:** When all puzzles are completed, a live countdown shows when new puzzles will be available (based on UTC midnight).

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000) to play.

## Project Structure

- `app/page.tsx` – Main page and game logic
- `app/components/` – UI components (Grid, GameBar, Stopwatch, Popup, etc.)
- `app/hooks/` – Custom React hooks (e.g., puzzle logic)
- `app/utils/` – Utility functions (e.g., time formatting, countdown)

## Customization

- **Puzzles:** Puzzles are loaded from CSV files per difficulty. You can add or update puzzles in the data source.
- **Styling:** Uses [Tailwind CSS](https://tailwindcss.com/) for rapid UI development.

## Deployment

Deploy easily to [Vercel](https://vercel.com/) or any platform that supports Next.js.

## License

MIT

---

Made with ❤️ using Next.js and React.
