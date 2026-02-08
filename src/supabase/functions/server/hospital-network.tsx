import { Hono } from 'npm:hono';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Get all transfers for a hospital
app.get('/transfers', async (c) => {
  try {
    const hospitalId = c.req.query('hospitalId');
    if (!hospitalId) {
      return c.json({ error: 'Hospital ID required' }, 400);
    }

    // Get transfers where hospital is sender or receiver
    const allTransfers = await kv.getByPrefix('transfer:');
    const filteredTransfers = allTransfers.filter((t: any) => 
      t.value.fromHospital === hospitalId || t.value.toHospital === hospitalId
    );

    return c.json(filteredTransfers.map((t: any) => t.value));
  } catch (error: any) {
    console.log('Error fetching transfers:', error);
    return c.json({ error: 'Failed to fetch transfers', details: error.message }, 500);
  }
});

// Create a new transfer request
app.post('/transfers', async (c) => {
  try {
    const body = await c.req.json();
    const { fromHospital, toHospital, patientName, patientId, reason } = body;

    if (!fromHospital || !toHospital || !patientName || !patientId || !reason) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const transferId = `TRF-${Date.now()}`;
    const transfer = {
      id: transferId,
      fromHospital,
      toHospital,
      patientName,
      patientId,
      reason,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };

    await kv.set(`transfer:${transferId}`, transfer);

    return c.json(transfer, 201);
  } catch (error: any) {
    console.log('Error creating transfer:', error);
    return c.json({ error: 'Failed to create transfer', details: error.message }, 500);
  }
});

// Update transfer status
app.patch('/transfers/:id', async (c) => {
  try {
    const transferId = c.req.param('id');
    const { status } = await c.req.json();

    if (!['approved', 'rejected'].includes(status)) {
      return c.json({ error: 'Invalid status' }, 400);
    }

    const transfer = await kv.get(`transfer:${transferId}`);
    if (!transfer) {
      return c.json({ error: 'Transfer not found' }, 404);
    }

    const updatedTransfer = {
      ...transfer,
      status,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`transfer:${transferId}`, updatedTransfer);

    return c.json(updatedTransfer);
  } catch (error: any) {
    console.log('Error updating transfer:', error);
    return c.json({ error: 'Failed to update transfer', details: error.message }, 500);
  }
});

// Get all messages for a hospital
app.get('/messages', async (c) => {
  try {
    const hospitalId = c.req.query('hospitalId');
    if (!hospitalId) {
      return c.json({ error: 'Hospital ID required' }, 400);
    }

    // Get messages where hospital is sender or receiver
    const allMessages = await kv.getByPrefix('message:');
    const filteredMessages = allMessages.filter((m: any) => 
      m.value.fromHospital === hospitalId || m.value.toHospital === hospitalId
    );

    return c.json(filteredMessages.map((m: any) => m.value));
  } catch (error: any) {
    console.log('Error fetching messages:', error);
    return c.json({ error: 'Failed to fetch messages', details: error.message }, 500);
  }
});

// Send a new message
app.post('/messages', async (c) => {
  try {
    const body = await c.req.json();
    const { fromHospital, toHospital, subject, message } = body;

    if (!fromHospital || !toHospital || !subject || !message) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const messageId = `MSG-${Date.now()}`;
    const newMessage = {
      id: messageId,
      fromHospital,
      toHospital,
      subject,
      message,
      timestamp: new Date().toISOString(),
      read: false,
    };

    await kv.set(`message:${messageId}`, newMessage);

    return c.json(newMessage, 201);
  } catch (error: any) {
    console.log('Error sending message:', error);
    return c.json({ error: 'Failed to send message', details: error.message }, 500);
  }
});

export default app;
