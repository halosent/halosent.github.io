// Live Orthodox — shared behaviour

document.addEventListener('DOMContentLoaded', () => {

  // dark mode toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('lo_theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('lo_theme', 'dark');
      }
    });
  }

  // announcement bar dismiss
  const bar = document.getElementById('announcementBar');
  const closeBtn = document.getElementById('announcementClose');
  if (bar && closeBtn) {
    if (localStorage.getItem('lo_announcement_dismissed') === 'true') {
      bar.style.display = 'none';
    }
    closeBtn.addEventListener('click', () => {
      bar.style.display = 'none';
      localStorage.setItem('lo_announcement_dismissed', 'true');
    });
  }

  // mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // essay accordion (articles page)
  const essays = document.querySelectorAll('.essay');
  essays.forEach(essay => {
    const head = essay.querySelector('.essay-head');
    const body = essay.querySelector('.essay-body');
    if (!head || !body) return;
    head.addEventListener('click', () => {
      const isOpen = essay.classList.contains('open');
      essays.forEach(other => {
        other.classList.remove('open');
        other.querySelector('.essay-body').style.maxHeight = null;
      });
      if (!isOpen) {
        essay.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 40 + 'px';
      }
    });
  });

  // faq accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
      }
    });
  });

  // article filter + search combined (declared early so bookmark logic below can use essayItems)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const essayItems = document.querySelectorAll('.essay');
  const searchInput = document.getElementById('articleSearch');
  const noResults = document.getElementById('noResults');
  let activeFilter = 'all';

  // bookmarks: inject star button next to each essay's toggle, wrap both
  const BOOKMARK_KEY = 'lo_bookmarks';
  function getBookmarks() {
    try {
      return new Set(JSON.parse(localStorage.getItem(BOOKMARK_KEY) || '[]'));
    } catch (e) {
      return new Set();
    }
  }
  function saveBookmarks(set) {
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(Array.from(set)));
  }
  let bookmarks = getBookmarks();

  essayItems.forEach(essay => {
    const head = essay.querySelector('.essay-head');
    const toggle = essay.querySelector('.essay-toggle');
    if (!head || !toggle) return;
    const id = essay.id;

    const wrap = document.createElement('div');
    wrap.className = 'essay-head-actions';

    const star = document.createElement('button');
    star.className = 'essay-bookmark';
    star.setAttribute('aria-label', 'Save for later');
    star.dataset.id = id;
    star.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 3h12a1 1 0 011 1v17l-7-4-7 4V4a1 1 0 011-1z"/></svg>';
    if (bookmarks.has(id)) star.classList.add('saved');

    head.insertBefore(wrap, toggle);
    wrap.appendChild(star);
    wrap.appendChild(toggle);

    star.addEventListener('click', (e) => {
      e.stopPropagation();
      if (bookmarks.has(id)) {
        bookmarks.delete(id);
        star.classList.remove('saved');
      } else {
        bookmarks.add(id);
        star.classList.add('saved');
      }
      saveBookmarks(bookmarks);
      if (activeFilter === 'bookmarked') applyEssayFilters();
    });
  });

  function applyEssayFilters() {
    const term = (searchInput ? searchInput.value : '').trim().toLowerCase();
    let visibleCount = 0;
    essayItems.forEach(item => {
      let matchesCategory;
      if (activeFilter === 'all') {
        matchesCategory = true;
      } else if (activeFilter === 'bookmarked') {
        matchesCategory = bookmarks.has(item.id);
      } else {
        matchesCategory = item.dataset.category === activeFilter;
      }
      const text = item.textContent.toLowerCase();
      const matchesSearch = term === '' || text.includes(term);
      const show = matchesCategory && matchesSearch;
      item.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });
    if (noResults) {
      if (activeFilter === 'bookmarked' && visibleCount === 0 && term === '') {
        noResults.textContent = "You haven't saved any articles yet. Tap the bookmark icon on an essay to save it here.";
      } else {
        noResults.textContent = 'No articles match your search.';
      }
      noResults.style.display = visibleCount === 0 ? '' : 'none';
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      applyEssayFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyEssayFilters);
  }

  // essay actions: copy link, share to X, download
  const clockIconUnused = null;
  essayItems.forEach(essay => {
    const bodyInner = essay.querySelector('.essay-body-inner');
    const h3 = essay.querySelector('h3');
    if (!bodyInner || !h3) return;
    const id = essay.id;
    const title = h3.textContent;
    const url = window.location.origin + window.location.pathname + '#' + id;
    const shareText = encodeURIComponent(title + ' — Live Orthodox');
    const shareUrl = encodeURIComponent(url);

    const actions = document.createElement('div');
    actions.className = 'essay-actions';
    actions.innerHTML =
      '<button class="essay-action-btn" data-role="copy" data-url="' + url + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 13a5 5 0 007.07 0l2-2a5 5 0 00-7.07-7.07l-1 1"/><path d="M14 11a5 5 0 00-7.07 0l-2 2a5 5 0 007.07 7.07l1-1"/></svg>' +
        '<span class="action-label">Copy link</span>' +
      '</button>' +
      '<a class="essay-action-btn" href="https://twitter.com/intent/tweet?url=' + shareUrl + '&text=' + shareText + '" target="_blank" rel="noopener">' +
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.6 8.7L23.3 22H16.9l-5-6.5-5.7 6.5H2l8.1-9.3L1 2h6.6l4.5 6 6.8-6zM17.7 20h1.7L7.4 3.9H5.6L17.7 20z"/></svg>' +
        '<span class="action-label">Share</span>' +
      '</a>' +
      '<button class="essay-action-btn" data-role="download" data-id="' + id + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16"/></svg>' +
        '<span class="action-label">Download</span>' +
      '</button>';
    bodyInner.appendChild(actions);
  });

  document.querySelectorAll('.essay-action-btn[data-role="copy"]').forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(btn.dataset.url).then(() => {
        const label = btn.querySelector('.action-label');
        const original = label.textContent;
        label.textContent = 'Copied';
        setTimeout(() => { label.textContent = original; }, 1800);
      });
    });
  });

  document.querySelectorAll('.essay-action-btn[data-role="download"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const essay = document.getElementById(btn.dataset.id);
      if (!essay) return;
      const title = essay.querySelector('h3').textContent;
      const paras = Array.from(essay.querySelectorAll('.essay-body-inner p'))
        .map(p => p.textContent.trim())
        .join('\n\n');
      const text = title + '\n\nLive Orthodox — liveorthodox.com\n\n' + paras;
      const blob = new Blob([text], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = btn.dataset.id + '.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    });
  });

  // copy email button
  const copyBtn = document.querySelector('.copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = copyBtn.dataset.email;
      navigator.clipboard.writeText(email).then(() => {
        const original = copyBtn.textContent;
        copyBtn.textContent = 'Copied';
        setTimeout(() => { copyBtn.textContent = original; }, 1800);
      });
    });
  }

  // verse lookup
  const verseForm = document.getElementById('verseForm');
  const verseInput = document.getElementById('verseInput');
  const verseResult = document.getElementById('verseResult');

  async function lookupVerse(ref) {
    if (!ref || !ref.trim()) return;
    verseResult.innerHTML = '<p class="verse-loading">Looking that up...</p>';
    try {
      const res = await fetch('https://bible-api.com/' + encodeURIComponent(ref.trim()));
      if (!res.ok) throw new Error('not found');
      const data = await res.json();
      if (!data || !data.text) throw new Error('not found');
      const text = data.text.trim().replace(/\n+/g, ' ');
      verseResult.innerHTML =
        '<div class="verse-card">' +
          '<div class="verse-ref">' + data.reference + '</div>' +
          '<div class="verse-text">' + text + '</div>' +
          '<div class="verse-translation">' + (data.translation_name || 'World English Bible') + '</div>' +
        '</div>';
    } catch (err) {
      verseResult.innerHTML = '<div class="verse-error">Couldn\'t find that reference. Try a format like "John 3:16" or "Romans 8:28-30".</div>';
    }
  }

  if (verseForm) {
    verseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      lookupVerse(verseInput.value);
    });
    document.querySelectorAll('.verse-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        verseInput.value = chip.dataset.ref;
        lookupVerse(chip.dataset.ref);
      });
    });
  }

});
