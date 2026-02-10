'use client'

import { useState, useMemo, type TouchEvent } from 'react'

export default function SchedulePage() {
  const today = useMemo(() => new Date(), [])
  const todayYear = today.getFullYear()
  const todayMonth = today.getMonth()
  const todayDate = today.getDate()

  type Day = {
    date: number
    isCurrentMonth: boolean
    isToday: boolean
  }

  // 달력 뷰 모드: 월 / 주
  const viewModes = ['month', 'week'] as const
  type ViewMode = (typeof viewModes)[number]
  const [viewModeIndex, setViewModeIndex] = useState(0)
  const viewMode: ViewMode = viewModes[viewModeIndex]

  // 날짜 상세 보기용 선택된 날짜
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const isDetailView = selectedDate !== null

  // 주 단위 뷰에서 몇 번째 주를 보고 있는지 (0 = 첫째 주)
  const [weekIndex, setWeekIndex] = useState(0)

  // 스와이프 제스처용 터치 위치
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  // 현재 표시할 년도와 월 (상태로 관리)
  const [displayYear, setDisplayYear] = useState(todayYear)
  const [displayMonth, setDisplayMonth] = useState(todayMonth)

  const toggleViewMode = () => {
    setViewModeIndex((prev) => (prev + 1) % viewModes.length)
    setWeekIndex(0)
  }

  // 이전 월로 이동
  const goToPreviousMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11)
      setDisplayYear(displayYear - 1)
    } else {
      setDisplayMonth(displayMonth - 1)
    }
    setWeekIndex(0)
  }

  // 다음 월로 이동
  const goToNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0)
      setDisplayYear(displayYear + 1)
    } else {
      setDisplayMonth(displayMonth + 1)
    }
    setWeekIndex(0)
  }

  // 해당 월의 첫 번째 날과 마지막 날
  const firstDay = new Date(displayYear, displayMonth, 1)
  const lastDay = new Date(displayYear, displayMonth + 1, 0)
  
  // 첫 번째 날의 요일 (0: 일요일, 6: 토요일)
  const startDayOfWeek = firstDay.getDay()
  const totalDays = lastDay.getDate()

  // 달력 날짜 배열 생성
  const calendarDays = useMemo<Day[]>(() => {
    const days: Day[] = []
    
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

  // 주 단위 뷰를 위한 주 배열
  const weeks = useMemo<Day[][]>(() => {
    const result: Day[][] = []
    for (let i = 0; i < calendarDays.length; i += 7) {
      result.push(calendarDays.slice(i, i + 7))
    }
    return result
  }, [calendarDays])

  const headerYear = isDetailView && selectedDate ? selectedDate.getFullYear() : displayYear
  const headerMonthIndex = isDetailView && selectedDate ? selectedDate.getMonth() : displayMonth

  const viewModeLabel = (() => {
    switch (viewMode) {
      case 'month':
        return '월'
      case 'week':
        return '주'
      default:
        return '월'
    }
  })()

  const handleDayClick = (day: Day) => {
    if (!day.isCurrentMonth) return
    const clickedDate = new Date(displayYear, displayMonth, day.date)
    setSelectedDate(clickedDate)
  }

  const handleBackToCalendar = () => {
    setSelectedDate(null)
  }

  // 주 단위 스와이프 핸들러
  const handleWeekTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX)
  }

  const handleWeekTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return
    const endX = e.changedTouches[0].clientX
    const deltaX = endX - touchStartX
    const threshold = 40 // 스와이프 최소 거리

    // 왼쪽으로 스와이프(손가락이 왼쪽으로 이동, deltaX < 0): 이전 주
    if (deltaX < -threshold && weekIndex > 0) {
      setWeekIndex((prev) => Math.max(prev - 1, 0))
    }
    // 오른쪽으로 스와이프(손가락이 오른쪽으로 이동, deltaX > 0): 다음 주
    else if (deltaX > threshold && weekIndex < weeks.length - 1) {
      setWeekIndex((prev) => Math.min(prev + 1, weeks.length - 1))
    }

    setTouchStartX(null)
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      minHeight: 0,
      paddingBottom: '80px',
      padding: '16px 20px 12px',
    }}>
      
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        borderRadius: '12px',
        margin: '0 16px 0',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        minHeight: 0
      }}>
        {/* 상단: 뷰 모드 토글/뒤로가기 + 년월/이전다음 버튼 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          flexShrink: 0
        }}>
          {/* 좌측: 달력 뷰 모드 토글 / 상세에서 뒤로가기 버튼 */}
          {!isDetailView ? (
            <button
              onClick={toggleViewMode}
              style={{
                backgroundColor: '#f5f5f5',
                border: '1px solid #e0e0e0',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '14px',
                cursor: 'pointer',
                color: '#333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                minWidth: '60px',
                height: '32px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e8f0ff'
                e.currentTarget.style.borderColor = '#007AFF'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5'
                e.currentTarget.style.borderColor = '#e0e0e0'
              }}
              aria-label="달력 뷰 모드 토글"
            >
              {viewModeLabel} 단위
            </button>
          ) : (
            <button
              onClick={handleBackToCalendar}
              style={{
                backgroundColor: '#f5f5f5',
                border: '1px solid #e0e0e0',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '14px',
                cursor: 'pointer',
                color: '#333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                minWidth: '60px',
                height: '32px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ffecec'
                e.currentTarget.style.borderColor = '#ff3b30'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5'
                e.currentTarget.style.borderColor = '#e0e0e0'
              }}
              aria-label="달력으로 돌아가기"
            >
              ← 달력으로
            </button>
          )}

          {/* 년도와 월 표시 + 양옆 버튼 (가운데) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* 이전 월 버튼 */}
            <button
              onClick={goToPreviousMonth}
              style={{
                background: 'none',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '18px',
                cursor: 'pointer',
                color: '#333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                minWidth: '36px',
                height: '36px',
                marginRight: '8px'
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
              margin: '0 4px'
            }}>
              {headerYear}년 {monthNames[headerMonthIndex]}
            </h2>

            {/* 다음 월 버튼 */}
            <button
              onClick={goToNextMonth}
              style={{
                background: 'none',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '18px',
                cursor: 'pointer',
                color: '#333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                minWidth: '36px',
                height: '36px',
                marginLeft: '8px'
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

          {/* 오른쪽 여백 맞추기용 더미 요소 */}
          <div style={{ width: '60px', height: '32px' }} />
        </div>

        {/* 요일 헤더 (월간에서만 사용, 상세뷰/주간에서는 숨김) */}
        {!isDetailView && viewMode === 'month' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '4px',
            marginBottom: '8px',
            flexShrink: 0
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
        )}

        {/* 달력 본문: 월 뷰 */}
        {!isDetailView && viewMode === 'month' && (
          <div style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gridTemplateRows: 'repeat(6, 1fr)',
            gap: '4px',
            minHeight: 0
          }}>
            {calendarDays.map((day, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'left',
                  justifyContent: 'right',
                  paddingTop: '5px',
                  paddingRight: '5px',
                  fontSize: 'clamp(12px, 2.5vw, 16px)',
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
                  transition: 'all 0.2s'
                }}
                onClick={() => handleDayClick(day)}
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
        )}

        {/* 달력 본문: 주 단위 뷰 (4행 2열, 스와이프 이동) */}
        {!isDetailView && viewMode === 'week' && (
          <div
            style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gridTemplateRows: 'repeat(4, 1fr)',
              gap: '8px',
              minHeight: 0
            }}
            onTouchStart={handleWeekTouchStart}
            onTouchEnd={handleWeekTouchEnd}
          >
            {(() => {
              const currentWeek = weeks[weekIndex] || []
              // 4행 2열 배치:
              // 1행1열: 비움
              // 1행2열: 일요일(0)
              // 2행1열: 월요일(1)
              // 2행2열: 화요일(2)
              // 3행1열: 수요일(3)
              // 3행2열: 목요일(4)
              // 4행1열: 금요일(5)
              // 4행2열: 토요일(6)
              const cellDayIndexMap: (number | null)[] = [
                null,
                0,
                1,
                2,
                3,
                4,
                5,
                6,
              ]

              return cellDayIndexMap.map((dayIdx, idx) => {
                if (dayIdx === null) {
                  return (
                    <div
                      key={idx}
                      style={{
                        borderRadius: '8px',
                        backgroundColor: 'transparent'
                      }}
                    />
                  )
                }

                const day = currentWeek[dayIdx]
                if (!day) {
                  return (
                    <div
                      key={idx}
                      style={{
                        borderRadius: '8px',
                        backgroundColor: 'transparent'
                      }}
                    />
                  )
                }

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-end',
                      paddingTop: '8px',
                      paddingRight: '8px',
                      fontSize: '16px',
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
                      transition: 'all 0.2s'
                    }}
                    onClick={() => handleDayClick(day)}
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
                    <span>
                      {day.date}{' '}
                      <span style={{ fontSize: '12px', color: '#777', marginLeft: '4px' }}>
                        {dayNames[dayIdx]}
                      </span>
                    </span>
                  </div>
                )
              })
            })()}
          </div>
        )}

        {/* 상세 스케줄 뷰: 선택된 날짜의 상세 정보 */}
        {isDetailView && selectedDate && (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 0
          }}>
            <div style={{
              borderRadius: '16px',
              padding: '24px 24px 28px',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              gap: '12px',
              width: '100%',
              maxWidth: '480px'
            }}>
              <div style={{ fontSize: '13px', color: '#777' }}>
                선택한 날짜
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#333' }}>
                {selectedDate.getFullYear()}년 {monthNames[selectedDate.getMonth()]} {selectedDate.getDate()}일 ({dayNames[selectedDate.getDay()]}요일)
              </div>
              <div style={{
                marginTop: '8px',
                fontSize: '15px',
                fontWeight: 600,
                color: '#444'
              }}>
                상세 스케줄
              </div>
              <div style={{
                width: '100%',
                borderRadius: '12px',
                backgroundColor: 'white',
                padding: '12px 14px',
                fontSize: '14px',
                color: '#777',
                border: '1px dashed #ddd'
              }}>
                이 날짜의 스케줄 정보를 여기에 표시할 수 있어요.
                <br />
                (API 연동 또는 일정 데이터를 연결하면 리스트를 렌더링하면 됩니다.)
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
