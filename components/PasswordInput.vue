<script lang="ts" setup>
const visibility = ref<"Hidden" | "Showing">("Hidden");

defineProps(["modelValue", "inputClass"]);
const emit = defineEmits(["update:modelValue"]);

const updateValue = (value: string) => {
  emit("update:modelValue", value);
};
</script>
<template>
  <div class="input-group">
    <input
      :value="modelValue"
      @input="
        updateValue(
          // @ts-ignore
          $event.target.value
        )
      "
      id="password"
      :type="visibility === 'Hidden' ? 'password' : 'text'"
      class="form-control"
      :class="inputClass" />
    <Button
      v-if="visibility === 'Hidden'"
      variant="primary"
      @click="visibility = 'Showing'">
      <Icon name="eye" />
      Show
    </Button>
    <Button
      v-if="visibility === 'Showing'"
      variant="primary"
      @click="visibility = 'Hidden'">
      <Icon name="eye-slash" />
      Hide
    </Button>
  </div>
</template>
