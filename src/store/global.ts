import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from "@/store/user"
export interface GlobalStatusProps {

  loading: boolean;
}
export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}
export interface ImageProps{
  _id?: string;
  url?: string;
  createdAt?: string;
}



export const useGlobalStore = defineStore('global', {
  state() {
    return {
      loading: false,
      error: { status: false } as GlobalErrorProps
    }
  },

  actions: {
    async setloading(status: boolean) {
      this.loading = status
    },
    setError(e: GlobalErrorProps) {
      this.error = e

    }
  },
  getters: {

  },
})