document.addEventListener('DOMContentLoaded', () => {
    // Time picker functionality
    const timeColumns = {
        hours: Array.from({ length: 12 }, (_, i) => (i === 0 ? '12' : (i + 1).toString().padStart(2, '0'))),
        minutes: Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')),
        meridiem: ['AM', 'PM']
    };

    // Initialize with current time rounded to next 15 minutes
    const now = new Date();
    now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15);
    let selectedTime = {
        hours: now.getHours() > 12 ? 
            (now.getHours() - 12).toString().padStart(2, '0') : 
            (now.getHours() === 0 ? '12' : now.getHours().toString().padStart(2, '0')),
        minutes: now.getMinutes().toString().padStart(2, '0'),
        meridiem: now.getHours() >= 12 ? 'PM' : 'AM'
    };

    // Initialize time columns
    Object.entries(timeColumns).forEach(([key, values]) => {
        const column = document.querySelector(`.time-column.${key} .time-scroll`);
        column.innerHTML = '';
        
        // Add padding options for smooth scrolling
        const allOptions = [...values.slice(-3), ...values, ...values.slice(0, 3)];
        
        allOptions.forEach(value => {
            const option = document.createElement('div');
            option.className = 'time-option';
            option.textContent = value;
            if (value === selectedTime[key]) {
                option.classList.add('selected');
            }
            column.appendChild(option);
        });

        // Center the selected time initially
        const selectedIndex = values.indexOf(selectedTime[key]) + 3;
        const optionHeight = 40;
        column.style.transform = `translateY(${-selectedIndex * optionHeight + (column.clientHeight / 2 - optionHeight / 2)}px)`;

        // Add touch and mouse scroll functionality
        let startY = 0;
        let currentTranslate = 0;
        let isDragging = false;

        function startDragging(e) {
            isDragging = true;
            startY = e.type === 'mousedown' ? e.pageY : e.touches[0].pageY;
            currentTranslate = parseFloat(column.style.transform.replace('translateY(', '')) || 0;
            column.style.transition = 'none';
        }

        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
            const currentY = e.type === 'mousemove' ? e.pageY : e.touches[0].pageY;
            const diff = currentY - startY;
            const newTranslate = currentTranslate + diff;
            column.style.transform = `translateY(${newTranslate}px)`;
        }

        function stopDragging() {
            if (!isDragging) return;
            isDragging = false;
            column.style.transition = 'transform 0.3s ease';
            
            const currentTranslate = parseFloat(column.style.transform.replace('translateY(', '')) || 0;
            const optionHeight = 40;
            const centerOffset = column.clientHeight / 2 - optionHeight / 2;
            const rawIndex = Math.round((centerOffset - currentTranslate) / optionHeight);
            const selectedIndex = ((rawIndex % values.length) + values.length) % values.length;
            
            // Update selected value
            selectedTime[key] = values[selectedIndex];
            
            // Update visual position
            const newTranslate = centerOffset - (selectedIndex + 3) * optionHeight;
            column.style.transform = `translateY(${newTranslate}px)`;
            
            // Update selected class
            column.querySelectorAll('.time-option').forEach(option => option.classList.remove('selected'));
            column.children[selectedIndex + 3].classList.add('selected');

            // Validate and adjust time if needed
            validateTime();
        }

        column.addEventListener('mousedown', startDragging);
        column.addEventListener('touchstart', startDragging);
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('mouseup', stopDragging);
        document.addEventListener('touchend', stopDragging);
    });

    function validateTime() {
        const selectedDate = dateInput.value ? new Date(dateInput.value) : new Date();
        const selectedHour = parseInt(selectedTime.hours) + (selectedTime.meridiem === 'PM' && selectedTime.hours !== '12' ? 12 : 0);
        const selectedMinute = parseInt(selectedTime.minutes);
        
        const selectedDateTime = new Date(selectedDate);
        selectedDateTime.setHours(selectedHour, selectedMinute, 0, 0);

        const now = new Date();
        if (selectedDateTime < now) {
            // If selected time is in the past, set it to next 15 minutes
            now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15);
            selectedTime.hours = now.getHours() > 12 ? 
                (now.getHours() - 12).toString().padStart(2, '0') : 
                (now.getHours() === 0 ? '12' : now.getHours().toString().padStart(2, '0'));
            selectedTime.minutes = now.getMinutes().toString().padStart(2, '0');
            selectedTime.meridiem = now.getHours() >= 12 ? 'PM' : 'AM';
            
            // Update UI
            Object.entries(timeColumns).forEach(([key, values]) => {
                const column = document.querySelector(`.time-column.${key} .time-scroll`);
                column.querySelectorAll('.time-option').forEach(option => option.classList.remove('selected'));
                const selectedIndex = values.indexOf(selectedTime[key]) + 3;
                column.children[selectedIndex].classList.add('selected');
                
                const optionHeight = 40;
                const centerOffset = column.clientHeight / 2 - optionHeight / 2;
                const newTranslate = centerOffset - selectedIndex * optionHeight;
                column.style.transform = `translateY(${newTranslate}px)`;
            });
        }
    }

    // Date picker functionality
    const datePicker = document.querySelector('.date-picker');
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.style.display = 'none';
    document.body.appendChild(dateInput);

    // Set minimum date to today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dateInput.min = today.toISOString().split('T')[0];
    dateInput.value = today.toISOString().split('T')[0];
    
    // Set maximum date to 30 days from today
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);
    dateInput.max = maxDate.toISOString().split('T')[0];

    // Update date picker button text initially
    updateDatePickerText(today);

    datePicker.addEventListener('click', () => {
        dateInput.click();
    });

    dateInput.addEventListener('change', (e) => {
        const selectedDate = new Date(e.target.value);
        updateDatePickerText(selectedDate);
        validateTime();
    });

    function updateDatePickerText(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        let dateText;
        if (date.getTime() === today.getTime()) {
            dateText = 'Today';
        } else if (date.getTime() === tomorrow.getTime()) {
            dateText = 'Tomorrow';
        } else {
            dateText = date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
        }
        
        datePicker.innerHTML = `
            <span class="calendar-icon">📅</span>
            ${dateText}
        `;
    }

    // Toggle between pickup and dropoff
    const timeTabs = document.querySelectorAll('.time-tab');
    timeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            timeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Handle next button
    const nextButton = document.querySelector('.next-button');
    nextButton.addEventListener('click', () => {
        const pickupLocation = document.querySelector('input[placeholder="Pickup location"]').value;
        const dropLocation = document.querySelector('input[placeholder="Drop location"]').value;
        const selectedTab = document.querySelector('.time-tab.active').textContent;
        
        // Create a date object with the selected date and time
        const selectedDate = new Date(dateInput.value);
        const selectedHour = parseInt(selectedTime.hours) + (selectedTime.meridiem === 'PM' && selectedTime.hours !== '12' ? 12 : 0);
        const selectedMinute = parseInt(selectedTime.minutes);
        selectedDate.setHours(selectedHour, selectedMinute, 0, 0);

        // Validate inputs
        if (!pickupLocation || !dropLocation) {
            alert('Please fill in all required fields');
            return;
        }

        // Save route details to localStorage
        localStorage.setItem('routeDetails', JSON.stringify({
            pickupLocation,
            dropLocation,
            scheduledTime: selectedDate.toLocaleString(),
            timeType: selectedTab
        }));

        // Navigate to looking for ride page
        window.location.href = 'looking-for-ride.html';
    });
}); 