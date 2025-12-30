// js/modules/whatsapp-share.js
class WhatsAppSharingManager {
  constructor() {
    this.whatsappGroupUrl = 'https://chat.whatsapp.com/C7NM0X8RfTN0a1wRjN22WS';
    console.log('📱 WhatsAppSharingManager initialisé');
  }

  // Ouvrir le groupe WhatsApp
  openWhatsAppGroup() {
    window.open(this.whatsappGroupUrl, '_blank');
    return { success: true };
  }

  // Créer un bouton de partage simple
  createShareButton(options = {}) {
    const button = document.createElement('button');
    
    button.className = 'whatsapp-group-btn';
    button.innerHTML = `
      <span class="whatsapp-icon">📸</span>
      <span class="btn-text">Partager la photo sur le groupe</span>
    `;
    
    button.addEventListener('click', (e) => {
      e.preventDefault();
      this.openWhatsAppGroup();
    });
    
    // Style inline minimal
    button.style.cssText = `
      background-color: #25D366;
      color: white;
      border: none;
      border-radius: 50px;
      padding: 12px 24px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px rgba(37, 211, 102, 0.3);
      margin: 10px 0;
    `;
    
    // Hover effect
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 6px 8px rgba(37, 211, 102, 0.4)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 4px 6px rgba(37, 211, 102, 0.3)';
    });
    
    return button;
  }

  // Ajouter un bouton à un conteneur existant
  addButtonToContainer(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Conteneur #${containerId} non trouvé`);
      return null;
    }
    
    const button = this.createShareButton(options);
    container.appendChild(button);
    return button;
  }
}

// Exporter simplement
if (typeof window !== 'undefined') {
  window.WhatsAppSharingManager = WhatsAppSharingManager;
  window.RosasWhatsApp = new WhatsAppSharingManager();
}