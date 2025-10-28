const TICKET_KEY = 'ticketapp_tickets';

const initTickets = () => {
  if (!localStorage.getItem(TICKET_KEY)) {
    const defaultTickets = [
      { id: 1, title: 'Server is down', description: 'The main server rack is unresponsive.', status: 'open', priority: 'high' },
      { id: 2, title: 'Cannot login', description: 'A user forgot their password and is locked out.', status: 'in_progress', priority: 'medium' },
      { id: 3, title: 'Need new mouse', description: 'The mouse for workstation 4 is broken.', status: 'closed', priority: 'low' },
    ];
    localStorage.setItem(TICKET_KEY, JSON.stringify(defaultTickets));
  }
};
initTickets();

const getTickets = () => {
  const tickets = localStorage.getItem(TICKET_KEY);
  return JSON.parse(tickets) || [];
};

const saveTickets = (tickets) => {
  localStorage.setItem(TICKET_KEY, JSON.stringify(tickets));
};

export const ticketService = {

  get: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getTickets());
      }, 300);
    });
  },


  create: (ticketData) => {
    return new Promise((resolve, reject) => {
      
      if (!ticketData.title || !ticketData.status) {
        return reject(new Error("Title and Status are required."));
      }
      if (!['open', 'in_progress', 'closed'].includes(ticketData.status)) {
         return reject(new Error("Invalid status value."));
      }
      
      setTimeout(() => {
        const tickets = getTickets();
        const newTicket = {
          ...ticketData,
          id: new Date().getTime(),
        };
        tickets.push(newTicket);
        saveTickets(tickets);
        resolve(newTicket);
      }, 300);
    });
  },

  update: (id, updatedData) => {
     return new Promise((resolve, reject) => {
       
      if (!updatedData.title || !updatedData.status) {
        return reject(new Error("Title and Status are required."));
      }
      if (!['open', 'in_progress', 'closed'].includes(updatedData.status)) {
         return reject(new Error("Invalid status value."));
      }
       
      setTimeout(() => {
        let tickets = getTickets();
        const index = tickets.findIndex(t => t.id === id);
        if (index === -1) {
          return reject(new Error("Ticket not found."));
        }
        tickets[index] = { ...tickets[index], ...updatedData };
        saveTickets(tickets);
        resolve(tickets[index]);
      }, 300);
    });
  },

  delete: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let tickets = getTickets();
        tickets = tickets.filter(t => t.id !== id);
        saveTickets(tickets);
        resolve({ success: true });
      }, 300);
    });
  }
};