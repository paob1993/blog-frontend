<template>
  <div>
    <b-alert :show="show" :variant="variant">
      {{ title }}
    </b-alert>
  </div>
</template>

<script>
export default {
  props: {
    show: { type: Number, required: true },
    title: { type: String, required: true },
    variant: { type: String },
  },
  watch: {
    variant: {
      handler(val, oldVal) {
        console.log(val, oldVal);
      },
    },
  }
};
</script>