/**
 * Supabase 사용 예제 코드 모음
 * 
 * 이 파일은 참고용 예제 코드입니다.
 * 실제 사용 시에는 각 컴포넌트나 페이지에서 필요한 부분만 사용하세요.
 */

import { supabase } from './client'
import { createClient } from './server'

// ============================================
// 클라이언트 사이드 예제
// ============================================

/**
 * 1. 인증 예제
 */

// 회원가입
export async function signUpExample(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

// 로그인
export async function signInExample(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

// 로그아웃
export async function signOutExample() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// 현재 사용자 가져오기
export async function getCurrentUserExample() {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// 세션 가져오기
export async function getSessionExample() {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

/**
 * 2. 데이터베이스 쿼리 예제
 */

// 모든 데이터 가져오기
export async function selectAllExample(tableName: string) {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
  return { data, error }
}

// 조건부 조회
export async function selectWithConditionExample(
  tableName: string,
  column: string,
  value: any
) {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq(column, value)
  return { data, error }
}

// 데이터 삽입
export async function insertExample(tableName: string, record: any) {
  const { data, error } = await supabase
    .from(tableName)
    .insert([record])
    .select()
  return { data, error }
}

// 데이터 업데이트
export async function updateExample(
  tableName: string,
  id: number,
  updates: any
) {
  const { data, error } = await supabase
    .from(tableName)
    .update(updates)
    .eq('id', id)
    .select()
  return { data, error }
}

// 데이터 삭제
export async function deleteExample(tableName: string, id: number) {
  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', id)
  return { error }
}

// 정렬 및 제한
export async function selectWithOrderAndLimitExample(
  tableName: string,
  orderBy: string,
  limit: number = 10
) {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .order(orderBy, { ascending: false })
    .limit(limit)
  return { data, error }
}

// 실시간 구독 (Realtime)
export function subscribeToTableExample(
  tableName: string,
  callback: (payload: any) => void
) {
  const channel = supabase
    .channel(`${tableName}_changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: tableName,
      },
      callback
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

/**
 * 3. 스토리지 예제
 */

// 파일 업로드
export async function uploadFileExample(
  bucket: string,
  path: string,
  file: File
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file)
  return { data, error }
}

// 파일 다운로드
export async function downloadFileExample(bucket: string, path: string) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .download(path)
  return { data, error }
}

// 파일 URL 가져오기
export function getPublicUrlExample(bucket: string, path: string) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  return data.publicUrl
}

// ============================================
// 서버 사이드 예제
// ============================================

/**
 * 서버 컴포넌트에서 사용자 정보 가져오기
 */
export async function getServerUserExample() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

/**
 * 서버 컴포넌트에서 데이터 조회
 */
export async function getServerDataExample(tableName: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
  return { data, error }
}
