<script setup lang="ts">
import {
  IconBrandAndroid,
  IconBrandApple,
  IconBrandGithub,
  IconChartBar,
  IconCode,
  IconDashboard,
} from "@tabler/icons-vue"

import NavMain from '@/components/NavMain.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const GITHUB_URL = 'https://github.com/old21/PRODStats'

const data = {
  navMain: [
    { title: "Главная", url: "/", icon: IconDashboard },
    { title: "Backend", url: "/backend", icon: IconCode },
    { title: "Frontend", url: "/frontend", icon: IconCode },
    { title: "iOS", url: "/ios", icon: IconBrandApple },
    { title: "Android", url: "/android", icon: IconBrandAndroid },
    { title: "ML", url: "/ml", icon: IconChartBar },
  ],
}
</script>

<template>
  <Sidebar collapsible="offcanvas">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            as-child
            class="data-[slot=sidebar-menu-button]:!p-1.5"
          >
            <NuxtLink to="/" class="flex items-center gap-2">
              <IconChartBar class="!size-5" />
              <span class="text-base font-semibold">Stats</span>
            </NuxtLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain" />
    </SidebarContent>
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton as-child :tooltip="'Исходники на GitHub'">
            <a :href="GITHUB_URL" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2">
              <IconBrandGithub class="size-4" />
              <span>GitHub</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>
