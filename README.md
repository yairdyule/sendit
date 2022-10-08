## SendIt

SendIt is the cutting-edge music-sharing experience you've been dreaming of. It allows for folks of all strokes to curate 'queues', which can be exported to other authenticated users' Spotify accounts.

To the accusations that "SendIt is just a glorified playlist maker", I retort "you're not dreaming big enough".

### The stack

- Remix
- Tailwind
- Prisma
- Fly.io

### Installation/Setup

- Register for a Spotify developer account. `cp .env.example .env`, then populate it with the values given there.
  - Note: while your application is in development mode, you'll have to whitelist users' emails on the Spotify developer dashboard.
- Create a Postgresql database, and update the connection url in `.env` to point towards it.
- `npx prisma generate && npx prisma db push` (todo: in that order? or another? trial & error?)
