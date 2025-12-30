// js/modules/sobriety-gauge.js
class SobrietyGauge {
  constructor(config = {}) {
    this.config = {
      containerId: config.containerId || 'sobriety-gauge',
      minValue: 0,
      maxValue: 10,
      initialValue: config.initialValue || 5,
      dangerThreshold: 3,
      warningThreshold: 6,
      colors: {
        safe: '#4CAF50',
        warning: '#FF9800',
        danger: '#F44336',
        background: '#e0e0e0'
      },
      ...config
    };
    
    this.currentValue = this.config.initialValue;
    this.container = null;
    this.gaugeElement = null;
    this.labelElement = null;
    
    this.init();
  }
  
  init() {
    this.container = document.getElementById(this.config.containerId);
    if (!this.container) {
      console.error(`Container #${this.config.containerId} non trouvé`);
      return;
    }
    
    this.render();
    this.updateDisplay();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="sobriety-gauge-container">
        <div class="gauge-header">
          <span class="gauge-title">🫗 Niveau de sobriété</span>
          <span class="gauge-value">${this.currentValue}/${this.config.maxValue}</span>
        </div>
        <div class="gauge-track">
          <div class="gauge-fill" id="gauge-fill"></div>
          <div class="gauge-markers">
            <span class="marker safe">Sobre</span>
            <span class="marker warning">Éméché</span>
            <span class="marker danger">Bourré</span>
          </div>
        </div>
        <div class="gauge-status" id="gauge-status">État : Normal</div>
        <div class="gauge-controls">
          <button class="btn btn-minus" title="Diminuer">-</button>
          <button class="btn btn-plus" title="Augmenter">+</button>
          <button class="btn btn-reset" title="Réinitialiser">🔄</button>
        </div>
      </div>
    `;
    
    this.gaugeElement = document.getElementById('gauge-fill');
    this.statusElement = document.getElementById('gauge-status');
    
    // Événements
    this.container.querySelector('.btn-minus').addEventListener('click', () => this.decrease(1));
    this.container.querySelector('.btn-plus').addEventListener('click', () => this.increase(1));
    this.container.querySelector('.btn-reset').addEventListener('click', () => this.reset());
  }
  
  updateDisplay() {
    const percentage = (this.currentValue / this.config.maxValue) * 100;
    
    // Mettre à jour la jauge
    if (this.gaugeElement) {
      this.gaugeElement.style.width = `${percentage}%`;
      
      // Changer la couleur selon le niveau
      let color = this.config.colors.safe;
      let status = '😊 Sobre';
      
      if (this.currentValue >= this.config.dangerThreshold) {
        color = this.config.colors.danger;
        status = '🤪 Bourré';
      } else if (this.currentValue >= this.config.warningThreshold) {
        color = this.config.colors.warning;
        status = '😎 Éméché';
      }
      
      this.gaugeElement.style.backgroundColor = color;
      
      // Mettre à jour le statut
      if (this.statusElement) {
        this.statusElement.textContent = `État : ${status}`;
        this.statusElement.style.color = color;
      }
    }
    
    // Mettre à jour la valeur
    const valueElement = this.container.querySelector('.gauge-value');
    if (valueElement) {
      valueElement.textContent = `${this.currentValue}/${this.config.maxValue}`;
    }
    
    // Émettre un événement
    this.emitChange();
  }
  
  increase(amount = 1) {
    const newValue = Math.min(this.currentValue + amount, this.config.maxValue);
    if (newValue !== this.currentValue) {
      this.currentValue = newValue;
      this.updateDisplay();
      
      // Animation
      this.pulseEffect();
    }
  }
  
  decrease(amount = 1) {
    const newValue = Math.max(this.currentValue - amount, this.config.minValue);
    if (newValue !== this.currentValue) {
      this.currentValue = newValue;
      this.updateDisplay();
    }
  }
  
  reset() {
    this.currentValue = this.config.initialValue;
    this.updateDisplay();
    
    // Animation de reset
    if (this.gaugeElement) {
      this.gaugeElement.style.transition = 'width 0.5s ease';
      setTimeout(() => {
        if (this.gaugeElement) {
          this.gaugeElement.style.transition = '';
        }
      }, 500);
    }
  }
  
  pulseEffect() {
    if (this.gaugeElement) {
      this.gaugeElement.classList.add('pulse');
      setTimeout(() => {
        this.gaugeElement.classList.remove('pulse');
      }, 300);
    }
  }
  
  getValue() {
    return this.currentValue;
  }
  
  setValue(newValue) {
    this.currentValue = Math.max(
      this.config.minValue, 
      Math.min(newValue, this.config.maxValue)
    );
    this.updateDisplay();
  }
  
  getStatus() {
    if (this.currentValue >= this.config.dangerThreshold) {
      return 'danger';
    } else if (this.currentValue >= this.config.warningThreshold) {
      return 'warning';
    }
    return 'safe';
  }
  
  emitChange() {
    const event = new CustomEvent('sobrietyChange', {
      detail: {
        value: this.currentValue,
        status: this.getStatus(),
        percentage: (this.currentValue / this.config.maxValue) * 100
      }
    });
    this.container.dispatchEvent(event);
  }
  
  destroy() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

// CSS nécessaire (à ajouter dans style.css)
const gaugeCSS = `
.sobriety-gauge-container {
  background: white;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin: 15px 0;
  max-width: 400px;
}

.gauge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.gauge-title {
  font-weight: bold;
  color: #333;
}

.gauge-value {
  font-weight: bold;
  font-size: 1.2em;
  color: #2196F3;
}

.gauge-track {
  background: #e0e0e0;
  height: 20px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  margin: 10px 0;
}

.gauge-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.gauge-markers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
  font-size: 0.8em;
  color: #666;
}

.gauge-status {
  text-align: center;
  font-weight: bold;
  margin: 10px 0;
  transition: color 0.3s ease;
}

.gauge-controls {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.gauge-controls .btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.btn-minus {
  background: #F44336;
  color: white;
}

.btn-plus {
  background: #4CAF50;
  color: white;
}

.btn-reset {
  background: #2196F3;
  color: white;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.pulse {
  animation: pulse 0.3s ease;
}
`;

// Injecter le CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = gaugeCSS;
  document.head.appendChild(style);
}

// Exporter
if (typeof window !== 'undefined') {
  window.SobrietyGauge = SobrietyGauge;
}

export default SobrietyGauge;