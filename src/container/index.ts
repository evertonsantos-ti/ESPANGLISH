// EVENTOS -------------------------------------------------------------

import { EventoRepository } from "../repositories/evento.repository";
import { EventoService } from "../services/evento.service";
import { EventoController } from "../controllers/evento.controller";

const eventoRepository = new EventoRepository();
const eventoService = new EventoService(eventoRepository);
export const eventoController = new EventoController(eventoService);

// EQUIPES -------------------------------------------------------------

import { EquipeRepository } from "../repositories/equipe.repository";
import { EquipeService } from "../services/equipe.service";
import { EquipeController } from "../controllers/equipe.controller";

const equipeRepository = new EquipeRepository();
const equipeService = new EquipeService(equipeRepository);
export const equipeController = new EquipeController(equipeService);
