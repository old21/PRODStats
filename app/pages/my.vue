<script setup lang="ts">
import type { ChartConfig } from '@/components/ui/chart'
import { Donut } from '@unovis/ts'
import { VisAxis, VisDonut, VisGroupedBar, VisSingleContainer, VisXYContainer } from '@unovis/vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  componentToString,
} from '@/components/ui/chart'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const CHART_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)', 'var(--chart-6)']

definePageMeta({ layout: 'default' })

const route = useRoute()
const { load, getRowByCode, getRankInfo, PASS_SLOTS } = useStatsData()

const code = computed(() => (route.query.code as string) ?? '')
const row = computed(() => (code.value ? getRowByCode(code.value) : null))
const rankInfo = computed(() => (code.value ? getRankInfo(code.value) : null))

const scoresList = computed(() => {
  const r = row.value
  if (!r) return []
  return Object.entries(r.scores)
    .filter(([, v]) => v !== undefined && v !== null && Number(v) !== 0)
    .map(([name, value]) => ({ name, value: Number(value) }))
    .sort((a, b) => b.value - a.value)
})

const barChartData = computed(() =>
  scoresList.value.map((item, i) => ({
    direction: item.name,
    score: item.value,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  })),
)

const donutChartData = computed(() =>
  scoresList.value.map((item, i) => ({
    name: item.name,
    value: item.value,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  })),
)

const totalScoreForDonut = computed(() =>
  donutChartData.value.reduce((acc, d) => acc + d.value, 0),
)

const barChartConfig = computed<ChartConfig>(() => ({
  score: { label: 'Баллы', color: 'var(--chart-1)' },
  direction: { label: 'Направление', color: undefined },
}))

const donutChartConfig = computed<ChartConfig>(() => {
  const config: ChartConfig = {}
  scoresList.value.forEach((item, i) => {
    config[item.name] = { label: item.name, color: CHART_COLORS[i % CHART_COLORS.length] }
  })
  return config
})

type BarData = { direction: string; score: number; fill: string }
type DonutData = { name: string; value: number; fill: string }

onMounted(load)
</script>

