document.addEventListener('DOMContentLoaded', () => {
  const inputBusca = document.getElementById('busca-musica');
  const listaMusicas = document.getElementById('lista-musicas');
  const limparBusca = document.getElementById('limpar-busca-musica');
  
  if (!inputBusca || !listaMusicas) return;

  const musicas = listaMusicas.querySelectorAll('.musica-bloco');
  
  inputBusca.addEventListener('input', (e) => {
    const termoBusca = e.target.value.toLowerCase().trim();
    
    musicas.forEach((musica) => {
      if (!termoBusca) {
        musica.style.display = '';
        return;
      }

      const titulo = musica.querySelector('.musica-header h3')?.textContent.toLowerCase() || '';
      const autor = musica.querySelector('.musica-autor')?.textContent.toLowerCase() || '';
      const letra = musica.querySelector('.musica-letra-conteudo')?.textContent.toLowerCase() || '';
      
      const encontrou =
        titulo.includes(termoBusca) ||
        autor.includes(termoBusca) ||
        letra.includes(termoBusca);
      
      musica.style.display = encontrou ? '' : 'none';
    });

    // Mensagem quando não há resultados
    atualizarMensagemVazia(termoBusca);
    if (limparBusca) limparBusca.hidden = !termoBusca;
  });

  if (limparBusca) {
    limparBusca.addEventListener('click', () => {
      inputBusca.value = '';
      inputBusca.dispatchEvent(new Event('input', { bubbles: true }));
      inputBusca.focus();
    });
  }

  function atualizarMensagemVazia(termo) {
    let mensagem = document.getElementById('mensagem-busca-vazia');
    const musicasVisiveis = Array.from(musicas).filter(m => m.style.display !== 'none');
    
    if (termo && musicasVisiveis.length === 0) {
      if (!mensagem) {
        mensagem = document.createElement('p');
        mensagem.id = 'mensagem-busca-vazia';
        mensagem.className = 'mensagem-busca-vazia';
        mensagem.textContent =
          inputBusca.dataset.emptyMessage || 'Nenhuma música encontrada com este termo.';
        listaMusicas.appendChild(mensagem);
      }
      mensagem.style.display = 'block';
    } else if (mensagem) {
      mensagem.style.display = 'none';
    }
  }
});
