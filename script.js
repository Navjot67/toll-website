document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const messageBox = document.getElementById('messageBox');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            nyTollAccount: document.getElementById('nyTollAccount').value.trim(),
            plateNumber: document.getElementById('plateNumber').value.trim(),
            njViolationNumber: document.getElementById('njViolationNumber').value.trim()
        };

        // Validate required fields
        if (!formData.name || !formData.nyTollAccount || !formData.plateNumber || !formData.njViolationNumber) {
            showMessage('Please fill in all required fields.', 'error');
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

