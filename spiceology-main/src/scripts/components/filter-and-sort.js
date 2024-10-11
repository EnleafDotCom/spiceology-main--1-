document.addEventListener("alpine:init", () => {
  Alpine.data("filterAndSort", () => ({
    activeFilters: {},
    filterCount: 0,
    filtersOpen: false,
    sortOpen: false,
    sortBy: null,
    sortByLabel: null,
    collectionHandle: null,
    pageType: null,
    searchParams: null,
    loading: false,
    productCount: null,

    // toggle and focus the filter panel
    toggleFilterPanel() {
      this.filtersOpen = !this.filtersOpen;
      this.filtersOpen
        ? this.$nextTick(() => this.$refs.filtersPanel.focus())
        : this.$nextTick(() => this.$refs.filtersButton.focus());
    },

    // toggle and focus the sort menu
    toggleSortMenu() {
      this.sortOpen = !this.sortOpen;
      this.filtersOpen = false;
      this.sortOpen
        ? this.$nextTick(() => this.$refs.sortMenu.focus())
        : this.$nextTick(() => this.$refs.sortButton.focus());
    },

    countTotalFilters(data) {
      let totalFilters = 0;

      Object.values(this.activeFilters).forEach((arr) => {
        totalFilters += arr.length;
      });

      return totalFilters;
    },

    // add/remove filters from the activeFilters object
    handleFilterValueClick(filterLabel, filter) {
      if (this.activeFilters[filterLabel]) {
        if (this.activeFilters[filterLabel].includes(filter)) {
          this.activeFilters[filterLabel] = this.activeFilters[
            filterLabel
          ].filter((item) => item !== filter);
          if (this.activeFilters[filterLabel].length === 0) {
            delete this.activeFilters[filterLabel];
          }
        } else {
          this.activeFilters[filterLabel].push(filter);
        }
      } else {
        this.activeFilters[filterLabel] = [filter];
      }
      this.filterCount = this.countTotalFilters(this.activeFilters);
    },
    handleChipClick(filter) {
      this.$refs[`filter-${filter}`].click();
    },
    handleKeydownPill(el) {
      el.click();
      el.focus();
    },
    // clear all filters
    handleClearFilters() {
      this.activeFilters = {};
      this.$refs.filter_form.reset();
      this.$dispatch("filter-updated");
      this.filterCount = 0;
    },

    sortCollection(sortValue, sortByLabel) {
      this.sortBy = sortValue;
      this.sortByLabel = sortByLabel;
      this.sortOpen = false;
    },
    setSortByLabel(value, name) {
      if (value === this.sortBy) {
        this.sortByLabel = name;
      }
    },
    // update the url with the new filter values
    updateForm: {
      ["@filter-updated.window"]() {
        const formRef = this.$refs.filter_form;
        this.$nextTick(() => {
          // set the Form Data to a variable and remove empty values
          const formData = new FormData(formRef);
          for (let [name, value] of Array.from(formData.entries())) {
            if (value === "") formData.delete(name);
          }
          const queryString = new URLSearchParams(formData).toString();
          this.loading = true;
          let updatedQueryString;
          // update the url with the new filter values based on page type
          if (this.pageType === "collections") {
            updatedQueryString = `/${this.pageType}/${this.collectionHandle}?${queryString}`;
          }
          if (this.pageType === "search") {
            updatedQueryString = `/${this.pageType}?${this.searchParams}&${queryString}`;
          }
          fetch(updatedQueryString)
            .then((response) => response.text())
            // update the dom with the new products
            .then((data) => {
              let html_div = document.createElement("div");
              html_div.innerHTML = data;
              let html_dom = html_div.querySelector(
                "#productGridContainer"
              ).innerHTML;
              document.querySelector("#productGridContainer").innerHTML =
                html_dom;
              // update url without refreshing the page
              if (this.pageType === "collections") {
                history.replaceState(null, null, "?" + queryString);
              }
              if (this.pageType === "search") {
                history.replaceState(
                  null,
                  null,
                  `?${this.searchParams}&${queryString}`
                );
              }
            })
            .catch((error) => console.error("Error:", error))
            .finally(() => (this.loading = false));
        });
      },
    },

    getCountLabel(label) {
      return this.productCount === 1
        ? `${this.productCount} ${label}`
        : `${this.productCount} ${label}s`;
    },

    // initialize the data based on the page type
    initializeData(sortBy, pageType, collectionHandle) {
      this.sortBy = sortBy;
      this.collectionHandle = collectionHandle;
      this.pageType = pageType;
      if (pageType === "search") {
        const urlParams = new URLSearchParams(location.search);
        for (const [key, value] of urlParams) {
          if (key === "q" && value) {
            this.searchParams = `q=${value.replace(/\s+/g, "+")}`;
          }
        }
      }
    },
  }));
});
