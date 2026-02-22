const urlParams = new URLSearchParams(window.location.search);
const linkId = urlParams.get('job');
let currentQ = 0;
let scores = 0;

async function loadJob() {
    const res = await fetch(`/api/jobs/${linkId}`);
    const job = await res.json();
    document.getElementById('title').textContent = `Apply: ${job.role}`;
    document.getElementById('jd').innerHTML = `<p>${job.jd}</p>`;
    showQuestion(job.mcqs);
}

function showQuestion(mcqs) {
    if (currentQ >= 5) {
        document.getElementById('quiz').style.display = 'none';
        document.getElementById('resumeForm').style.display = 'block';
        return;
    }
    const mcq = mcqs[currentQ];
    document.getElementById('quiz').innerHTML = `
    <h3>Q${currentQ + 1}/5: ${mcq.q}</h3>
    ${mcq.options.map((opt, idx) =>
        `<button onclick="answer(${idx}, ${mcq.correct}, '${linkId}')">${opt}</button>`
    ).join('')}
  `;
}

async function answer(selected, correct, linkId) {
    scores++;
    if (selected !== correct) {
        await fetch(`/api/apply/${linkId}/knockout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ score: scores - 1, isCorrect: false })
        });
        alert('Knocked out! Wrong answer.');
        return;
    }
    await fetch(`/api/apply/${linkId}/knockout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: scores, isCorrect: true })
    });
    currentQ++;
    loadJob();  // Next Q
}

document.getElementById('resumeForm').onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('mcqScores', scores);
    formData.append('resume', document.getElementById('resume').files[0]);

    await fetch(`/api/apply/${linkId}/submit`, { method: 'POST', body: formData });
    alert('Submitted!');
};

loadJob();
