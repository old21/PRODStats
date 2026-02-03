<script setup lang="ts">
import { IconChartBar, IconUsers, IconSchool, IconSum } from "@tabler/icons-vue"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const { data: statsData } = useStatsData()
</script>

<template>
  <div class="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
    <Card class="@container/card">
      <CardHeader>
        <CardDescription>Всего записей</CardDescription>
        <CardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {{ statsData?.totalRows ?? '—' }}
        </CardTitle>
      </CardHeader>
      <CardFooter class="flex-col items-start gap-1.5 text-sm">
        <div class="text-muted-foreground flex items-center gap-2">
          <IconChartBar class="size-4" />
          Строк в data.csv
        </div>
      </CardFooter>
    </Card>
    <Card class="@container/card">
      <CardHeader>
        <CardDescription>Участников с баллами</CardDescription>
        <CardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {{ statsData?.rowsWithAnyScore ?? '—' }}
        </CardTitle>
      </CardHeader>
      <CardFooter class="flex-col items-start gap-1.5 text-sm">
        <div class="text-muted-foreground flex items-center gap-2">
          <IconUsers class="size-4" />
          Хотя бы один ненулевой балл
        </div>
      </CardFooter>
    </Card>
    <Card class="@container/card">
      <CardHeader>
        <CardDescription>Направлений с данными</CardDescription>
        <CardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {{ statsData ? (statsData.directionNames.filter(n => statsData.directions[n]?.count > 0).length) : '—' }}
        </CardTitle>
      </CardHeader>
      <CardFooter class="flex-col items-start gap-1.5 text-sm">
        <div class="text-muted-foreground flex items-center gap-2">
          <IconSchool class="size-4" />
          Направления с ненулевыми баллами
        </div>
      </CardFooter>
    </Card>
    <Card class="@container/card">
      <CardHeader>
        <CardDescription>Средний балл</CardDescription>
        <CardTitle class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {{ statsData?.globalAvg ?? '—' }}
        </CardTitle>
      </CardHeader>
      <CardFooter class="flex-col items-start gap-1.5 text-sm">
        <div class="text-muted-foreground flex items-center gap-2">
          <IconSum class="size-4" />
          По всем ненулевым оценкам
        </div>
      </CardFooter>
    </Card>
  </div>
</template>
