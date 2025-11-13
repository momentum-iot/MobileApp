import { ICheckRepository } from '../repositories/ICheckRepository';

export class CheckInUseCase {

  constructor(private checkRepository: ICheckRepository) {}

  async execute(): Promise<string> {
    return await this.checkRepository.checkIn();
  }
  
}