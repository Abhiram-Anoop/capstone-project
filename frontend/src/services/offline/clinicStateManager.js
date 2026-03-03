// Clinic State Manager - Manages real-time clinic operations and state
// Handles patient queue, staff workflow, and real-time updates

// Simple EventEmitter implementation for browser
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(...args));
    }
  }

  removeAllListeners() {
    this.events = {};
  }
}

import offlineStorage from './offlineStorage.js';

class ClinicStateManager extends EventEmitter {
  constructor() {
    super();
    this.currentQueue = [];
    this.activeConsultations = new Map();
    this.clinicConfig = {};
    this.staffSession = null;
    this.dailyStats = {};
    
    // Initialize on creation
    this.initialize();
  }

  /**
   * Initialize clinic state manager
   */
  async initialize() {
    try {
      await offlineStorage.initializeDatabase();
      await this.loadTodayQueue();
      await this.loadClinicConfig();
      this.startDailyReset();
      
      console.log('✅ Clinic State Manager initialized');
      this.emit('initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Clinic State Manager:', error);
      this.emit('error', error);
    }
  }

  /**
   * Load today's patient queue
   */
  async loadTodayQueue() {
    try {
      this.currentQueue = await offlineStorage.getTodayQueue();
      this.emit('queueUpdated', this.currentQueue);
      this.updateDailyStats();
    } catch (error) {
      console.error('❌ Failed to load today queue:', error);
    }
  }

  /**
   * Load clinic configuration
   */
  async loadClinicConfig() {
    // Default clinic configuration
    this.clinicConfig = {
      clinicName: 'Government Rural Health Center',
      clinicId: 'GRHC_001',
      operatingHours: {
        start: '09:00',
        end: '17:00',
        lunchBreak: { start: '13:00', end: '14:00' }
      },
      services: [
        'General Consultation',
        'Video Consultation',
        'Vaccination',
        'Health Checkup',
        'Medicine Distribution',
        'Emergency Care'
      ],
      languages: ['hi', 'pa', 'en'],
      maxDailyPatients: 100,
      emergencySlots: 10
    };

    // Try to load from offline storage
    // Implementation would load saved config from IndexedDB
    this.emit('configLoaded', this.clinicConfig);
  }

  /**
   * Add patient to queue
   */
  async addPatientToQueue(patientData, serviceType = 'consultation', priority = 'normal') {
    try {
      // Validate operating hours
      if (!this.isWithinOperatingHours()) {
        throw new Error('Clinic is currently closed');
      }

      // Check if queue is full (except for emergencies)
      if (priority !== 'emergency' && this.currentQueue.length >= this.clinicConfig.maxDailyPatients) {
        throw new Error('Daily patient limit reached');
      }

      // Add to offline storage
      const queueEntry = await offlineStorage.addToPatientQueue({
        ...patientData,
        serviceType,
        priority
      });

      // Update current queue
      this.currentQueue.push(queueEntry);
      this.currentQueue.sort(this.sortQueueByPriority);

      // Update stats
      this.updateDailyStats();

      // Emit events
      this.emit('patientAdded', queueEntry);
      this.emit('queueUpdated', this.currentQueue);

      // Voice announcement for staff
      this.announceNewPatient(queueEntry);

      return queueEntry;
    } catch (error) {
      console.error('❌ Failed to add patient to queue:', error);
      throw error;
    }
  }

  /**
   * Update patient status in queue
   */
  async updatePatientStatus(tokenNumber, status, additionalData = {}) {
    try {
      // Update in offline storage
      await offlineStorage.updateQueueStatus(tokenNumber, status);

      // Update current queue
      const patientIndex = this.currentQueue.findIndex(p => p.tokenNumber === tokenNumber);
      if (patientIndex !== -1) {
        this.currentQueue[patientIndex] = {
          ...this.currentQueue[patientIndex],
          status,
          ...additionalData,
          lastModified: Date.now()
        };

        // If consultation is starting, add to active consultations
        if (status === 'in-consultation') {
          this.activeConsultations.set(tokenNumber, {
            ...this.currentQueue[patientIndex],
            startTime: Date.now()
          });
        }

        // If consultation is completed, remove from active consultations
        if (status === 'completed' || status === 'no-show') {
          this.activeConsultations.delete(tokenNumber);
        }

        this.updateDailyStats();
        this.emit('patientStatusUpdated', this.currentQueue[patientIndex]);
        this.emit('queueUpdated', this.currentQueue);
      }

      return this.currentQueue[patientIndex];
    } catch (error) {
      console.error('❌ Failed to update patient status:', error);
      throw error;
    }
  }

