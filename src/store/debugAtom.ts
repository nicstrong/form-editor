import { createId } from '@paralleldrive/cuid2'
import { atom, getDefaultStore, useAtomValue } from 'jotai'
import { atomWithImmer } from 'jotai-immer'

type DebugValueType = string | number | boolean | object | null | undefined
type DebugValue = {
  value: DebugValueType
  activityId?: string
}

export type ActivityMetadata = {
  id: string
  name: string
}

export type Activity = ActivityMetadata & {
  setDebugValue: (key: string, value: DebugValueType) => void
  setDebugMultiValue: (keyPrefix: string, values: DebugValueType[]) => void
  dispose: () => void
}

export const debugAtom = atomWithImmer<Record<string, DebugValue>>({})
export const debugOverlayMinimizedAtom = atom(false)

export type DebugValuesByActivity = {
  defaultValues: Record<string, DebugValueType>
  activityValues: Record<
    string,
    { name: string; data: Record<string, DebugValueType> }
  >
}

const activeActivities = new Map<string, Activity>()

export const debugByActivityAtom = atom((get) =>
  Object.keys(get(debugAtom)).reduce(
    (acc, key) => {
      const debugValue = get(debugAtom)[key]
      if (debugValue.activityId) {
        const act = activeActivities.get(debugValue.activityId)
        if (!act)
          throw new Error(`Activity with ID ${debugValue.activityId} not found`)
        if (!acc.activityValues[debugValue.activityId]) {
          acc.activityValues[debugValue.activityId] = {
            name: act.name,
            data: {},
          }
        }
        acc.activityValues[debugValue.activityId].data[key] = debugValue.value
      } else {
        acc.defaultValues[key] = debugValue.value
      }
      return acc
    },
    { defaultValues: {}, activityValues: {} } as DebugValuesByActivity,
  ),
)

export const useDebugValues = () => useAtomValue(debugByActivityAtom)

const store = getDefaultStore()

export function createActivity(name: string): Activity {
  const id = createId()
  const act = {
    id,
    name,
    setDebugValue: (key: string, value: DebugValueType) => {
      setDebugValue(key, value, id)
    },
    setDebugMultiValue: (keyPrefix: string, values: DebugValueType[]) => {
      setDebugMultiValue(keyPrefix, values, id)
    },
    dispose: () => {
      activeActivities.delete(id)
      store.set(debugAtom, (prev) => {
        for (const key in prev) {
          if (prev[key].activityId === id) {
            delete prev[key]
          }
        }
      })
    },
  }
  activeActivities.set(id, act)
  return act
}

export function setDebugValue(
  key: string,
  value: DebugValueType,
  activityId?: string,
) {
  store.set(debugAtom, (prev) => {
    prev[key] = { value, activityId }
  })
}

export function deleteDebugValue(key: string) {
  store.set(debugAtom, (prev) => {
    delete prev[key]
  })
}

export function setDebugMultiValue(
  keyPrefix: string,
  values: DebugValueType[],
  activityId?: string,
) {
  store.set(debugAtom, (prev) => {
    const keysAdded = new Set<string>()
    values.forEach((value, index) => {
      const key = `${keyPrefix}-${index}`
      prev[key] = { value, activityId }
      keysAdded.add(key)
    })

    for (const key in prev) {
      if (key.startsWith(keyPrefix) && !keysAdded.has(key)) {
        delete prev[key]
      }
    }
  })
}
