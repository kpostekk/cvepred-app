import { useForm } from "@tanstack/react-form"
import GroupTabs from "../inputs/GroupTabs"
import { clientQuery as $api } from "../../clients/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { components } from "../../clients/schema"
import z from "zod"
import { useCallback, useEffect, useState } from "react"
import { VscLoading } from "react-icons/vsc"

type CveModel = components["schemas"]["CveModel"]
type CvePrediction = components["schemas"]["CvePrediction"]

const IMPACTS = ["NONE", "LOW", "HIGH"] as const
const SCOPES = ["UNCHANGED", "CHANGED"] as const
const ATTACK_VECTORS = [
  "NETWORK",
  "ADJACENT_NETWORK",
  "LOCAL",
  "PHYSICAL",
] as const
const ATTACK_COMPLEXITIES = ["LOW", "HIGH"] as const
const PRIVILEGES_REQUIRED = ["NONE", "LOW", "HIGH"] as const
const USER_INTERACTIONS = ["NONE", "REQUIRED"] as const

const formSchema = z.object({
  attackComplexity: z.enum(ATTACK_COMPLEXITIES),
  attackVector: z.enum(ATTACK_VECTORS),
  availabilityImpact: z.enum(IMPACTS),
  confidentialityImpact: z.enum(IMPACTS),
  integrityImpact: z.enum(IMPACTS),
  privilegesRequired: z.enum(PRIVILEGES_REQUIRED),
  scope: z.enum(SCOPES),
  userInteraction: z.enum(USER_INTERACTIONS),
})

export type CveFormProps = {
  defaultValues?: CveModel
  onSubmit?: (values: CveModel) => void
}

const defaultValues: CveModel = {
  attackComplexity: "LOW",
  attackVector: "NETWORK",
  availabilityImpact: "NONE",
  confidentialityImpact: "NONE",
  integrityImpact: "NONE",
  privilegesRequired: "NONE",
  scope: "UNCHANGED",
  userInteraction: "NONE",
}

