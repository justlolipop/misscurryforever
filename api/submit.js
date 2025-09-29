module.exports = (req, res) => {
  // Enable CORS (allows form to submit from any domain)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only accept POST requests
  if (req.method === 'POST') {
    let body = "";

    // Collect the data chunks
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    // When all data is received
    req.on("end", () => {
      // Parse the form data
      const params = new URLSearchParams(body);
      
      // Extract form fields
      const name = params.get("name");
      const email = params.get("email");
      const number = params.get("number");
      const loveCurry = params.get("love-curry");
      const item = params.get("item");
      const gender = params.getAll("gender"); // Can have multiple values
      const wish = params.get("wish");

      // Log to server console (you can see this in Vercel logs)
      console.log("Form submitted:", {
        name,
        email,
        number,
        loveCurry,
        item,
        gender,
        wish
      });

      // Send success response back to browser
      res.status(200).json({
        success: true,
        message: "Form submitted successfully! Thank you for remembering Curry 🐱",
        data: {
          name,
          email,
          number,
          loveCurry,
          item,
          gender,
          wish
        }
      });
    });

    // Handle errors
    req.on("error", (error) => {
      console.error("Error:", error);
      res.status(500).json({
        success: false,
        message: "Server error occurred"
      });
    });

  } else {
    // If not POST, return error
    res.status(405).json({ 
      success: false,
      message: "Method not allowed. Please use POST." 
    });
  }
};
