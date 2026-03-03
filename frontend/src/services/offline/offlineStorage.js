// Offline-First Data Storage Service for Rural Clinic Operations
// Handles IndexedDB storage, sync management, and conflict resolution

class OfflineStorageService {
  constructor() {
    this.dbName = 'ClinicHealthcareDB';
    this.dbVersion = 1;
    this.db = null;
    this.syncQueue = [];
    this.isOnline = navigator.onLine;
    
    // Initialize connection monitoring
    this.initializeConnectionMonitoring();
  }

  /**
   * Initialize the IndexedDB database with required object stores
   */
  async initializeDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Patient Records Store
        if (!db.objectStoreNames.contains('patients')) {
          const patientStore = db.createObjectStore('patients', { 
            keyPath: 'localId', 
            autoIncrement: true 
          });
          patientStore.createIndex('phone', 'phone', { unique: false });
          patientStore.createIndex('name', 'name', { unique: false });
          patientStore.createIndex('village', 'village', { unique: false });
          patientStore.createIndex('serverId', 'serverId', { unique: true });
          patientStore.createIndex('lastModified', 'lastModified', { unique: false });
        }

        // Consultation Records Store
        if (!db.objectStoreNames.contains('consultations')) {
          const consultationStore = db.createObjectStore('consultations', { 
            keyPath: 'localId', 
            autoIncrement: true 
          });
          consultationStore.createIndex('patientId', 'patientId', { unique: false });
          consultationStore.createIndex('date', 'date', { unique: false });
          consultationStore.createIndex('type', 'type', { unique: false });
          consultationStore.createIndex('status', 'status', { unique: false });
          consultationStore.createIndex('serverId', 'serverId', { unique: true });
        }

        // Medicine Inventory Store
        if (!db.objectStoreNames.contains('medicines')) {
          const medicineStore = db.createObjectStore('medicines', { 
            keyPath: 'localId', 
            autoIncrement: true 
          });
          medicineStore.createIndex('name', 'name', { unique: false });
          medicineStore.createIndex('category', 'category', { unique: false });
          medicineStore.createIndex('stock', 'stock', { unique: false });
          medicineStore.createIndex('serverId', 'serverId', { unique: true });
        }

