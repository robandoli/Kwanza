# Instrumentação do site no GA4

O site envia os eventos definidos neste documento quando `ga_measurement_id` está configurado e o Hugo gera uma build que não seja o servidor local. O Google Analytics continua responsável pela coleta e pelos relatórios.

## Eventos

| Evento | O que mede | Parâmetros úteis |
| --- | --- | --- |
| `click_contact_cta` | CTA de contato na home | `cta_label`, `page_section` |
| `click_whatsapp` | Contato por WhatsApp, incluindo CTAs flutuantes | `cta_label`, `page_section`, `event_name` |
| `click_event_banner` | Vitrine Kwanza em Movimento na home | `cta_label`, `event_name` |
| `click_map` | Abertura de mapa | `location_name`, `location_city`, `page_section` |
| `file_download_curriculo` | Clique em arquivo de currículo | `file_name`, `page_section` |
| `external_social_click` | Acesso a rede social | `social_network`, `page_section` |
| `external_event_click` | Acesso ao site externo de um evento | `event_name`, `page_section` |
| `navigation_click` | Links da navegação do cabeçalho e rodapé | `navigation_area`, `navigation_label` |
| `navigation_toggle` | Abertura/fechamento do menu mobile | `navigation_area`, `navigation_action` |
| `language_switch` | Troca de idioma | `target_language` |
| `content_link_click` | Links dentro do conteúdo das páginas | `component_name`, `link_label`, `link_type` |
| `content_component_toggle` | Abertura/fechamento de FAQ, letras e grupos de locais | `component_name`, `component_action`, identificador do item |
| `content_search` | Busca no catálogo de cantigas | `component_name`, `search_action`, `search_result_count` |
| `content_media_start` | Início de reprodução de áudio | `component_name`, `content_name`, `media_type` |
| `content_media_complete` | Áudio reproduzido até o fim | `component_name`, `content_name`, `media_type` |
| `carousel_interaction` | Uso de controles ou deslize no carrossel | `carousel_name`, `carousel_action` |
| `schedule_image_open` | Abertura de imagem da programação do evento | `activity_name`, `page_section` |
| `schedule_image_close` | Fechamento da imagem da programação do evento | `event_name`, `page_section` |
| `event_view` | Entrada na página do evento internacional | `event_name` |
| `event_gallery_open` | Abertura de imagem na galeria da retrospectiva | `event_name`, `gallery_item` |
| `event_video_play` | Reprodução de vídeo local ou carregamento de vídeo externo validado | `event_name`, `video_category` |
| `event_learn_cta_click` | CTA para aulas ou apresentação institucional na retrospectiva | `event_name`, `cta_label` |

`page_path` e `page_title` acompanham os eventos. Para links externos, `link_url` contém somente a origem; para links internos, contém o caminho sem query ou fragmento. Links de telefone e e-mail não enviam o endereço de destino.

O texto digitado na busca de cantigas não é enviado. Buscas são registradas após 600 ms sem digitação, junto com a quantidade de resultados.

Os vídeos externos da retrospectiva são incorporados após um clique e a validação do provedor e do identificador ou URL HTTPS. Nos vídeos locais, `event_video_play` é enviado ao iniciar ou retomar a reprodução; nos externos, ao carregar o vídeo. O evento não registra dados pessoais.

## Mapa da retrospectiva Internacional Capoeira Kwanza 2026

O mapa abaixo descreve a instrumentação no código. A coleta real depende da publicação, da configuração e disponibilidade do GA4; não foi verificada na propriedade. Filtre o caminho `/internacional-capoeira-kwanza/` para analisar a página em português.

| Interação | Evento | Parâmetros específicos e valores |
| --- | --- | --- |
| Entrada na retrospectiva | `event_view` | `event_name=internacional_capoeira_kwanza` |
| Abrir uma foto da galeria | `event_gallery_open` | `event_name`, `gallery_item=registro-01` a `registro-12` |
| Iniciar ou retomar um vídeo local | `event_video_play` | `event_name`, `video_category=vivencias`, `roda` ou `cerimonias` |
| Navegar pelos homenageados | `carousel_interaction` | `carousel_name=formados_mestres`, `carousel_action=previous`, `next`, `dot`, `swipe_previous` ou `swipe_next`; os pontos também enviam `carousel_page` |
| Clicar em um dos botões da retrospectiva | `event_learn_cta_click` | `event_name`, `cta_label=conheca_nossas_aulas` ou `conheca_grupo_kwanza` |
| Abrir ou fechar a programação histórica | `content_component_toggle` | `component_name=event_schedule_archive`, `component_item=internacional_capoeira_kwanza_2026`, `component_action=open` ou `close` |
| Abrir um cartaz da programação | `schedule_image_open` | `event_name`, `activity_name`, `page_section=arquivo_historico` |
| Fechar a imagem de um cartaz | `schedule_image_close` | `event_name`, `component_name=event_activity_lightbox`, `page_section=arquivo_historico` |
| Clicar no mapa da programação | `click_map` | `event_name`, `location_name`, `page_section=arquivo_historico` |
| Acessar o canal do YouTube a partir dos vídeos | `external_social_click` | `social_network=youtube`, `page_section=event_videos` |

O identificador `event_name=internacional_capoeira_kwanza` acima é um parâmetro enviado pelo site para identificar o encontro; o nome do evento do GA4 é o da coluna Evento. Como `event_name` também identifica o próprio evento nos relatórios do GA4, confirme no DebugView como esse parâmetro é tratado antes de usá-lo para filtrar. Para analisar esta página, o caminho é um filtro alternativo.

`event_gallery_open` conta cliques nas miniaturas: avançar entre fotos dentro da imagem ampliada não dispara outro evento. Os vídeos locais não têm evento específico de conclusão ou percentual assistido. Os cliques em navegação, seletor de idioma, redes sociais e WhatsApp também usam os eventos globais da tabela anterior. `click_event_banner` é registrado na home, ao clicar para chegar à retrospectiva.

Para explorar os dados por ação, foto, vídeo ou botão, avalie dimensões personalizadas de escopo Evento para `carousel_name`, `carousel_action`, `gallery_item`, `video_category`, `cta_label`, `component_name` e `component_action`, conforme a necessidade e as dimensões já existentes na propriedade. Confira os nomes e valores recebidos no Tempo real ou DebugView antes de criar definições; elas não são criadas pelo código do site.

## Relatórios

No GA4, use **Relatórios → Engajamento → Eventos** para ver a contagem por nome de evento. Para separar os resultados pelos parâmetros, crie dimensões personalizadas com escopo **Evento** para os parâmetros que deseja usar — por exemplo, `cta_label`, `page_section`, `component_name`, `component_item`, `component_action`, `location_country`, `navigation_area` e `target_language` — e depois use uma exploração livre.

