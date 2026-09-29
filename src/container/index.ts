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

// CATEGORIAS -------------------------------------------------------------

import { CategoriaRepository } from "../repositories/categoria.repository";
import { CategoriaService } from "../services/categoria.service";
import { CategoriaController } from "../controllers/categoria.controller";

const categoriaRepository = new CategoriaRepository();
const categoriaService = new CategoriaService(categoriaRepository);
export const categoriaController = new CategoriaController(categoriaService);

// CRITERIOS -------------------------------------------------------------

import { CriterioRepository } from "../repositories/criterio.repository";
import { CriterioService } from "../services/criterio.service";
import { CriterioController } from "../controllers/criterio.controller";

const criterioRepository = new CriterioRepository();
const criterioService = new CriterioService(criterioRepository);
export const criterioController = new CriterioController(criterioService);

// JURADOS -------------------------------------------------------------

import { JuradoRepository } from "../repositories/jurado.repository";
import { JuradoService } from "../services/jurado.service";
import { JuradoController } from "../controllers/jurado.controller";

const juradoRepository = new JuradoRepository();
const juradoService = new JuradoService(juradoRepository);
export const juradoController = new JuradoController(juradoService);

// USUARIOS -------------------------------------------------------------
import { UsuarioRepository } from "../repositories/usuario.repository";
import { UsuarioService } from "../services/usuario.service";
import { UsuarioController } from "../controllers/usuario.controller";

const usuarioRepository = new UsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepository);
export const usuarioController = new UsuarioController(usuarioService);

// JURADO_CATEGORIA -------------------------------------------------------------

import { JuradoCategoriaRepository } from "../repositories/juradoCategoria.repository";
import { JuradoCategoriaService } from "../services/juradoCategoria.service";
import { JuradoCategoriaController } from "../controllers/juradoCategoria.controller";

const juradoCategoriaRepository = new JuradoCategoriaRepository();
const juradoCategoriaService = new JuradoCategoriaService(
  juradoCategoriaRepository,
);
export const juradoCategoriaController = new JuradoCategoriaController(
  juradoCategoriaService,
);

// AVALIACOES -------------------------------------------------------------

import { AvaliacaoRepository } from "../repositories/avaliacao.repository";
import { AvaliacaoService } from "../services/avaliacao.service";
import { AvaliacaoController } from "../controllers/avaliacao.controller";

const avaliacaoRepository = new AvaliacaoRepository();
const avaliacaoService = new AvaliacaoService(avaliacaoRepository);
export const avaliacaoController = new AvaliacaoController(avaliacaoService);

// NOTAS -------------------------------------------------------------

import { NotaRepository } from "../repositories/nota.repository";
import { NotaService } from "../services/nota.service";
import { NotaController } from "../controllers/nota.controller";

const notaRepository = new NotaRepository();
const notaService = new NotaService(notaRepository);
export const notaController = new NotaController(notaService);

// MOVIMENTACAO PONTUACAO -------------------------------------------------------------

import { MovimentacaoPontuacaoRepository } from "../repositories/movimentacaoPontuacao.repository";
import { MovimentacaoPontuacaoService } from "../services/movimentacaoPontuacao.service";
import { MovimentacaoPontuacaoController } from "../controllers/movimentacaoPontuacao.controller";

const movimentacaoPontuacaoRepository = new MovimentacaoPontuacaoRepository();
const movimentacaoPontuacaoService = new MovimentacaoPontuacaoService(
  movimentacaoPontuacaoRepository,
);
export const movimentacaoPontuacaoController =
  new MovimentacaoPontuacaoController(movimentacaoPontuacaoService);

// RELATÓRIOS -------------------------------------------------------------

import { RelatorioRepository } from "../repositories/relatorio.repository";
import { RelatorioService } from "../services/relatorio.service";
import { RelatorioController } from "../controllers/relatorio.controller";

const relatorioRepository = new RelatorioRepository();
const relatorioService = new RelatorioService(relatorioRepository);
export const relatorioController = new RelatorioController(relatorioService);

// LOGIN -------------------------------------------------------------

import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../auth/auth.service";
import { PasswordService } from "../auth/password.service";
import { JwtService } from "../auth/jwt.service";

const passwordService = new PasswordService();
const jwtService = new JwtService();
const authService = new AuthService(
  usuarioRepository, // Essa classe já foi declarada no espaço de usuários a partir da linha 51
  juradoRepository, // Essa classe já foi declarada no espaço de jurados a partir da linha 41
  passwordService,
  jwtService,
);

export const authController = new AuthController(authService);
