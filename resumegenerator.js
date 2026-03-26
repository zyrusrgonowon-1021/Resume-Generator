// ==================== FORM VALIDATION ==================== 
function validateForm(formData) {
    const errors = [];

    if (!formData.fname || formData.fname.trim().length < 2) {
        errors.push("Full name must be at least 2 characters");
    }

    if (!formData.bday) {
        errors.push("Birthday is required");
    } else {
        const age = new Date().getFullYear() - new Date(formData.bday).getFullYear();
        if (age < 16) {
            errors.push("You must be at least 16 years old");
        }
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.push("Please enter a valid email address");
    }

    if (!formData.phone || formData.phone.replace(/\D/g, '').length < 10) {
        errors.push("Please enter a valid phone number");
    }

    if (!formData.educ) {
        errors.push("Education level is required");
    }

    if (!formData.skills || formData.skills.trim().length < 3) {
        errors.push("Please enter at least one skill");
    }

    if (!formData.experience || formData.experience.trim().length < 5) {
        errors.push("Please describe your work experience");
    }

    return errors;
}

function displayErrors(errors) {
    const errorContainer = document.getElementById('errorContainer');
    if (!errorContainer) return;

    if (errors.length === 0) {
        errorContainer.classList.remove('show');
        errorContainer.innerHTML = '';
    } else {
        errorContainer.classList.add('show');
        errorContainer.innerHTML = errors.map(error => `<div class="error-item">${error}</div>`).join('');
    }
}

// ==================== FORM SUBMISSION ==================== 
function handleFormSubmit() {
    const form = document.querySelector('#resumeForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Get form data
        const imageFile = document.querySelector('.UploadImage').files[0];
        const formData = {
            fname: document.getElementById('fname').value,
            bday: document.getElementById('bday').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('Phone').value,
            educ: document.getElementById('Educ').value,
            skills: document.getElementById('skills').value,
            experience: document.getElementById('experience').value,
            accomplishment: document.getElementById('accomplishment').value
        };

        // Validate form data
        const errors = validateForm(formData);
        displayErrors(errors);

        if (errors.length > 0) {
            return;
        }

        if (!imageFile) {
            displayErrors(["Please upload a profile photo"]);
            return;
        }

        // Check file size (5MB max)
        if (imageFile.size > 5 * 1024 * 1024) {
            displayErrors(["Image file size must be less than 5MB"]);
            return;
        }

        // Read image
        const imageReader = new FileReader();
        imageReader.onload = function () {
            // Save image
            sessionStorage.setItem("UploadImage", imageReader.result);

            // Save form data
            sessionStorage.setItem("fname", formData.fname);
            sessionStorage.setItem("Bday", formData.bday);
            sessionStorage.setItem("Email", formData.email);
            sessionStorage.setItem("Phone", formData.phone);
            sessionStorage.setItem("Educ", formData.educ);
            sessionStorage.setItem("skills", formData.skills);
            sessionStorage.setItem("experience", formData.experience);
            sessionStorage.setItem("accomplishment", formData.accomplishment);

            // Handle certificate if provided
            const certFile = document.querySelector('.UploadCertificate').files[0];
            if (certFile) {
                const certReader = new FileReader();
                certReader.onload = function () {
                    sessionStorage.setItem("certificateData", certReader.result);
                    sessionStorage.setItem("certificateType", certFile.type);
                    sessionStorage.setItem("certificateName", certFile.name);
                    window.location.href = "resumegeneratorfinalresult.html";
                };
                certReader.readAsDataURL(certFile);
            } else {
                window.location.href = "resumegeneratorfinalresult.html";
            }
        };

        imageReader.onerror = function () {
            displayErrors(["Error reading image file"]);
        };

        imageReader.readAsDataURL(imageFile);
    });
}

// ==================== GO BACK BUTTON ==================== 
function handleGoBack() {
    const btn = document.querySelector('.gobackclick');
    if (!btn) return;

    btn.addEventListener('click', () => {
        window.history.back();
    });
}

