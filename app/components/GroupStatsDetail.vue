<script setup lang="ts">
import type { ChartConfig } from '@/components/ui/chart'
import type { GroupKey } from '@/composables/useStatsData'
import { SCORE_BUCKET_LABELS, type ScoreBucketItem } from '@/composables/useStatsData'
import { VisAxis, VisGroupedBar, VisXYContainer } from '@unovis/vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartCrosshair,
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

const props = defineProps<{
  groupKey: GroupKey
  title: string
  description?: string
}>()

const { directionStatsForGroup, groupAggregate, scoreBucketsForGroup } = useStatsData()
const items = directionStatsForGroup(props.groupKey)
const aggregate = groupAggregate(props.groupKey)
const chartData = scoreBucketsForGroup(props.groupKey)

const chartConfig = {
  count: {
    label: 'Человек',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card v-if="aggregate">
      <CardHeader>
        <CardDescription>{{ title }} — сводка</CardDescription>
        <CardTitle class="text-2xl">
          Участников: {{ aggregate.count }}, средний балл: {{ aggregate.avg }}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Progress :model-value="Math.min(100, aggregate.avg)" class="h-3" />
      </CardContent>
    </Card>
    <Card v-if="chartData.length && chartData.some(d => d.count > 0)">
      <CardHeader>
        <CardTitle>Распределение по баллам</CardTitle>
        <CardDescription>Количество человек в группах баллов (0–10, 10–20 и т.д.)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer :config="chartConfig" class="aspect-video h-[280px] w-full">
          <VisXYContainer
            :data="chartData"
            :margin="{ left: -24 }"
            :y-domain="[0, undefined]"
          >
            <VisGroupedBar
              :x="(d: ScoreBucketItem) => d.rangeIndex"
              :y="(d: ScoreBucketItem) => d.count"
              :color="chartConfig.count.color"
              :rounded-corners="10"
            />
            <VisAxis
              type="x"
              :x="(d: ScoreBucketItem) => d.rangeIndex"
              :tick-line="false"
              :domain-line="false"
              :grid-line="false"
              :num-ticks="10"
              :tick-format="(d: number) => chartData[d]?.range ?? ''"
              :tick-values="chartData.map(d => d.rangeIndex)"
            />
            <VisAxis
              type="y"
              :num-ticks="4"
              :tick-line="false"
              :domain-line="false"
            />
            <ChartTooltip />
            <ChartCrosshair
              :template="componentToString(chartConfig, ChartTooltipContent, {
                hideLabel: false,
                labelFormatter: (d: number) => SCORE_BUCKET_LABELS[d] ?? '',
              })"
              color="#0000"
            />
          </VisXYContainer>
        </ChartContainer>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>{{ title }} — по направлениям</CardTitle>
        <CardDescription v-if="description">
          {{ description }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table v-if="items.length">
          <TableHeader>
            <TableRow>
              <TableHead>Направление / ЯП</TableHead>
              <TableHead class="text-right w-28">Участников</TableHead>
              <TableHead class="text-right w-28">Средний балл</TableHead>
              <TableHead class="w-40">Уровень</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="item in items"
              :key="item.name"
            >
              <TableCell class="font-medium">
                {{ item.name.replace('Backend - ', '').replace('Mobile - ', '') }}
              </TableCell>
              <TableCell class="text-right tabular-nums">
                {{ item.count }}
              </TableCell>
              <TableCell class="text-right tabular-nums">
                {{ item.avg }}
              </TableCell>
              <TableCell>
                <Progress :model-value="Math.min(100, item.avg)" class="h-2" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <p v-else class="text-muted-foreground py-8 text-center text-sm">
          Нет данных по этому направлению (все баллы нулевые).
        </p>
      </CardContent>
    </Card>
  </div>
</template>
