// import the Request and Response classes

import { NextResponse, NextRequest } from 'next/server'


import mysql from 'mysql2/promise'
import { GetDBSettings } from '../config/GetDBSetting'

let connectionParams = GetDBSettings()

// define and export the GET handler function

export async function GET(request: Request) {
  try {
    // 2. connect to database
    const connection = await mysql.createConnection(connectionParams)
    // 3. create a query to fetch data

    let get_exp_query = ''

    get_exp_query = 'SELECT * FROM Materiales'

    // we can use this array to pass parameters to the SQL query

    let values: any[] = []

    // 4. exec the query and retrieve the results

    const [results] = await connection.execute(get_exp_query, values)

    // 5. close the connection when done

    connection.end()

    // return the results as a JSON API response

    return NextResponse.json(results)
  } catch (err) {
    console.log(err)
    console.log('ERROR: API - ', (err as Error).message)

    const response = {
      error: (err as Error).message,

      returnedStatus: 200,
    }

    return NextResponse.json(response, { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const reqBody = await request.json()
    // 2. connect to database
    const connection = await mysql.createConnection(connectionParams)
    // 3. create a query to insert data
    let insert_query = ''

    insert_query =  'INSERT INTO materiales (nombre,  tipo,  marca,  modelo,  estado,  peso,  descripcion,  fecha_ingreso) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'

    console.log(insert_query)
    // we can use this array to pass parameters to the SQL query
    let values: any[] = [reqBody.nombre, reqBody.tipo, reqBody.marca, reqBody.modelo, reqBody.estado, reqBody.peso, reqBody.descripcion, new Date()]
    // 4. exec the query and retrieve the results

    const [results] = await connection.execute(insert_query, values)
    // 5. close the connection when done
    connection.end()
    // return the results as a JSON API response

    return NextResponse.json(results)
  }
  catch (err) {
    console.log(err)
    console.log('ERROR: API - ', (err as Error).message)
    const response = {
      error: (err as Error).message,

      returnedStatus: 200,
    }
    return NextResponse.json(response, { status: 200 })
  } 
}

export async function PUT(request: NextRequest) {
  try {
    const reqBody = await request.json()
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    
    const connection = await mysql.createConnection(connectionParams)
    let update_query = 'UPDATE materiales SET nombre = ?, tipo = ?,marca = ?, modelo = ?, estado = ?, peso = ?, descripcion = ? WHERE id = ?'
   let values: any[] = [reqBody.nombre, reqBody.tipo, reqBody.marca, reqBody.modelo, reqBody.estado, reqBody.peso, reqBody.descripcion, id]   

    const [results] = await connection.execute(update_query, values)
    connection.end()

    return NextResponse.json(results)
  } catch (err) {
    console.log('ERROR: API - ', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  } 
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    
    const connection = await mysql.createConnection(connectionParams)
    let delete_query = 'DELETE FROM materiales WHERE id = ?'
    let values: any[] = [id]

    const [results] = await connection.execute(delete_query, values)
    connection.end()

    return NextResponse.json(results)
  } catch (err) {
    console.log('ERROR: API - ', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}