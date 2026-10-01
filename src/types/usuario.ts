export interface CriarUsuario {
  nome: string;
  senha: string;
}

export interface AtualizarUsuario {
  nome: string;
  senha?: string;
}

export interface Usuario {
  id: number;
  nome: string;
}

export interface UsuarioComSenha extends Usuario {
  senhaHash: string;
}

export interface UsuarioPersistido {
  nome: string;
  senhaHash: string;
}

export interface AtualizarUsuarioPersistido {
  nome: string;
  senhaHash?: string;
}
