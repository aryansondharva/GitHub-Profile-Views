export class CounterPdoRepository {
  constructor(pool, tableName = 'github_profile_views') {
    if (!/^[a-z_][a-z0-9_]*$/i.test(tableName)) {
      throw new Error('Database table name contains invalid characters');
    }

    this.pool = pool;
    this.tableName = tableName;
  }

  async getViewsCountByUsername(username) {
    const result = await this.pool.query(
      `SELECT COUNT(*)::text AS count FROM ${this.tableName} WHERE username = $1`,
      [username.toString()]
    );

    return BigInt(result.rows[0]?.count ?? '0');
  }

  async addViewByUsername(username) {
    const result = await this.pool.query(
      `SELECT EXISTS (
        SELECT 1 FROM ${this.tableName}
        WHERE username = $1
        AND created_at > NOW() - INTERVAL '10 seconds'
      ) AS has_cooldown`,
      [username.toString()]
    );

    if (result.rows[0]?.has_cooldown) {
      return;
    }

    await this.pool.query(
      `INSERT INTO ${this.tableName} (username, created_at) VALUES ($1, NOW())`,
      [username.toString()]
    );
  }
}

export async function createPostgresRepository(env) {
  let pg;

  try {
    pg = await import('pg');
  } catch {
    throw new Error('PostgreSQL repository requires the optional "pg" package. Run npm install.');
  }

  const Pool = pg.Pool ?? pg.default?.Pool;

  if (Pool === undefined) {
    throw new Error('Could not load the "pg" Pool client');
  }

  return new CounterPdoRepository(
    new Pool({
      host: env.DB_HOST,
      port: Number(env.DB_PORT),
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME
    }),
    env.DB_TABLE
  );
}
