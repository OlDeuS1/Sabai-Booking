<script setup>
import { computed } from 'vue';

const props = defineProps({
  inputType: {
    type: String,
  },
  inputName: {
    type: String,
  },
  inputPlaceHolder: {
    type: String,
  },
  labelValue: {
    type: String
  }
})

const emit = defineEmits(['updateModelValue']);

const iconValue = `/src/views/assets/icons/${props.inputName}.svg`;

</script>

<template>
  <div class="form-group flex flex-col mb-4 w-full">
    <label :for="props.inputName" class="font-bold">{{ props.labelValue }}</label>
    <div class="form-input-icon w-full relative">
      <img :src="iconValue" alt="user-icon" class="w-6 h-6 absolute top-1/2 left-2 -translate-y-1/2">
      <input
        class="form-input mt-1 border-2 border-gray-200 py-2 pl-9 pr-2 rounded-md text-base w-full"
        :type="props.inputType"
        :id="props.inputName"
        :name="inputName"
        required
        :placeholder="inputPlaceHolder"
        @input="emit('updateModelValue', $event.target.value)" 
      />
    </div>
  </div>
</template>