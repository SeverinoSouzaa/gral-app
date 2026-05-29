import { Injectable } from '@nestjs/common';

/**
 * Padrão Singleton:
 * Este serviço para manipulação de arquivos no AWS S3 é injetado como Singleton pelo NestJS.
 * Justificativa: Não precisamos recriar o cliente SDK da AWS (S3Client) a cada requisição
 * de upload ou download. Usar a mesma instância em memória para todo o app melhora a performance.
 */
@Injectable()
export class S3Service {
  // TODO: Instanciar cliente AWS S3 SDK (ex: new S3Client(...)) na inicialização

  async uploadFile(fileName: string, _fileBuffer: Buffer) {
    // Lógica futura de upload para o S3
    await Promise.resolve();
    return `https://gral-bucket-midias.s3.amazonaws.com/${fileName}`;
  }
}
