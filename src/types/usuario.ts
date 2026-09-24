export interface CriarUsuario {
  nome: string;
  senhaHash: string;
}

export interface AtualizarUsuario extends CriarUsuario {}

export interface Usuario extends AtualizarUsuario {
  id: number;
}
