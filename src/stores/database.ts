import { defineStore } from 'pinia'

export const useDatabaseStore = defineStore('database', () => {
  const open = async (
    name: string,
    // @ts-ignore
    version: number = import.meta.env.VITE_INDEXED_DB_VERSION,
    upgradeCallback?: (db: IDBDatabase) => void
  ) => {
    if (!indexedDB)
      throw new Error('IndexedDB is not supported by your browser')

    const request = indexedDB.open(name, version)
    request.onupgradeneeded = () => {
      if (upgradeCallback) upgradeCallback(request.result)
    }
    request.onerror = () => {
      throw new Error('There was an error opening the database')
    }
    request.onblocked = () => {
      throw new Error('Database is blocked')
    }

    return request
  }

  const getDb = async (name: string) => {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(name)
      request.onsuccess = () => {
        resolve(request.result)
      }
      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  const getStore = (db: IDBDatabase, storeName: string) => {
    const transaction = db.transaction(storeName, 'readwrite')
    return transaction.objectStore(storeName)
  }

  const clearStore = (store: IDBObjectStore) => {
    store.clear()
  }

  const add = <D>(store: IDBObjectStore, data: D) => {
    return new Promise<IDBValidKey>((resolve, reject) => {
      const request = store.add(data)
      request.onsuccess = () => {
        resolve(request.result)
      }
      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  const getAll = async <D>(
    store: IDBObjectStore,
    filters?: Record<string, string>,
    pageSize = 10,
    pageNumber = 1
  ) => {
    const offset = (pageNumber - 1) * pageSize

    return new Promise<D[]>((resolve) => {
      const result: D[] = []

      store.openCursor(null, 'next').onsuccess = (event: Event) => {
        const cursor = (event.target as IDBRequest)?.result

        if (cursor) {
          if (filters) {
            for (const key in filters) {
              if (filters[key] !== cursor.value[key]) {
                cursor.continue()
                return
              }
            }
          }

          result.push(cursor.value)

          if (result.length >= offset + pageSize) {
            return resolve(result.slice(offset, offset + pageSize))
          }

          cursor.continue()
        } else {
          resolve(result.slice(offset, offset + pageSize))
        }
      }
    })
  }

  const deleteItem = (store: IDBObjectStore, key: IDBValidKey) => {
    return new Promise<void>((resolve, reject) => {
      const request = store.delete(key)
      request.onsuccess = () => {
        resolve()
      }
      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  return {
    open,
    getDb,
    getStore,
    clearStore,
    add,
    getAll,
    deleteItem
  }
})
