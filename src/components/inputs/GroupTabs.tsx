import { Tab, TabGroup, TabList } from "@headlessui/react"
import { useEffect, useState } from "react"
import clsx from "clsx"

export type InputGroupTabsProps<T extends readonly string[]> = {
  value?: T[number]
  values: T
  labels?: string[] | readonly string[]
  onChange?: (value: T[number]) => void
}

export default function GroupTabs<T extends readonly string[]>(
  props: InputGroupTabsProps<T>,
) {
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    if (!props.value) return

    const index = props.values.indexOf(props.value)
    setSelected(index)
  }, [props.value, props.values])

  // useEffect(() => {
  //   if (!props.onChange) return

  //   props.onChange(props.values[selected])
  // }, [selected])

  return (
    <TabGroup
      onChange={(i) => {
        setSelected(i)
        if (props.onChange) props.onChange(props.values[i])
      }}
      selectedIndex={selected}
    >
      <TabList className="flex gap-2">
        {props.values.map((value, index) => (
          <Tab
            className={clsx(
              "border rounded-full px-2 py-1 border-transparent",
              index === selected && "border-white",
              index !== selected && "hover:border-white hover:border-dashed cursor-pointer",
            )}
            key={value + index}
          >
            {props.labels?.at(index) ?? value}
          </Tab>
        ))}
      </TabList>
    </TabGroup>
  )
}
