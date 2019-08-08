import { join } from "path";
import { JetztConfig } from "./config";
import { execAsync, fail } from "./lib/exec";
import { log, LogLevel } from "./lib/log";
import { sleep } from "./lib/sleep";
import { runStep } from "./lib/step";

export async function deploy(config: JetztConfig) {
  await runStep(`Checking for Azure CLI...`, () => checkForAzCLI());

  await runStep(`Creating resource group...`, () =>
    createResourceGroup(config)
  );

  await runStep(`Creating creating storage account...`, () =>
    createStorage(config)
  );

  await runStep(`Creating function app...`, () => createFunctionApp(config));

  const { buildOutputPath } = config;
  await runStep(`Uploading package & assets...`, () =>
    upload(config, buildOutputPath)
  );
}

async function checkForAzCLI() {
  try {
    await execAsync(`az --version`);
  } catch {
    fail(
      "Could not find Azure CLI. Please install from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest"
    );
  }
}

async function createResourceGroup(config: JetztConfig) {
  const { subscriptionId, location, resourceGroup } = config;

  try {
    await execAsync(
      `az group create --subscription ${subscriptionId} --name ${resourceGroup} --location ${location}`
    );
  } catch (e) {
    fail("Could not create resource group", e);
  }
}

async function createStorage(config: JetztConfig) {
  const {
    storageAccount,
    subscriptionId,
    location,
    resourceGroup,
    assetsContainerName
  } = config;

  try {
    await execAsync(
      `az storage account create --subscription ${subscriptionId} --name ${storageAccount} --location ${location} --resource-group ${resourceGroup} --sku Standard_LRS`
    );
  } catch (e) {
    fail("Could not create storage account", e);
  }

  log(`Setting storage container permissions`, LogLevel.Verbose);
  try {
    await execAsync(
      `az storage container set-permission --public-access blob --subscription ${subscriptionId} --account-name ${storageAccount} --name ${assetsContainerName}`
    );
  } catch (e) {
    fail("Could not set storage container access level", e);
  }
}

async function createFunctionApp(config: JetztConfig) {
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

  log(`Enabling package deploy`, LogLevel.Verbose);
  try {
    await execAsync(
      `az functionapp config appsettings set --settings ${ConfigName}=1 --resource-group ${resourceGroup} --name ${name}`
    );
  } catch (e) {
    fail("Could not enable package deployment", e);
  }
}

async function upload(config: JetztConfig, buildOutputPath: string) {
  const {
    subscriptionId,
    resourceGroup,
    name,
    storageAccount,
    assetsContainerName
  } = config;

  debugger;
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; ++attempt) {
    try {
      log(
        `Attempting to upload package (${attempt}/${maxAttempts})...`,
        LogLevel.Verbose
      );
      await execAsync(
        `az functionapp deployment source config-zip --subscription ${subscriptionId} -n ${name} -g ${resourceGroup} --src ${join(
          buildOutputPath,
          "package.zip"
        )}`
      );

      log(`Upload successful`, LogLevel.Verbose);
      break;
    } catch (e) {
      if (attempt + 1 <= maxAttempts) {
        log(
          `Could not deploy package to Azure function app, waiting 5s and then retrying... ${
            e.message
          }`
        );

        await sleep(5000);
      } else {
        fail("Could not deploy package to Azure function app", e);
      }
    }
  }

  log(`Uploading assets to blob storage...`, LogLevel.Verbose);
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
