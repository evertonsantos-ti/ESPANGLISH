import { describe, expect, it } from "vitest";
import bcrypt from "bcrypt";

import { PasswordService } from "../../src/auth/password.service";

describe("PasswordService.hash", () => {
  it("deve gerar um hash de senha em formato bcrypt", async () => {
    const passwordService = new PasswordService();

    const hash = await passwordService.hash("senhaSegura123");

    expect(typeof hash).toBe("string");
    expect(hash).not.toBe("senhaSegura123");
    expect(hash).toMatch(/^\$2[aby]\$\d{2}\$/);
  });

  it("deve gerar hashes diferentes para a mesma senha em chamadas distintas", async () => {
    const passwordService = new PasswordService();

    const hash1 = await passwordService.hash("senhaSegura123");
    const hash2 = await passwordService.hash("senhaSegura123");

    expect(hash1).not.toBe(hash2);
  });

  it("deve produzir um hash válido que possa ser validado com bcrypt.compare", async () => {
    const passwordService = new PasswordService();
    const password = "senhaSegura123";

    const hash = await passwordService.hash(password);
    const isValid = await bcrypt.compare(password, hash);

    expect(isValid).toBe(true);
  });
});

describe("PasswordService.compare", () => {
  it("deve retornar true quando a senha informada bate com o hash", async () => {
    const passwordService = new PasswordService();
    const password = "senhaSegura123";
    const hash = await passwordService.hash(password);

    const isValid = await passwordService.compare(password, hash);

    expect(isValid).toBe(true);
  });

  it("deve retornar false quando a senha informada não bate com o hash", async () => {
    const passwordService = new PasswordService();
    const password = "senhaSegura123";
    const hash = await passwordService.hash(password);

    const isValid = await passwordService.compare("senhaErrada456", hash);

    expect(isValid).toBe(false);
  });

  it("deve comparar corretamente um hash gerado pelo próprio serviço", async () => {
    const passwordService = new PasswordService();
    const password = "senhaComHash123";

    const hash = await passwordService.hash(password);
    const isValid = await passwordService.compare(password, hash);

    expect(isValid).toBe(true);
  });
});
