# YAM App

Next.js와 React를 활용한 모바일 앱 스타일의 웹 애플리케이션입니다.

## 기능

- 하단 네비게이션 바 (4개 메뉴)
  - 홈
  - 검색
  - 알림
  - 프로필
- Supabase 연동
  - 인증 (회원가입, 로그인, 로그아웃)
  - 데이터베이스 쿼리
  - 실시간 구독

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. Supabase 설정

1. [Supabase](https://supabase.com)에서 프로젝트를 생성합니다.
2. 프로젝트 설정 > API에서 다음 정보를 확인합니다:
   - Project URL
   - anon/public key
3. `.env.local` 파일을 생성하고 다음 내용을 추가합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 데이터베이스 테이블 생성 (선택사항)

데이터베이스 예제를 사용하려면 Supabase SQL Editor에서 다음 쿼리를 실행하세요:

```sql
-- todos 테이블 생성
create table todos (
  id bigserial primary key,
  title text not null,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security 활성화 (선택사항)
alter table todos enable row level security;

-- 모든 사용자가 todos를 볼 수 있도록 정책 생성
create policy "Todos are viewable by everyone" on todos
  for select using (true);

-- 인증된 사용자만 todos를 생성할 수 있도록 정책 생성
create policy "Authenticated users can create todos" on todos
  for insert with check (auth.role() = 'authenticated');

-- 사용자는 자신이 생성한 todos만 수정/삭제할 수 있도록 정책 생성
create policy "Users can update their own todos" on todos
  for update using (auth.uid()::text = user_id::text);

create policy "Users can delete their own todos" on todos
  for delete using (auth.uid()::text = user_id::text);
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
fe-yam/
├── app/
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 홈 페이지 (Supabase 예제 포함)
│   ├── globals.css         # 전역 스타일
│   ├── search/             # 검색 페이지
│   ├── notifications/      # 알림 페이지
│   └── profile/            # 프로필 페이지
├── components/
│   ├── BottomNavigation.tsx # 하단 네비게이션 바
│   ├── AuthExample.tsx      # 인증 예제 컴포넌트
│   └── DataExample.tsx      # 데이터베이스 예제 컴포넌트
├── lib/
│   └── supabase/
│       ├── client.ts        # 클라이언트 사이드 Supabase 클라이언트
│       ├── server.ts        # 서버 사이드 Supabase 클라이언트
│       ├── middleware.ts    # 미들웨어 헬퍼
│       └── examples.ts      # Supabase 사용 예제 코드 모음
├── middleware.ts            # Next.js 미들웨어
└── package.json
```

## Supabase 사용 예제

### 클라이언트 사이드에서 사용

```typescript
import { supabase } from '@/lib/supabase/client'

// 인증
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
})

// 데이터 조회
const { data, error } = await supabase
  .from('todos')
  .select('*')

// 데이터 삽입
const { data, error } = await supabase
  .from('todos')
  .insert([{ title: '할 일', completed: false }])
```

### 서버 사이드에서 사용

```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
const { data, error } = await supabase
  .from('todos')
  .select('*')
```

더 많은 예제는 `lib/supabase/examples.ts` 파일을 참고하세요.

## 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase + Next.js 가이드](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
