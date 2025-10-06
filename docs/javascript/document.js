const toggleBtn = document.getElementById('toggle-references-btn');
        const referencesBox = document.getElementById('references-container');

        toggleBtn.addEventListener('click', () => {
            referencesBox.classList.toggle('hidden');

            // Altera o texto do botão
            if (referencesBox.classList.contains('hidden')) {
                toggleBtn.textContent = 'Show References';
            } else {
                toggleBtn.textContent = 'Hide References';
            }
        });