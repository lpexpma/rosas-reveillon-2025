// js/photo-manager.js
class PhotoManager {
  constructor() {
    this.whatsappGroupLink = "https://chat.whatsapp.com/C7NM0X8RfTN0a1wRjN22WS";
  }

  // Ouvrir WhatsApp avec un message prédéfini
  shareToWhatsApp(photoData) {
    const message = `Voici ma photo pour le défi Rosas !\nMission : ${photoData.mission}\nDe : ${photoData.playerName}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  // Ouvrir le groupe WhatsApp
  openWhatsAppGroup() {
    window.open(this.whatsappGroupLink, '_blank');
  }

  // Capturer une photo depuis la caméra
  captureFromCamera() {
    return new Promise((resolve, reject) => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        reject("L'appareil photo n'est pas disponible");
        return;
      }

      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          const video = document.createElement('video');
          video.srcObject = stream;
          video.play();

          video.onloadedmetadata = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            stream.getTracks().forEach(track => track.stop());

            const dataUrl = canvas.toDataURL('image/jpeg');
            resolve(dataUrl);
          };
        })
        .catch(reject);
    });
  }
}

window.RosasPhotoManager = new PhotoManager();