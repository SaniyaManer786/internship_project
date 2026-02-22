// Load stats
async function loadStats() {
    const res = await fetch('/api/dashboard/stats');
    const data = await res.json();
    document.getElementById('total').textContent = `Applied: ${data.total}`;
    document.getElementById('knocked').textContent = `Knocked: ${data.knocked}`;
    document.getElementById('shortlisted').textContent = `Shortlisted: ${data.shortlisted}`;
}

// Create MCQs form
for (let i = 0; i < 5; i++) {
    document.getElementById('mcqs').innerHTML += `
    <input placeholder="Q${i + 1}" id="q${i}">
    <input placeholder="Options (A,B,C,D)" id="opts${i}">
    <input type="number" min="0" max="3" placeholder="Correct idx" id="ci${i}">
  `;
}

// Submit job
document.getElementById('jobForm').onsubmit = async (e) => {
    e.preventDefault();
    const mcqs = [];
    for (let i = 0; i < 5; i++) {
        const opts = document.getElementById(`opts${i}`).value.split(',');
        mcqs.push({
            q: document.getElementById(`q${i}`).value,
            options: opts,
            correct: parseInt(document.getElementById(`ci${i}`).value)
        });
    }
    const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            role: document.getElementById('role').value,
            jd: document.getElementById('jd').value,
            mcqs
        })
    });
    const { link } = await res.json();
    document.getElementById('link').innerHTML = `<p>Share: <a href="${link}">${link}</a></p>`;
};

// Load apps
async function loadApps() {
    const res = await fetch('/api/applications');
    const apps = await res.json();
    const tbody = document.querySelector('#appsTable tbody');
    tbody.innerHTML = apps.map(app => `
    <tr>
      <td>${app.candidateName}</td>
      <td>${app.email}</td>
      <td>${app.status}</td>
      <td><a href="${app.resumePath}" target="_blank">Download</a></td>
    </tr>
  `).join('');
}

loadStats();
loadApps();
setInterval(loadStats, 5000);  // Auto-refresh
