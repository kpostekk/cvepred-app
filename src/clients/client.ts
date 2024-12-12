import type { paths } from "./schema"
import createFetchClient from "openapi-fetch"
import createApi from "openapi-react-query"

export const clientFetch = createFetchClient<paths>({
  baseUrl: import.meta.env.PUBLIC_CVEPRED_URL,
})

export const clientQuery = createApi(clientFetch)