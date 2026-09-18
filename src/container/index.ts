// EVENTOS -------------------------------------------------------------

import { EventoRepository } from "../repositories/evento.repository";
import { EventoService } from "../services/evento.service";
import { EventoController } from "../controllers/evento.controller";

const eventoRepository = new EventoRepository();
const eventoService = new EventoService(eventoRepository);
export const eventoController = new EventoController(eventoService);

// EQUIPES -------------------------------------------------------------
