# Instrumentação do site no GA4

O site envia os eventos definidos neste documento quando `ga_measurement_id` está configurado e o Hugo gera uma build que não seja o servidor local. O Google Analytics continua responsável pela coleta e pelos relatórios.

## Eventos

| Evento | O que mede | Parâmetros úteis |
| --- | --- | --- |
| `click_contact_cta` | CTA de contato na home | `cta_label`, `page_section` |
| `click_whatsapp` | Contato por WhatsApp, incluindo CTAs flutuantes | `cta_label`, `page_section`, `event_name` |
| `click_event_banner` | Banner do evento na home | `cta_label`, `event_name` |
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
| `carousel_interaction` | Uso manual de controles de carrossel | `carousel_name`, `carousel_action` |
| `schedule_image_open` | Abertura de imagem da programação do evento | `activity_name`, `page_section` |
| `schedule_image_close` | Fechamento da imagem da programação do evento | `event_name`, `page_section` |
| `event_view` | Entrada na página do evento internacional | `event_name` |

`page_path` e `page_title` acompanham os eventos. Para links externos, `link_url` contém somente a origem; para links internos, contém o caminho sem query ou fragmento. Links de telefone e e-mail não enviam o endereço de destino.

O texto digitado na busca de cantigas não é enviado. Buscas são registradas após 600 ms sem digitação, junto com a quantidade de resultados.

Os vídeos incorporados do YouTube recebem `enablejsapi=1` para permitir que a medição otimizada de vídeo do GA4 registre `video_start`, `video_progress` e `video_complete`, se esse recurso estiver habilitado na propriedade.

## Relatórios

No GA4, use **Relatórios → Engajamento → Eventos** para ver a contagem por nome de evento. Para separar os resultados pelos parâmetros, crie dimensões personalizadas com escopo **Evento** para os parâmetros que deseja usar — por exemplo, `cta_label`, `page_section`, `component_name`, `component_item`, `component_action`, `location_country`, `navigation_area` e `target_language` — e depois use uma exploração livre.

