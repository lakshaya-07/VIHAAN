document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("verificationForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const fullName = document.getElementById("fullName").value;
      const aadhaar = document.getElementById("aadhaar").value;
      const abcId = document.getElementById("abcId").value;
      const collegeName = document.getElementById("collegeName").value;
      const gender = document.querySelector("input[name='gender']:checked")?.value;

      try {
        await db.collection("verifications").add({
          fullName,
          aadhaar,
          abcId,
          collegeName,
          gender,
          timestamp: new Date()
        });
        window.location.href = "document-upload.html";
      } catch (error) {
        console.error("Error writing document: ", error);
        alert("Verification failed. Try again.");
      }
    });
  }
});
