import axios, { AxiosRequestConfig } from "axios"
import { useEffect, useState } from "react"

export type useFetchType<DataType> = {
  data: DataType | null
  isFetching: boolean
  isFetched: boolean
  error: string | null
}

export default function useAxiosFetch<T>(
  url: string,
  options?: RequestInit
): useFetchType<T> {
  const [data, setData] = useState<T | null>(null)
  const [isFetching, setIsFetching] = useState(false)
  const [isFetched, setIsFetched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const axiosFetch = (url: string, customOptions = {}) => {
    setIsFetching(true)

    const config: AxiosRequestConfig<any> = {
      method: "get",
      url: url,
      ...customOptions,
    }

    axios(config)
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => {
        setError(error.statusText)
      })
      .finally(() => {
        setIsFetched(true)
      })
  }

  useEffect(() => {
    if (typeof url === "string" && url) {
      axiosFetch(url, options)
    } else if (Array.isArray(url)) {
    }
  }, [options, url])

  return {
    data,
    isFetching,
    isFetched,
    error,
  }
}
