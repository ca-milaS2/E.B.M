
fetch('/api/parsely-data')
    .then(res => res.json())
    .then(data => {
        console.log('Dados da API:', data);
        // Exibir no seu site
    })
    .catch(err => console.error('Erro:', err));
