import React, { useState, useEffect } from 'react';
import { ticketService } from '../services/ticketService';

const newTicketState = {
  title: '',
  description: '',
  status: 'open',
  priority: 'low'
};

const TicketManagementPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(newTicketState);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ticketService.get();
      setTickets(data);
    } catch (err) {
      setError('Failed to load tickets. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCurrentTicket(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!currentTicket.title) errors.title = "Title is required.";
    if (!currentTicket.status) errors.status = "Status is required.";
    else if (!['open', 'in_progress', 'closed'].includes(currentTicket.status)) {
      errors.status = "Invalid status. Must be open, in_progress, or closed.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openCreateForm = () => {
    setIsEditing(false);
    setCurrentTicket(newTicketState);
    setFormErrors({});
    setShowForm(true);
  };

  const openEditForm = (ticket) => {
    setIsEditing(true);
    setCurrentTicket(ticket);
    setFormErrors({});
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setCurrentTicket(newTicketState);
    setFormErrors({});
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEditing) {
        await ticketService.update(currentTicket.id, currentTicket);
        showToast('Ticket updated successfully!');
      } else {
        await ticketService.create(currentTicket);
        showToast('Ticket created successfully!');
      }
      closeForm();
      loadTickets(); 
    } catch (err) {
      setFormErrors({ general: err.message });
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await ticketService.delete(id);
        showToast('Ticket deleted.');
        loadTickets(); 
      } catch (err) {
        showToast('Failed to delete ticket.', 'error');
      }
    }
  };

  
  const renderStatusTag = (status) => {
    const statusClass = `status-tag status-${status.replace('_', '')}`;
    return <span className={statusClass}>{status.replace('_', ' ')}</span>;
  };

  const renderTicketCard = (ticket) => (
    <div className="card" key={ticket.id}>
      <div className="card-header">
        <h3 className="card-title">{ticket.title}</h3>
        {renderStatusTag(ticket.status)}
      </div>
      <div className="card-body">
        <p>{ticket.description || 'No description provided.'}</p>
        <p style={{marginTop: '1rem', fontSize: '0.9rem'}}><strong>Priority:</strong> {ticket.priority}</p>
      </div>
      <div className="card-footer">
        <div className="card-actions">
          <button onClick={() => openEditForm(ticket)} className="btn btn-secondary">Edit</button>
          <button onClick={() => handleDelete(ticket.id)} className="btn btn-secondary" style={{borderColor: 'var(--error)', color: 'var(--error)'}}>Delete</button>
        </div>
      </div>
    </div>
  );

  const renderForm = () => (
    <div className="form-container" style={{margin: '0 0 2rem 0', maxWidth: '100%'}}>
      <h3>{isEditing ? 'Edit Ticket' : 'Create New Ticket'}</h3>
      <form onSubmit={handleFormSubmit}>
        {formErrors.general && <p className="form-error">{formErrors.general}</p>}
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" name="title" id="title" value={currentTicket.title} onChange={handleFormChange} />
          {formErrors.title && <p className="form-error">{formErrors.title}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea name="description" id="description" value={currentTicket.description} onChange={handleFormChange}></textarea>
        </div>
        <div style={{display: 'flex', gap: '1rem'}}>
          <div className="form-group" style={{flex: 1}}>
            <label htmlFor="status">Status</label>
            <select name="status" id="status" value={currentTicket.status} onChange={handleFormChange}>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
            {formErrors.status && <p className="form-error">{formErrors.status}</p>}
          </div>
           <div className="form-group" style={{flex: 1}}>
            <label htmlFor="priority">Priority</label>
            <select name="priority" id="priority" value={currentTicket.priority} onChange={handleFormChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">{isEditing ? 'Update Ticket' : 'Create Ticket'}</button>
          <button type="button" onClick={closeForm} className="btn btn-secondary" style={{marginLeft: '1rem'}}>Cancel</button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="main-content app-container">
      { }
      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h2>Ticket Management</h2>
        {!showForm && <button onClick={openCreateForm} className="btn btn-primary">Create New Ticket</button>}
      </div>

      {showForm && renderForm()}

      {loading && <p>Loading tickets...</p>}
      {error && <p className="form-error">{error}</p>}
      
      {!loading && !error && (
        <div className="grid-3">
          {tickets.length > 0 ? (
            tickets.map(renderTicketCard)
          ) : (
            <p>No tickets found. Get started by creating one!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketManagementPage;