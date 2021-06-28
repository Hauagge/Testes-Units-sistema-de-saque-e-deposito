import { Connection, createConnection, getConnectionOptions} from 'typeorm';


export default async () => {
  return await createConnection();
}
