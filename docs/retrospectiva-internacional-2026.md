# Internacional Capoeira Kwanza 2026 — publicação da retrospectiva

## Prévia e política de publicação

Os arquivos `content/internacional-capoeira-kwanza*.md` são a fonte dos dados localizados. As imagens reais ficam em `static/img/eventos/internacional-2026/` e os vídeos locais são exibidos com controles de reprodução.

As mídias demonstrativas foram removidas e `feature_flags.demo_media` está desativado. Indicadores não confirmados continuam ocultos; somente valores confirmados são exibidos.

Os caminhos para as mídias reais estão preenchidos nos quatro front matters, sob `/img/eventos/internacional-2026/`. Quando uma mídia estiver ausente, os componentes que verificam sua existência não a exibem. Ao adicionar uma foto, atualize também seu texto alternativo e suas dimensões conforme o arquivo final.

Antes de publicar o acervo real:

1. Verifique as mídias reais e aprove a imagem de compartilhamento.
2. Marque como confirmadas somente as métricas verificadas.
3. Publique depoimentos apenas depois de aprovação e autorização da pessoa citada.
4. Execute `npm test` e `hugo --minify`.

## Onde substituir o conteúdo

- **Hero:** `evento.imagem`, `evento.imagem_alt`, `evento.imagem_largura` e `evento.imagem_altura`.
- **Vitrine da Home:** `home_destaque.imagem`, `home_destaque.alt`, `home_destaque.largura` e `home_destaque.altura`.
- **Momentos:** cada item em `momentos` tem um `id` estável, título, descrição e texto alternativo. Preencha `imagem`; use `fotos` para anexar imagens adicionais.
- **Galeria:** cada registro em `galeria` tem `id`, `categoria`, legenda, texto alternativo e dimensões. Preencha `imagem` e mantenha categorias e legendas traduzidas.
- **Vídeos:** para um MP4 local, preencha `arquivo` com o caminho em `/img/eventos/internacional-2026/`. Como alternativa, preencha `provedor` (`youtube` ou `vimeo`) e `identificador` ou uma URL HTTPS válida do provedor. `miniatura` é opcional. Vídeos locais usam controles nativos; incorporações externas são criadas depois do clique.
- **Indicadores:** `valor` só aparece quando `status: "confirmed"`. Registros sem valor ou sem confirmação ficam ocultos. Valores com `demo: true` aparecem apenas na prévia identificada.
- **Depoimentos:** `aprovado: true` é necessário para exibir um relato real. Preencha nome, vínculo, localidade opcional, texto e fotografia opcional.
- **Imagem de compartilhamento:** preencha `sharing_image` com o arquivo real.
- **Programação histórica:** mantenha a programação em `arquivo_historico.programacao`. A nota introdutória descreve os itens como planejados e não afirma que todos ocorreram.
- **Reconhecimento:** `formados_mestres` preserva nomes e artes já publicados. A seção informa que homenagem não comprova graduação.

Os textos de interface ficam nos arquivos `i18n/pt.toml`, `i18n/en.toml`, `i18n/es.toml` e `i18n/de.toml`. Títulos, legendas, textos alternativos e descrições de conteúdo ficam nas quatro traduções do front matter.

## Analytics

`event_view` registra a entrada na retrospectiva; `event_gallery_open`, `event_video_play` e `event_learn_cta_click` registram interações nessa página; `click_event_banner` registra a vitrine da Home. Os parâmetros não incluem nome, contato ou outros dados pessoais de participantes.
