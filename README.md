This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

- [Next.js](https://nextjs.org)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [Documentation](https://create.t3.gg/)

## dev usage

narzedzie do bazy danych:
pnpm db:studio

pnpm dev to start nextjs dev server

pnpm ngrok to start ngrok proxy for clerk auth webhooks in dev
https://ngrok.com/downloads/windows?tab=install
potem komenda:
ngrok config add-authtoken <token-ktory-wysle-pv>
potem zeby uruchomic to pnpm ngrok

zeby apka z logowaniem dziala musi naraz chodzic ngrok i next server
