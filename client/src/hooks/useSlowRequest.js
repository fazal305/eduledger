import { useNetworkStore } from '../store/networkStore'

export function useSlowRequest() {
  return useNetworkStore((s) => s.slowRequestCount > 0)
}
