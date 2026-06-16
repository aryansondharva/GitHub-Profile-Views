# GitHub Profile Views Counter

A small JavaScript/Node.js service that counts GitHub profile badge hits and returns an SVG badge.

Maintained by Aryan Sondharva.

## Usage

Add the badge to your GitHub profile README:

```markdown
![](https://your-domain.example/ghpvc/?username=aryansondharva)
```

Supported query parameters:

| parameter | example | description |
| --- | --- | --- |
| `username` | `aryansondharva` | GitHub username to count views for |
| `color` | `green` or `dc143c` | Badge message color |
| `style` | `flat-square` | `flat`, `flat-square`, `plastic`, `for-the-badge`, or `pixel` |
| `label` | `PROFILE+VIEWS` | Custom label text |
| `base` | `1000` | Number added to the stored count |
| `abbreviated` | `true` | Shows values like `12.3K` |

## Local Development

```bash
npm install
cp .env.example .env
npm start
```

The app runs at `http://localhost:3000` by default.

Example:

```text
http://localhost:3000/ghpvc/?username=aryansondharva&color=green&style=flat-square
```

## Storage

The default repository is file storage. Counts are stored in `storage/`.

```env
REPOSITORY=file
FILE_STORAGE_PATH=
```

PostgreSQL is also available through `REPOSITORY=pdo` or `REPOSITORY=postgres`. It uses the optional `pg` npm package.

Expected table:

```sql
CREATE TABLE github_profile_views (
  username VARCHAR(39) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## Docker

```bash
cp .env.example .env
docker-compose up --build
```

The container exposes the service on `http://localhost:3000`.

## Test

```bash
npm test
```

## License

This project is open-sourced software licensed under the [MIT license](LICENSE).
