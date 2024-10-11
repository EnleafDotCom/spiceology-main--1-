import Alpine from 'alpinejs'

Alpine.data("select", () => {
  return {
    init() {
      this.$nextTick(() => {
        new Choices(this.$refs.select, {
          searchEnabled: false,
          itemSelectText: "",
          placeholder: true,
        });
      });
    },
  };
});
