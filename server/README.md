# Lottie Editor Server

## Environment
* Node 20

## Commands
* Installation: npm install
* Development: npm build && npm dev + npm watch to auto-rebuild on file changes

## Instructions

To run the Lottie Editor Server locally, follow these steps:

1. Install postgres locally if you don't have it

2. Create `mydatabase` database, make sure to give a super user(commonaly `postgres`) acces to db, edit `schema.prisma`.

3. Run `npm run build`

4. Run `npm run dev` + `npm run watch`

5. Server shuld be running at `localhost:3006`


