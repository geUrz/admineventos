export const initializeOneSignal = () => {
  window.OneSignal = window.OneSignal || [];

  OneSignal.push(function() {
    OneSignal.init({
      appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
    });

    // Solicitar permiso para notificaciones
    OneSignal.push(() => {
      OneSignal.registerForPushNotifications().then(() => {
        getPlayerIdWithRetry().then((playerId) => {
          console.log('Player ID:', playerId);
          const userId = getCookie('userId');
          console.log('User ID:', userId);

          // Obtén el nombre y el usuario del contexto o de las cookies
          const userName = getCookie('userName');
          console.log('UserName:', userName);
          const userUsername = getCookie('userUsername');
          console.log('Usuario:', userUsername);

          if (userId) {
            // Enviar Player ID al backend para agregarlo al usuario
            fetch('/api/savePlayerId', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ playerId, userId, userName, userUsername }),
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
        }).catch((error) => {
          console.error(error);
        });
      }).catch(error => {
        console.error('Error al registrar para notificaciones:', error);
      });
    });

    // Capturar cuando un usuario se suscribe
    OneSignal.on('subscriptionChange', function(isSubscribed) {
      if (isSubscribed) {
        getPlayerIdWithRetry().then((playerId) => {
          const userId = getCookie('userId');
          const userName = getCookie('userName');
          const userUsername = getCookie('userUsername');

          if (userId) {
            // Enviar Player ID al backend si cambia la suscripción
            fetch('/api/notificaciones/sendSubscriptionEmail', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ playerId, userId, userName, userUsername }),
            })
            .then(response => response.json())
            .then(data => {
              console.log('Correo de suscripción enviado:', data.message);
            })
            .catch(error => {
              console.error('Error al enviar correo de suscripción:', error);
            });
          } else {
            console.error('User ID no disponible en las cookies');
          }
        }).catch((error) => {
          console.error(error);
        });
      }
    });
  });
};

// Función para obtener el Player ID con reintentos
const getPlayerIdWithRetry = async (retries = 10, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    const playerId = await window.OneSignal.getUserId();
    if (playerId) {
      return playerId; // Si obtienes el playerId, retorna
    }
    await new Promise(res => setTimeout(res, delay)); // Espera antes de reintentar
  }
  throw new Error('Player ID no disponible después de varios intentos');
};

// Función para obtener cookies
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};
