import { useContext } from 'react'
import { StorageContext } from '../hoc/StorageProvider'

export const useStorage = () => {
    return useContext(StorageContext)
}