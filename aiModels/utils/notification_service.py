import time

class NotificationService:
    """
    Service for sending notifications to users and engineers.
    """

    def __init__(self, notification_mode="email"):
        """
        Initialise the notification service.

        Parameters:
            notification_mode (str): Mode of notification ("email", "sms", "websocket").
        """
        self.notification_mode = notification_mode

    def send(self, alert):
        """
        Send a notification based on the selected mode.

        Parameters:
            alert (dict): Alert details to be sent.

        Raises:
            NotImplementedError: If the notification mode is unsupported.
        """
        try:
            if self.notification_mode == "email":
                self._send_email(alert)
            elif self.notification_mode == "sms":
                self._send_sms(alert)
            elif self.notification_mode == "websocket":
                self._send_websocket(alert)
            else:
                raise NotImplementedError(f"Notification mode {self.notification_mode} not supported.")
        except Exception as e:
            print(f"Error sending notification: {e}")

    def _send_email(self, alert):
        """
        Send an email notification.

        Parameters:
            alert (dict): Alert details.
        """
        print(f"Sending email: {alert['message']} to admin@example.com")

    def _send_sms(self, alert):
        """
        Send an SMS notification.

        Parameters:
            alert (dict): Alert details.
        """
        print(f"Sending SMS: {alert['message']} to +1234567890")

    def _send_websocket(self, alert):
        """
        Send a WebSocket notification.

        Parameters:
            alert (dict): Alert details.
        """
        print(f"Sending WebSocket notification: {alert['message']}")

    def retry_notification(self, alert, retries=3, delay=2):
        """
        Retry sending a notification in case of failure.

        Parameters:
            alert (dict): Alert details.
            retries (int): Number of retry attempts (default: 3).
            delay (int): Delay between retries in seconds (default: 2).
        """
        for attempt in range(retries):
            try:
                self.send(alert)
                print(f"Notification sent successfully on attempt {attempt + 1}")
                return
            except Exception as e:
                print(f"Retry {attempt + 1} failed: {e}")
                time.sleep(delay)
        print("Failed to send notification after retries.")
