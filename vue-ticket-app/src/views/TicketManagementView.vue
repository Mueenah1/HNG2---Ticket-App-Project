<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ticketService } from '../services/ticketService';

const newTicketState = {
  title: '',
  description: '',
  status: 'open',
  priority: 'low'
};

const tickets = ref([]);
const loading = ref(true);
const error = ref(null);
const toast = ref(null); // { message, type }

const showForm = ref(false);
const isEditing = ref(false);
const currentTicket = reactive({ ...newTicketState });
const formErrors = reactive({});

onMounted(() => {
  loadTickets();
});

const loadTickets = async () => {
  try {
    loading.value = true;
    error.value = null;
    tickets.value = await ticketService.get();
  } catch (err) {
    error.value = 'Failed to load tickets. Please retry.';
  } finally {
    loading.value = false;
  }
};

const showToast = (message, type = 'success') => {
  toast.value = { message, type };
  setTimeout(() => (toast.value = null), 3000);
};

// --- Form Handling ---
const validateForm = () => {
  Object.keys(formErrors).forEach(key => delete formErrors[key]);
  
  if (!currentTicket.title) formErrors.title = "Title is required.";
  if (!currentTicket.status) formErrors.status = "Status is required.";
  else if (!['open', 'in_progress', 'closed'].includes(currentTicket.status)) {
    formErrors.status = "Invalid status. Must be open, in_progress, or closed.";
  }
  return Object.keys(formErrors).length === 0;
};

const openCreateForm = () => {
  isEditing.value = false;
  Object.assign(currentTicket, newTicketState);
  Object.keys(formErrors).forEach(key => delete formErrors[key]);
  showForm.value = true;
};

const openEditForm = (ticket) => {
  isEditing.value = true;
  Object.assign(currentTicket, ticket); // Copy ticket data into reactive form
  Object.keys(formErrors).forEach(key => delete formErrors[key]);
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
};

const handleFormSubmit = async () => {
  if (!validateForm()) return;

  try {
    if (isEditing.value) {
      await ticketService.update(currentTicket.id, currentTicket);
      showToast('Ticket updated successfully!');
    } else {
      await ticketService.create(currentTicket);
      showToast('Ticket created successfully!');
    }
    closeForm();
    loadTickets();
  } catch (err) {
    formErrors.general = err.message;
    showToast(err.message, 'error');
  }
};

// --- Delete Handling ---
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

// --- Helper for class binding ---
const getStatusClass = (status) => {
  return `status-tag status-${status.replace('_', '')}`;
};
</script>

<template>
  <div class="main-content app-container">
    <div v-if="toast" :class="`toast toast-${toast.type}`">{{ toast.message }}</div>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem">
      <h2>Ticket Management</h2>
      <button v-if="!showForm" @click="openCreateForm" class="btn btn-primary">Create New Ticket</button>
    </div>

    <div v-if="showForm" class="form-container" style="margin: 0 0 2rem 0; max-width: 100%">
      <h3>{{ isEditing ? 'Edit Ticket' : 'Create New Ticket' }}</h3>
      <form @submit.prevent="handleFormSubmit">
        <p v-if="formErrors.general" class="form-error">{{ formErrors.general }}</p>
        
        <div class="form-group">
          <label for="title">Title</label>
          <input type="text" id="title" v-model="currentTicket.title" />
          <p v-if="formErrors.title" class="form-error">{{ formErrors.title }}</p>
        </div>
        
        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" v-model="currentTicket.description"></textarea>
        </div>

        <div style="display: flex; gap: 1rem">
          <div class="form-group" style="flex: 1">
            <label for="status">Status</label>
            <select id="status" v-model="currentTicket.status">
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
            <p v-if="formErrors.status" class="form-error">{{ formErrors.status }}</p>
          </div>
          <div class="form-group" style="flex: 1">
            <label for="priority">Priority</label>
            <select id="priority" v-model="currentTicket.priority">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">{{ isEditing ? 'Update Ticket' : 'Create Ticket' }}</button>
          <button type="button" @click="closeForm" class="btn btn-secondary" style="margin-left: 1rem">Cancel</button>
        </div>
      </form>
    </div>

    <p v-if="loading">Loading tickets...</p>
    <p v-if="error" class="form-error">{{ error }}</p>
    
    <div v-if="!loading && !error" class="grid-3">
      <p v-if="tickets.length === 0">No tickets found. Get started by creating one!</p>
      
      <div v-for="ticket in tickets" :key="ticket.id" class="card">
        <div class="card-header">
          <h3 class="card-title">{{ ticket.title }}</h3>
          <span :class="getStatusClass(ticket.status)">{{ ticket.status.replace('_', ' ') }}</span>
        </div>
        <div class="card-body">
          <p>{{ ticket.description || 'No description provided.' }}</p>
          <p style="margin-top: 1rem; font-size: 0.9rem"><strong>Priority:</strong> {{ ticket.priority }}</p>
        </div>
        <div class="card-footer">
          <div class="card-actions">
            <button @click="openEditForm(ticket)" class="btn btn-secondary">Edit</button>
            <button @click="handleDelete(ticket.id)" class="btn btn-secondary" style="border-color: var(--error); color: var(--error)">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>