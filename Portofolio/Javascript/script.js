/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO — STEPH
   script.js — Interactions et animations
   ✏️ Les sections marquées ✏️ peuvent être facilement modifiées
════════════════════════════════════════════════════════════════ */

/* ─── UTILITAIRE : attendre le DOM ──────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  // ────────────────────────────────────────────────────────────
  // 1. ANNÉE DYNAMIQUE DANS LE FOOTER
  // ────────────────────────────────────────────────────────────
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ────────────────────────────────────────────────────────────
  // 2. CURSEUR PERSONNALISÉ
  // (désactivé automatiquement sur mobile via CSS)
  // ────────────────────────────────────────────────────────────
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');

  if (cursor && follower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Curseur principal suit immédiatement
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    // Le follower suit avec un léger retard (lerp)
    function animateCursor() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top  = followerY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  // ────────────────────────────────────────────────────────────
  // 3. NAVBAR — changement de style au scroll
  // ────────────────────────────────────────────────────────────
  const navbar = document.getElementById('navbar');

  function handleNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbar, { passive: true });
  handleNavbar(); // état initial

  // ────────────────────────────────────────────────────────────
  // 4. MENU HAMBURGER (mobile)
  // ────────────────────────────────────────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      // Empêcher le scroll du body quand le menu est ouvert
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Fermer le menu quand on clique sur un lien
    mobileMenu.querySelectorAll('.mob-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ────────────────────────────────────────────────────────────
  // 5. ANIMATIONS AU SCROLL — Intersection Observer
  // Tous les éléments avec la class "reveal" apparaissent
  // progressivement quand ils entrent dans la fenêtre.
  // ────────────────────────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Délai en cascade pour les éléments proches
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, entry.target.dataset.delay || 0);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  // Ajouter des délais en cascade aux enfants de même niveau
  document.querySelectorAll('.skills-grid, .projects-grid, .about-stats, .hero-cta').forEach(parent => {
    parent.querySelectorAll('.reveal, .skill-card, .project-card, .stat, .btn').forEach((child, index) => {
      child.setAttribute('data-delay', index * 80);
    });
  });

  revealEls.forEach(el => revealObserver.observe(el));

  // ────────────────────────────────────────────────────────────
  // 6. LIEN ACTIF dans la navbar selon la section visible
  // ────────────────────────────────────────────────────────────
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(section => sectionObserver.observe(section));

  // Style du lien actif (ajouté dynamiquement)
  const activeStyle = document.createElement('style');
  activeStyle.textContent = `
    .nav-link.active { color: var(--accent) !important; }
    .nav-link.active::after { width: 100% !important; }
  `;
  document.head.appendChild(activeStyle);

  // ────────────────────────────────────────────────────────────
  // 7. FORMULAIRE DE CONTACT — Validation + Feedback
  // ✏️ Remplace l'alerte par une vraie requête fetch vers
  //    ton backend PHP (ex: contact.php) quand tu seras prêt.
  // ────────────────────────────────────────────────────────────
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      btn.textContent = 'Envoi en cours...';
      btn.disabled = true;

      // ──────────────────────────────────────────────────────
      // ✏️ OPTION A : Simulation (mode démo sans backend)
      // Remplace ce bloc par OPTION B quand tu as un backend.
      // ──────────────────────────────────────────────────────
      await new Promise(r => setTimeout(r, 1200)); // Simule un délai réseau

      formFeedback.style.color = 'var(--accent-2)';
      formFeedback.textContent = '✓ Message envoyé ! Je te répondrai bientôt.';
      contactForm.reset();

      // ──────────────────────────────────────────────────────
      // ✏️ OPTION B : Vrai envoi vers ton backend PHP
      // Décommente et adapte quand tu as créé contact.php
      // ──────────────────────────────────────────────────────
      /*
      const formData = new FormData(contactForm);

      try {
        const response = await fetch('contact.php', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();

        if (result.success) {
          formFeedback.style.color = 'var(--accent-2)';
          formFeedback.textContent = '✓ Message envoyé avec succès !';
          contactForm.reset();
        } else {
          throw new Error(result.message || 'Erreur serveur');
        }
      } catch (err) {
        formFeedback.style.color = '#ff6b6b';
        formFeedback.textContent = '✗ Erreur : ' + err.message;
      }
      */

      btn.textContent = 'Envoyer le message';
      btn.disabled = false;

      // Effacer le message après 5 secondes
      setTimeout(() => { formFeedback.textContent = ''; }, 5000);
    });
  }

  // ────────────────────────────────────────────────────────────
  // 8. NAVIGATION DOUCE — Scroll sur les ancres internes
  // ────────────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ────────────────────────────────────────────────────────────
  // 9. EFFET PARALLAX LÉGER sur les orbes du hero
  // (subtil, pour ne pas distraire)
  // ────────────────────────────────────────────────────────────
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');

  if (orb1 && orb2) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      orb1.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
      orb2.style.transform = `translate(${-x * 0.3}px, ${-y * 0.3}px)`;
    }, { passive: true });
  }

  // ────────────────────────────────────────────────────────────
  // 10. ANIMATION DE FRAPPE sur le titre hero (typewriter)
  // ✏️ Modifie les phrases dans le tableau 'phrases' ci-dessous
  // ────────────────────────────────────────────────────────────
  const heroName = document.querySelector('.hero-name');

  if (heroName) {
    // ✏️ Tu peux remplacer par tes propres phrases
    const phrases = [
      'Steph.',
      'Développeur.',
      'Créateur.',
      'Apprenant.',
    ];

    let phraseIndex = 0;
    let charIndex   = 0;
    let isDeleting  = false;
    let isPaused    = false;

    // ✏️ Mets false si tu préfères juste "Steph." fixe sans animation
    const ENABLE_TYPEWRITER = true;

    if (ENABLE_TYPEWRITER) {
      heroName.textContent = '';

      function typeWriter() {
        if (isPaused) return;

        const currentPhrase = phrases[phraseIndex];

        if (!isDeleting) {
          // Écriture
          heroName.textContent = currentPhrase.slice(0, charIndex + 1);
          charIndex++;
          if (charIndex === currentPhrase.length) {
            // Pause avant effacement
            isPaused = true;
            setTimeout(() => { isPaused = false; isDeleting = true; typeWriter(); }, 2000);
            return;
          }
        } else {
          // Effacement
          heroName.textContent = currentPhrase.slice(0, charIndex - 1);
          charIndex--;
          if (charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
          }
        }

        const speed = isDeleting ? 60 : 100;
        setTimeout(typeWriter, speed);
      }

      // Démarrer après un petit délai
      setTimeout(typeWriter, 1200);
    }
  }

  // ────────────────────────────────────────────────────────────
  // FIN — Portfolio initialisé avec succès ✓
  // ────────────────────────────────────────────────────────────
  console.log('🚀 Portfolio Steph — initialisé');

}); // fin DOMContentLoaded
