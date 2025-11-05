export interface IDBSettings {
  host: string

  port: number

  user: string

  password: string

  database: string
}

export const GetDBSettings = (): IDBSettings => {
  const env = process.env.NODE_ENV

  if (env == 'development')
    return {
      host: process.env.DB_HOST!, //'58.84.143.251',

      port: parseInt(process.env.DB_PORT!),

      user: process.env.DB_USER!,

      password: process.env.DB_PASSWORD!,

      database: process.env.DB_NAME!,
    }
  else
    return {
      host: process.env.DB_HOST!, //'58.84.143.251',

      port: parseInt(process.env.DB_PORT!),

      user: process.env.DB_USER!,

      password: process.env.DB_PASSWORD!,

      database: process.env.DB_NAME!,
    }
}