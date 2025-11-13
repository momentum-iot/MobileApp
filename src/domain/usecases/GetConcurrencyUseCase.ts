import { ICheckRepository } from '../repositories/ICheckRepository';

export class GetConcurrencyUseCase {

  constructor(private checkRepository: ICheckRepository) {}

  async execute(): Promise<number> {
    return await this.checkRepository.getConcurrency();
  }
  
}