<template>
  <div class="flex flex-col gap-4 md:gap-6 w-full">
    <Card v-if="!code">
      <CardHeader>
        <CardTitle>Моя статистика</CardTitle>
        <CardDescription>
          Введите шифр в поле «Поиск по шифру» в сайдбаре и нажмите Enter.
        </CardDescription>
      </CardHeader>
    </Card>
    <Card v-else-if="!row">
      <CardHeader>
        <CardTitle>Шифр не найден</CardTitle>
        <CardDescription>
          По запросу «{{ code }}» записей нет. Проверьте шифр и попробуйте снова.
        </CardDescription>
      </CardHeader>
    </Card>
    <template v-else>
      <div class="grid gap-4 md:gap-6 @xl/main:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Место в рейтинге</CardTitle>
            <CardDescription>
              Рейтинг по сумме баллов по всем направлениям. Проходит {{ PASS_SLOTS }} человек.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div v-if="rankInfo" class="flex flex-col gap-3">
              <div class="flex items-baseline justify-between gap-2">
                <span class="text-muted-foreground">Место</span>
                <span class="text-2xl font-semibold tabular-nums">
                  {{ rankInfo.rank }} из {{ rankInfo.totalParticipants }}
                </span>
              </div>
              <div class="flex items-baseline justify-between gap-2">
                <span class="text-muted-foreground">Сумма баллов</span>
                <span class="text-xl font-medium tabular-nums">{{ rankInfo.totalScore }}</span>
              </div>
              <div class="flex items-baseline justify-between gap-2">
                <span class="text-muted-foreground">Проход (всего мест)</span>
                <span class="font-medium">{{ PASS_SLOTS }} человек</span>
              </div>
              <div class="flex items-baseline justify-between gap-2">
                <span class="text-muted-foreground">Процент на проход</span>
                <span class="tabular-nums">{{ rankInfo.passPercent }}% участников проходят</span>
              </div>
              <div
                class="rounded-lg border px-3 py-2 text-center font-medium"
                :class="rankInfo.passes ? 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400' : 'border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400'"
              >
                {{ rankInfo.passes ? 'Вы проходите' : 'Вы не проходите' }}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Сводка по шифру {{ row.code }}</CardTitle>
            <CardDescription>
              Направлений с ненулевыми баллами: {{ scoresList.length }}. Ниже — детализация и графики.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="scoresList.length" class="space-y-3">
              <div
                v-for="item in scoresList"
                :key="item.name"
                class="flex flex-col gap-1"
              >
                <div class="flex justify-between text-sm">
                  <span class="truncate">{{ item.name }}</span>
                  <span class="tabular-nums text-muted-foreground">{{ item.value }} / 100</span>
                </div>
                <Progress :model-value="item.value" class="h-2" />
              </div>
            </div>
            <p v-else class="text-muted-foreground text-sm">
              Нет ненулевых баллов по направлениям.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card v-if="scoresList.length">
        <CardHeader>
          <CardTitle>Баллы по направлениям (столбцы)</CardTitle>
          <CardDescription>
            Визуализация ваших баллов по каждому направлению.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer :config="barChartConfig" class="h-[280px] w-full">
            <VisXYContainer
              :data="barChartData"
              :margin="{ left: -24 }"
              :y-domain="[0, 100]"
            >
              <VisGroupedBar
                :x="(d: BarData) => d.direction"
                :y="(d: BarData) => d.score"
                :color="(d: BarData) => d.fill"
                :rounded-corners="6"
              />
              <VisAxis
                type="x"
                :x="(d: BarData) => d.direction"
                :tick-line="false"
                :domain-line="false"
                :grid-line="false"
                :tick-format="(v: string) => v"
                :tick-values="barChartData.map(d => d.direction)"
              />
              <VisAxis
                type="y"
                :num-ticks="5"
                :tick-line="false"
                :domain-line="false"
                :tick-format="(v: number) => String(Math.round(v))"
              />
              <ChartTooltip />
            </VisXYContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div class="grid gap-4 md:gap-6 @xl/main:grid-cols-2">
        <Card v-if="donutChartData.length">
          <CardHeader>
            <CardTitle>Доля баллов по направлениям</CardTitle>
            <CardDescription>
              Круговая диаграмма: вклад каждого направления в вашу сумму баллов.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              :config="donutChartConfig"
              class="mx-auto aspect-square max-h-[260px]"
              :style="{
                '--vis-donut-central-label-font-size': 'var(--text-2xl)',
                '--vis-donut-central-label-font-weight': 'var(--font-weight-bold)',
                '--vis-donut-central-label-text-color': 'var(--foreground)',
                '--vis-donut-central-sub-label-text-color': 'var(--muted-foreground)',
              }"
            >
              <VisSingleContainer :data="donutChartData" :margin="{ top: 20, bottom: 20 }">
                <VisDonut
                  :value="(d: DonutData) => d.value"
                  :color="(d: DonutData) => d.fill"
                  :arc-width="28"
                  :central-label-offset-y="8"
                  :central-label="totalScoreForDonut.toFixed(1)"
                  central-sub-label="Сумма баллов"
                />
                <ChartTooltip
                  :triggers="{
                    [Donut.selectors.segment]: componentToString(donutChartConfig, ChartTooltipContent, { hideLabel: true })!,
                  }"
                />
              </VisSingleContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Таблица баллов</CardTitle>
            <CardDescription>
              Баллы по направлениям (только ненулевые), отсортированы по убыванию.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table v-if="scoresList.length">
              <TableHeader>
                <TableRow>
                  <TableHead>Направление</TableHead>
                  <TableHead class="text-right">Баллы</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="item in scoresList" :key="item.name">
                  <TableCell>{{ item.name }}</TableCell>
                  <TableCell class="text-right tabular-nums">{{ item.value }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <p v-else class="text-muted-foreground text-sm">
              Нет ненулевых баллов по направлениям.
            </p>
          </CardContent>
        </Card>
      </div>
    </template>
  </div>
</template>