  /**
   * Get current queue with filtering options
   */
  getCurrentQueue(filters = {}) {
    let queue = [...this.currentQueue];

    if (filters.status) {
      queue = queue.filter(p => p.status === filters.status);
    }

    if (filters.priority) {
      queue = queue.filter(p => p.priority === filters.priority);
    }

    if (filters.serviceType) {
      queue = queue.filter(p => p.serviceType === filters.serviceType);
    }

    return queue;
  }

  /**
   * Get next patient to be served
   */
  getNextPatient() {
    const waitingPatients = this.currentQueue.filter(p => p.status === 'waiting');
    return waitingPatients.length > 0 ? waitingPatients[0] : null;
  }

  /**
   * Start consultation for a patient
   */
  async startConsultation(tokenNumber, doctorInfo = null) {
    try {
      const consultationData = {
        startTime: Date.now(),
        doctorInfo,
        type: 'in-person'
      };

      await this.updatePatientStatus(tokenNumber, 'in-consultation', consultationData);
      
      // Start consultation timer
      this.startConsultationTimer(tokenNumber);

      return consultationData;
    } catch (error) {
      console.error('❌ Failed to start consultation:', error);
      throw error;
    }
  }

  /**
   * Complete consultation for a patient
   */
  async completeConsultation(tokenNumber, consultationResults = {}) {
    try {
      const patient = this.currentQueue.find(p => p.tokenNumber === tokenNumber);
      if (!patient) {
        throw new Error('Patient not found in queue');
      }

      // Save consultation record
      const consultationRecord = {
        patientId: patient.patientId,
        tokenNumber,
        date: Date.now(),
        type: patient.serviceType,
        duration: patient.startTime ? Date.now() - patient.startTime : null,
        results: consultationResults,
        status: 'completed'
      };

      await offlineStorage.saveConsultation(consultationRecord);

      // Update patient status
      await this.updatePatientStatus(tokenNumber, 'completed', {
        consultationId: consultationRecord.localId,
        completedAt: Date.now()
      });

      this.emit('consultationCompleted', {
        patient,
        consultation: consultationRecord
      });

      return consultationRecord;
    } catch (error) {
      console.error('❌ Failed to complete consultation:', error);
      throw error;
    }
  }

  /**
   * Handle emergency patient
   */
  async handleEmergencyPatient(patientData) {
    try {
      // Emergency patients get highest priority
      const emergencyEntry = await this.addPatientToQueue(
        patientData, 
        'emergency', 
        'emergency'
      );

      // Immediate notification to staff
      this.emit('emergencyPatient', emergencyEntry);
      
      // Audio alert
      this.playEmergencyAlert();

      return emergencyEntry;
    } catch (error) {
      console.error('❌ Failed to handle emergency patient:', error);
      throw error;
    }
  }

  /**
   * Get real-time clinic statistics
   */
  getDailyStats() {
    const stats = {
      totalPatients: this.currentQueue.length,
      waiting: this.currentQueue.filter(p => p.status === 'waiting').length,
      inConsultation: this.currentQueue.filter(p => p.status === 'in-consultation').length,
      completed: this.currentQueue.filter(p => p.status === 'completed').length,
      noShow: this.currentQueue.filter(p => p.status === 'no-show').length,
      emergency: this.currentQueue.filter(p => p.priority === 'emergency').length,
      averageWaitTime: this.calculateAverageWaitTime(),
      activeConsultations: this.activeConsultations.size,
      nextPatient: this.getNextPatient()
    };

    return stats;
  }

  /**
   * Sort queue by priority and token number
   */
  sortQueueByPriority(a, b) {
    // Emergency patients first
    if (a.priority === 'emergency' && b.priority !== 'emergency') return -1;
    if (b.priority === 'emergency' && a.priority !== 'emergency') return 1;
    
    // Then by token number
    return a.tokenNumber - b.tokenNumber;
  }

