import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).json({ message: "Not Found" });
  }

  const serverKey = process.env.MIDTRANS_SERVER_KEY; // taruh di Vercel ENV
  const isProduction = false;

  const apiUrl = isProduction
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
          "Basic " + Buffer.from(serverKey + ":").toString("base64"),
      },
      body: JSON.stringify(req.body),
    });

    const result = await response.json();
    return res.status(response.status).json(result);
  } catch (error) {
    console.error("Midtrans Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
