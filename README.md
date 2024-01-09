# giveme-resume
Simple resume API and generator built with Fastify.

---

### Requirements
- Requires [Node.js](https://nodejs.org) version 18.19.0 or higher.
- [Fastify](https://github.com/fastify/fastify) 4.0.0 or higher

### Getting Started
Clone the project
```
git clone https://github.com/melkristian/giveme-resume.git
```

Switch into the default or specified project directory
```
cd <default_or_specific_project_name>
```

Install dependencies
```
npm install
```

Run the application regularly
```
npm start  
```

Run the application in dev mode with pretty logs
```
npm run dev 
```

Test the application using the command below. Test mode uses a separate JSON file if needed.
```
npm test  
```
See [Fastify CLI](https://github.com/fastify/fastify-cli) for additional command line options.

### Verify App
You can verify if the app is working with the endpoints below via browser or command line. The following endpoints will return an empty array if data generation has not been performed. See [Resume Generator](#using-the-resume-generator) section below. Note that the root route `/` just redirects to `/resume`.
```
curl -L http://127.0.0.1:3000
or
curl http://127.0.0.1:3000/resume
```
You can see all available routes by running the command:
```
npx fastify print-routes app.js
```
```
└── / (GET, HEAD)
    └── resume (GET, HEAD)
        └── / (GET, HEAD)
            └── :resumeId (GET, HEAD)
```

### Expose a Server File
One of Fastify's values is to separate the Server and App. Depending on your setup, you may need a standalone server file when running the app. Use the following command to generate one:
```
npx fastify eject
```
This `eject` command will generate a `server.js` file that can be run with `node`.

---

## Using the Resume Generator
This project is a simple API for displaying mocked / generated resumes. A generator file is included to create records that will be stored in a JSON file to act as a pseudo database managed with [lowDb](https://github.com/typicode/lowdb). Most data are provided by [Faker](https://fakerjs.dev). 

The following command with generate 10 resumes and create `db.json` in the `data` folder by default.
```
node generators/populate-db.js -n 10
```

Use the `-h` or `--help` argument to show available options:
```
node generators/populate-db.js -h
```
```
Usage: populate-db [options]

Options:
  -t, --target <string>   json file output location relative to the location of populate-db.js
  -n, --count <number>    number of entries to generate (default: 1)
  -c, --country <string>  three-letter country code. defaults to 'USA'. use 'any' for random country codes
  -a, --append            if provided, data will be added to existing data, otherwise, it will overwrite
  -h, --help              display help for command
```

---

### Developer's Notes
This project was meant to be a super quick foray into a new Node.js framework, in this case, Fastify, and actually be a very small component for another practice project. This turned into something a little more. When I started this, I was not aware that a [JSON-based standard for resumes](https://jsonresume.org/schema/) existed. The data points were initially modeled from my own resume and expanded from there.

### License
Licensed under [MIT](./LICENSE).
