<script setup lang="ts">
import { IconChevronDown } from "@tabler/icons-vue"

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const { directionStatsListGrouped } = useStatsData()

function hasChildren(item: { children?: unknown }): item is { children: { name: string; count: number; avg: number; sum: number }[] } {
  return 'children' in item && Array.isArray(item.children)
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Статистика по направлениям</CardTitle>
      <CardDescription>
        Участники и средний балл (0 баллов не учитываются). Backend объединён — детали по ЯП в выпадающем списке.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Table v-if="directionStatsListGrouped.length">
        <TableHeader>
          <TableRow>
            <TableHead>Направление</TableHead>
            <TableHead class="text-right w-28">Участников</TableHead>
            <TableHead class="text-right w-28">Средний балл</TableHead>
            <TableHead class="w-48">Уровень</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="item in directionStatsListGrouped"
            :key="item.name"
          >
            <TableCell class="font-medium">
              {{ item.name }}
              <DropdownMenu v-if="hasChildren(item)">
                <DropdownMenuTrigger as-child>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="ml-2 h-7 gap-1 text-muted-foreground"
                  >
                    <IconChevronDown class="size-4" />
                    детально по ЯП
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" class="w-72">
                  <div class="border-b px-3 py-2 text-xs font-medium text-muted-foreground">
                    Backend по языкам
                  </div>
                  <div
                    v-for="ch in item.children"
                    :key="ch.name"
                    class="flex items-center justify-between gap-4 px-3 py-2 text-sm"
                  >
                    <span>{{ ch.name.replace('Backend - ', '') }}</span>
                    <span class="tabular-nums">{{ ch.count }} уч., ср. {{ ch.avg }}</span>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
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
        Загрузка данных…
      </p>
    </CardContent>
  </Card>
</template>
