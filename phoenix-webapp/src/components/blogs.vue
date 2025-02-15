<template>
  <div class="rounded-md bg-red-50 p-4 mb-3" v-if="error">
    <div class="flex">
      <div class="ml-3">
        <p class="text-sm text-red-700">
          {{ error }}
        </p>
      </div>
    </div>
  </div>

  <div class="text-center" v-if="!$store.loading && blogs.length === 0">
    <FireIcon class="inline-flex items-center -ml-0.5 mr-1.5 h-16 w-16 color-grey" aria-hidden="true" />
    <h3 class="mt-2 text-sm font-semibold text-gray-900">No blogs</h3>
    <p class="mt-1 text-sm text-gray-500">Get started by creating a new blog.</p>
    <div class="mt-6">
      <RouterLink  :to="newBlogUrl">
        <CfButton class="inline-flex items-center">
          <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          New Blog
        </CfButton>
      </RouterLink>
    </div>
  </div>

  <div v-else-if="!$store.loading && blogs.length > 0" class="flex flex-col justify-center max-w-2xl mx-auto">
    <div class="flex">
      <RouterLink  :to="newBlogUrl">
        <CfButton>
          <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New Blog
        </CfButton>
      </RouterLink>
    </div>
    <div class="flex mt-4">
      <ul role="list" class="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm border rounded-xl w-full">
        <li v-for="blog in blogs" :key="blog.id"
          class="relative flex gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6 cursor-pointer">
          <RouterLink :to="`/blogs/${blog.id}`" class="flex w-full justify-between">
            <div class="flex gap-x-4">
              <!-- <img class="h-12 w-12 flex-none rounded-full bg-gray-50" :src="person.imageUrl" alt="" /> -->
              <div class="min-w-0 flex-auto">
                <p class="text-sm font-semibold leading-6 text-gray-900">
                  <span class="absolute inset-x-0 -top-px bottom-0" />
                  {{ blog.name }}
                </p>
                <p class="mt-1 flex text-xs leading-5 text-gray-500">
                  <span class="relative truncate">{{ blog.slug }}.cloudflarebook.net</span>
                </p>
              </div>
            </div>
            <div class="flex items-center gap-x-4">
              <ChevronRightIcon class="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useApiClient } from '@/app/api_client';
import type { Blog } from '@phoenix/core/entities';
import { onBeforeMount, ref, type Ref } from 'vue';
import * as api from '@phoenix/core/api';
import { PlusIcon, FireIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';
import CfButton from '@/components/cf_button.vue';
import { useStore } from '@/app/store';

// props

// events

// composables
const $apiClient = useApiClient();
const $store = useStore();

// lifecycle
onBeforeMount(() => fetchData());

// variables
let error = ref('');
const newBlogUrl = '/blogs/new'

const blogs: Ref<Blog[]> = ref([]);

// computed

// watch

// functions
async function fetchData() {
  $store.setLoading(true);
  error.value = '';

  try {
    blogs.value = await api.getBlogs($apiClient);
  } catch (err: any) {
    error.value = err.message;
  } finally {
    $store.setLoading(false);
  }
}
</script>
