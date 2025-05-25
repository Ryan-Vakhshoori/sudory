import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const { puzzleIndex, difficulty } = req.query;
  const { data, error } = await supabase
    .from("completions")
    .select("time, move_count")
    .eq("puzzle_index", puzzleIndex)
    .eq("difficulty", difficulty);
  
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ times: data?.map(d => d.time), moves: data?.map(d => d.move_count) });
}