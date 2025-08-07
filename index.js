document.addEventListener('DOMContentLoaded', () => {
    const barraPesquisa = document.getElementById('textBox');
    const botaoLupa = document.querySelector('.pesquisa-container img');
    
    const modal = document.getElementById('modal');
    const respostaModal = document.getElementById('respostaModal');
    const botaoFechar = document.getElementById('fecharModal');

    async function buscarRepositorios() {
        const username = barraPesquisa.value.trim();
        
        if (!username) {
            respostaModal.innerHTML = '<p class="erro">Por favor, digite um nome de usuário</p>';
            modal.classList.remove('oculto');
            return;
        }

        respostaModal.innerHTML = '<p class="carregando">Buscando repositórios...</p>';
        modal.classList.remove('oculto');

        try {
            const userResponse = await fetch(`https://api.github.com/users/${username}`);
            
            if (!userResponse.ok) {
                throw new Error('Usuário não encontrado');
            }
            
            const userData = await userResponse.json();
            const reposResponse = await fetch(userData.repos_url);
            const reposData = await reposResponse.json();
            
            exibirResultados(userData, reposData);
            
        } catch (error) {
            respostaModal.innerHTML = `<p class="erro">Erro: ${error.message}</p>`;
        }
    }

    function exibirResultados(user, repos) {
        let html = `
            <div class="usuario-info">
                <img src="${user.avatar_url}" alt="Avatar" class="avatar" style="width: 100px; border-radius: 50%;">
                <h2>${user.name || user.login}</h2>
                <p>${user.bio || 'Sem biografia'}</p>
            </div>
            <div class="repositorios-container">
                <h3>Repositórios (${repos.length})</h3>
        `;

        if (repos.length === 0) {
            html += '<p class="sem-repos">Nenhum repositório público encontrado</p>';
        } else {
            repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
            
            repos.forEach(repo => {
                html += `
                    <div class="repo-card">
                        <h4><a href="${repo.html_url}" target="_blank">${repo.name}</a></h4>
                        <p class="repo-desc">${repo.description || 'Sem descrição'}</p>
                        <div class="repo-stats">
                            <span class="stars">⭐ ${repo.stargazers_count}</span>
                            <span class="forks">🍴 ${repo.forks_count}</span>
                            ${repo.language ? `<span class="language">${repo.language}</span>` : ''}
                        </div>
                    </div>
                `;
            });
        }

        html += '</div>';
        respostaModal.innerHTML = html;
    }

    botaoLupa.addEventListener('click', buscarRepositorios);
    barraPesquisa.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            buscarRepositorios();
        }
    });


    botaoFechar.addEventListener('click', () => {
        modal.classList.add('oculto');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('oculto');
        }
    });
});
