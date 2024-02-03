import type { Plugin, PluginInitContext, PublicAPI, Query, Result } from "@wox-launcher/wox-plugin"
import clipboard from "clipboardy"

let api: PublicAPI

export const plugin: Plugin = {
  init: async (context: PluginInitContext) => {
    api = context.API
  },

  query: async (query: Query): Promise<Result[]> => {
    await api.Log("Info", `sum: ${query.RawQuery}`)

    if (query.Type === "selection" && query.Selection.Type === "text") {
      for (const splitter of [" ", "\n", "\t", ","]) {
        const tokens = query.Selection.Text.split(splitter)
        const isAllNumber = tokens.every(token => {
          return !isNaN(Number(token))
        })
        if (isAllNumber) {
          return [
            {
              Title: "Sum",
              Icon: {
                ImageType: "relative",
                ImageData: "images/app.png"
              },
              Actions: [
                {
                  Name: "Sum",
                  Action: async () => {
                    //sum tokens
                    let sum = 0
                    tokens.forEach(token => {
                      sum += Number(token)
                    })
                    await api.Notify("Copied Sum Result", sum.toString())
                    await clipboard.write(sum.toString())
                  }
                }
              ]
            }
          ]
        }
      }
    }

    return []
  }
}
