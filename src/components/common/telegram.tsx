import { useEffect } from 'react';

export interface TelegramLoginButtonProps {
  botName: string;
  onAuth: (user: any) => void;
}

declare global {
  interface Window {
    onTelegramAuth: (user: any) => void;
  }
}

const TelegramLoginButton = ({ botName, onAuth }: TelegramLoginButtonProps) => {
  useEffect(() => {
    const existingScript = document.getElementById('telegram-login-script');
    if (existingScript) {
      existingScript.remove();
    }
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.id = 'telegram-login-script';
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', 'medium');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    const container = document.getElementById('telegram-login-container');
    if (container) {
      container.appendChild(script);
    } else {
      console.error('Container element not found');
    }
    window.onTelegramAuth = (user: any) => {
      // alert(
      //     ` Logged in as ${user.first_name} ${user.last_name} (${user.id}${user.username ? ', @' + user.username : ''})`
      // );
      onAuth(user);
    };
  }, [onAuth, botName]);

  return (
    <div>
      <div id="telegram-login-container"></div>
    </div>
  );
};

export default TelegramLoginButton;
