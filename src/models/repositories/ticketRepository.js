import Ticket from '../Ticket.js';
import TicketDTO from '../dtos/ticketDTO.js';

class TicketRepository {
    async createTicket(ticketData) {
        try {
            const newTicket = await Ticket.create(ticketData);
            return TicketDTO.fromTicket(newTicket);
        } catch (error) {
            throw new Error(`Error creating ticket: ${error.message}`);
        }
    }

    async getTicketById(id) {
        try {
            const ticket = await Ticket.findById(id)
                .populate('purchaser', 'email')
                .populate('items.product');
                
            if (!ticket) {
                throw new Error('Ticket not found');
            }
            
            return TicketDTO.fromTicket(ticket);
        } catch (error) {
            throw new Error(`Error fetching ticket: ${error.message}`);
        }
    }

    async getTicketByCode(code) {
        try {
            const ticket = await Ticket.findOne({ code })
                .populate('purchaser', 'email')
                .populate('items.product');
                
            if (!ticket) {
                throw new Error('Ticket not found');
            }
            
            return TicketDTO.fromTicket(ticket);
        } catch (error) {
            throw new Error(`Error fetching ticket: ${error.message}`);
        }
    }

    async getUserTickets(userId) {
        try {
            const tickets = await Ticket.find({ purchaser: userId })
                .populate('purchaser', 'email')
                .populate('items.product')
                .sort({ purchase_datetime: -1 });
            
            return TicketDTO.fromTickets(tickets);
        } catch (error) {
            throw new Error(`Error fetching user tickets: ${error.message}`);
        }
    }
}

export default new TicketRepository();