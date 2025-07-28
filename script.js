
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('appointmentForm');
    const messageDiv = document.getElementById('message');
    const submitBtn = form.querySelector('.submit-btn');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Disable submit button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Scheduling...';
        
        // Hide any previous messages
        messageDiv.style.display = 'none';
        
        // Get form data
        const formData = new FormData(form);
        
        // Get selected time slots
        const timeSlots = Array.from(document.getElementById('timeSlots').selectedOptions)
            .map(option => option.value);
        
        // Create appointment object
        const appointmentData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            timeSlots: timeSlots,
            reason: formData.get('reason'),
            submissionDate: new Date().toISOString()
        };

        try {
            // Send data to backend
            const response = await fetch('/submit-appointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData)
            });

            const result = await response.json();

            if (response.ok) {
                showMessage('Appointment request submitted successfully! We will contact you soon.', 'success');
                form.reset();
            } else {
                showMessage(result.error || 'An error occurred. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Network error. Please check your connection and try again.', 'error');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Schedule Appointment';
        }
    });

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Add some interactive feedback for the multi-select
    const timeSlots = document.getElementById('timeSlots');
    timeSlots.addEventListener('change', function() {
        const selectedCount = this.selectedOptions.length;
        const small = this.parentNode.querySelector('small');
        
        if (selectedCount > 0) {
            small.textContent = `${selectedCount} time slot(s) selected`;
            small.style.color = '#27ae60';
        } else {
            small.textContent = 'Hold Ctrl (Cmd on Mac) to select multiple time slots';
            small.style.color = '#6c757d';
        }
    });
});
