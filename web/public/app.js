(() => {
  // DOM Elements
  const chatViewport = document.getElementById('chatViewport');
  const messagesList = document.getElementById('messagesList');
  const welcomeHero = document.getElementById('welcomeHero');
  const chatForm = document.getElementById('chatForm');
  const userInput = document.getElementById('userInput');
  const btnSend = document.getElementById('btnSend');
  const btnStop = document.getElementById('btnStop');
  const btnNewChat = document.getElementById('btnNewChat');
  const btnSettings = document.getElementById('btnSettings');
  const statusDot = document.getElementById('statusDot');
  const statusBanner = document.getElementById('statusBanner');
  const statusBannerText = document.getElementById('statusBannerText');

  // Modal Elements
  const settingsModal = document.getElementById('settingsModal');
  const btnCloseSettings = document.getElementById('btnCloseSettings');
  const inputEndpoint = document.getElementById('inputEndpoint');
  const inputApiKey = document.getElementById('inputApiKey');
  const btnToggleKey = document.getElementById('btnToggleKey');
  const btnTestConn = document.getElementById('btnTestConn');
  const connTestResult = document.getElementById('connTestResult');
  const btnSaveSettings = document.getElementById('btnSaveSettings');

  // App State
  let conversation = [];
  let isGenerating = false;
  let currentAbortController = null;

  const STORAGE_ENDPOINT_KEY = 'tanitbot_api_endpoint';
  const STORAGE_APIKEY_KEY = 'tanitbot_api_key';

  let apiEndpoint = localStorage.getItem(STORAGE_ENDPOINT_KEY) || '/api/chat';
  let apiKey = localStorage.getItem(STORAGE_APIKEY_KEY) || '';

  // Initialize UI values
  inputEndpoint.value = apiEndpoint;
  inputApiKey.value = apiKey;

  // Auto-resize textarea
  function autoResizeTextarea() {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 160) + 'px';
  }
  userInput.addEventListener('input', autoResizeTextarea);

  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating && userInput.value.trim().length > 0) {
        chatForm.dispatchEvent(new Event('submit'));
      }
    }
  });

  // Settings Modal handlers
  btnSettings.addEventListener('click', () => {
    inputEndpoint.value = apiEndpoint;
    inputApiKey.value = apiKey;
    connTestResult.textContent = '';
    connTestResult.className = 'conn-test-status';
    settingsModal.style.display = 'flex';
  });

  btnCloseSettings.addEventListener('click', () => {
    settingsModal.style.display = 'none';
  });

  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
      settingsModal.style.display = 'none';
    }
  });

  btnToggleKey.addEventListener('click', () => {
    inputApiKey.type = inputApiKey.type === 'password' ? 'text' : 'password';
  });

  btnSaveSettings.addEventListener('click', () => {
    apiEndpoint = (inputEndpoint.value.trim() || '/api/chat');
    apiKey = inputApiKey.value.trim();
    localStorage.setItem(STORAGE_ENDPOINT_KEY, apiEndpoint);
    localStorage.setItem(STORAGE_APIKEY_KEY, apiKey);
    settingsModal.style.display = 'none';
    checkEndpointHealth();
  });

  // Test connection button
  btnTestConn.addEventListener('click', async () => {
    connTestResult.textContent = 'جاري الفحص...';
    connTestResult.className = 'conn-test-status';
    try {
      const target = inputEndpoint.value.trim() || '/api/chat';
      const headers = {};
      if (inputApiKey.value.trim()) {
        headers['X-API-Key'] = inputApiKey.value.trim();
      }
      const res = await fetch(target, { method: 'GET', headers });
      if (!res.ok) {
        throw new Error(`خطأ ${res.status}`);
      }
      const data = await res.json();
      connTestResult.textContent = `متصل بنجاح (${data.bot || 'OK'})`;
      connTestResult.className = 'conn-test-status ok';
    } catch (err) {
      connTestResult.textContent = `فشل الاتصال: ${err.message}`;
      connTestResult.className = 'conn-test-status err';
    }
  });

  // Check endpoint health silently
  async function checkEndpointHealth() {
    try {
      const headers = {};
      if (apiKey) headers['X-API-Key'] = apiKey;
      const res = await fetch(apiEndpoint, { method: 'GET', headers });
      if (res.ok) {
        statusDot.className = 'status-indicator-dot';
        statusDot.title = 'خادم الذكاء الاصطناعي متصل وجاهز';
      } else {
        statusDot.className = 'status-indicator-dot busy';
        statusDot.title = 'الخادم يحتاج إعدادات أو مفتاح ترخيص';
      }
    } catch {
      statusDot.className = 'status-indicator-dot busy';
      statusDot.title = 'الخادم في وضع الاستعداد';
    }
  }
  checkEndpointHealth();

  // Quick Prompt Chips
  document.querySelectorAll('.prompt-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query');
      if (query && !isGenerating) {
        userInput.value = query;
        autoResizeTextarea();
        chatForm.dispatchEvent(new Event('submit'));
      }
    });
  });

  // Reset / New Chat
  btnNewChat.addEventListener('click', () => {
    if (isGenerating && currentAbortController) {
      currentAbortController.abort();
    }
    conversation = [];
    messagesList.innerHTML = '';
    welcomeHero.style.display = 'flex';
    statusBanner.style.display = 'none';
    userInput.value = '';
    autoResizeTextarea();
    userInput.focus();
  });

  // Message Formatter (Arabic text, markdown-like bullets, citations)
  function formatContent(text) {
    if (!text) return '';

    // Sanitize HTML
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Convert Citations: [المصدر: ...، صفحة X]
    escaped = escaped.replace(/\[(المصدر:[^\]]+)\]/g, (match, citation) => {
      return `<span class="citation-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
          <path d="M6 6h10M6 10h10"/>
        </svg>
        ${citation}
      </span>`;
    });

    // Bold **text**
    escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Inline code `code`
    escaped = escaped.replace(/`([^`]+)`/g, '<code style="font-family: var(--font-mono); background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px;">$1</code>');

    // Bullet points & line breaks
    const lines = escaped.split('\n');
    const formatted = lines.map((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
        return `<div style="display: flex; gap: 8px; margin: 4px 0;"><span style="color: var(--primary);">•</span><span>${trimmed.slice(1).trim()}</span></div>`;
      }
      return line ? `<div>${line}</div>` : '<div style="height: 8px;"></div>';
    }).join('');

    return formatted;
  }

  // Append a message to the chat
  function appendMessage(role, content) {
    welcomeHero.style.display = 'none';

    const row = document.createElement('div');
    row.className = `message-row ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = role === 'user'
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
      : `<svg class="shield-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`;

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-text';
    contentDiv.innerHTML = formatContent(content);
    bubble.appendChild(contentDiv);

    if (role === 'assistant') {
      const actions = document.createElement('div');
      actions.className = 'message-actions';

      const copyBtn = document.createElement('button');
      copyBtn.className = 'btn-msg-action';
      copyBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
        <span>نسخ</span>
      `;
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(content).then(() => {
          copyBtn.querySelector('span').textContent = 'تم النسخ!';
          setTimeout(() => {
            copyBtn.querySelector('span').textContent = 'نسخ';
          }, 2000);
        });
      });

      actions.appendChild(copyBtn);
      bubble.appendChild(actions);
    }

    row.appendChild(avatar);
    row.appendChild(bubble);
    messagesList.appendChild(row);

    chatViewport.scrollTop = chatViewport.scrollHeight;
    return { row, bubble, contentDiv };
  }

  // Handle Form Submit (Sending message)
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text || isGenerating) return;

    // Reset input
    userInput.value = '';
    autoResizeTextarea();

    // Add user message to conversation
    conversation.push({ role: 'user', content: text });
    appendMessage('user', text);

    // Prepare assistant streaming message bubble
    const { bubble, contentDiv } = appendMessage('assistant', '');
    const cursor = document.createElement('span');
    cursor.className = 'streaming-cursor';
    contentDiv.appendChild(cursor);

    isGenerating = true;
    btnSend.style.display = 'none';
    btnStop.style.display = 'inline-flex';
    statusDot.className = 'status-indicator-dot busy';

    currentAbortController = new AbortController();

    // Timer for cold start detection
    let receivedFirstChunk = false;
    const coldStartTimer = setTimeout(() => {
      if (!receivedFirstChunk && isGenerating) {
        statusBannerText.textContent = 'جاري إيقاظ الخادم (Modal GPU Cold Start)... قد يستغرق دقيقة واحدة لأول مرة.';
        statusBanner.style.display = 'flex';
      }
    }, 4000);

    let fullReply = '';

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      };
      if (apiKey) {
        headers['X-API-Key'] = apiKey;
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers,
        signal: currentAbortController.signal,
        body: JSON.stringify({
          messages: conversation,
          stream: true,
        }),
      });

      if (!response.ok) {
        let errMessage = `خطأ في الخادم (${response.status})`;
        try {
          const errData = await response.json();
          if (errData.error) errMessage = errData.error;
        } catch {}
        throw new Error(errMessage);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let sseBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        receivedFirstChunk = true;
        clearTimeout(coldStartTimer);
        statusBanner.style.display = 'none';

        sseBuffer += decoder.decode(value, { stream: true });

        let sep;
        while ((sep = sseBuffer.indexOf('\n\n')) !== -1) {
          const frame = sseBuffer.slice(0, sep);
          sseBuffer = sseBuffer.slice(sep + 2);

          const dataLine = frame.split('\n').find((l) => l.startsWith('data:'));
          if (!dataLine) continue;

          try {
            const event = JSON.parse(dataLine.slice('data:'.length).trim());
            if (event.delta) {
              fullReply += event.delta;
              contentDiv.innerHTML = formatContent(fullReply);
              contentDiv.appendChild(cursor);
              chatViewport.scrollTop = chatViewport.scrollHeight;
            }
            if (event.error) {
              throw new Error(event.error);
            }
          } catch (jsonErr) {
            console.warn('SSE frame parse error:', jsonErr);
          }
        }
      }

      // Generation completed cleanly
      cursor.remove();
      conversation.push({ role: 'assistant', content: fullReply });

      // Add copy button
      const actions = document.createElement('div');
      actions.className = 'message-actions';
      const copyBtn = document.createElement('button');
      copyBtn.className = 'btn-msg-action';
      copyBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
        <span>نسخ</span>
      `;
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(fullReply).then(() => {
          copyBtn.querySelector('span').textContent = 'تم النسخ!';
          setTimeout(() => {
            copyBtn.querySelector('span').textContent = 'نسخ';
          }, 2000);
        });
      });
      actions.appendChild(copyBtn);
      bubble.appendChild(actions);

    } catch (err) {
      clearTimeout(coldStartTimer);
      statusBanner.style.display = 'none';
      cursor.remove();

      if (err.name === 'AbortError') {
        contentDiv.innerHTML += ' <span style="color: var(--text-dim); font-size: 0.8rem;">(تم الإيقاف)</span>';
      } else {
        contentDiv.innerHTML = `<div style="color: var(--accent-red); font-size: 0.9rem;">⚠️ ${err.message}</div>`;
      }
    } finally {
      isGenerating = false;
      btnSend.style.display = 'inline-flex';
      btnStop.style.display = 'none';
      statusDot.className = 'status-indicator-dot';
      currentAbortController = null;
      userInput.focus();
    }
  });

  // Stop generation
  btnStop.addEventListener('click', () => {
    if (currentAbortController) {
      currentAbortController.abort();
    }
  });
})();
