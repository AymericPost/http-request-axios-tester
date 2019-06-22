# Just an Axios request tester

A tool intended to test requests to servers locally or in a micro-services cluster. Uses Axios to make requests (see https://github.com/axios/axios).

## Local installation

### Pre-requisites

- [npm](https://www.npmjs.com/)
- [nodejs](https://nodejs.org/en/)

### Setup

1. Clone repository

```git clone https://github.com/AymericPost/http-request-axios-tester.git```

2. Install dependencies from project repository

```cd ./http-request-axios-tester && npm install```

3. Set "parameters.json" tests

Open it with your favorite editor. Examples are provided in it. A list of properties is available in the documentation. See [documentation for params](https://aymericpost.github.io/http-request-axios-tester/module-Script.html#~params).

### Start

Build the application and run the tests

```
npm run build
npm start
```

Results will be logged in console. Alternatively, results can be put into a file.

```npm start >> results.txt```

## Docker container installation

### Pre-requisites

- [Docker](https://www.docker.com/)

### Setup

1. Clone repository

```git clone https://github.com/AymericPost/http-request-axios-tester.git```

2. Set "parameters.json" tests

Open it with your favorite editor. Examples are provided in it. A list of properties is available in the documentation. See [documentation for params](https://aymericpost.github.io/http-request-axios-tester/module-Script.html#~params).

3. Make a docker image from project repository

```cd ./http-request-axios-tester && docker build -t http-request-axios-tester .```

### Start

Start the docker container.
```docker run http-request-axios-tester```

For each change of test sets, setup must be done again from set 2.

## Possible evolutions

- Making result logs prettier with [Chalk](https://www.npmjs.com/package/chalk).
- Using Express for possible webhooks
