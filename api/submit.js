export default async function handler(req, res) {
  if (req.method === "POST") {
    // Parse the body depending on how it was sent
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const params = new URLSearchParams(body);
      const name = params.get("name");
      const email = params.get("email");
      const number = params.get("number");
      const wish = params.get("wish");

      res.status(200).json({
        message: "Form submitted successfully!",
        data: { name, email, number, wish },
      });
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
