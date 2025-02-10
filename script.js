// Signup form submission
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(signupForm);
        try {
            const response = await fetch('/api/users/signup', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (response.ok) {
                alert('Signup successful!');
                window.location.href = 'login.html';
            } else {
                alert(`Signup failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during signup');
        }
    });
}

// Login form submission
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const loginId = document.getElementById('loginId').value;
        const password = document.getElementById('password').value;
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ loginId, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);
                window.location.href = 'profile.html';
            } else {
                alert(`Login failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during login');
        }
    });
}

// Load user profile
async function loadUserProfile() {
    const profileInfo = document.getElementById('profileInfo');
    if (profileInfo) {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!token || !userId) {
            window.location.href = 'login.html';
            return;
        }
        try {
            const response = await fetch(`/api/users/profile/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const user = await response.json();
            if (response.ok) {
                profileInfo.innerHTML = `
                    <img src="/uploads/${user.profilePhoto}" alt="Profile Photo">
                    <h2>${user.name}</h2>
                    <p>Roll Number: ${user.rollNumber}</p>
                    <p>Mobile Number: ${user.mobileNumber}</p>
                    <p>Email: ${user.email}</p>
                    <p>Gender: ${user.gender}</p>
                `;
            } else {
                alert(`Failed to load profile: ${user.message}`);
                window.location.href = 'login.html';
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while loading the profile');
        }
    }
}

// Load user profile on profile page
if (window.location.pathname.endsWith('profile.html')) {
    loadUserProfile();
}
