# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 가입하고 로그인합니다.
2. "New Project"를 클릭하여 새 프로젝트를 생성합니다.
3. 프로젝트 이름, 데이터베이스 비밀번호, 리전을 설정합니다.
4. 프로젝트가 생성될 때까지 기다립니다 (약 2분 소요).

## 2. 환경 변수 설정

1. Supabase 대시보드에서 프로젝트 설정 > API로 이동합니다.
2. 다음 정보를 복사합니다:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. 프로젝트 루트에 `.env.local` 파일을 생성합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 3. 데이터베이스 테이블 생성

### 방법 1: SQL Editor 사용

1. Supabase 대시보드에서 SQL Editor로 이동합니다.
2. 다음 SQL을 실행합니다:

```sql
-- todos 테이블 생성
create table todos (
  id bigserial primary key,
  title text not null,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security 활성화
alter table todos enable row level security;

-- 정책 생성
create policy "Todos are viewable by everyone" on todos
  for select using (true);

create policy "Anyone can insert todos" on todos
  for insert with check (true);

create policy "Anyone can update todos" on todos
  for update using (true);

create policy "Anyone can delete todos" on todos
  for delete using (true);
```

### 방법 2: Table Editor 사용

1. Supabase 대시보드에서 Table Editor로 이동합니다.
2. "New Table"을 클릭합니다.
3. 테이블 이름을 `todos`로 설정합니다.
4. 다음 컬럼을 추가합니다:
   - `id`: bigint, Primary Key, Auto-increment
   - `title`: text, Not Null
   - `completed`: boolean, Default: false
   - `created_at`: timestamptz, Default: now()

## 4. 인증 설정 (선택사항)

기본적으로 Supabase는 이메일/비밀번호 인증이 활성화되어 있습니다.

추가 인증 방법을 설정하려면:
1. Authentication > Providers로 이동합니다.
2. 원하는 인증 방법을 활성화합니다 (Google, GitHub 등).

## 5. 테스트

1. 개발 서버를 실행합니다:
```bash
npm run dev
```

2. 브라우저에서 `http://localhost:3000`을 엽니다.
3. 홈 페이지에서 인증 및 데이터베이스 예제를 테스트합니다.

## 문제 해결

### "Missing Supabase environment variables" 오류

- `.env.local` 파일이 프로젝트 루트에 있는지 확인하세요.
- 환경 변수 이름이 정확한지 확인하세요 (`NEXT_PUBLIC_` 접두사 필수).
- 개발 서버를 재시작하세요.

### "relation 'todos' does not exist" 오류

- Supabase에서 `todos` 테이블이 생성되었는지 확인하세요.
- 테이블 이름이 정확한지 확인하세요 (대소문자 구분).

### 인증이 작동하지 않는 경우

- Supabase 대시보드에서 Authentication > Settings를 확인하세요.
- Site URL이 올바르게 설정되어 있는지 확인하세요.
- 이메일 인증이 활성화되어 있는지 확인하세요.