// ==================== PDF GENERATION ==================== 
function generatePDF() {
    const element = document.querySelector('.displayinfo');
    if (!element) return;

    // Save previous styles
    const previousStyle = {
        width: element.style.width,
        maxWidth: element.style.maxWidth,
        minHeight: element.style.minHeight,
        transform: element.style.transform,
        bodyBg: document.body.style.background
    };

    // Fix layout for PDF
    element.style.width = '210mm';
    element.style.maxWidth = '210mm';
    element.style.minHeight = '297mm';
    element.style.transform = 'scale(1)';

    window.scrollTo(0, 0);

    // ✅ FIX: Remove gradient background (CAUSE OF GRAY EFFECT)
    document.body.style.background = '#ffffff';

    // Apply clean PDF mode
    element.classList.add('pdf-ready');

    // ✅ FIX: Better rendering settings
    const options = {
        margin: 10,
        filename: `Resume_${sessionStorage.getItem('fname') || 'resume'}.pdf`,
        image: { type: 'jpeg', quality: 1 }, // 🔥 clearer than png
        html2canvas: {
            scale: 2, // 🔥 less blur (3 → 2)
            useCORS: true,
            backgroundColor: '#ffffff',
            letterRendering: true
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if (typeof html2pdf === 'undefined') {
        alert('PDF library not loaded. Please refresh the page.');
        restoreStyles();
        return;
    }

    html2pdf().set(options).from(element).save()
        .then(() => restoreStyles())
        .catch(() => restoreStyles());

    // Restore original styles after PDF
    function restoreStyles() {
        element.style.width = previousStyle.width;
        element.style.maxWidth = previousStyle.maxWidth;
        element.style.minHeight = previousStyle.minHeight;
        element.style.transform = previousStyle.transform;
        document.body.style.background = previousStyle.bodyBg;
        element.classList.remove('pdf-ready');
    }
}

// ==================== DISPLAY RESUME DATA ==================== 
function displayResumeData() {
    if (document.getElementById("outName")) {
        // Display personal information
        const outName = document.getElementById("outName");
        const outBday = document.getElementById("outBday");
        const outEmail = document.getElementById("outEmail");
        const outPhone = document.getElementById("outPhone");
        const outEduc = document.getElementById("outEduc");
        const outskills = document.getElementById("outskills");
        const outexperience = document.getElementById("outexperience");
        const outaccomplishment = document.getElementById("outaccomplishment");

        if (outName) outName.textContent = sessionStorage.getItem("fname") || '';
        if (outBday) outBday.textContent = formatDate(sessionStorage.getItem("Bday")) || '';
        if (outEmail) outEmail.textContent = sessionStorage.getItem("Email") || '';
        if (outPhone) outPhone.textContent = sessionStorage.getItem("Phone") || '';
        if (outEduc) outEduc.textContent = sessionStorage.getItem("Educ") || '';
        if (outskills) outskills.textContent = sessionStorage.getItem("skills") || '';
        if (outexperience) outexperience.textContent = sessionStorage.getItem("experience") || '';
        
        // Handle accomplishment section
        const accomplishmentText = sessionStorage.getItem("accomplishment");
        if (outaccomplishment) outaccomplishment.textContent = accomplishmentText || '';
        
        const accomplishmentSection = document.getElementById("accomplishmentSection");
        if (accomplishmentSection) {
            if (accomplishmentText && accomplishmentText.trim().length > 0) {
                accomplishmentSection.style.display = 'block';
            } else {
                accomplishmentSection.style.display = 'none';
            }
        }

        // Display image
        const imgData = sessionStorage.getItem("UploadImage");
        if (imgData) {
            const outImage = document.getElementById("outImage");
            if (outImage) outImage.src = imgData;
        }

        // Display certificate
        displayCertificate();
    }
}

function formatDate(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {year: 'numeric',month: 'short', day: 'numeric' }); // 🔥 shorter month (Dec instead of December)
    } catch (e) {
        return dateString;
    }
}

function displayCertificate() {
    const certData = sessionStorage.getItem("certificateData");
    const certType = sessionStorage.getItem("certificateType");
    const certDiv = document.getElementById("outcertificate");
    const certSection = document.getElementById("certificateSection");

    if (!certDiv || !certData) {
        if (certSection) certSection.style.display = 'none';
        return;
    }

    if (certSection) certSection.style.display = 'block';

    try {
        if (certType && certType.startsWith("image/")) {
            certDiv.innerHTML = `<img src="${certData}" style="max-width:100%; border-radius: 6px; border: 2px solid #ddd;">`;
        } 
        else if (certType === "application/pdf") {
            if (typeof pdfjsLib !== 'undefined') {
                const loadingTask = pdfjsLib.getDocument(certData);
                loadingTask.promise.then(pdf => {
                    pdf.getPage(1).then(page => {
                        const scale = 1.5;
                        const viewport = page.getViewport({ scale });

                        const canvas = document.createElement("canvas");
                        const context = canvas.getContext("2d");
                        canvas.width = viewport.width;
                        canvas.height = viewport.height;

                        page.render({
                            canvasContext: context,
                            viewport: viewport
                        }).promise.then(() => {
                            const imgData = canvas.toDataURL("image/png");
                            certDiv.innerHTML = `<img src="${imgData}" style="max-width:100%; border-radius: 6px; border: 2px solid #ddd;">`;
                        });
                    });
                }).catch(err => {
                    certDiv.innerHTML = `<p style="color: #666;">Certificate uploaded (PDF)</p>`;
                });
            } else {
                certDiv.innerHTML = `<p style="color: #666;">Certificate uploaded as PDF</p>`;
            }
        } 
        else {
            certDiv.innerHTML = `<p style="color: #666;">Certificate uploaded</p>`;
        }
    } catch (err) {
        certDiv.innerHTML = `<p style="color: #666;">Error displaying certificate</p>`;
    }
}

// ==================== PAGE INITIALIZATION ==================== 
window.addEventListener('DOMContentLoaded', function () {
    // Initialize form handlers
    handleFormSubmit();
    handleGoBack();
    
    // Initialize download button
    const btnPDF = document.getElementById("downloadform");
    if (btnPDF) {
        btnPDF.addEventListener('click', generatePDF);
    }

    // Display resume data if on result page
    displayResumeData();
    
    // Add event listeners for file inputs
    const imageInput = document.querySelector('.UploadImage');
    if (imageInput) {
        imageInput.addEventListener('change', function (e) {
            if (e.target.files.length > 0) {
                displayErrors([]);
            }
        });
    }
});