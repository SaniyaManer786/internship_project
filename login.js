document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const result = await res.json();

            if (res.ok) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
                if (result.user.role === 'recruiter') {
                    window.location.href = 'dashboard.html';
                } else {
                    window.location.href = 'apply.html';
                }
            } else {
                alert(result.error);
            }
        } catch (error) {
            alert('Login failed');
        }
    });
});
