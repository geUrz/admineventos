export const initializeOneSignal = () => {
  window.OneSignal = window.OneSignal || [];
  OneSignal.push(function() {
    OneSignal.init({
      appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
    });

    OneSignal.push(() => {
      OneSignal.registerForPushNotifications(); // Registra al usuario para notificaciones

      OneSignal.getUserId().then((playerId) => {
        if (!playerId) {
          console.error('Player ID no disponible. Asegúrate de que el usuario haya aceptado las notificaciones.');
          return;
        }

        const userId = getCookie('userId'); // Asegúrate de que 'userId' esté en las cookies
        if (userId) {
          fetch('/api/savePlayerId', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ playerId, userId }),
          })
          .then(response => response.json())
          .then(data => {
            console.log(data.message);
          })
          .catch(error => {
            console.error('Error al enviar Player ID:', error);
          });
        } else {
          console.error('User ID no disponible en las cookies');
        }
      });
    });
  });
};

// Función para obtener cookies
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};
