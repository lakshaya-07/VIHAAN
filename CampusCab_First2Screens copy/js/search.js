document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("searchForm");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const pickup = document.getElementById("pickup").value;
        const destination = document.getElementById("destination").value;
        const rideType = document.querySelector("input[name='rideType']:checked").value;

        try {
            const docRef = await db.collection("rides").add({
                pickup,
                destination,
                rideType,
                createdAt: new Date()
            });
            localStorage.setItem("rideId", docRef.id);
            window.location.href = "map.html";
        } catch (error) {
            console.error("Error:", error);
            alert("Could not continue.");
        }
    });
});