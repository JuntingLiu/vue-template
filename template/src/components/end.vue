<template>
  <div>
    {{ message }}
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      message: 'Hello '
    }
  },
  created() {
    this.message = 'test coverage.';
  }
}
</script>
