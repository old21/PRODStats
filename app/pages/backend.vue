<script setup lang="ts">
import GroupStatsDetail from '@/components/GroupStatsDetail.vue'

definePageMeta({ layout: 'default' })

const { load } = useStatsData()
onMounted(load)
</script>

<template>
  <GroupStatsDetail
    group-key="backend"
    title="Backend"
    description="Статистика по языкам программирования (Python, NodeJS, Kotlin, Java, Golang, Custom, .NET). 0 баллов не учитываются."
  />
</template>
