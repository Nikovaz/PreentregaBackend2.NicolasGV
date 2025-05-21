import ticketRepository from '../repositories/ticketRepository.js';

class TicketService {
    async getTicketById(id) {
        try {
            return await ticketRepository.getTicketById(id);
        } catch (error) {
            throw new Error(`Error fetching ticket: ${error.message}`);
        }
    }

    async getTicketByCode(code) {
        try {
            return await ticketRepository.getTicketByCode(code);
        } catch (error) {
            throw new Error(`Error fetching ticket: ${error.message}`);
        }
    }

    async getUserTickets(userId) {
        try {
            return await ticketRepository.getUserTickets(userId);
        } catch (error) {
            throw new Error(`Error fetching user tickets: ${error.message}`);
        }
    }
}

export default new TicketService();