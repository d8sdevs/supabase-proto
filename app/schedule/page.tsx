'use client'

import { useState, useMemo } from 'react'

export default function SchedulePage() {
  const today = useMemo(() => new Date(), [])
  const todayYear = today.getFullYear()
  const todayMonth = today.getMonth()
  const todayDate = today.getDate()

  // 현재 표시할 년도와 월 (상태로 관리)
  const [displayYear, setDisplayYear] = useState(todayYear)
  const [displayMonth, setDisplayMonth] = useState(todayMonth)

  // 이전 월로 이동
  const goToPreviousMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11)
      setDisplayYear(displayYear - 1)
    } else {
      setDisplayMonth(displayMonth - 1)
    }
  }

  // 다음 월로 이동
  const goToNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0)
      setDisplayYear(displayYear + 1)
    } else {
      setDisplayMonth(displayMonth + 1)
    }
  }

  // 해당 월의 첫 번째 날과 마지막 날
  const firstDay = new Date(displayYear, displayMonth, 1)
  const lastDay = new Date(displayYear, displayMonth + 1, 0)
  
  // 첫 번째 날의 요일 (0: 일요일, 6: 토요일)
  const startDayOfWeek = firstDay.getDay()
  const totalDays = lastDay.getDate()

  // 달력 날짜 배열 생성
  const calendarDays = useMemo(() => {
    const days = []
    
    // 이전 달의 마지막 날들 (빈 칸 채우기)
    const prevMonthLastDay = new Date(displayYear, displayMonth, 0).getDate()
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        isToday: false,
      })
    }
    
    // 현재 달의 날들
    for (let i = 1; i <= totalDays; i++) {
      const isToday = displayYear === todayYear && 
                     displayMonth === todayMonth && 
                     i === todayDate
      days.push({
        date: i,
        isCurrentMonth: true,
        isToday: isToday,
      })
    }
    
    // 다음 달의 첫 날들 (빈 칸 채우기)
    const remainingDays = 42 - days.length // 6주 * 7일 = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        isToday: false,
      })
    }
    
    return days
  }, [displayYear, displayMonth, totalDays, startDayOfWeek, todayYear, todayMonth, todayDate])

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ]
  
  const dayNames = ['일', '월', '화', '수', '목', '금', '토']

  return (
    <div style={{
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
      paddingBottom: '100px' // 하단 네비게이션 공간
    }}>
      <h1 style={{
        fontSize: '28px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#333'
      }}>
        일정
      </h1>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {/* 년도와 월 표시 + 좌우 버튼 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          {/* 이전 월 버튼 */}
          <button
            onClick={goToPreviousMonth}
            style={{
              background: 'none',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '18px',
              cursor: 'pointer',
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              minWidth: '40px',
              height: '40px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0'
              e.currentTarget.style.borderColor = '#007AFF'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.borderColor = '#e0e0e0'
            }}
            aria-label="이전 월"
          >
            ‹
          </button>

          {/* 년도와 월 */}
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#333',
            margin: 0
          }}>
            {displayYear}년 {monthNames[displayMonth]}
          </h2>

          {/* 다음 월 버튼 */}
          <button
            onClick={goToNextMonth}
            style={{
              background: 'none',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '18px',
              cursor: 'pointer',
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              minWidth: '40px',
              height: '40px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0'
              e.currentTarget.style.borderColor = '#007AFF'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.borderColor = '#e0e0e0'
            }}
            aria-label="다음 월"
          >
            ›
          </button>
        </div>

        {/* 요일 헤더 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
          marginBottom: '8px'
        }}>
          {dayNames.map((day, index) => (
            <div
              key={day}
              style={{
                textAlign: 'center',
                padding: '8px 4px',
                fontSize: '14px',
                fontWeight: '600',
                color: index === 0 ? '#ff4444' : index === 6 ? '#4444ff' : '#666'
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 달력 날짜 그리드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px'
        }}>
          {calendarDays.map((day, index) => (
            <div
              key={index}
              style={{
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                borderRadius: '8px',
                backgroundColor: day.isToday 
                  ? '#007AFF' 
                  : day.isCurrentMonth 
                    ? 'transparent' 
                    : '#f5f5f5',
                color: day.isToday
                  ? 'white'
                  : day.isCurrentMonth
                    ? '#333'
                    : '#999',
                fontWeight: day.isToday ? '600' : '400',
                cursor: day.isCurrentMonth ? 'pointer' : 'default',
                transition: 'all 0.2s',
                ...(day.isCurrentMonth && !day.isToday && {
                  ':hover': {
                    backgroundColor: '#f0f0f0'
                  }
                })
              }}
              onMouseEnter={(e) => {
                if (day.isCurrentMonth && !day.isToday) {
                  e.currentTarget.style.backgroundColor = '#f0f0f0'
                }
              }}
              onMouseLeave={(e) => {
                if (day.isCurrentMonth && !day.isToday) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              {day.date}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