        // Sync Queue Store
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { 
            keyPath: 'localId', 
            autoIncrement: true 
          });
          syncStore.createIndex('operation', 'operation', { unique: false });
          syncStore.createIndex('priority', 'priority', { unique: false });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Clinic Configuration Store
        if (!db.objectStoreNames.contains('clinicConfig')) {
          const configStore = db.createObjectStore('clinicConfig', { 
            keyPath: 'key' 
          });
        }

        // Patient Queue Store (for daily operations)
        if (!db.objectStoreNames.contains('patientQueue')) {
          const queueStore = db.createObjectStore('patientQueue', { 
            keyPath: 'tokenNumber' 
          });
          queueStore.createIndex('date', 'date', { unique: false });
          queueStore.createIndex('status', 'status', { unique: false });
          queueStore.createIndex('priority', 'priority', { unique: false });
        }

        console.log('✅ Offline database initialized successfully');
      };
    });
  }

  /**
   * Monitor online/offline status changes
   */
  initializeConnectionMonitoring() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('🌐 Connection restored - starting sync');
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('📶 Connection lost - switching to offline mode');
    });
  }

  /**
   * Add or update a patient record
   */
  async savePatient(patientData) {
    if (!this.db) await this.initializeDatabase();

    const patient = {
      ...patientData,
      lastModified: Date.now(),
      syncStatus: this.isOnline ? 'synced' : 'pending',
      localId: patientData.localId || undefined
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['patients'], 'readwrite');
      const store = transaction.objectStore('patients');
      
      const request = store.put(patient);
      
      request.onsuccess = () => {
        const savedPatient = { ...patient, localId: request.result };
        
        // Add to sync queue if offline or if this is a new/updated record
        if (!this.isOnline || !patient.serverId) {
          this.addToSyncQueue({
            operation: patient.serverId ? 'update' : 'create',
            type: 'patient',
            data: savedPatient,
            priority: 2
          });
        }
        
        resolve(savedPatient);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all patients with optional filtering
   */
  async getPatients(filters = {}) {
    if (!this.db) await this.initializeDatabase();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['patients'], 'readonly');
      const store = transaction.objectStore('patients');
      const request = store.getAll();

      request.onsuccess = () => {
        let patients = request.result;

        // Apply filters
        if (filters.village) {
          patients = patients.filter(p => 
            p.village.toLowerCase().includes(filters.village.toLowerCase())
          );
        }
        
        if (filters.name) {
          patients = patients.filter(p => 
            p.name.toLowerCase().includes(filters.name.toLowerCase())
          );
        }

        if (filters.phone) {
          patients = patients.filter(p => p.phone.includes(filters.phone));
        }

        // Sort by last modified (most recent first)
        patients.sort((a, b) => b.lastModified - a.lastModified);
        
        resolve(patients);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Save a consultation record
   */
  async saveConsultation(consultationData) {
    if (!this.db) await this.initializeDatabase();

    const consultation = {
      ...consultationData,
      date: consultationData.date || Date.now(),
      lastModified: Date.now(),
      syncStatus: this.isOnline ? 'synced' : 'pending'
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['consultations'], 'readwrite');
      const store = transaction.objectStore('consultations');
      
      const request = store.put(consultation);
      
      request.onsuccess = () => {
        const savedConsultation = { ...consultation, localId: request.result };
        
        // High priority for consultation data
        if (!this.isOnline || !consultation.serverId) {
          this.addToSyncQueue({
            operation: consultation.serverId ? 'update' : 'create',
            type: 'consultation',
            data: savedConsultation,
            priority: 1 // High priority
          });
        }
        
        resolve(savedConsultation);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get consultations for a patient
   */
  async getPatientConsultations(patientId) {
    if (!this.db) await this.initializeDatabase();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['consultations'], 'readonly');
      const store = transaction.objectStore('consultations');
      const index = store.index('patientId');
      const request = index.getAll(patientId);

      request.onsuccess = () => {
        const consultations = request.result;
        consultations.sort((a, b) => b.date - a.date); // Most recent first
        resolve(consultations);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Manage patient queue for daily operations
   */
  async addToPatientQueue(patientData) {
    if (!this.db) await this.initializeDatabase();

    const today = new Date().toDateString();
    const existingQueue = await this.getTodayQueue();
    const tokenNumber = existingQueue.length + 1;

    const queueEntry = {
      tokenNumber,
      patientId: patientData.localId,
      patientName: patientData.name,
      serviceType: patientData.serviceType || 'consultation',
      priority: patientData.priority || 'normal',
      status: 'waiting',
      date: today,
      timestamp: Date.now()
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['patientQueue'], 'readwrite');
      const store = transaction.objectStore('patientQueue');
      
      const request = store.put(queueEntry);
      
      request.onsuccess = () => resolve(queueEntry);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get today's patient queue
   */
  async getTodayQueue() {
    if (!this.db) await this.initializeDatabase();

    const today = new Date().toDateString();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['patientQueue'], 'readonly');
      const store = transaction.objectStore('patientQueue');
      const index = store.index('date');
      const request = index.getAll(today);

      request.onsuccess = () => {
        const queue = request.result;
        queue.sort((a, b) => {
          // Sort by priority first, then by token number
          if (a.priority === 'emergency' && b.priority !== 'emergency') return -1;
          if (b.priority === 'emergency' && a.priority !== 'emergency') return 1;
          return a.tokenNumber - b.tokenNumber;
        });
        resolve(queue);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Update patient queue status
   */
  async updateQueueStatus(tokenNumber, status) {
    if (!this.db) await this.initializeDatabase();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['patientQueue'], 'readwrite');
      const store = transaction.objectStore('patientQueue');
      
      const getRequest = store.get(tokenNumber);
      
      getRequest.onsuccess = () => {
        const queueEntry = getRequest.result;
        if (queueEntry) {
          queueEntry.status = status;
          queueEntry.lastModified = Date.now();
          
          const updateRequest = store.put(queueEntry);
          updateRequest.onsuccess = () => resolve(queueEntry);
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          reject(new Error('Queue entry not found'));
        }
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  /**
   * Add operation to sync queue
   */
  async addToSyncQueue(operation) {
    if (!this.db) await this.initializeDatabase();

    const syncItem = {
      ...operation,
      timestamp: Date.now(),
      attempts: 0,
      status: 'pending'
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      
      const request = store.add(syncItem);
      
      request.onsuccess = () => {
        this.syncQueue.push({ ...syncItem, localId: request.result });
        resolve(request.result);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Process sync queue when connection is available
   */
  async processSyncQueue() {
    if (!this.isOnline || !this.db) return;

    console.log('🔄 Processing sync queue...');

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['syncQueue'], 'readonly');
      const store = transaction.objectStore('syncQueue');
      const request = store.getAll();

      request.onsuccess = async () => {
        const pendingItems = request.result.filter(item => item.status === 'pending');
        
        // Sort by priority (1 = highest priority)
        pendingItems.sort((a, b) => a.priority - b.priority);

        console.log(`📦 Found ${pendingItems.length} items to sync`);

        for (const item of pendingItems) {
          try {
            await this.syncItem(item);
            await this.removeSyncItem(item.localId);
          } catch (error) {
            console.error(`❌ Failed to sync item ${item.localId}:`, error);
            await this.updateSyncItemStatus(item.localId, 'failed', error.message);
          }
        }

        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Sync individual item with server
   */
  async syncItem(item) {
    // This would integrate with your actual API endpoints
    const API_BASE = '/api/clinic';
    
    try {
      let response;
      
      switch (item.operation) {
        case 'create':
          response = await fetch(`${API_BASE}/${item.type}s`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.data)
          });
          break;
          
        case 'update':
          response = await fetch(`${API_BASE}/${item.type}s/${item.data.serverId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.data)
          });
          break;
          
        case 'delete':
          response = await fetch(`${API_BASE}/${item.type}s/${item.data.serverId}`, {
            method: 'DELETE'
          });
          break;
      }

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();
      
      // Update local record with server ID if it's a new creation
      if (item.operation === 'create' && result.id) {
        await this.updateLocalRecordWithServerId(item.type, item.data.localId, result.id);
      }

      console.log(`✅ Successfully synced ${item.type} ${item.operation}`);
      
    } catch (error) {
      console.error(`❌ Sync failed for ${item.type} ${item.operation}:`, error);
      throw error;
    }
  }

  /**
   * Update local record with server ID after successful sync
   */
  async updateLocalRecordWithServerId(type, localId, serverId) {
    const storeName = `${type}s`; // patients, consultations, etc.
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const getRequest = store.get(localId);
      
      getRequest.onsuccess = () => {
        const record = getRequest.result;
        if (record) {
          record.serverId = serverId;
          record.syncStatus = 'synced';
          
          const updateRequest = store.put(record);
          updateRequest.onsuccess = () => resolve(record);
          updateRequest.onerror = () => reject(updateRequest.error);
        }
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  /**
   * Remove successfully synced item from sync queue
   */
  async removeSyncItem(syncId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      
      const request = store.delete(syncId);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Update sync item status (for failed syncs)
   */
  async updateSyncItemStatus(syncId, status, errorMessage = null) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      
      const getRequest = store.get(syncId);
      
      getRequest.onsuccess = () => {
        const item = getRequest.result;
        if (item) {
          item.status = status;
          item.attempts = (item.attempts || 0) + 1;
          item.lastError = errorMessage;
          item.lastAttempt = Date.now();
          
          const updateRequest = store.put(item);
          updateRequest.onsuccess = () => resolve(item);
          updateRequest.onerror = () => reject(updateRequest.error);
        }
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  /**
   * Get clinic statistics for dashboard
   */
  async getClinicStats() {
    const today = new Date().toDateString();
    const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [todayQueue, patients, consultations] = await Promise.all([
      this.getTodayQueue(),
      this.getPatients(),
      this.getAllConsultations()
    ]);

    const stats = {
      today: {
        patientsInQueue: todayQueue.length,
        consultationsCompleted: todayQueue.filter(q => q.status === 'completed').length,
        waitingPatients: todayQueue.filter(q => q.status === 'waiting').length,
        emergencyPatients: todayQueue.filter(q => q.priority === 'emergency').length
      },
      week: {
        totalPatients: consultations.filter(c => c.date >= thisWeek.getTime()).length
      },
      month: {
        totalPatients: consultations.filter(c => c.date >= thisMonth.getTime()).length
      },
      total: {
        registeredPatients: patients.length,
        totalConsultations: consultations.length
      },
      sync: {
        pendingItems: this.syncQueue.filter(item => item.status === 'pending').length,
        isOnline: this.isOnline
      }
    };

    return stats;
  }

  /**
   * Get all consultations (helper method)
   */
  async getAllConsultations() {
    if (!this.db) await this.initializeDatabase();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['consultations'], 'readonly');
      const store = transaction.objectStore('consultations');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear old data (for maintenance)
   */
  async clearOldData(daysToKeep = 90) {
    const cutoffDate = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    
    // Clear old consultations
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['consultations', 'patientQueue'], 'readwrite');
      
      // Clear old consultations
      const consultationStore = transaction.objectStore('consultations');
      const consultationIndex = consultationStore.index('date');
      const consultationRequest = consultationIndex.openCursor(IDBKeyRange.upperBound(cutoffDate));
      
      consultationRequest.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };

      // Clear old queue entries
      const queueStore = transaction.objectStore('patientQueue');
      const queueRequest = queueStore.openCursor();
      
      queueRequest.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const entry = cursor.value;
          const entryDate = new Date(entry.date).getTime();
          if (entryDate < cutoffDate) {
            cursor.delete();
          }
          cursor.continue();
        }
      };

      transaction.oncomplete = () => {
        console.log(`🧹 Cleaned up data older than ${daysToKeep} days`);
        resolve();
      };
      
      transaction.onerror = () => reject(transaction.error);
    });
  }

  /**
   * Export data for backup or migration
   */
  async exportData() {
    const [patients, consultations, medicines] = await Promise.all([
      this.getPatients(),
      this.getAllConsultations(),
      this.getAllMedicines()
    ]);

    return {
      patients,
      consultations,
      medicines,
      exportDate: new Date().toISOString(),
      version: this.dbVersion
    };
  }

  /**
   * Get all medicines (placeholder - implement based on your medicine management needs)
   */
  async getAllMedicines() {
    if (!this.db) await this.initializeDatabase();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['medicines'], 'readonly');
      const store = transaction.objectStore('medicines');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

// Export singleton instance
const offlineStorage = new OfflineStorageService();

export default offlineStorage;