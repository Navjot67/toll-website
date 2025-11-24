document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const messageBox = document.getElementById('messageBox');

    // Get field groups
    const nyAccountGroup = document.getElementById('nyAccountGroup');
    const plateNumberGroup = document.getElementById('plateNumberGroup');
    const njViolationGroup = document.getElementById('njViolationGroup');
    const nyTollAccountInput = document.getElementById('nyTollAccount');
    const plateNumberInput = document.getElementById('plateNumber');
    const njViolationInput = document.getElementById('njViolationNumber');

    // Handle toll type selection
    const tollTypeRadios = document.querySelectorAll('input[name="tollType"]');
    tollTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            updateFieldVisibility(this.value);
        });
    });

    function updateFieldVisibility(tollType) {
        // Reset required attributes
        nyTollAccountInput.removeAttribute('required');
        plateNumberInput.removeAttribute('required');
        njViolationInput.removeAttribute('required');

        // Hide all groups first
        nyAccountGroup.style.display = 'none';
        plateNumberGroup.style.display = 'none';
        njViolationGroup.style.display = 'none';

        // Show appropriate fields based on selection
        if (tollType === 'NY') {
            nyAccountGroup.style.display = 'flex';
            plateNumberGroup.style.display = 'flex';
            nyTollAccountInput.setAttribute('required', 'required');
            plateNumberInput.setAttribute('required', 'required');
        } else if (tollType === 'NJ') {
            njViolationGroup.style.display = 'flex';
            plateNumberGroup.style.display = 'flex';
            njViolationInput.setAttribute('required', 'required');
            plateNumberInput.setAttribute('required', 'required');
        } else if (tollType === 'BOTH') {
            nyAccountGroup.style.display = 'flex';
            njViolationGroup.style.display = 'flex';
            plateNumberGroup.style.display = 'flex';
            nyTollAccountInput.setAttribute('required', 'required');
            njViolationInput.setAttribute('required', 'required');
            plateNumberInput.setAttribute('required', 'required');
        }
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get selected toll type
        const selectedTollType = document.querySelector('input[name="tollType"]:checked');
        if (!selectedTollType) {
            showMessage('Please select which tolls you want to check.', 'error');
            return;
        }

        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            tollType: selectedTollType.value,
            nyTollAccount: document.getElementById('nyTollAccount').value.trim(),
            plateNumber: document.getElementById('plateNumber').value.trim(),
            njViolationNumber: document.getElementById('njViolationNumber').value.trim()
        };

        // Validate required fields based on toll type
        if (!formData.name || !formData.email) {
            showMessage('Please fill in name and email address.', 'error');
            return;
        }

        // Validate fields based on toll type
        if (formData.tollType === 'NY') {
            if (!formData.nyTollAccount || !formData.plateNumber) {
                showMessage('Please fill in NY Toll Account Number and Plate Number.', 'error');
                return;
            }
        } else if (formData.tollType === 'NJ') {
            if (!formData.njViolationNumber || !formData.plateNumber) {
                showMessage('Please fill in NJ Violation Number and Plate Number.', 'error');
                return;
            }
        } else if (formData.tollType === 'BOTH') {
            if (!formData.nyTollAccount || !formData.njViolationNumber || !formData.plateNumber) {
                showMessage('Please fill in all required fields for both NY and NJ.', 'error');
                return;
            }
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        setLoadingState(true);
        hideMessage();

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                showMessage(data.message || 'Your information has been submitted successfully!', 'success');
                form.reset();
                // Hide all field groups after reset
                nyAccountGroup.style.display = 'none';
                plateNumberGroup.style.display = 'none';
                njViolationGroup.style.display = 'none';
                // Clear required attributes
                nyTollAccountInput.removeAttribute('required');
                plateNumberInput.removeAttribute('required');
                njViolationInput.removeAttribute('required');
            } else {
                showMessage(data.error || 'Failed to submit information. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('An error occurred. Please check your connection and try again.', 'error');
        } finally {
            setLoadingState(false);
        }
    });

    function setLoadingState(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline';
        } else {
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    }

    function showMessage(message, type) {
        messageBox.textContent = message;
        messageBox.className = `message-box ${type}`;
        messageBox.style.display = 'block';
        
        // Scroll to message
        messageBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function hideMessage() {
        messageBox.style.display = 'none';
    }
});

// Example image modal functions
function showExample(type) {
    const modal = document.getElementById('exampleModal');
    const modalTitle = document.getElementById('modalTitle');
    const exampleImage = document.getElementById('exampleImage');
    const imageContainer = exampleImage.parentElement;
    
    // Try different image formats
    const imageFormats = ['.jpg', '.jpeg', '.png', '.webp'];
    let imagePath = '';
    let imageAlt = '';
    let title = '';
    
    // Set image source and title based on type
    if (type === 'nyToll') {
        title = 'NY Toll Bill Account Number Example';
        imageAlt = 'Example of NY Toll Bill Account Number';
        const baseName = 'images/ny-toll-account-example';
        // Try to find the image with any supported format
        imagePath = baseName + '.jpg'; // Default to jpg, but will check if exists
    } else if (type === 'njViolation') {
        title = 'NJ Toll Violation Number Example';
        imageAlt = 'Example of NJ Toll Violation Number';
        const baseName = 'images/nj-violation-example';
        imagePath = baseName + '.jpg'; // Default to jpg
    }
    
    modalTitle.textContent = title;
    exampleImage.alt = imageAlt;
    exampleImage.src = imagePath;
    
    // Handle image load error
    exampleImage.onerror = function() {
        exampleImage.style.display = 'none';
        if (!imageContainer.querySelector('.image-error')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'image-error';
            errorMsg.style.cssText = 'padding: 20px; color: #666; text-align: center;';
            errorMsg.innerHTML = `
                <p style="margin-bottom: 10px;">⚠️ Example image not found</p>
                <p style="font-size: 0.9rem; color: #999;">Please add an example image to the <code>images</code> folder.</p>
                <p style="font-size: 0.85rem; color: #999; margin-top: 10px;">Expected file: <code>${imagePath.split('/').pop()}</code></p>
            `;
            imageContainer.appendChild(errorMsg);
        }
    };
    
    exampleImage.onload = function() {
        exampleImage.style.display = 'block';
        const errorMsg = imageContainer.querySelector('.image-error');
        if (errorMsg) {
            errorMsg.remove();
        }
    };
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeExample() {
    const modal = document.getElementById('exampleModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('exampleModal');
    if (event.target === modal) {
        closeExample();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeExample();
    }
});

