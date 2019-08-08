import prompts, { PromptObject } from "prompts";
import { JetztConfig } from "../config";

function required(value: string): boolean {
  return (value && value.length > 0) || false;
}

const flow: PromptObject[] = [
  {
    type: "confirm",
    name: "create",
    message: `Do you want to create a jetzt.config.js?`,
    initial: true
  },
  {
    type: "text",
    name: "subscriptionId",
    message: `Enter your Azure Subscription ID (e.g, 2e54024b-0b4b-4f57-93cd-089da3a2a8fd)`,
    validate: required
  },
  {
    type: "text",
    name: "resourceGroup",
    message: `Enter the name of the resource group (e.g., nextjs-group)`,
    validate: required
  },
  {
    type: "text",
    name: "location",
    message:
      "Enter the Azure location you would like to host your application in (e.g., westeurope)",
    validate: required
  },
  {
    type: "text",
    name: "name",
    message: "Enter the name of your function app (e.g., nextjs-function-app)",
    validate: required
  },
  {
    type: "text",
    name: "account",
    message:
      "Enter the name of the storage account that will be used to host all assets (e.g., nextjsfunctionstorage)",
    validate: required
  }
];

export async function configPrompt(
  sourcePath: string
): Promise<JetztConfig | undefined> {
  let canceled = false;
  const response = await prompts(flow, {
    onSubmit: (prompt, answer, answers) => {
      if (prompt.name === "create" && answer !== true) {
        // Return true to cancel
        return true;
      }
    },
    onCancel: () => (canceled = true)
  });

  if (canceled) {
    return;
  }

  const rawConfig = {
    functionApp: {
      subscriptionId: response["subscriptionId"],
      location: response["location"],
      name: response["name"],
      resourceGroup: response["resourceGroup"]
    },
    storage: {
      account: response["account"]
    }
  };

  await JetztConfig.write(sourcePath, rawConfig);

  return new JetztConfig(sourcePath, rawConfig);
}
