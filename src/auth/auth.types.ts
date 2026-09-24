export type AuthUser =
  | {
      id: number;
      tipo: "ADMIN";
    }
  | {
      id: number;
      tipo: "JURADO";
      eventoId: number;
    };

export type AdminLoginInput = {
  nome: string;
  senha: string;
};
