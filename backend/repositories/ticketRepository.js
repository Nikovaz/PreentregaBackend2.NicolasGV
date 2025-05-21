import Ticket from '../models/Ticket.js';

class TicketRepository {
    async createTicket(ticketData) {
        try {
            const ticket = new Ticket(ticketData);
            return await ticket.save();
        } catch (error) {
            throw new Error(`Error creating ticket: ${error.message}`);
        }
    }

    async getTicketsByUser(userId) {
        try {
            return await Ticket.find({ purchaser: userId })
                .populate('items.product')
                .sort({ purchase_datetime: -1 });
        } catch (error) {
            throw new Error(`Error fetching tickets: ${error.message}`);
        }
    }

    async getTicketById(ticketId) {
        try {
            return await Ticket.findById(ticketId)
                .populate('items.product')
                .exec();
        } catch (error) {
            throw new Error(`Error fetching ticket: ${error.message}`);
        }
    }

    async getTicketsByDateRange(startDate, endDate) {
        try {
            return await Ticket.find({
                purchase_datetime: {
                    $gte: startDate,
                    $lte: endDate
                }
            })
            .populate('items.product')
            .sort({ purchase_datetime: -1 });
        } catch (error) {
            throw new Error(`Error fetching tickets by date range: ${error.message}`);
        }
    }

    async getTicketsByStatus(status) {
        try {
            return await Ticket.find({ status })
                .populate('items.product')
                .sort({ purchase_datetime: -1 });
        } catch (error) {
            throw new Error(`Error fetching tickets by status: ${error.message}`);
        }
    }

    async updateTicketStatus(ticketId, status) {
        try {
            return await Ticket.findByIdAndUpdate(ticketId, { status }, { new: true })
                .populate('items.product');
        } catch (error) {
            throw new Error(`Error updating ticket status: ${error.message}`);
        }
    }
}

export default new TicketRepository();
