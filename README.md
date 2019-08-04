# jetzt - WORK IN PROGRESS!

`jetzt` is a small utility to build, package, and publish [Next.js](https://nextjs.org/) serverless applications to Azure Functions.

In general there are two ways of hosting a Next.js app on Azure Functions: 

1. Use one function that takes the request and routes it via Next.js's server mode
2. Publish each individual page as a separate Azure Function

`jetzt` uses the second approach. Each page is wrapped with a small, custom Azure Function specific handler, and a proxy is generated to maintain the original URL structure. 

Assets are uploaded to Azure Blob Storage and can be served using the CDN.

## Current state:

### Usage: 

`jetzt` is pretty much work in progress. Check again in a few days then the major features should be working. For now, proceed at your own risk:

1. Build your Next.js 9 serverless app (only version 9 is supported)
2. Make sure it builds successfully
3. Install Azure CLI
3. Login to your subscription
3. Create a `jetzt.config.js` file, with your subscription id, resource group name, location and the function app as well as your desired storage account nampe.
   ```
    {
        "functionApp": {
            "subscriptionId": "9cd14f4c-dddc-40b2-b671-61fd667e0937",
            "resourceGroup": "nextjs-rg1",
            "location": "westeurope",
            "name": "nextjs-rg1-function-app"
        },
        "storage": {
            "account": "nextjs1functionstorage"
        }
    }
   ```
3. Execute: `npx jetzt .` from your project's folder. This will build the required packages, create the resource group, create the function app, set it up and upload the build output.

## FAQ

### Is this tested and production ready?

Hell, no! This is an early experiment, so expect things to break. If you do want to play with it, I'd love to hear about your experience.

### What about the name? 

Placeholder, expect it to change :)

### Does this use some kind of Azure Functions best practice(s)? 

I am no expert in using Azure Functions, I just put something together that works - most of the time. Let me know if anything can be improved.
