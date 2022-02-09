# NEAR enough

TODO: add method documentation?

# Exploring The Code

1. The main smart contract code lives in `assembly/index.ts`. You can compile
   it with the `./compile` script.
2. Tests: You can run smart contract tests with the `./test` script. This runs
   standard AssemblyScript tests using [as-pect].

[as-pect]: https://www.npmjs.com/package/@as-pect/cli

This repo was bootstrapped by the [near-sdk-as Starter Kit](https://github.com/Learn-NEAR/starter--near-sdk-as).

## The file system

```sh
├── README.md                          # this file
├── as-pect.config.js                  # configuration for as-pect (AssemblyScript unit testing)
├── asconfig.json                      # configuration for AssemblyScript compiler (supports multiple contracts)
├── package.json                       # NodeJS project manifest
├── scripts
│   ├── 1.dev-deploy.sh                # helper: build and deploy contracts
│   ├── 2.use-contract.sh              # helper: call methods on ContractPromise
│   ├── 3.cleanup.sh                   # helper: delete build and deploy artifacts
│   └── README.md                      # documentation for helper scripts
├── src
│   ├── as_types.d.ts                  # AssemblyScript headers for type hints
│   ├── simple                         # Contract 1: "Simple example"
│   │   ├── __tests__
│   │   │   ├── as-pect.d.ts           # as-pect unit testing headers for type hints
│   │   │   └── index.unit.spec.ts     # unit tests for contract 1
│   │   ├── asconfig.json              # configuration for AssemblyScript compiler (one per contract)
│   │   └── assembly
│   │       └── index.ts               # contract code for contract 1
│   ├── tsconfig.json                  # Typescript configuration
│   └── utils.ts                       # common contract utility functions
└── yarn.lock                          # project manifest version lock
```

### Other documentation

- See `./scripts/README.md` for documentation about the scripts
- Watch this video where Willem Wyndham walks us through refactoring a simple example of a NEAR smart contract written in AssemblyScript

  https://youtu.be/QP7aveSqRPo

  ```
   0:00 noise (to cut)
   0:10 Welcome
   0:59 Create project starting with "npm init"
   2:20 Customize the project for AssemblyScript development
   9:25 Import the Counter example and get unit tests passing
  18:30 Adapt the Counter example to a Singleton style contract
  21:49 Refactoring unit tests to access the new methods
  24:45 Review and summary
  ```
