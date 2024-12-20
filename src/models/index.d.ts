import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncItem, AsyncCollection } from "@aws-amplify/datastore";





type EagerImagenes = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Imagenes, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly url?: string | null;
  readonly description?: string | null;
  readonly likes?: number | null;
  readonly Usuarios?: Usuarios | null;
  readonly usuariosID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyImagenes = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Imagenes, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly url?: string | null;
  readonly description?: string | null;
  readonly likes?: number | null;
  readonly Usuarios: AsyncItem<Usuarios | undefined>;
  readonly usuariosID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Imagenes = LazyLoading extends LazyLoadingDisabled ? EagerImagenes : LazyImagenes

export declare const Imagenes: (new (init: ModelInit<Imagenes>) => Imagenes) & {
  copyOf(source: Imagenes, mutator: (draft: MutableModel<Imagenes>) => MutableModel<Imagenes> | void): Imagenes;
}

type EagerUsuarios = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Usuarios, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly nombre?: string | null;
  readonly imagenPerfil?: string | null;
  readonly Imagenes?: (Imagenes | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUsuarios = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Usuarios, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly nombre?: string | null;
  readonly imagenPerfil?: string | null;
  readonly Imagenes: AsyncCollection<Imagenes>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Usuarios = LazyLoading extends LazyLoadingDisabled ? EagerUsuarios : LazyUsuarios

export declare const Usuarios: (new (init: ModelInit<Usuarios>) => Usuarios) & {
  copyOf(source: Usuarios, mutator: (draft: MutableModel<Usuarios>) => MutableModel<Usuarios> | void): Usuarios;
}