# chain_explorer
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Start Substrate node server
Prerequisite:
https://docs.substrate.io/install/macos/

Clone this repo
https://github.com/bipulbafna/substrate-node-template.git
 
```bash
cd substrate-node-template
cargo build --release
./target/release/node-template --dev
```
Or Follow this doc

https://docs.substrate.io/quick-start/start-a-node/