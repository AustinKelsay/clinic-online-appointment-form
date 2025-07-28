document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('appointmentForm');
    const successMessage = document.getElementById('successMessage');
    const submitBtn = form.querySelector('.submit-btn');

    // Add input animations
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });

        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Add loading state
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="loading"></div> Processing...';
        submitBtn.disabled = true;

        // Get form data
        const formData = new FormData(form);
        const timeSlots = Array.from(document.querySelectorAll('input[name="timeSlots"]:checked'))
            .map(checkbox => checkbox.value);

        if (timeSlots.length === 0) {
            alert('Please select at least one preferred time slot.');
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
            return;
        }

        const appointmentData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            timeSlots: timeSlots.join(', '),
            reason: formData.get('reason'),
            timestamp: new Date().toISOString()
        };

        try {
            // Submit to Google Sheets
            await submitToGoogleSheets(appointmentData);

            // Show success message
            form.style.display = 'none';
            successMessage.style.display = 'block';

            // Reset form after 5 seconds
            setTimeout(() => {
                form.style.display = 'block';
                successMessage.style.display = 'none';
                form.reset();
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
            }, 5000);

        } catch (error) {
            alert('There was an error submitting your appointment. Please try again.');
            console.error('Error:', error);
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
        }
    });
});

async function submitToGoogleSheets(data) {
    // TODO: Replace with your Google Apps Script Web App URL
    const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

    // For now, we'll simulate the API call
    console.log('Appointment data to be sent to Google Sheets:', data);

    // Uncomment and modify this when you have your Google Apps Script URL
    /*
    const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Failed to submit appointment');
    }

    return await response.json();
    */

    // Simulate API delay
    return new Promise(resolve => setTimeout(resolve, 2000));
}