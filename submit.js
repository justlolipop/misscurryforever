export default function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body; // form data
    console.log("Form submitted:", data);

    // Here you could send email, save to database, etc.
    res.status(200).json({ message: 'Form received!' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
