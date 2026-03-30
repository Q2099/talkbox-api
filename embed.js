(function () {
  const script = document.currentScript;
  const API_URL = script.getAttribute("data-api");

  const FORM_TITLE = script.getAttribute("data-title") || "Subscribe";
  const POPUP_TITLE = script.getAttribute("data-popup-title") || "Thank you!";
  const POPUP_MESSAGE = script.getAttribute("data-popup-message") || "You’ve been subscribed.";

  const container = document.createElement("div");
  container.innerHTML = `
    <style>
      form.tb-form {display: flex;}
      .tb-form-container { font-family: Arial,sans-serif; max-width:400px;margin:20px auto;text-align:center; }
      .tb-form-container h2 { margin-bottom:10px; }
      .tb-form-container input { padding:10px;width:70%;margin-right:5px; }
      .tb-form-container button { padding:10px 15px; cursor:pointer; }
      .tb-popup { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); justify-content:center; align-items:center; z-index:9999; }
      .tb-popup-content { background:#fff; padding:25px; border-radius:8px; text-align:center; }
    </style>
    <div class="tb-form-container">
      <h2>${FORM_TITLE}</h2>
      <form class="tb-form">
        <input type="email" placeholder="Enter your email" required />
        <button type="submit">Subscribe</button>
      </form>
    </div>
    <div class="tb-popup">
      <div class="tb-popup-content">
        <h3>${POPUP_TITLE}</h3>
        <p>${POPUP_MESSAGE}</p>
        <button class="tb-close">Close</button>
      </div>
    </div>
  `;

  script.parentNode.insertBefore(container, script);

  const form = container.querySelector(".tb-form");
  const input = container.querySelector("input");
  const popup = container.querySelector(".tb-popup");
  const closeBtn = container.querySelector(".tb-close");
  const submitBtn = form.querySelector("button");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = input.value;

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const result = await res.json();

      if (result.success) {
        popup.style.display = "flex";
        form.reset();

        // Fire Meta Pixel CompleteRegistration
        if (typeof fbq === "function") {
          fbq("track", "CompleteRegistration", { email });
        }
      } else {
        alert("Error: " + (result.message || "Unknown server error"));
      }
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Subscribe";
    }
  });

  closeBtn.addEventListener("click", () => { popup.style.display = "none"; });
})();
