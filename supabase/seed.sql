insert into public.thanks_cards (id, name, title, photo_url, created_at)
values
  (
    '11111111-1111-4111-8111-111111111111',
    '김하늘',
    '따뜻한 봄날과 함께할 수 있어 감사합니다.',
    '/assets/bible.jpg',
    now() - interval '5 days'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    '박도윤',
    '오늘도 함께 일할 수 있는 동료들이 있어 든든합니다.',
    '/assets/bible.jpg',
    now() - interval '4 days'
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    '이서윤',
    '작은 성취를 쌓아갈 수 있는 하루에 감사합니다.',
    '/assets/bible.jpg',
    now() - interval '3 days'
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    '최준호',
    '서로를 응원하는 분위기 덕분에 힘이 납니다.',
    '/assets/bible.jpg',
    now() - interval '2 days'
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    '정유진',
    '이번 주도 무사히 지나갈 수 있어 감사합니다.',
    '/assets/bible.jpg',
    now() - interval '1 day'
  )
on conflict (id) do nothing;
