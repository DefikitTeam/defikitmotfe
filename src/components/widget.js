window.AIChatWidget = {
    config: {},
    previousWelcomeMessage: null, // Track the previous welcome message
    init: function (config) {
        // Validate required config parameters
        if (!config.widgetUrl) {
            console.error('Widget URL is required');
            return;
        }

        // Store the previous welcome message if we have one
        if (this.config.welcomeMessage) {
            this.previousWelcomeMessage = this.config.welcomeMessage;
        }

        // Normalize the widget URL (remove trailing slash if present)
        config.widgetUrl = config.widgetUrl.replace(/\/$/, '');
        this.config = config;

        // Generate or use provided roomId, now agent-specific
        this.config.roomId = config.roomId || this.generateRoomId(config.agentId);

        // Store roomId in localStorage for persistence with agent-specific key
        localStorage.setItem(`ai-chat-widget-roomId-${config.agentId}`, this.config.roomId);

        // Check if this is a new conversation and set the flag
        this.config.isNewConversation = this.isNewConversation();

        // Check if welcome message has changed and update if needed
        this.updateWelcomeMessageIfChanged();

        // Verify the logo URL is accessible
        const logoUrl = `${this.config.widgetUrl}/logo.png`;
        this.verifyImageUrl(logoUrl).then(isValid => {
            if (!isValid) {
                console.warn(`Logo not found at ${logoUrl}, using fallback icon`);
            }
        });

        // Store auth token in localStorage for persistence
        if (config.authToken) {
            localStorage.setItem('ai-chat-widget-token', config.authToken);
        }

        // Create container and set theme and position
        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'ai-chat-widget-container';
        widgetContainer.setAttribute('data-theme', config.theme || 'light');
        widgetContainer.setAttribute('data-position', config.position || 'bottom-right'); // Add position attribute

        // Load styles
        if (!document.querySelector('link[href$="/styling.css"]')) {
            const styleLink = document.createElement('link');
            styleLink.rel = 'stylesheet';
            styleLink.href = `${this.config.widgetUrl}/styling.css`;
            document.head.appendChild(styleLink);

            // Initialize external triggers after styles are loaded
            styleLink.onload = () => initializeExternalTriggers();
        } else {
            initializeExternalTriggers();
        }

        this.renderWidget(widgetContainer);
    },

    // Save a message to localStorage history (now agent-specific)
    saveMessageToHistory: function (message, isUser) {
        const messageObj = {
            text: message,
            isUser,
            timestamp: new Date().toISOString()
        };

        // Load current messages from agent-specific storage
        const messages = this.loadMessageHistory();

        // Add new message
        messages.push(messageObj);

        // Limit to last 50 messages to prevent localStorage overflow
        const limitedMessages = messages.slice(-50);

        // Store back in localStorage with agent-specific key
        localStorage.setItem(`ai-chat-widget-messages-${this.config.agentId}-${this.config.roomId}`, JSON.stringify(limitedMessages));

        return limitedMessages;
    },

    // Load message history from localStorage (now agent-specific)
    loadMessageHistory: function () {
        const savedMessages = localStorage.getItem(`ai-chat-widget-messages-${this.config.agentId}-${this.config.roomId}`);
        return savedMessages ? JSON.parse(savedMessages) : [];
    },

    // Render message history to chat container
    renderMessageHistory: function (messagesContainer) {
        const messages = this.loadMessageHistory();

        if (messages.length === 0) return;

        // Clear existing messages
        messagesContainer.innerHTML = '';

        // Render each message
        messages.forEach(msg => {
            if (msg.isUser) {
                messagesContainer.innerHTML += `
          <div class="flex justify-end">
            <div class="max-w-[80%]">
              <div class="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-tr-sm">
                ${this.escapeHTML(msg.text)}
              </div>
            </div>
          </div>
        `;
            } else {
                // Create a properly structured message bubble
                const renderedHTML = this.renderMarkdown(msg.text);
                messagesContainer.innerHTML += `
          <div class="flex justify-start">
            <div class="max-w-[80%]">
              <div class="bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white px-4 py-2 rounded-2xl rounded-tl-sm markdown-content">
                ${renderedHTML}
              </div>
            </div>
          </div>
        `;
            }
        });

        // Process any markdown content to ensure styles are applied
        const markdownContents = messagesContainer.querySelectorAll('.markdown-content');
        markdownContents.forEach(content => {
            // Ensure paragraph spacing is correct
            const paragraphs = content.querySelectorAll('p');
            paragraphs.forEach(p => {
                p.style.marginBottom = '0.75em';
                p.style.marginTop = '0';
            });

            // If there's a last paragraph, remove its bottom margin
            if (paragraphs.length > 0) {
                paragraphs[paragraphs.length - 1].style.marginBottom = '0';
            }

            // Fix code block styling
            const codeBlocks = content.querySelectorAll('pre code');
            codeBlocks.forEach(block => {
                block.style.display = 'block';
                block.style.overflowX = 'auto';
                block.style.padding = '0.5em';
                block.style.backgroundColor = 'rgba(0,0,0,0.05)';
                block.style.borderRadius = '3px';
                block.style.fontFamily = 'monospace';
            });
        });

        // Scroll to bottom
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 10);
    },

    // Add new method to check if welcome message changed and update it
    updateWelcomeMessageIfChanged: function () {
        // Skip if there's no previous welcome message (first initialization)
        if (!this.previousWelcomeMessage && !this.config.welcomeMessage) {
            return;
        }

        // If welcome message changed or was newly added
        if (this.previousWelcomeMessage !== this.config.welcomeMessage) {
            const messages = this.loadMessageHistory();

            // Only update if there are messages and the first one is from the agent
            if (messages.length > 0 && !messages[0].isUser) {
                // Check if the first message is likely the welcome message
                // (First message from agent should be the welcome message)

                // Update the welcome message in history
                messages[0].text = this.config.welcomeMessage || "Hello! How can I help you today?";

                // Store back in localStorage
                localStorage.setItem(
                    `ai-chat-widget-messages-${this.config.agentId}-${this.config.roomId}`,
                    JSON.stringify(messages)
                );

                // Update the UI if the dialog is currently open
                const messagesContainer = document.querySelector('#chat-messages');
                if (messagesContainer &&
                    window.getComputedStyle(messagesContainer.closest('.ai-chat-widget-modal')).visibility === 'visible') {
                    this.renderMessageHistory(messagesContainer);
                }
            }

            // Update the stored welcome message reference
            this.previousWelcomeMessage = this.config.welcomeMessage;
        }
    },

    generateRoomId: function (agentId) {
        // Get stored roomId for this specific agent or generate new one
        const storedRoomId = localStorage.getItem(`ai-chat-widget-roomId-${agentId}`);
        if (storedRoomId) {
            return storedRoomId;
        }

        // Generate roomId based on domain name AND agent ID
        const domain = window.location.hostname;
        return `room-${domain}-${agentId}-${Date.now()}`;
    },

    verifyImageUrl: function (url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    },

    getStoredToken: function () {
        return localStorage.getItem('ai-chat-widget-token');
    },

    sendMessage: async function (message) {
        const token = this.config.authToken;

        try {
            const response = await fetch(`${this.config.serverUrl}/${this.config.agentId}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    agentId: this.config.agentId,
                    text: message,
                    userId: 'widget-user',
                    userName: 'Widget User',
                    roomId: this.config.roomId
                })
            });
            // ... rest of send message logic
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    },

    clearChat: function () {
        // Remove chat history for this specific agent
        localStorage.removeItem(`ai-chat-widget-messages-${this.config.agentId}-${this.config.roomId}`);

        // Remove roomId for this specific agent
        localStorage.removeItem(`ai-chat-widget-roomId-${this.config.agentId}`);

        // Generate new roomId for this agent
        this.config.roomId = this.generateRoomId(this.config.agentId);

        // Store new roomId in localStorage with agent-specific key
        localStorage.setItem(`ai-chat-widget-roomId-${this.config.agentId}`, this.config.roomId);

        // Set isNewConversation to true to trigger welcome message
        this.config.isNewConversation = true;

        // Return empty message history
        return [];
    },

    renderWidget: function (container) {
        // Create button and dialog
        const button = document.createElement('button');
        button.className = 'ai-chat-widget-button';
        button.style.backgroundColor = '#334155'; // slate-700
        button.style.borderRadius = '50%'; // Make it circular
        button.style.padding = '10px';
        button.style.width = '50px';
        button.style.height = '50px';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';

        const dialog = document.createElement('div');
        dialog.className = 'ai-chat-widget-modal';
        dialog.style.visibility = 'hidden';
        dialog.style.opacity = '0';

        // Set consistent transform state regardless of screen size
        dialog.style.transform = 'scale(0.95)';
        dialog.style.transformOrigin = 'bottom right';
        dialog.style.bottom = '70px'; // Space between button and dialog
        dialog.style.zIndex = '99999'; // Ensure highest z-index

        // Apply consistent styles for all screen sizes (mobile-like layout)
        dialog.style.width = 'calc(100% - 20px)'; // Add some margin on edges
        dialog.style.maxWidth = '400px'; // Set a reasonable max-width for desktop
        dialog.style.height = 'auto';
        dialog.style.maxHeight = 'calc(90vh - 80px)'; // Leave space for button
        dialog.style.borderRadius = '0.75rem';
        dialog.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.2)';
        dialog.style.position = 'fixed';

        // Set initial position based on container's data-position attribute
        const initialPosition = container.getAttribute('data-position') || 'bottom-right';
        this.adjustDialogPosition(dialog, initialPosition);

        // Handle resize events to maintain proportions only
        window.addEventListener('resize', () => {
            // Adjust max-width based on screen size
            if (window.matchMedia('(max-width: 480px)').matches) {
                dialog.style.maxWidth = '100%';
            } else {
                dialog.style.maxWidth = '400px';
            }

            // Reapply position styles based on container position attribute
            const position = container.getAttribute('data-position');
            this.adjustDialogPosition(dialog, position);
        });

        // Remove the individual margin styling since it's handled in CSS
        container.style.margin = '0';

        dialog.innerHTML = `
      <div class="flex flex-col bg-white dark:bg-neutral-800 h-full rounded-lg overflow-hidden">
        <div class="border-b p-4 flex justify-between items-center dark:border-neutral-700">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
          <button class="close-button text-gray-500 hover:text-gray-700 dark:text-gray-200 dark:hover:text-gray-100">&times;</button>
        </div>
        <div class="flex-1 overflow-y-auto p-4 space-y-4 -webkit-overflow-scrolling-touch" id="chat-messages"></div>
        <div class="border-t dark:border-neutral-700 dark:bg-neutral-700">
          <div class="p-2" id="chat-form-container">
            <!-- Replace the form with a modified version that preserves button positions -->
            <form class="flex flex-row items-center gap-2" id="chat-form" style="display: flex !important; flex-wrap: nowrap !important;">
              <div style="flex: 0 0 auto;">
                <button 
                  type="button" 
                  id="clear-chat-button"
                  class="rounded-md bg-gray-200 dark:bg-neutral-600 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-neutral-500 text-sm font-medium transition-colors duration-200"
                  style="width: 36px; height: 36px; padding: 0; min-width: 36px;"
                  title="Clear chat history"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
              <input 
                name="message" 
                class="flex-1 min-w-0 rounded-md border border-neutral-700 p-2 text-sm focus:outline-none dark:bg-neutral-700 dark:border-neutral-600 text-black dark:text-white dark:placeholder-gray-400" 
                style="flex: 1 1 auto; min-width: 0;"
                placeholder="Type a message..."
              />
              <div style="flex: 0 0 auto;">
                <button 
                  type="submit" 
                  class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 text-sm font-medium transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                  style="white-space: nowrap; height: 36px;"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

        let isOpen = false;

        // Toggle button handler
        button.innerHTML = `
      <div class="flex items-center">
        <img 
          src="${this.config.widgetUrl}/logo.png" 
          alt="Chat with Agent"
          class="h-10 w-10"
          onerror="this.onerror=null; this.parentElement.innerHTML='<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' class=\'h-6 w-6 text-white\'><path d=\'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\'></path></svg>';"
        />
      </div>
    `;

        button.addEventListener('click', () => {
            isOpen = !isOpen;
            if (isOpen) {
                dialog.style.visibility = 'visible';
                requestAnimationFrame(() => {
                    dialog.style.opacity = '1';
                    dialog.style.transform = 'scale(1)';

                    // Ensure dialog is properly positioned on small screens when opened
                    if (window.matchMedia('(max-width: 640px)').matches) {
                        dialog.style.transform = 'translateY(0)';
                    }
                });
                button.innerHTML = `
          <div class="flex items-center justify-center w-full h-full">
            <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        `;
                // Update button style for close state
                button.style.backgroundColor = '#334155'; // slate-700

                // Add welcome message if this is a new conversation
                // (after a slight delay to ensure the container is ready)
                setTimeout(() => {
                    const messagesContainer = dialog.querySelector('#chat-messages');
                    if (messagesContainer) {
                        this.addWelcomeMessage(messagesContainer);
                    }
                }, 100);
            } else {
                this.closeWidget(dialog, button);
            }
        });

        // Close button handler
        const closeButton = dialog.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            isOpen = false;
            this.closeWidget(dialog, button);
        });

        // Click outside handler
        document.addEventListener('mousedown', (event) => {
            if (!dialog.contains(event.target) && !button.contains(event.target)) {
                if (isOpen) {
                    isOpen = false;
                    this.closeWidget(dialog, button);
                }
            }
        });

        // Handle chat form submission
        const form = dialog.querySelector('#chat-form');
        const messagesContainer = dialog.querySelector('#chat-messages');

        // Add clear chat button handler
        const clearChatButton = dialog.querySelector('#clear-chat-button');
        clearChatButton.addEventListener('click', () => {
            this.clearChat();

            // Show the message with opacity transition
            const clearMessage = document.createElement('div');
            clearMessage.className = 'flex justify-center my-4 clear-message';
            clearMessage.innerHTML = `
        <div class="text-center bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg text-sm">
          Chat history cleared. You are now in a new conversation.
        </div>
      `;

            // Add transition styles
            clearMessage.style.transition = 'opacity 0.3s ease-in-out';
            clearMessage.style.opacity = '0';

            // Clear existing messages then add our temporary message
            messagesContainer.innerHTML = '';
            messagesContainer.appendChild(clearMessage);

            // Trigger fade in
            setTimeout(() => {
                clearMessage.style.opacity = '1';
            }, 10);

            // Set timeout to remove the message after 2 seconds
            setTimeout(() => {
                // Fade out
                clearMessage.style.opacity = '0';

                // Remove from DOM after transition completes
                setTimeout(() => {
                    if (messagesContainer.contains(clearMessage)) {
                        messagesContainer.removeChild(clearMessage);
                    }

                    // Now add the welcome message
                    this.addWelcomeMessage(messagesContainer);
                }, 300); // Wait for fade out transition

            }, 1500); // 2 seconds display time
        });

        // Load and render existing chat messages
        this.renderMessageHistory(messagesContainer);

        // Add welcome message immediately if we've loaded the widget for the first time
        // and there are no messages (but only if the dialog is visible)
        if (this.config.isNewConversation && messagesContainer &&
            window.getComputedStyle(dialog).visibility !== 'hidden') {
            this.addWelcomeMessage(messagesContainer);
        }

        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = form.querySelector('input');
            const submitButton = form.querySelector('button[type="submit"]');
            const message = input?.value.trim();

            if (!message) return;

            // Disable input and button
            input.disabled = true;
            submitButton.disabled = true;
            // Add visual feedback class
            submitButton.setAttribute('disabled', 'disabled');

            try {
                // Save user message to history and add to UI
                this.saveMessageToHistory(message, true);
                messagesContainer.innerHTML += `
          <div class="flex justify-end">
            <div class="max-w-[80%]">
              <div class="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-tr-sm">
                ${message}
              </div>
            </div>
          </div>
        `;

                // Add loading message bubble for agent
                const loadingBubbleId = `loading-${Date.now()}`;
                messagesContainer.innerHTML += `
          <div class="flex justify-start" id="${loadingBubbleId}">
            <div class="max-w-[80%]">
              <div class="bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white px-4 py-2 rounded-2xl rounded-tl-sm min-h-[2.5rem] flex items-center justify-center">
                <span class="typing-dots text-center">
                  <span class="dot animate-bounce" style="animation-delay: 0ms">.</span>
                  <span class="dot animate-bounce" style="animation-delay: 200ms">.</span>
                  <span class="dot animate-bounce" style="animation-delay: 400ms">.</span>
                </span>
              </div>
            </div>
          </div>
        `;

                input.value = '';
                messagesContainer.scrollTop = messagesContainer.scrollHeight;

                // Send message to agent
                const token = this.getStoredToken();
                const response = await fetch(`${this.config.serverUrl}/${this.config.agentId}/message`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        agentId: this.config.agentId,
                        text: message,
                        userId: 'widget-user',
                        userName: 'Widget User',
                        roomId: this.config.roomId
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to get response from agent');
                }

                const data = await response.json();
                const reply = Array.isArray(data) && data.length > 0 ? data[0].text : 'No reply from agent.';

                // Save agent reply to history
                this.saveMessageToHistory(reply, false);

                // Replace loading bubble with actual response
                const loadingBubble = document.getElementById(loadingBubbleId);
                if (loadingBubble) {
                    // Fade out dots with transition
                    const dots = loadingBubble.querySelector('.typing-dots');
                    if (dots) {
                        dots.style.opacity = '0';
                        dots.style.transition = 'opacity 0.2s ease-out';
                    }

                    // After a slight delay to allow fade-out
                    setTimeout(() => {
                        try {
                            // Completely remove the loading bubble from the DOM
                            loadingBubble.remove();

                            // Create a brand new bubble with the response
                            const newBubble = document.createElement('div');
                            newBubble.className = 'flex justify-start';
                            newBubble.style.marginBottom = '12px';

                            // Parse the markdown response text
                            const renderedHTML = this.renderMarkdown(reply);

                            // Add the content with proper structure
                            newBubble.innerHTML = `
                <div class="max-w-[80%]">
                  <div class="bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white px-4 py-2 rounded-2xl rounded-tl-sm markdown-content">
                    ${renderedHTML}
                  </div>
                </div>
              `;

                            // Add the new bubble to the messages container
                            messagesContainer.appendChild(newBubble);

                            // Force a reflow/repaint to ensure styles are applied
                            void newBubble.offsetHeight;

                            // Apply direct styling to ensure formatting is correct
                            const messageContent = newBubble.querySelector('.markdown-content');
                            if (messageContent) {
                                // Make sure paragraphs have proper spacing
                                const paragraphs = messageContent.querySelectorAll('p');
                                for (let i = 0; i < paragraphs.length; i++) {
                                    paragraphs[i].style.margin = '0 0 0.75em 0';
                                    paragraphs[i].style.padding = '0';
                                }

                                // Fix the last paragraph's margin
                                if (paragraphs.length > 0) {
                                    paragraphs[paragraphs.length - 1].style.marginBottom = '0';
                                }

                                // Fix code blocks
                                const codeBlocks = messageContent.querySelectorAll('pre code');
                                for (let i = 0; i < codeBlocks.length; i++) {
                                    codeBlocks[i].style.display = 'block';
                                    codeBlocks[i].style.overflowX = 'auto';
                                    codeBlocks[i].style.padding = '0.5em';
                                    codeBlocks[i].style.backgroundColor = 'rgba(0,0,0,0.05)';
                                    codeBlocks[i].style.borderRadius = '3px';
                                    codeBlocks[i].style.fontFamily = 'monospace';
                                    codeBlocks[i].style.whiteSpace = 'pre-wrap';
                                }

                                // Fix inline code
                                const inlineCodes = messageContent.querySelectorAll('code:not(pre code)');
                                for (let i = 0; i < inlineCodes.length; i++) {
                                    inlineCodes[i].style.backgroundColor = 'rgba(0,0,0,0.05)';
                                    inlineCodes[i].style.padding = '2px 4px';
                                    inlineCodes[i].style.borderRadius = '3px';
                                    inlineCodes[i].style.fontFamily = 'monospace';
                                    inlineCodes[i].style.fontSize = '0.9em';
                                }

                                // Fix lists
                                const lists = messageContent.querySelectorAll('ul, ol');
                                for (let i = 0; i < lists.length; i++) {
                                    lists[i].style.marginLeft = '1.5em';
                                    lists[i].style.marginBottom = '0.75em';
                                    lists[i].style.paddingLeft = '0';
                                }
                            }

                            // Ensure we scroll to the new message
                            messagesContainer.scrollTop = messagesContainer.scrollHeight;

                        } catch (error) {
                            console.error('Error rendering message:', error);
                            // Fallback to basic text if rendering fails
                            messagesContainer.innerHTML += `
                <div class="flex justify-start" style="margin-bottom: 12px;">
                  <div class="max-w-[80%]">
                    <div class="bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white px-4 py-2 rounded-2xl rounded-tl-sm">
                      ${reply.replace(/\n/g, '<br>')}
                    </div>
                  </div>
                </div>
              `;
                            messagesContainer.scrollTop = messagesContainer.scrollHeight;
                        }
                    }, 200);
                }

                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            } catch (error) {
                console.error('Error sending message:', error);

                const errorMessage = 'Failed to get response from agent. Please try again.';
                // Save error message to history
                this.saveMessageToHistory(errorMessage, false);

                messagesContainer.innerHTML += `
          <div class="flex justify-start">
            <div class="max-w-[80%]">
              <div class="bg-red-100 text-red-600 px-4 py-2 rounded-2xl rounded-tl-sm">
                ${errorMessage}
              </div>
            </div>
          </div>
        `;
            } finally {
                // Re-enable input and button
                input.disabled = false;
                submitButton.disabled = false;
                // Remove visual feedback class
                submitButton.removeAttribute('disabled');
                input.focus();
            }
        });

        // Append elements to container and document
        container.appendChild(button);
        container.appendChild(dialog);
        document.body.appendChild(container);

        // Ensure the container itself has proper styling
        container.style.position = 'fixed';
        container.style.zIndex = '99998'; // Just below dialog

        // Position the container based on its data-position attribute
        const position = container.getAttribute('data-position') || 'bottom-right';
        if (position === 'bottom-left') {
            container.style.bottom = '20px';
            container.style.left = '20px';
            container.style.right = 'auto';
            container.style.top = 'auto';
        } else if (position === 'top-right') {
            container.style.top = '20px';
            container.style.right = '20px';
            container.style.bottom = 'auto';
            container.style.left = 'auto';
        } else if (position === 'top-left') {
            container.style.top = '20px';
            container.style.left = '20px';
            container.style.bottom = 'auto';
            container.style.right = 'auto';
        } else { // default: bottom-right
            container.style.bottom = '20px';
            container.style.right = '20px';
            container.style.top = 'auto';
            container.style.left = 'auto';
        }

        // Make the button more visible and accessible on mobile
        button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        button.style.zIndex = '99998';

        // Fix iOS Safari scrolling issues
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            messagesContainer.style.WebkitOverflowScrolling = 'touch';
        }

        // Apply specific fixes for top positions on mobile
        if (position === 'top-right' || position === 'top-left') {
            if (window.matchMedia('(max-width: 640px)').matches) {
                // Fix dialog positioning for top positions on mobile
                dialog.style.top = '70px'; // Position below the widget button
                dialog.style.bottom = 'auto';
                dialog.style.transformOrigin = position === 'top-right' ? 'top right' : 'top left';

                // Fix the gap below input field
                const formContainer = dialog.querySelector('#chat-form-container');
                if (formContainer) {
                    formContainer.style.paddingBottom = '0';
                    formContainer.style.marginBottom = '0';
                }

                const form = dialog.querySelector('#chat-form');
                if (form) {
                    form.style.marginBottom = '0';
                }

                // Add a CSS class to help with targeting this specific layout
                dialog.classList.add(`${position}-mobile`);
            }
        }

        // Add CSS for Markdown content
        const styleTag = document.createElement('style');
        styleTag.textContent = `
      .markdown-content {
        font-size: 14px;
        line-height: 1.5;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
      }
      .markdown-content p {
        margin-bottom: 0.75em;
        margin-top: 0;
      }
      .markdown-content p:last-child {
        margin-bottom: 0;
      }
      .markdown-content h1, .markdown-content h2, .markdown-content h3 {
        font-weight: 600;
        margin-top: 1em;
        margin-bottom: 0.5em;
      }
      .markdown-content h1 {
        font-size: 1.5em;
      }
      .markdown-content h2 {
        font-size: 1.25em;
      }
      .markdown-content h3 {
        font-size: 1.125em;
      }
      .markdown-content ul, .markdown-content ol {
        margin-left: 1.5em;
        margin-bottom: 0.75em;
        padding-left: 0;
      }
      .markdown-content li {
        margin-bottom: 0.25em;
      }
      .markdown-content strong {
        font-weight: 600;
      }
      .markdown-content em {
        font-style: italic;
      }
      .markdown-content code {
        background-color: rgba(0,0,0,0.05);
        padding: 2px 4px;
        border-radius: 3px;
        font-family: monospace;
        font-size: 0.9em;
      }
      .markdown-content pre {
        margin: 0.75em 0;
      }
      .markdown-content pre code {
        display: block;
        overflow-x: auto;
        padding: 0.5em;
        background-color: rgba(0,0,0,0.05);
        border-radius: 3px;
      }
      .dark .markdown-content code {
        background-color: rgba(255,255,255,0.1);
      }
      .dark .markdown-content pre code {
        background-color: rgba(255,255,255,0.1);
      }
      .typing-dots .dot {
        display: inline-block;
        animation-duration: 1.4s;
        animation-iteration-count: infinite;
        font-weight: bold;
      }
    `;
        document.head.appendChild(styleTag);
    },

    // Add a new helper method for positioning the dialog
    adjustDialogPosition: function (dialog, position) {
        // Reset all positions first
        dialog.style.top = 'auto';
        dialog.style.bottom = 'auto';
        dialog.style.left = 'auto';
        dialog.style.right = 'auto';

        if (position === 'bottom-left') {
            dialog.style.bottom = '70px';
            dialog.style.left = '10px';
            dialog.style.transformOrigin = 'bottom left';
        } else if (position === 'top-right') {
            dialog.style.top = '70px';
            dialog.style.right = '10px';
            dialog.style.transformOrigin = 'top right';
        } else if (position === 'top-left') {
            dialog.style.top = '70px';
            dialog.style.left = '10px';
            dialog.style.transformOrigin = 'top left';
        } else { // default: bottom-right
            dialog.style.bottom = '70px';
            dialog.style.right = '10px';
            dialog.style.transformOrigin = 'bottom right';
        }
    },

    closeWidget: function (dialog, button) {
        // Use the same animation style for both desktop and mobile
        dialog.style.opacity = '0';
        dialog.style.transform = 'scale(0.95)';

        setTimeout(() => {
            dialog.style.visibility = 'hidden';
        }, 200);

        button.innerHTML = `
      <div class="flex items-center justify-center w-full h-full">
        <img 
          src="${this.config.widgetUrl}/logo.png" 
          alt="Chat with Agent"
          class="h-8 w-8"
          onerror="this.onerror=null; this.parentElement.innerHTML='<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' class=\'h-6 w-6 text-white\'><path d=\'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\'></path></svg>';"
        />
      </div>
    `;
        // Reset button style for open state
        button.style.backgroundColor = '#334155'; // slate-700
    },

    // Helper to escape HTML in user messages
    escapeHTML: function (text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // Render markdown to HTML
    renderMarkdown: function (text) {
        if (!text) return '<p></p>';

        // Create a helper function for HTML escaping
        const escapeHTML = (str) => {
            const element = document.createElement('div');
            element.textContent = str;
            return element.innerHTML;
        };

        // Normalize line endings
        text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        // Pre-process code blocks to protect them from other formatting
        const codeBlocks = [];
        let processedText = text.replace(/```([a-z]*)\n([\s\S]*?)\n```/g, (match, lang, code) => {
            const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
            codeBlocks.push({
                language: lang,
                code: escapeHTML(code.trim())
            });
            return placeholder;
        });

        // Process inline code blocks
        const inlineCodeBlocks = [];
        processedText = processedText.replace(/`([^`]+)`/g, (match, code) => {
            const placeholder = `__INLINE_CODE_${inlineCodeBlocks.length}__`;
            inlineCodeBlocks.push(escapeHTML(code));
            return placeholder;
        });

        // Process headers
        processedText = processedText
            .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
            .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
            .replace(/^# (.*?)$/gm, '<h1>$1</h1>');

        // Process emphasis and strong
        processedText = processedText
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>');

        // Process unordered lists
        const listItems = [];
        processedText = processedText.replace(/^\s*[-*] (.*?)$/gm, (match, item) => {
            const placeholder = `__LIST_ITEM_${listItems.length}__`;
            listItems.push(item);
            return placeholder;
        });

        // Split text into paragraphs
        const paragraphs = processedText.split(/\n\n+/);
        let html = '';

        paragraphs.forEach(para => {
            // Skip empty paragraphs
            if (!para.trim()) return;

            // Check if it's a header, a list item placeholder, or a code block placeholder
            if (para.match(/^<h[1-3]>/)) {
                html += para;
            } else if (para.match(/__LIST_ITEM_\d+__/)) {
                // Convert list item placeholders to <li> elements
                const listContent = para.replace(/__LIST_ITEM_(\d+)__/g, (match, index) => {
                    return `<li>${listItems[parseInt(index)]}</li>`;
                });
                html += `<ul>${listContent}</ul>`;
            } else if (para.match(/__CODE_BLOCK_\d+__/)) {
                // It's a code block placeholder
                html += para;
            } else {
                // It's a regular paragraph - replace \n with <br>
                html += `<p>${para.replace(/\n/g, '<br>')}</p>`;
            }
        });

        // Restore code blocks
        html = html.replace(/__CODE_BLOCK_(\d+)__/g, (match, index) => {
            const block = codeBlocks[parseInt(index)];
            return `<pre><code class="language-${block.language}">${block.code}</code></pre>`;
        });

        // Restore inline code blocks
        html = html.replace(/__INLINE_CODE_(\d+)__/g, (match, index) => {
            return `<code>${inlineCodeBlocks[parseInt(index)]}</code>`;
        });

        return html;
    },

    // Check if this is a new conversation (no message history)
    isNewConversation: function () {
        const messages = this.loadMessageHistory();
        return messages.length === 0;
    },

    // Add a welcome message for new conversations
    addWelcomeMessage: function (messagesContainer) {
        if (!this.config.isNewConversation) return;

        // Default welcome message
        const welcomeMessage = this.config.welcomeMessage || "Hello! How can I help you today?";

        // Save welcome message to history
        this.saveMessageToHistory(welcomeMessage, false);

        // If the messages container is provided, display the message
        if (messagesContainer) {
            const renderedHTML = this.renderMarkdown(welcomeMessage);
            messagesContainer.innerHTML += `
        <div class="flex justify-start">
          <div class="max-w-[80%]">
            <div class="bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white px-4 py-2 rounded-2xl rounded-tl-sm markdown-content">
              ${renderedHTML}
            </div>
          </div>
        </div>
      `;

            // Ensure we scroll to show the welcome message
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
        }

        // Mark that we've shown the welcome message
        this.config.isNewConversation = false;

        // Store this welcome message as our reference
        this.previousWelcomeMessage = welcomeMessage;
    }
};

function initializeExternalTriggers() {
    // Find all external trigger buttons
    const externalTriggers = document.querySelectorAll('[data-widget-trigger]');

    externalTriggers.forEach(trigger => {
        // Add necessary classes
        trigger.classList.add('ai-chat-widget-button');

        // Create send icon SVG
        const sendIcon = document.createElement('span');
        sendIcon.className = 'send-icon';
        sendIcon.innerHTML = `
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        class="h-5 w-5"
      >
        <path d="M22 2L11 13"></path>
        <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
      </svg>
    `;

        // Create loading spinner
        const spinner = document.createElement('span');
        spinner.className = 'loading-spinner hidden';
        spinner.innerHTML = `
      <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    `;

        // Clear existing content and add new elements
        trigger.innerHTML = '';
        trigger.appendChild(sendIcon);
        trigger.appendChild(spinner);

        // Add styles directly to button
        trigger.style.display = 'inline-flex';
        trigger.style.alignItems = 'center';
        trigger.style.justifyContent = 'center';
        trigger.style.width = '40px';
        trigger.style.height = '40px';
        trigger.style.padding = '8px';
        trigger.style.borderRadius = '6px';
        trigger.style.color = '#2563eb'; // blue-600
        trigger.style.cursor = 'pointer';
    });
}

function initializeWidget() {
    const widget = document.getElementById('ai-cms-widget');
    if (!widget) return;

    // Force widget to use its own styles
    widget.setAttribute('data-theme-independent', 'true');

    // Ensure all inputs within widget use our styles
    const inputs = widget.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.style.setProperty('color', '#000000', 'important');
        input.style.setProperty('background-color', '#ffffff', 'important');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeWidget();
    // Add viewport adjustment check after initial load
    setTimeout(adjustWidgetForViewport, 500);
});

// Add a check for viewport size that adjusts styling on page load
function adjustWidgetForViewport() {
    const container = document.getElementById('ai-chat-widget-container');
    if (!container) return;

    const dialog = container.querySelector('.ai-chat-widget-modal');
    if (!dialog) return;

    const position = container.getAttribute('data-position') || 'bottom-right';

    // Apply consistent mobile-like layout regardless of screen size
    dialog.style.width = 'calc(100% - 20px)';
    dialog.style.maxWidth = window.matchMedia('(max-width: 480px)').matches ? '100%' : '400px';
    dialog.style.height = 'auto';
    dialog.style.maxHeight = 'calc(90vh - 80px)';
    dialog.style.borderRadius = '0.75rem';

    // Call the positioning helper from AIChatWidget
    if (window.AIChatWidget && typeof window.AIChatWidget.adjustDialogPosition === 'function') {
        window.AIChatWidget.adjustDialogPosition(dialog, position);
    }

    // Special handling for top positions
    if (position === 'top-right' || position === 'top-left') {
        // Fix the chat form container and input field gap
        const formContainer = dialog.querySelector('#chat-form-container');
        if (formContainer) {
            formContainer.style.paddingBottom = '0';
            formContainer.style.marginBottom = '0';
            formContainer.style.borderBottom = 'none';
        }

        // Fix any padding in the form itself
        const form = dialog.querySelector('#chat-form');
        if (form) {
            form.style.marginBottom = '0';
            form.style.paddingBottom = '8px';
        }
    }

    // Detect iOS Safari and add additional styles
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        const messagesContainer = dialog.querySelector('#chat-messages');
        if (messagesContainer) {
            messagesContainer.style.WebkitOverflowScrolling = 'touch';
        }
    }

    // Form layout fixes that apply to all screen sizes
    const form = container.querySelector('#chat-form');
    if (!form) return;

    form.style.display = 'flex';
    form.style.flexDirection = 'row';
    form.style.flexWrap = 'nowrap';
    form.style.alignItems = 'center';
    form.style.width = '100%';

    const formContainer = container.querySelector('#chat-form-container');
    if (formContainer) {
        formContainer.style.padding = '8px';
    }

    const input = form.querySelector('input');
    if (input) {
        input.style.flex = '1 1 auto';
        input.style.minWidth = '0';
    }

    const buttonContainers = form.querySelectorAll('div');
    buttonContainers.forEach(div => {
        div.style.flex = '0 0 auto';
    });
}

// Listen for orientation changes on mobile
window.addEventListener('orientationchange', adjustWidgetForViewport);

// Attach event listener for load events
window.addEventListener('load', () => {
    setTimeout(adjustWidgetForViewport, 100);
});

// Add improved global CSS early in the initialization
window.addEventListener('DOMContentLoaded', function () {
    // Inject critical CSS early to ensure it's loaded before any messages
    const styleTag = document.createElement('style');
    styleTag.textContent = `
    /* Force consistent styling for markdown content */
    .markdown-content {
      font-size: 14px !important;
      line-height: 1.5 !important;
      overflow-wrap: break-word !important;
      word-wrap: break-word !important;
      word-break: break-word !important;
      color: inherit !important;
    }
    
    /* Force proper paragraph spacing */
    .markdown-content p {
      margin: 0 0 0.75em 0 !important;
      padding: 0 !important;
    }
    
    /* Fix last paragraph margin */
    .markdown-content p:last-child {
      margin-bottom: 0 !important;
    }
    
    /* Header styling */
    .markdown-content h1, .markdown-content h2, .markdown-content h3 {
      font-weight: 600 !important;
      margin: 0.5em 0 !important;
    }
    
    /* Fix list margins and padding */
    .markdown-content ul, .markdown-content ol {
      margin: 0 0 0.75em 1.5em !important;
      padding-left: 0 !important;
    }
    
    .markdown-content li {
      margin-bottom: 0.25em !important;
    }
    
    .markdown-content li:last-child {
      margin-bottom: 0 !important;
    }
    
    /* Code styling */
    .markdown-content code {
      background-color: rgba(0,0,0,0.05) !important;
      padding: 2px 4px !important;
      border-radius: 3px !important;
      font-family: monospace !important;
      font-size: 0.9em !important;
      white-space: pre-wrap !important;
    }
    
    .markdown-content pre {
      margin: 0.75em 0 !important;
      background-color: transparent !important;
      padding: 0 !important;
    }
    
    .markdown-content pre code {
      display: block !important;
      overflow-x: auto !important;
      padding: 0.5em !important;
      background-color: rgba(0,0,0,0.05) !important;
      border-radius: 3px !important;
    }
    
    .dark .markdown-content code {
      background-color: rgba(255,255,255,0.1) !important;
    }
    
    .dark .markdown-content pre code {
      background-color: rgba(255,255,255,0.1) !important;
    }
    
    /* Animation styling */
    .typing-dots .dot {
      display: inline-block !important;
      animation-duration: 1.4s !important;
      animation-iteration-count: infinite !important;
      font-weight: bold !important;
    }
    
    /* Fix message bubble spacing */
    .ai-chat-widget-modal .flex-start,
    .ai-chat-widget-modal .justify-start,
    .ai-chat-widget-modal .justify-end {
      margin-bottom: 0.75em !important;
    }

    /* Fix chat container spacing */  
    #chat-messages > div {
      margin-bottom: 12px !important;
    }
    
    /* Force correct line breaks */
    .markdown-content br {
      content: "" !important;
      display: block !important;
      margin: 0.25em 0 !important;
    }
  `;
    document.head.appendChild(styleTag);
});