# MyPathFinder Frontend

## Routing split

- Employee panel: open on `http://localhost:5173/`
- Admin panel: open on `http://admin.localhost:5173/login`

The app now uses host-based routing:

- `admin.*` hosts render the existing admin portal
- all other hosts render the employee panel

## Local setup for admin host

Add this entry in your local hosts file:

```txt
127.0.0.1 admin.localhost
```

Then run:

```bash
npm install
npm run dev
```

Now you can test both panels:

- `http://localhost:5173/` (employee)
- `http://admin.localhost:5173/login` (admin)
