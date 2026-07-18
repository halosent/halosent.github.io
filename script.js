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

  // article filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const essayItems = document.querySelectorAll('.essay');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      essayItems.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.display = show ? '' : 'none';
      });
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

});
