export async function POST(req, res) {
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
}
