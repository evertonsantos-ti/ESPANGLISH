DELIMITER $$

CREATE PROCEDURE inativar_eventos_vencidos()
BEGIN
  UPDATE evento
  SET ativo = FALSE
  WHERE data_fim < CURDATE()
    AND ativo = TRUE;
END $$

DELIMITER;