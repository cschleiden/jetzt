import { join } from "path";
import { JetztConfig } from "./config";
import { execAsync, fail } from "./lib/exec";
import { log, LogLevel } from "./lib/log";
import { sleep } from "./lib/sleep";
import { runStep } from "./lib/step";

export async function deploy(config: JetztConfig, buildOutputPath: string) {
  runStep(`Checking for Azure CLI...`, () => checkForAzCLI());

  runStep(`Creating resource group...`, () => createResourceGroup(config));

  runStep(`Creating creating storage account...`, () => createStorage(config));

  runStep(`Creating function app...`, () => createFunctionApp(config));

  runStep(`Uploading package & assets...`, () =>
    upload(config, buildOutputPath)
  );
}

export async function checkForAzCLI() {
  try {
    await execAsync(`az --version`);
  } catch (e) {
    fail(
      "Could not find Azure CLI. Please install from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest",
      e
    );
  }
}

export async function createResourceGroup(config: JetztConfig) {
  const { subscriptionId, location, resourceGroup } = config;

  try {
    await execAsync(
      `az group create --subscription ${subscriptionId} --name ${resourceGroup} --location ${location}`
    );
  } catch (e) {
    fail("Could not create resource group", e);
  }
}

export async function createStorage(config: JetztConfig) {
  const { storageAccount, subscriptionId, location, resourceGroup } = config;

  try {
    await execAsync(
      `az storage account create --subscription ${subscriptionId} --name ${storageAccount} --location ${location} --resource-group ${resourceGroup} --sku Standard_LRS`
    );
  } catch (e) {
    fail("Could not create storage account", e);
  }

  log(`Creating storage container...`, LogLevel.Verbose);
  try {
  } catch (e) {
    fail("Could not create storage container", e);
  }
}

interface AppSetting {
  name: string;
  slotSettings: boolean;
  value: string;
}

export async function createFunctionApp(config: JetztConfig) {
  const {
    subscriptionId,
    storageAccount,
    location,
    resourceGroup,
    name
  } = config;

  const ConfigName = "WEBSITE_RUN_FROM_PACKAGE";

  try {
    await execAsync(
      `az functionapp create --subscription ${subscriptionId} --resource-group ${resourceGroup} --consumption-plan-location ${location} \
--name ${name} --storage-account ${storageAccount} --runtime node`
    );
  } catch (e) {
    fail("Could not create function app", e);
  }

  // Check if package deployment is already enabled
  log(`Enabling package deploy`, LogLevel.Verbose);
  try {
    const result = await execAsync(
      `az functionapp config appsettings list --resource-group ${resourceGroup} --name ${name}`
    );
    if (result && result.stdout) {
      const appSettings: AppSetting[] = JSON.parse(result.stdout);
      const setting = appSettings.find(x => x.name === ConfigName);
      if (setting && setting.value === "1") {
        log(`Already enabled.`, LogLevel.Verbose);
        return;
      }
    }

    await execAsync(
      `az functionapp config appsettings set --settings ${ConfigName}=1 --resource-group ${resourceGroup} --name ${name}`
    );
  } catch (e) {
    fail("Could not enable package deployment", e);
  }

  // Wait before next step to give the service time to restart
  await sleep(5000);
}

export async function upload(config: JetztConfig, buildOutputPath: string) {
  const {
    subscriptionId,
    resourceGroup,
    name,
    storageAccount,
    assetsContainerName
  } = config;

  for (let attempt = 0; attempt < 3; ++attempt) {
    try {
      await execAsync(
        `az functionapp deployment source config-zip --subscription ${subscriptionId} -n ${name} -g ${resourceGroup} --src ${join(
          buildOutputPath,
          "package.zip"
        )}`
      );
    } catch (e) {
      if (attempt + 1 < 3) {
        log(
          "Could not deploy package to Azure function app, waiting 5s and then retrying..."
        );

        await sleep(5000);
      } else {
        fail("Could not deploy package to Azure function app", e);
      }
    }
  }

  try {
    await execAsync(
      `az storage blob upload-batch --subscription ${subscriptionId} --account-name ${storageAccount} --destination ${assetsContainerName} --source ${join(
        buildOutputPath,
        "assets"
      )}`
    );
  } catch (e) {
    fail("Could not upload assets to Azure blob storage", e);
  }
}
