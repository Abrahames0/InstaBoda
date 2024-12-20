// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Imagenes, Usuarios } = initSchema(schema);

export {
  Imagenes,
  Usuarios
};