import React, { useEffect } from 'react';

const CommentTelegram = ({ discussionLink }: { discussionLink: string }) => {
  useEffect(() => {
    if (!discussionLink) return;

    const existingScript = document.getElementById('telegram-comment-script');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.id = 'telegram-comment-script';
    script.setAttribute('data-telegram-discussion', `${discussionLink}`);
    script.setAttribute('data-comments-limit', '5');

    const container = document.getElementById('telegram-comment-container');
    if (container) {
      container.appendChild(script);
    } else {
      console.error('Container element not found');
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [discussionLink]);

  return (
    <div>
      <div id="telegram-comment-container"></div>
    </div>
  );
};

export default CommentTelegram;
