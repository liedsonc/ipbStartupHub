import { formatDate, formatRelativeTime } from '@/lib/utils/format'

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-01-15T10:30:00Z')
    const formatted = formatDate(date.toISOString())
    expect(formatted).toContain('15')
    expect(formatted).toContain('janeiro')
    expect(formatted).toContain('2024')
  })

  it('handles different date formats', () => {
    const date = new Date('2024-12-25T00:00:00Z')
    const formatted = formatDate(date.toISOString())
    expect(formatted).toContain('25')
    expect(formatted).toContain('dezembro')
    expect(formatted).toContain('2024')
  })
})

describe('formatRelativeTime', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('formats time as "agora mesmo" for very recent dates', () => {
    const recentDate = new Date('2024-01-15T11:59:30Z').toISOString()
    const formatted = formatRelativeTime(recentDate)
    expect(formatted).toBe('agora mesmo')
  })

  it('formats time in minutes', () => {
    const fiveMinutesAgo = new Date('2024-01-15T11:55:00Z').toISOString()
    const formatted = formatRelativeTime(fiveMinutesAgo)
    expect(formatted).toMatch(/minutos?/)
  })

  it('formats time in hours', () => {
    const twoHoursAgo = new Date('2024-01-15T10:00:00Z').toISOString()
    const formatted = formatRelativeTime(twoHoursAgo)
    expect(formatted).toMatch(/horas?/)
  })

  it('formats time in days', () => {
    const threeDaysAgo = new Date('2024-01-12T12:00:00Z').toISOString()
    const formatted = formatRelativeTime(threeDaysAgo)
    expect(formatted).toMatch(/dias?/)
  })
})