  /**
   * Check if clinic is within operating hours
   */
  isWithinOperatingHours() {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    const startTime = parseInt(this.clinicConfig.operatingHours.start.replace(':', ''));
    const endTime = parseInt(this.clinicConfig.operatingHours.end.replace(':', ''));
    const lunchStart = parseInt(this.clinicConfig.operatingHours.lunchBreak.start.replace(':', ''));
    const lunchEnd = parseInt(this.clinicConfig.operatingHours.lunchBreak.end.replace(':', ''));

    // Check if within operating hours but not during lunch break
    return (currentTime >= startTime && currentTime <= endTime) &&
           !(currentTime >= lunchStart && currentTime <= lunchEnd);
  }

  /**
   * Calculate average wait time
   */
  calculateAverageWaitTime() {
    const completedToday = this.currentQueue.filter(p => 
      p.status === 'completed' && p.completedAt
    );

    if (completedToday.length === 0) return 0;

    const totalWaitTime = completedToday.reduce((sum, patient) => {
      const waitTime = patient.startTime ? patient.startTime - patient.timestamp : 0;
      return sum + waitTime;
    }, 0);

    return Math.round(totalWaitTime / completedToday.length / 1000 / 60); // in minutes
  }

  /**
   * Start consultation timer
   */
  startConsultationTimer(tokenNumber) {
    const checkInterval = setInterval(() => {
      const consultation = this.activeConsultations.get(tokenNumber);
      if (!consultation) {
        clearInterval(checkInterval);
        return;
      }

      const duration = Date.now() - consultation.startTime;
      const durationMinutes = Math.floor(duration / 1000 / 60);

      // Emit timer update every minute
      this.emit('consultationTimer', {
        tokenNumber,
        duration: durationMinutes
      });

      // Alert if consultation is taking too long (>30 minutes)
      if (durationMinutes > 30 && durationMinutes % 10 === 0) {
        this.emit('longConsultationAlert', {
          tokenNumber,
          duration: durationMinutes,
          patient: consultation
        });
      }
    }, 60000); // Check every minute
  }

  /**
   * Update daily statistics
   */
  updateDailyStats() {
    this.dailyStats = this.getDailyStats();
  }

  /**
   * Voice announcement for new patient (if available)
   */
  announceNewPatient(patient) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `Token number ${patient.tokenNumber}, ${patient.patientName} for ${patient.serviceType}`
      );
      utterance.lang = 'hi-IN'; // Hindi announcement
      speechSynthesis.speak(utterance);
    }
  }

  /**
   * Play emergency alert sound
   */
  playEmergencyAlert() {
    // Create audio context for emergency sound
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  }

  /**
   * Reset daily operations (runs at midnight)
   */
  startDailyReset() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    setTimeout(() => {
      this.resetDailyOperations();
      
      // Set up daily reset for every 24 hours
      setInterval(() => {
        this.resetDailyOperations();
      }, 24 * 60 * 60 * 1000);
      
    }, msUntilMidnight);
  }

  /**
   * Reset operations for new day
   */
  async resetDailyOperations() {
    console.log('🌅 Starting new day - resetting clinic operations');
    
    // Clear current queue
    this.currentQueue = [];
    this.activeConsultations.clear();
    
    // Archive yesterday's data
    await this.archiveYesterdayData();
    
    // Reset stats
    this.dailyStats = {};
    
    // Emit new day event
    this.emit('newDay', new Date().toDateString());
    
    console.log('✅ Daily reset completed');
  }

  /**
   * Archive previous day's data
   */
  async archiveYesterdayData() {
    // Implementation would move yesterday's queue to archive
    // This helps keep the current day's operations fast
    console.log('📁 Archiving yesterday\'s data');
  }

  /**
   * Get clinic operating status
   */
  getOperatingStatus() {
    const isOpen = this.isWithinOperatingHours();
    const status = {
      isOpen,
      currentTime: new Date().toLocaleTimeString('en-IN'),
      operatingHours: this.clinicConfig.operatingHours,
      message: isOpen ? 'Clinic is Open' : 'Clinic is Closed'
    };

    return status;
  }

  /**
   * Export daily report
   */
  async exportDailyReport() {
    const today = new Date().toDateString();
    const stats = this.getDailyStats();
    
    const report = {
      date: today,
      clinicInfo: {
        name: this.clinicConfig.clinicName,
        id: this.clinicConfig.clinicId
      },
      statistics: stats,
      patientDetails: this.currentQueue,
      operatingHours: this.clinicConfig.operatingHours,
      generatedAt: new Date().toISOString()
    };

    return report;
  }
}

// Export singleton instance
const clinicStateManager = new ClinicStateManager();

export default clinicStateManager;