// api/subscribe.js
export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { email } = req.body;

  // Validate email
  if (!email) {
    console.error("No email provided");
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  // Get TalkBox credentials from environment variables
  const user = process.env.TALKBOX_USER;
  const pass = process.env.TALKBOX_PASS;

  if (!user || !pass) {
    console.error("TALKBOX_USER or TALKBOX_PASS environment variable missing");
    return res.status(500).json({
      success: false,
      message: "Server configuration error: missing credentials"
    });
  }

  const auth = Buffer.from(`${user}:${pass}`).toString("base64");

  try {
    console.log("Sending request to TalkBox for email:", email);

    const response = await fetch(
      "https://talkbox.impactapp.com.au/service/v1/contacts",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TalkBox API responded with error:", errorText);
      return res.status(response.status).json({ success: false, message: errorText });
    }

    console.log("TalkBox contact added/updated successfully:", email);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Function execution error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
