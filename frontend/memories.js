const form = document.getElementById('memory-form');
const memoryContainer = document.getElementById('memory-container');

// Load existing memories from backend (or fallback to localStorage)
async function loadMemories() {
    memoryContainer.innerHTML = '';
    try {
        const res = await fetch('/memories');
            if (!res.ok) throw new Error('Network response was not ok');
            const memories = await res.json();
            memories.forEach(mem => {
                const div = document.createElement('div');
                div.classList.add('memory-card');
                div.innerHTML = `
                    <img src="${mem.imageUrl}" alt="Memory">
                    <h3>${mem.name}</h3>
                    <p>${mem.caption}</p>
                    <small>${mem.details}</small>
                `;
                memoryContainer.appendChild(div);
            });
            return;
        } catch (err) {
            // fallback to localStorage
            const fallback = JSON.parse(localStorage.getItem('memories') || '[]');
            fallback.forEach(mem => {
                const div = document.createElement('div');
                div.classList.add('memory-card');
                div.innerHTML = `
                    <img src="${mem.src}" alt="Memory">
                    <h3>${mem.name || 'You'}</h3>
                    <p>${mem.caption}</p>
                    <small>${mem.details || ''}</small>
                `;
                memoryContainer.appendChild(div);
            });
        }
}

// Load memories on page load
loadMemories();

// Handle form submission for new memory (guard the form exists)
if (form) {
    form.addEventListener('submit', e => {
           e.preventDefault();
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        caption: formData.get('caption'),
        details: formData.get('details'),
        imageUrl: formData.get('imageUrl')
    };

    fetch('/add-memory', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
        // use backticks for template string
        alert(`Memory added! Total memories: ${res.count}`);
        form.reset();
        loadMemories();
    })
    .catch(err => console.log(err));
    });
}