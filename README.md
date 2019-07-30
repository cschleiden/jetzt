# jetzt

`jetzt` is a small utility to build, package, and publish Next.js serverless applications to Azure Functions.

In general there are two ways of hosting a Next.js app on Azure Functions: 

1. Use one function that takes the request and routes it via Next.js's server mode
2. Publish each individual page as a separate Azure Function

`jetzt` uses the second approach. Each page is wrapped with a small, custom Azure Function specific handler, and a proxy is generated to maintain the original URL structure. 

Assets are uploaded to Azure Blob Storage and can be served using the CDN.

## FAQ

### Is this tested and production ready?

Hell, no! This is an early experiment, so expect things to break. If you do want to play with it, I'd love to hear about your experience.