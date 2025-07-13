const urlInput = document.getElementById('url');
const btn = document.getElementById('go');
const grid = document.getElementById('resultGrid');

btn.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  if (!url) return alert('Enter a URL');

  btn.disabled = true; btn.textContent = 'Working…';
  grid.innerHTML = '';

  try {
    const res = await fetch('/api/summarise', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ url })
    });
    const { summary, urdu, error } = await res.json();
    if (error) throw Error(error);

    grid.innerHTML = `
      <div class="card"><h3>English</h3><p>${summary}</p></div>
      <div class="card"><h3>اردو</h3><p dir="rtl">${urdu}</p></div>`;
  } catch (err) {
    alert(err.message);
  } finally {
    btn.disabled = false; btn.textContent = 'Summarise';
  }
});
