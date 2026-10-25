/**
 * CareerPath Browser Web Push Notification Engine (Phase 1)
 * Uses native Web Notifications API for deadline alerts & weekly milestone reminders.
 * No third-party email service or external server required.
 */

import { Icons } from './icons.js';

export const NotificationService = {
  isSupported() {
    return 'Notification' in window;
  },

  getPermission() {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission; // 'default', 'granted', 'denied'
  },

  async requestPermission() {
    if (!this.isSupported()) {
      alert('Browser notifications are not supported in your current browser.');
      return 'unsupported';
    }

    try {
      const permission = await Notification.requestPermission();
      window.dispatchEvent(new CustomEvent('careerpath:notificationPermissionChanged', { detail: permission }));
      return permission;
    } catch (e) {
      console.error('Error requesting notification permission:', e);
      return 'denied';
    }
  },

  sendNotification(title, body, url = 'scholarships.html') {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      console.warn('Notifications not granted or supported.');
      return false;
    }

    try {
      const notif = new Notification(title, {
        body,
        icon: 'images/hero-illustration.svg',
        tag: 'careerpath-deadline-alert'
      });

      notif.onclick = () => {
        window.focus();
        if (url) window.location.href = url;
      };

      return true;
    } catch (e) {
      console.error('Failed to trigger notification:', e);
      return false;
    }
  },

  triggerTestNotification() {
    if (Notification.permission === 'granted') {
      this.sendNotification(
        '🔔 CareerConnect Deadline Reminder',
        'MahaDBT & AICTE Pragati verification window is active! Check your document checklist.',
        'scholarships.html'
      );
      return true;
    } else {
      this.requestPermission().then(perm => {
        if (perm === 'granted') {
          this.sendNotification(
            '🔔 CareerConnect Deadline Reminder',
            'Browser notifications enabled! You will receive upcoming scholarship and roadmap reminders.',
            'dashboard.html'
          );
        }
      });
      return false;
    }
  }
};