export function CveForm(props: CveFormProps) {
  const form = useForm<CveModel>({
    defaultValues: props.defaultValues ?? defaultValues,
    validators: {
      onChange: () => {
        formSchema.parse(form.state.values)
        form.handleSubmit()
      },
    },
    onSubmit: (values) => {
      props.onSubmit?.(values.value)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="grid grid-cols-[auto_auto_auto] gap-4 p-4 border border-white rounded-2xl"
    >
      <form.Field name="attackVector">
        {(field) => (
          <div className="col-span-2">
            <p>Attack vector</p>
            <GroupTabs
              value={field.state.value}
              onChange={(v) => field.handleChange(v)}
              values={ATTACK_VECTORS}
            />
          </div>
        )}
      </form.Field>
      <form.Field name="attackComplexity">
        {(field) => (
          <div>
            <p>Attack complexity</p>
            <GroupTabs
              value={field.state.value}
              onChange={(v) => field.handleChange(v)}
              values={ATTACK_COMPLEXITIES}
            />
          </div>
        )}
      </form.Field>
      <form.Field name="privilegesRequired">
        {(field) => (
          <div>
            <p>Privileges required</p>
            <GroupTabs
              value={field.state.value}
              onChange={(v) => field.handleChange(v)}
              values={PRIVILEGES_REQUIRED}
            />
          </div>
        )}
      </form.Field>
      <form.Field name="userInteraction">
        {(field) => (
          <div>
            <p>User interaction</p>
            <GroupTabs
              value={field.state.value}
              onChange={(v) => field.handleChange(v)}
              values={USER_INTERACTIONS}
            />
          </div>
        )}
      </form.Field>
      <form.Field name="scope">
        {(field) => (
          <div>
            <p>Scope</p>
            <GroupTabs
              value={field.state.value}
              onChange={(v) => field.handleChange(v)}
              values={SCOPES}
            />
          </div>
        )}
      </form.Field>
      <form.Field name="confidentialityImpact">
        {(field) => (
          <div>
            <p>Confidentiality impact</p>
            <GroupTabs
              value={field.state.value}
              onChange={(v) => field.handleChange(v)}
              values={IMPACTS}
            />
          </div>
        )}
      </form.Field>
      <form.Field name="integrityImpact">
        {(field) => (
          <div>
            <p>Integrity impact</p>
            <GroupTabs
              value={field.state.value}
              onChange={(v) => field.handleChange(v)}
              values={IMPACTS}
            />
          </div>
        )}
      </form.Field>
      <form.Field name="availabilityImpact">
        {(field) => (
          <div>
            <p>Availability impact</p>
            <GroupTabs
              value={field.state.value}
              onChange={(v) => field.handleChange(v)}
              values={IMPACTS}
            />
          </div>
        )}
      </form.Field>
    </form>
  )
}

export type CveFormListProps = {
  onSubmit?: (values: CveModel[]) => void
}

export function CveFormList(props: CveFormListProps) {
  const [cveModels, setCveModels] = useState<CveModel[]>([])

  const addNewCve = useCallback(() => {
    const newCves = cveModels.concat([defaultValues])
    setCveModels(newCves)
    props.onSubmit?.(newCves)
  }, [cveModels, props])

  const removeCve = useCallback(
    (index: number) => {
      setCveModels((prev) => {
        const copy = [...prev]
        copy.splice(index, 1)
        props.onSubmit?.(copy)
        return copy
      })
    },
    [props],
  )

  useEffect(() => {
    if (cveModels.length === 0) {
      addNewCve()
    }
  }, [addNewCve, cveModels])

  return (
    <div className="relative">
      {cveModels.map((cve, index) => (
        <div>
          <CveForm
            key={index}
            defaultValues={cve}
            onSubmit={(v) => {
              setCveModels((prev) => {
                const copy = [...prev]
                copy[index] = v
                props.onSubmit?.(copy)
                return copy
              })
            }}
          />
          {cveModels.length > 1 && (
            <button className="button" onClick={() => removeCve(index)}>
              Remove this CVE {"(-)"}
            </button>
          )}
          {index !== cveModels.length - 1 && <hr className="mb-8 mt-2" />}
        </div>
      ))}

      {cveModels.length < 3 && (
        <div className="sticky bottom-0 flex justify-end">
          <button
            type="button"
            className="bg-black my-4 button"
            onClick={() => addNewCve()}
          >
            Add another CVE {"(+)"}
          </button>
        </div>
      )}
    </div>
  )
}

export type CvePredictionProps = {
  prediction: CvePrediction
}

export function CvePredictionRow(props: CvePredictionProps) {
  const humanLabel = [
    "Probably exploit does not exist",
    "Probably exploit exists",
  ][props.prediction.label]

  return (
    <div className="border border-white rounded-2xl p-4">
      <p className="font-bold text-xl">{humanLabel}</p>
      <p>Score: {props.prediction.score.toLocaleString()}</p>
      <div className="opacity-25 flex gap-2 flex-wrap mt-2 text-xs">
        {Object.entries(props.prediction.inputModel).map(([key, value]) => (
          <span key={key}>{value}</span>
        ))}
      </div>
    </div>
  )
}

export function CveFormPredict() {
  const [models, setModels] = useState<CveModel[]>([])
  const predictQuery = $api.useQuery("post", "/predict", {
    body: {
      data: models,
    },
  })

  return (
    <div className="grid grid-cols-[2fr_auto_1fr] place-content-center gap-4">
      <div className="overflow-auto">
        <QueryClientProvider client={new QueryClient()}>
          <CveFormList onSubmit={(v) => setModels(v)} />
        </QueryClientProvider>
      </div>
      <div className="w-px h-full bg-white" />
      {predictQuery.isLoading && (
        <div className="flex justify-center text-2xl py-4 w-full">
          <VscLoading className="animate-spin" />
        </div>
      )}
      {predictQuery.isFetched && (
        <div className="overflow-auto">
          {predictQuery.data?.data.map((result, index) => (
            <div key={index}>
              <CvePredictionRow prediction={result} />
              {index !== predictQuery.data?.data.length - 1 && (
                <hr className="my-4" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const queryClient = new QueryClient()

export function CveFormPredictContexts() {
  return (
    <QueryClientProvider client={queryClient}>
      <CveFormPredict />
    </QueryClientProvider>
  )
}
