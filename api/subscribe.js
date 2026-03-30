export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email required"
    });
  }

  try {
    await fetch("https://talkbox.impactapp.com.au/service/v1/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.TALKBOX_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
}