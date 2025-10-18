import { neon } from '@neondatabase/serverless';

// This tells Vercel to parse the form body automatically
export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({
      error: 'DATABASE_URL not set in environment variables!'
    });
  }
  // Connect to Neon using DATABASE_URL from .env
  const sql = neon(process.env.DATABASE_URL);

  // ==================== GET - Fetch wishes ====================
  if (req.method === 'GET') {
    try {
      // Create table if not exists
      await sql`
        CREATE TABLE IF NOT EXISTS curry_wishes (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT,
          age INTEGER,
          love_curry TEXT,
          curry_stand TEXT,
          curry_gender TEXT,
          wish TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Get all wishes
      const wishes = await sql`
        SELECT * FROM curry_wishes 
        ORDER BY created_at DESC 
        LIMIT 100
      `;

      return res.status(200).json({
        success: true,
        wishes: wishes
      });

    } catch (error) {
      console.error('❌ GET Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch wishes',
        error: error.message
      });
    }
  }

  // ==================== POST - Save wish ====================
  if (req.method === 'POST') {
    try {
      // Get form data from req.body
      const { name, email, number, 'love-curry': loveCurry, item, gender, wish } = req.body;

      console.log('📝 Received data:', req.body);

      // Validate required fields
      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: 'Name and email are required!'
        });
      }

      // Create table if not exists
      await sql`
        CREATE TABLE IF NOT EXISTS curry_wishes (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT,
          age INTEGER,
          love_curry TEXT,
          curry_stand TEXT,
          curry_gender TEXT,
          wish TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Insert into database
      await sql`
        INSERT INTO curry_wishes (name, email, age, love_curry, curry_stand, curry_gender, wish)
        VALUES (
          ${name}, 
          ${email}, 
          ${number ? parseInt(number) : null}, 
          ${loveCurry || null}, 
          ${item || null}, 
          ${gender || null}, 
          ${wish || null}
        )
      `;

      console.log('✅ Wish saved successfully!');

      // Redirect to thank you page
      res.setHeader('Location', '/thanks.html');
      return res.status(302).end();

    } catch (error) {
      console.error('❌ POST Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to save wish',
        error: error.message
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: 'Method not allowed'
  });
}
