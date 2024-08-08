# GoogleTasks API

**Universidad de San Carlos de Guatemala**
**Facultad de Ingeniería**
**Escuela de Ciencias y Sistemas**

**Prácticas Intermedias Sección D**
**Segundo Semestre de 2024**

**Sergio Andrés Larios Fajardo**
**Carné 202111849**

## Recursos
1. [Google Tasks API](https://developers.google.com/tasks)
2. [Google Tasks API Node.js Quickstart](https://developers.google.com/tasks/quickstart/nodejs)
3. [Google Tasks API Service](https://developers.google.com/apps-script/advanced/tasks)
4. [Apps Script Samples](https://github.com/googleworkspace/apps-script-samples/blob/main/tasks/simpleTasks/README.md)

## Procedimiento
1. Consola de Google Cloud Platform (GCP) - https://console.cloud.google.com/welcome/new?authuser=1&project=unified-scout-431022-c6&supportedpurview=project
2. Crear un proyecto
3. Menu -> APIs y servicios -> Biblioteca -> Google Tasks API -> Habilitar
4. Credentials -> Create credentials -> OAuth client ID -> Desktop app -> NewCredentialsName -> Create
5. NewCredentialsName -> Download -> client_secret.json -> rename to credentials.json -> move to project folder
6. Go [here](https://developers.google.com/tasks/quickstart/nodejs)
7. `npm install googleapis@105 @google-cloud/local-auth@2.1.0 --save`
8. Set up `index.js`
9. Run the sample with `node .`
10. La primera vez pide acceso

## Creating project
1. `npm create vite@latest`
2. `frontend`
3. `cd frontend`
4. `npm install`
5. `npm run dev`

## Misc
`npm install react-router-dom`