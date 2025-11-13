import { ICheckRepository } from '../repositories/ICheckRepository';

export class CheckOutUseCase {

  constructor(private checkRepository: ICheckRepository) {}

  async execute(): Promise<string> {
    return await this.checkRepository.checkOut();
  }
  
}