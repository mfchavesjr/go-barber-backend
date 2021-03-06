import { startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

import AppError from '@shared/errors/AppError';

interface IRequest {
  provider_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) { }

  public async execute({ provider_id, date }: IRequest): Promise<Appointment> {

    const appointmentDate = startOfHour(date);

    const findAppointementIsSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointementIsSameDate) {
      throw new AppError('This appointment is already');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
