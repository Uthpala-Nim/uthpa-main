(function() {
  const ANALYTICS_API = 'http://localhost:3005/track';
  
  function getSessionId() {
    let id = localStorage.getItem('session_id');
    if (!id) {
      if (window.crypto && crypto.randomUUID) {
        id = crypto.randomUUID();
      } else {
        id = Math.random().toString(36).slice(2);
      }
      localStorage.setItem('session_id', id);
    }
    return id;
  }

  async function trackEvent(data) {
    try {
      const response = await fetch(ANALYTICS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  const sessionId = getSessionId();
  const path = window.location.pathname;
  const pageStart = Date.now();
  const sessionStart = parseInt(localStorage.getItem('session_start') || pageStart);

  // Set session start time if not exists
  if (!localStorage.getItem('session_start')) {
    localStorage.setItem('session_start', sessionStart.toString());
  }

  // Track page view
  trackEvent({ 
    session_id: sessionId, 
    event: 'page_view', 
    path,
    value: document.title 
  });

  // Track clicks with more context
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button, [data-trackable]');
    if (target) {
      trackEvent({
        session_id: sessionId,
        event: 'click',
        path,
        value: target.innerText || target.id || target.getAttribute('data-trackable') || target.tagName
      });
    }
  });

  // Track scroll depth with throttling
  let maxDepth = 0;
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) return;
    
    scrollTimeout = setTimeout(() => {
      const doc = document.documentElement;
      const current = Math.round((window.scrollY + window.innerHeight) / doc.scrollHeight * 100);
      if (current > maxDepth) {
        maxDepth = current;
        if (maxDepth % 25 === 0) { // Track at 25%, 50%, 75%, 100%
          trackEvent({
            session_id: sessionId,
            event: 'scroll_depth',
            path,
            value: maxDepth.toString()
          });
        }
      }
      scrollTimeout = null;
    }, 100);
  });

  // Track time on page
  window.addEventListener('beforeunload', () => {
    const duration = Math.round((Date.now() - pageStart) / 1000);
    trackEvent({
      session_id: sessionId,
      event: 'page_time',
      path,
      value: duration.toString()
    });

    // Track session time
    const sessionDuration = Math.round((Date.now() - sessionStart) / 1000);
    trackEvent({
      session_id: sessionId,
      event: 'session_time',
      path,
      value: sessionDuration.toString()
    });
  });

  // Track session time periodically
  setInterval(() => {
    const sessionDuration = Math.round((Date.now() - sessionStart) / 1000);
    trackEvent({
      session_id: sessionId,
      event: 'session_time',
      path,
      value: sessionDuration.toString()
    });
  }, 60000); // Update every minute
})();