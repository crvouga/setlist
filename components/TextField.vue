<script setup lang="ts">
const props = defineProps<{
  label: string;
  problems: string[];
  id: string;
  type?: "email" | "text";
  modelValue: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
<template>
  <label :for="id" class="form-label">{{ label }}</label>
  <input
    :type="type"
    class="form-control"
    :class="{
      'is-invalid': problems.length > 0,
    }"
    :id="id"
    v-model="inputValue"
    required />
  <p v-for="problem in problems" class="mt-1 text-danger" v-bind:key="problem">
    {{ problem }}
  </p>
</template>
