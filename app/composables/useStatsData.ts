export interface DirectionStats {
  count: number
  sum: number
  avg: number
}

export const SCORE_BUCKET_LABELS = ['0–10', '10–20', '20–30', '30–40', '40–50', '50–60', '60–70', '70–80', '80–90', '90–100'] as const

export interface ScoreBucketItem {
  range: string
  rangeIndex: number
  count: number
}

export interface StatsData {
  directions: Record<string, DirectionStats>
  directionNames: string[]
  scoreBucketsByDirection: Record<string, number[]>
  totalRows: number
  rowsWithAnyScore: number
  globalAvg: number
}

export const GROUPS = {
  backend: ['Backend - Python', 'Backend - NodeJS', 'Backend - Kotlin', 'Backend - Java', 'Backend - Golang', 'Backend - Custom', 'Backend - .NET'],
  frontend: ['Frontend'],
  ios: ['Mobile - iOS'],
  android: ['Mobile - Android'],
  ml: ['ML'],
} as const

export type GroupKey = keyof typeof GROUPS

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') {
      inQuotes = !inQuotes
    } else if ((c === ',' && !inQuotes) || (c === '\r' && !inQuotes)) {
      result.push(current.trim())
      current = ''
      if (c === '\r') break
    } else {
      current += c
    }
  }
  result.push(current.trim())
  return result
}

function parseCsv(text: string): string[][] {
  return text.split('\n').filter(Boolean).map(parseCsvLine)
}

export function useStatsData() {
  const data = useState<StatsData | null>('stats-csv-data', () => null)
  const error = ref<Error | null>(null)

  async function load() {
    try {
      const raw = await $fetch<string>('/data.csv')
      const rows = parseCsv(raw)
      if (rows.length < 2) {
        data.value = { directions: {}, directionNames: [], scoreBucketsByDirection: {}, totalRows: 0, rowsWithAnyScore: 0, globalAvg: 0 }
        return
      }
      const header = rows[0]
      const directionCols = header.slice(1)
      const stats: Record<string, { count: number; sum: number }> = {}
      const buckets: Record<string, number[]> = {}
      for (const name of directionCols) {
        stats[name] = { count: 0, sum: 0 }
        buckets[name] = Array(10).fill(0)
      }

      let rowsWithAnyScore = 0
      let globalSum = 0
      let globalCount = 0

      for (let r = 1; r < rows.length; r++) {
        const row = rows[r]
        let hasAny = false
        for (let c = 0; c < directionCols.length; c++) {
          const cell = row[c + 1]
          if (cell === undefined || cell === '') continue
          const num = Number.parseFloat(cell)
          if (Number.isNaN(num) || num === 0) continue
          const name = directionCols[c]
          stats[name].count += 1
          stats[name].sum += num
          const bucketIndex = Math.min(9, Math.floor(num / 10))
          buckets[name][bucketIndex] += 1
          hasAny = true
          globalSum += num
          globalCount += 1
        }
        if (hasAny) rowsWithAnyScore += 1
      }

      const directions: Record<string, DirectionStats> = {}
      for (const [name, s] of Object.entries(stats)) {
        directions[name] = {
          count: s.count,
          sum: s.sum,
          avg: s.count > 0 ? Math.round((s.sum / s.count) * 100) / 100 : 0,
        }
      }

      data.value = {
        directions,
        directionNames: directionCols,
        scoreBucketsByDirection: buckets,
        totalRows: rows.length - 1,
        rowsWithAnyScore,
        globalAvg: globalCount > 0 ? Math.round((globalSum / globalCount) * 100) / 100 : 0,
      }
      error.value = null
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
      data.value = null
    }
  }

  const directionStatsList = computed(() => {
    const d = data.value
    if (!d) return []
    return d.directionNames
      .map(name => ({ name, ...d.directions[name] }))
      .filter(x => x.count > 0)
      .sort((a, b) => b.count - a.count)
  })

  const directionStatsListGrouped = computed(() => {
    const d = data.value
    if (!d) return []
    const backendDirections = GROUPS.backend
      .map(name => ({ name, ...d.directions[name] }))
      .filter(x => x.count > 0)
      .sort((a, b) => b.count - a.count)
    const backendAgg = backendDirections.length
      ? {
          name: 'Backend',
          count: backendDirections.reduce((s, x) => s + x.count, 0),
          sum: backendDirections.reduce((s, x) => s + x.sum, 0),
          avg: 0,
          children: backendDirections,
        }
      : null
    if (backendAgg) backendAgg.avg = backendAgg.count > 0 ? Math.round((backendAgg.sum / backendAgg.count) * 100) / 100 : 0
    const others = directionStatsList.value.filter(
      item => !GROUPS.backend.includes(item.name as typeof GROUPS.backend[number]),
    )
    if (backendAgg) return [backendAgg, ...others]
    return others
  })

  function directionStatsForGroup(groupKey: GroupKey) {
    return computed(() => {
      const d = data.value
      if (!d) return []
      const names = GROUPS[groupKey]
      return names
        .map(name => ({ name, ...d.directions[name] }))
        .filter(x => x.count > 0)
        .sort((a, b) => b.count - a.count)
    })
  }

  function groupAggregate(groupKey: GroupKey) {
    return computed(() => {
      const d = data.value
      if (!d) return null
      const names = GROUPS[groupKey]
      let count = 0
      let sum = 0
      for (const name of names) {
        const s = d.directions[name]
        if (s?.count) {
          count += s.count
          sum += s.sum
        }
      }
      if (count === 0) return null
      return { count, sum, avg: Math.round((sum / count) * 100) / 100 }
    })
  }

  function scoreBucketsForGroup(groupKey: GroupKey) {
    return computed<ScoreBucketItem[]>(() => {
      const d = data.value
      if (!d) return []
      const names = GROUPS[groupKey]
      const merged = Array(10).fill(0) as number[]
      for (const name of names) {
        const b = d.scoreBucketsByDirection[name]
        if (b) for (let i = 0; i < 10; i++) merged[i] += b[i]
      }
      return SCORE_BUCKET_LABELS.map((range, rangeIndex) => ({
        range,
        rangeIndex,
        count: merged[rangeIndex],
      }))
    })
  }

  return {
    data,
    error,
    load,
    directionStatsList,
    directionStatsListGrouped,
    directionStatsForGroup,
    groupAggregate,
    scoreBucketsForGroup,
  }
}
