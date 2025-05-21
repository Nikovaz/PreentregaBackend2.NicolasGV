class TicketDTO {
    constructor(ticket) {
        this.id = ticket._id;
        this.code = ticket.code;
        this.purchase_datetime = ticket.purchase_datetime;
        this.amount = ticket.amount;
        this.purchaser = ticket.purchaser;
        this.purchaser_email = ticket.purchaser_email;
        this.items = ticket.items.map(item => ({
            product: item.product,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.subtotal
        }));
        this.status = ticket.status;
        this.unprocessed_items = ticket.unprocessed_items;
    }

    static fromTicket(ticket) {
        return new TicketDTO(ticket);
    }

    static fromTickets(tickets) {
        return tickets.map(ticket => new TicketDTO(ticket));
    }
}

export default TicketDTO;