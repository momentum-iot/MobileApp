import { ICheckRepository } from '../repositories/ICheckRepository';

export class GetUserStatusUseCase {

  constructor(private checkRepository: ICheckRepository) {}

  async execute(): Promise<boolean> {
    return await this.checkRepository.isUserInside();
  }
  
}