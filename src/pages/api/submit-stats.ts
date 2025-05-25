import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // if (req.method !== "POST") return res.status(405).end();

  const { puzzleIndex, difficulty, time, moveCount } = req.body;
  const { error } = await supabase.from("completions").insert([
    { puzzle_index: puzzleIndex, difficulty, time, move_count: moveCount }
  ]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ success: true });
}