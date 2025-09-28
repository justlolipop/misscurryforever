export default function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, number, wish } = req.body;

    // For now, just send back a success message
    res.status(200).json({
      message: "Form submitted successfully!",
      data: { name, email, number, wish },
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
