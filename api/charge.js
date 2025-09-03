export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).json({ message: "Not Found" });
  }

  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    return res.status(500).json({ error: "MIDTRANS_SERVER_KEY is not set" });
  }

  const isProduction = false;
  const apiUrl = isProduction
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";

  try {
    // Parse body secara manual
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
          "Basic " + Buffer.from(serverKey + ":").toString("base64"),
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    return res.status(response.status).json(result);
  } catch (error) {
    console.error("Midtrans Error:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
