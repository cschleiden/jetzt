# jetzt

*jetzt* is a small utility to build, package, and publish [Next.js](https://nextjs.org/) 9 serverless applications to Azure Functions with a single command.

## How it works

In general there are two ways of hosting a Next.js app on Azure Functions: 

1. Use one function that takes the request and routes it via Next.js's server mode
2. Publish each individual page as a separate Azure Function

*jetzt* uses the second approach. Each page is wrapped with a small, custom Azure Function specific handler, and a proxy is generated to maintain the original URL structure. 

Assets are uploaded to Azure Blob Storage and can be served using the CDN.

## Usage

### Prerequisites

- Have a [serverless](https://nextjs.org/docs#serverless-deployment) Next.js 9 app
- Install [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)
  - For now, [login](https://docs.microsoft.com/en-us/cli/azure/authenticate-azure-cli?view=azure-cli-latest) to your Azure subscription in Azure CLI

### Build & Package & Publish

1. Install:
   ```shell
   $ npm install -D jetzt
   ```
2. Create a `jetzt.config.json` file, with your subscription id, resource group name, location and the function app as well as your desired storage account name, see [Configuration](#configuration) below.

3. Execute 
   ```shell
   $ npx jetzt .
   ``` 
   from your project's folder. This will build the required packages, create the resource group, create the function app, set it up and upload the build output.

4. Access your app under `https://<name>.azurewebsites.net`

### Build & Package only

If you only want to build and package, run
```shell
$ npx jetzt -b .
```
or 
```shell
$ npx jetzt --no-deploy .
```
and then upload to Azure yourself.

### Configuration

`jetzt` expects a `jetzt.config.json` file in the directory of the Next.js app. The structure 
   ```json
    {
        "functionApp": {
            // Id of the Azure subscription
            "subscriptionId": "9cd14f4c-dddc-40b2-b671-61fd667e0937",
            // Name of the resource group to create the function app in
            "resourceGroup": "nextjs-rg1",
            // Location of the function app
            "location": "westeurope",
            "name": "nextjs-rg1-function-app"
        },
        "storage": {
            "account": "nextjs1functionstorage"
        }
    }
   ```

If you run without an existing configuration you will be prompted to create one.

## FAQ

### Is this tested and production ready?

Hell, no! This is an early experiment, so expect things to break. If you do want to play with it, I'd love to hear about your experience.

### What about the name? 

Placeholder, expect it to change :)

### Does this use some kind of Azure Functions best practice(s)? 

I am no expert in using Azure Functions, I just put something together that works - most of the time. Let me know if there is anything can be improved.

### Does this support all features of Next.js?

It should eventually, for now it might be good to take a look at the open issues to see what is still being worked on.
