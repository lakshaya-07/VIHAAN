function bookRide(type) {
    const recurring = document.getElementById("recurring").checked;
    const rideTypes = document.getElementsByName("ride");
    let selectedRideType = null;
  
    for (const ride of rideTypes) {
      if (ride.checked) {
        selectedRideType = ride.value;
        break;
      }
    }
  
    if (!selectedRideType) {
      alert("Please select a ride type!");
      return;
    }
  
    // Redirect based on button clicked
    if (type === 'instant') {
      window.location.href = 'instant.html';
    } else if (type === 'schedule') {
      window.location.href = 'schedule.html';
    } else if (type === 'daily') {
      window.location.href = 'daily.html';
    }
  }