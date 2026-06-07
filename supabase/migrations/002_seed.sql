-- Seed: webinários iniciais IDM

INSERT INTO webinars (
  title, slug, description,
  presenter_name, presenter_bio,
  video_url, video_duration_seconds,
  session_interval_minutes,
  offer_appears_at_seconds,
  offer_title, offer_cta_text,
  payment_config,
  wpp_group_url,
  min_fake_viewers, max_fake_viewers,
  active
) VALUES
(
  'Conheça a Integratividade Aplicada à Psicanálise',
  'psicanalise',
  'Descubra como a Psicanálise Integrativa pode transformar sua vida e sua prática. Uma aula gratuita e exclusiva com conteúdo que vai além do convencional.',
  'Instituto Despertamente',
  'O IDM é referência em formações de Psicanálise, Numerologia e desenvolvimento humano no Brasil.',
  '',  -- preencher com URL do vídeo Bunny.net
  5400, -- 90 minutos
  30,
  4200, -- CTA aparece aos 70 min
  'Garanta sua Vaga na Formação Completa',
  'QUERO ME INSCREVER AGORA',
  '[
    {"type":"vega","label":"Garantir vaga — Pagamento seguro","url":""},
    {"type":"mercado_pago","label":"Pagar com Mercado Pago","url":""},
    {"type":"wpp","label":"Falar com consultor no WhatsApp","url":"https://wa.me/5511000000000"}
  ]',
  'https://chat.whatsapp.com/',
  60, 220,
  true
),
(
  'Assinatura do Poder — Numerologia Revelada',
  'numerologia',
  'Descubra o que os números do seu nome e nascimento revelam sobre sua missão, seus bloqueios e seu potencial. Aula ao vivo gratuita.',
  'Instituto Despertamente',
  'O IDM é referência em formações de Psicanálise, Numerologia e desenvolvimento humano no Brasil.',
  '',  -- preencher com URL do vídeo Bunny.net
  5400,
  30,
  4200,
  'Garanta sua Vaga na Formação Completa de Numerologia',
  'QUERO REVELAR MEU MAPA AGORA',
  '[
    {"type":"vega","label":"Garantir vaga — Pagamento seguro","url":""},
    {"type":"mercado_pago","label":"Pagar com Mercado Pago","url":""},
    {"type":"wpp","label":"Falar com consultor no WhatsApp","url":"https://wa.me/5511000000000"}
  ]',
  'https://chat.whatsapp.com/',
  60, 220,
  true
);

-- Seed: comentários roteirizados para Psicanálise
INSERT INTO scripted_comments (webinar_id, author_name, author_initials, message, appears_at_seconds)
SELECT w.id, c.author_name, c.author_initials, c.message, c.appears_at_seconds
FROM webinars w, (VALUES
  ('Mariana S.', 'MS', 'Que aula incrível! Nunca tinha visto isso explicado assim 😍', 180),
  ('Lucas O.', 'LO', 'Isso explica TUDO que eu sempre senti mas não sabia nomear', 360),
  ('Fernanda R.', 'FR', 'Assistindo pelo celular e já travei 3 vezes tentando anotar tudo', 600),
  ('Thiago M.', 'TM', 'Você consegue indicar leitura complementar para isso?', 900),
  ('Ana P.', 'AP', 'Minha terapeuta nunca me explicou assim... quero aprender mais', 1200),
  ('Rafael B.', 'RB', 'Que clareza! Estou adorando cada minuto', 1500),
  ('Camila N.', 'CN', 'Já passei o link pra minha irmã. Ela precisa ouvir isso', 1800),
  ('Bruno L.', 'BL', 'A parte do inconsciente foi DEMAIS. Pode aprofundar?', 2100),
  ('Juliana W.', 'JW', '❤️ Obrigada por trazer esse conteúdo gratuito', 2400),
  ('Pedro H.', 'PH', 'Já sei que preciso da formação completa depois dessa aula', 3600),
  ('Simone A.', 'SA', 'Esse webinário deveria ser obrigatório pra todo mundo', 3900),
  ('Diego C.', 'DC', 'Onde consigo me inscrever na formação?', 4100),
  ('Vanessa T.', 'VT', 'Aproveitando muito! Que presente essa aula 🙏', 4500)
) AS c(author_name, author_initials, message, appears_at_seconds)
WHERE w.slug = 'psicanalise';

-- Seed: comentários roteirizados para Numerologia
INSERT INTO scripted_comments (webinar_id, author_name, author_initials, message, appears_at_seconds)
SELECT w.id, c.author_name, c.author_initials, c.message, c.appears_at_seconds
FROM webinars w, (VALUES
  ('Beatriz F.', 'BF', 'Calculei meu caminho de vida AGORA enquanto assisto 😱', 120),
  ('Carlos M.', 'CM', 'Meu número 8 explica tudo sobre minha carreira!', 300),
  ('Letícia D.', 'LD', 'Nunca achei que numerologia tivesse base em algo tão sólido', 600),
  ('Marcus V.', 'MV', 'Minha esposa e eu temos mapas complementares — como não vi isso antes?', 900),
  ('Patrícia R.', 'PR', 'Isso é muito profundo. Muito obrigada por trazer esse conteúdo', 1200),
  ('Eduardo S.', 'ES', 'Precisando de mais! Que formação vocês oferecem?', 1800),
  ('Gabriele A.', 'GA', '11 de caminho de vida aqui! Bateu no coração essa explicação', 2100),
  ('Rodrigo M.', 'RM', 'Indiquei pra todo o meu grupo de estudos', 2400),
  ('Tatiane B.', 'TB', 'Sinto que esse mapa me conhece melhor do que eu mesma 😭', 3000),
  ('Felipe N.', 'FN', 'Como se inscreve na formação completa depois da aula?', 4000),
  ('Isabela C.', 'IC', 'Melhor aula sobre numerologia que já assisti, sem comparação', 4300),
  ('Wellington S.', 'WS', 'Tô anotando tudo! A formação completa deve ser transformadora', 4600)
) AS c(author_name, author_initials, message, appears_at_seconds)
FROM webinars w
WHERE w.slug = 'numerologia';
