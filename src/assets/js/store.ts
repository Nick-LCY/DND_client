import { reactive } from "vue";

export const store = reactive({
    loading: false,
    startLoad() {
        this.loading = true
    },
    endLoad() {
        this.loading = false
    }
})