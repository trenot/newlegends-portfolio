/**
 * NewLegends: Jodie Devine's Concert Photography Journal & Review Archive
 * Core Application Engine, Routing, Dynamic Views, LocalStorage, Map & Lightbox
 */

(function () {
  'use strict';

  // --- STATE ---
  const STORAGE_KEY = 'newlegends_concerts_v1';
  const GRAIN_STORAGE_KEY = 'newlegends_grain_active';

  let concerts = loadConcerts();
  let currentView = 'home';
  let activeShowId = null;
  let activePhotoIndex = 0;
  let vaultPhotos = [];
  let mapInstance = null;

  // Filter state
  let searchQuery = '';
  let selectedArtistFilter = 'all';
  let selectedCityFilter = 'all';
  let selectedTourFilter = 'all';
  let minRatingFilter = 0;
  let showFavoritesOnly = false;
  let sortBy = 'date-desc';

  // --- INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', () => {
    initFilmGrain();
    setupRouting();
    setupGlobalEventListeners();
    handleRoute();
    lucide.createIcons();
  });

  // --- LOCAL STORAGE HELPERS ---
  function loadConcerts() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored concerts, using defaults', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_CONCERTS));
  }

  function saveConcerts() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(concerts));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  function resetDefaultConcerts() {
    if (confirm('Reset concert archive to default original entries? Your local edits will be reset.')) {
      concerts = JSON.parse(JSON.stringify(DEFAULT_CONCERTS));
      saveConcerts();
      renderCurrentView();
      showToast('Concert archive reset to defaults.');
    }
  }

  // --- FILM GRAIN TOGGLE ---
  function initFilmGrain() {
    const isEnabled = localStorage.getItem(GRAIN_STORAGE_KEY) !== 'false';
    const grainOverlay = document.getElementById('film-grain-overlay');
    const grainToggleBtn = document.getElementById('grain-toggle-btn');

    if (!isEnabled) {
      document.body.classList.add('grain-disabled');
      if (grainToggleBtn) grainToggleBtn.classList.remove('text-amber-400');
    } else {
      document.body.classList.remove('grain-disabled');
      if (grainToggleBtn) grainToggleBtn.classList.add('text-amber-400');
    }

    if (grainToggleBtn) {
      grainToggleBtn.addEventListener('click', () => {
        const currentlyDisabled = document.body.classList.contains('grain-disabled');
        if (currentlyDisabled) {
          document.body.classList.remove('grain-disabled');
          localStorage.setItem(GRAIN_STORAGE_KEY, 'true');
          grainToggleBtn.classList.add('text-amber-400');
          showToast('35mm Film Grain: Enabled');
        } else {
          document.body.classList.add('grain-disabled');
          localStorage.setItem(GRAIN_STORAGE_KEY, 'false');
          grainToggleBtn.classList.remove('text-amber-400');
          showToast('35mm Film Grain: Disabled');
        }
      });
    }
  }

  // --- HASH ROUTING ---
  function setupRouting() {
    window.addEventListener('hashchange', handleRoute);
  }

  function handleRoute() {
    const hash = window.location.hash || '#/home';
    const cleanHash = hash.replace(/^#\/?/, '');
    const parts = cleanHash.split('/');

    const mainRoute = parts[0] || 'home';
    const subParam = parts[1];

    if (mainRoute === 'show' && subParam) {
      currentView = 'show';
      activeShowId = subParam;
    } else {
      currentView = mainRoute;
      activeShowId = null;
    }

    updateNavigationUI();
    renderCurrentView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function navigateTo(hash) {
    window.location.hash = hash;
  }

  function updateNavigationUI() {
    // Update active state in desktop and mobile nav
    const navLinks = document.querySelectorAll('[data-nav-target]');
    navLinks.forEach(link => {
      const target = link.getAttribute('data-nav-target');
      if (target === currentView || (currentView === 'show' && target === 'reviews')) {
        link.classList.add('text-amber-400', 'border-amber-400');
        link.classList.remove('text-stone-400', 'border-transparent');
      } else {
        link.classList.remove('text-amber-400', 'border-amber-400');
        link.classList.add('text-stone-400', 'border-transparent');
      }
    });

    // Close mobile nav drawer if open
    const mobileMenu = document.getElementById('mobile-nav-drawer');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
    }
  }

  // --- GLOBAL EVENT LISTENERS ---
  function setupGlobalEventListeners() {
    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      // Lightbox navigation
      const lightbox = document.getElementById('photo-lightbox');
      if (lightbox && !lightbox.classList.contains('hidden')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextLightboxPhoto();
        if (e.key === 'ArrowLeft') prevLightboxPhoto();
        return;
      }

      // Close modal on escape
      const logModal = document.getElementById('log-show-modal');
      if (logModal && !logModal.classList.contains('hidden') && e.key === 'Escape') {
        closeLogModal();
        return;
      }

      const editModal = document.getElementById('edit-show-modal');
      if (editModal && !editModal.classList.contains('hidden') && e.key === 'Escape') {
        closeEditModal();
        return;
      }

      const pmModal = document.getElementById('photo-manager-modal');
      if (pmModal && !pmModal.classList.contains('hidden') && e.key === 'Escape') {
        closePhotoManagerModal();
        return;
      }

      // Quick search shortcut with '/'
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input') || document.getElementById('view-search-input');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    const mobileDrawer = document.getElementById('mobile-nav-drawer');
    const mobileCloseBtn = document.getElementById('mobile-nav-close');
    if (mobileMenuBtn && mobileDrawer) {
      mobileMenuBtn.addEventListener('click', () => mobileDrawer.classList.toggle('hidden'));
    }
    if (mobileCloseBtn && mobileDrawer) {
      mobileCloseBtn.addEventListener('click', () => mobileDrawer.classList.add('hidden'));
    }

    // Global Search Input
    const globalSearch = document.getElementById('global-search-input');
    if (globalSearch) {
      globalSearch.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        if (currentView !== 'reviews') {
          navigateTo('#/reviews');
        } else {
          renderReviewsView();
        }
      });
    }

    // Log Show Modal Triggers
    const logShowBtns = document.querySelectorAll('.open-log-modal-btn');
    logShowBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openLogModal();
      });
    });

    // Close Log Modal
    const closeLogBtn = document.getElementById('close-log-modal-btn');
    const logModalBackdrop = document.getElementById('log-modal-backdrop');
    if (closeLogBtn) closeLogBtn.addEventListener('click', closeLogModal);
    if (logModalBackdrop) logModalBackdrop.addEventListener('click', closeLogModal);

    // Close Edit Modal
    const closeEditBtn = document.getElementById('close-edit-modal-btn');
    const editModalBackdrop = document.getElementById('edit-modal-backdrop');
    if (closeEditBtn) closeEditBtn.addEventListener('click', closeEditModal);
    if (editModalBackdrop) editModalBackdrop.addEventListener('click', closeEditModal);

    // Photo Manager Modal Triggers
    const openPmBtn = document.getElementById('open-photo-manager-btn');
    const mobileOpenPmBtn = document.getElementById('mobile-open-photo-manager-btn');
    if (openPmBtn) openPmBtn.addEventListener('click', () => openPhotoManagerModal());
    if (mobileOpenPmBtn) mobileOpenPmBtn.addEventListener('click', () => openPhotoManagerModal());

    const closePmBtn = document.getElementById('close-photo-manager-btn');
    const pmBackdrop = document.getElementById('photo-manager-backdrop');
    if (closePmBtn) closePmBtn.addEventListener('click', closePhotoManagerModal);
    if (pmBackdrop) pmBackdrop.addEventListener('click', closePhotoManagerModal);

    // Lightbox Controls
    const closeLightboxBtn = document.getElementById('lightbox-close-btn');
    const prevLightboxBtn = document.getElementById('lightbox-prev-btn');
    const nextLightboxBtn = document.getElementById('lightbox-next-btn');
    const lightboxBackdrop = document.getElementById('lightbox-backdrop');

    if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);
    if (prevLightboxBtn) prevLightboxBtn.addEventListener('click', prevLightboxPhoto);
    if (nextLightboxBtn) nextLightboxBtn.addEventListener('click', nextLightboxPhoto);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

    // Setup Form & Manager handlers
    setupLogShowForm();
    setupEditShowForm();
    setupPhotoManagerEvents();
  }

  // --- VIEW RENDERING ROUTER ---
  function renderCurrentView() {
    const mainContainer = document.getElementById('main-content-outlet');
    if (!mainContainer) return;

    switch (currentView) {
      case 'home':
        renderHomeView();
        break;
      case 'reviews':
        renderReviewsView();
        break;
      case 'show':
        renderSingleShowView(activeShowId);
        break;
      case 'timeline':
        renderTimelineView();
        break;
      case 'vault':
        renderPhotoVaultView();
        break;
      case 'stats':
        renderStatsView();
        break;
      case 'sitemap':
        renderSitemapView();
        break;
      case 'about':
        renderAboutView();
        break;
      default:
        renderHomeView();
    }

    lucide.createIcons();
  }

  // =========================================================================
  // VIEW: HOME / SPOTLIGHT
  // =========================================================================
  function renderHomeView() {
    const outlet = document.getElementById('main-content-outlet');
    const favorites = concerts.filter(c => c.favorite);
    const recent = [...concerts].sort((a, b) => new Date(b.dateIso) - new Date(a.dateIso)).slice(0, 4);

    outlet.innerHTML = `
      <!-- Hero Section -->
      <section class="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 border-b border-stone-800/80">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div class="lg:col-span-7 space-y-6">
              <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900 border border-stone-700/60 text-xs font-mono tracking-widest text-amber-400 uppercase">
                <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                Archive Active · 18 Shows Logged · 11 Cities
              </div>
              
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-serif-editorial font-bold tracking-tight text-stone-100 leading-[1.1]">
                Preserving the kinetic pulse between the barrier & stage.
              </h1>
              
              <p class="text-lg sm:text-xl text-stone-300 font-light leading-relaxed">
                Welcome to <strong class="text-amber-400 font-medium">NewLegends</strong>: Jodie Devine's concert photography journal and review archive. 
                Documenting live music with an organic analog film aesthetic, 4-axis critical ratings, and pit-level barrier perspectives.
              </p>

              <div class="flex flex-wrap gap-4 pt-4">
                <a href="#/reviews" class="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold transition-all shadow-lg shadow-amber-950/40">
                  <i data-lucide="book-open" class="w-5 h-5"></i>
                  <span>Explore Concert Reviews</span>
                </a>
                <a href="#/vault" class="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-stone-700 font-medium transition-all">
                  <i data-lucide="camera" class="w-5 h-5"></i>
                  <span>Photo Vault</span>
                </a>
                <a href="#/stats" class="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 font-medium transition-all">
                  <i data-lucide="map" class="w-5 h-5"></i>
                  <span>Tour Map & Stats</span>
                </a>
              </div>

              <!-- Quick Connect Badges -->
              <div class="pt-6 border-t border-stone-800/60 flex flex-wrap items-center gap-3 text-xs font-mono text-stone-400">
                <span class="text-stone-500">DIRECT INTEGRATION:</span>
                <a href="https://jumbleofnotes.wordpress.com/" target="_blank" rel="noopener noreferrer" class="hover:text-amber-400 transition-colors flex items-center gap-1 bg-stone-900/80 px-2.5 py-1 rounded-lg border border-stone-800">
                  <i data-lucide="globe" class="w-3.5 h-3.5"></i> Jumble of Notes
                </a>
                <a href="https://www.instagram.com/jodiedevineart/" target="_blank" rel="noopener noreferrer" class="hover:text-amber-400 transition-colors flex items-center gap-1 bg-stone-900/80 px-2.5 py-1 rounded-lg border border-stone-800">
                  <i data-lucide="instagram" class="w-3.5 h-3.5"></i> @jodiedevineart
                </a>
                <a href="https://jodiedevinef.wixsite.com/jodiefolio" target="_blank" rel="noopener noreferrer" class="hover:text-amber-400 transition-colors flex items-center gap-1 bg-stone-900/80 px-2.5 py-1 rounded-lg border border-stone-800">
                  <i data-lucide="external-link" class="w-3.5 h-3.5"></i> Jodie Devine Folio
                </a>
              </div>
            </div>

            <!-- Hero Featured Film Slide Card -->
            <div class="lg:col-span-5">
              <div class="deckled-card rounded-3xl p-4 sm:p-5 border border-stone-700/80 bg-stone-900/90 shadow-2xl relative">
                <div class="film-sprockets rounded-2xl overflow-hidden relative mb-4">
                  <img src="${favorites[0]?.coverPhoto || recent[0]?.coverPhoto}" alt="Featured Live Concert" class="w-full h-80 sm:h-96 object-cover hover:scale-105 transition-transform duration-700" />
                  <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80"></div>
                  <div class="absolute bottom-4 left-4 right-4 text-stone-100">
                    <span class="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/90 text-stone-950 text-xs font-mono font-bold tracking-wider mb-2 uppercase">
                      Spotlight Entry
                    </span>
                    <h3 class="text-2xl font-serif-editorial font-bold leading-tight">${favorites[0]?.artist}</h3>
                    <p class="text-xs font-mono text-stone-300 mt-1">${favorites[0]?.venue} · ${favorites[0]?.city}, ${favorites[0]?.state}</p>
                  </div>
                </div>

                <div class="p-2 space-y-3">
                  <blockquote class="italic text-stone-300 font-serif-editorial text-lg border-l-2 border-amber-500 pl-3 leading-snug">
                    "${favorites[0]?.standoutQuote}"
                  </blockquote>

                  <div class="grid grid-cols-4 gap-2 pt-2 text-center text-xs font-mono">
                    <div class="bg-stone-950/60 p-2 rounded-xl border border-stone-800">
                      <div class="text-stone-400 text-[10px]">ENERGY</div>
                      <div class="text-amber-400 font-bold text-sm">${favorites[0]?.ratings.energy}</div>
                    </div>
                    <div class="bg-stone-950/60 p-2 rounded-xl border border-stone-800">
                      <div class="text-stone-400 text-[10px]">VOCALS</div>
                      <div class="text-sky-400 font-bold text-sm">${favorites[0]?.ratings.vocals}</div>
                    </div>
                    <div class="bg-stone-950/60 p-2 rounded-xl border border-stone-800">
                      <div class="text-stone-400 text-[10px]">CROWD</div>
                      <div class="text-emerald-400 font-bold text-sm">${favorites[0]?.ratings.crowdVibe}</div>
                    </div>
                    <div class="bg-stone-950/60 p-2 rounded-xl border border-stone-800">
                      <div class="text-stone-400 text-[10px]">ACOUSTICS</div>
                      <div class="text-purple-400 font-bold text-sm">${favorites[0]?.ratings.acoustics}</div>
                    </div>
                  </div>

                  <a href="#/show/${favorites[0]?.id}" class="mt-2 w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-sm font-medium flex items-center justify-center gap-2 transition-colors border border-stone-700/60">
                    <span>Read Full Editorial Review</span>
                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- Archive Quick Metrics Bar -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div class="bg-stone-900/90 backdrop-blur border border-stone-800 rounded-3xl p-6 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <i data-lucide="ticket" class="w-6 h-6"></i>
            </div>
            <div>
              <div class="text-2xl font-bold font-mono text-stone-100">${concerts.length}</div>
              <div class="text-xs text-stone-400 font-mono uppercase tracking-wider">Shows Documented</div>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <i data-lucide="map-pin" class="w-6 h-6"></i>
            </div>
            <div>
              <div class="text-2xl font-bold font-mono text-stone-100">${new Set(concerts.map(c => c.city)).size}</div>
              <div class="text-xs text-stone-400 font-mono uppercase tracking-wider">Unique Cities</div>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <i data-lucide="camera" class="w-6 h-6"></i>
            </div>
            <div>
              <div class="text-2xl font-bold font-mono text-stone-100">${concerts.reduce((acc, c) => acc + (c.photos ? c.photos.length : 1), 0)}+</div>
              <div class="text-xs text-stone-400 font-mono uppercase tracking-wider">Pit Photos Vaulted</div>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <i data-lucide="award" class="w-6 h-6"></i>
            </div>
            <div>
              <div class="text-2xl font-bold font-mono text-stone-100">CAMINO / 5SOS</div>
              <div class="text-xs text-stone-400 font-mono uppercase tracking-wider">Most Seen Headliners</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Concert Reviews Grid -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <div class="text-xs font-mono tracking-widest text-amber-400 uppercase mb-1">CURATED SELECTION</div>
            <h2 class="text-3xl font-serif-editorial font-bold text-stone-100">Featured Concert Reviews</h2>
          </div>
          <a href="#/reviews" class="inline-flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300">
            <span>View All ${concerts.length} Shows</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${favorites.slice(0, 6).map(concert => renderShowCardMarkup(concert)).join('')}
        </div>
      </section>

      <!-- Tour Run Spotlight Banner -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div class="deckled-card rounded-3xl p-8 sm:p-10 border border-stone-800 bg-gradient-to-br from-stone-900 to-stone-950 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div class="space-y-4 max-w-2xl">
            <span class="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-wider">
              Cross-Country Chronology
            </span>
            <h3 class="text-3xl sm:text-4xl font-serif-editorial font-bold text-stone-100">
              The "Everyone's A Star!" Road Run & Special Residencies
            </h3>
            <p class="text-stone-300 font-light leading-relaxed">
              Trace the road journey from Uncasville to Boston, back-to-back nights at Madison Square Garden, the legendary 200-cap dive bar gig at The Muse on Nantucket, down to the Memphis 2-night homecoming.
            </p>
          </div>
          <div class="flex flex-wrap gap-4 shrink-0">
            <a href="#/timeline" class="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold transition-all">
              View Tour Timeline
            </a>
            <a href="#/sitemap" class="px-6 py-3.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-medium transition-all">
              Browse Sitemap
            </a>
          </div>
        </div>
      </section>
    `;
  }

  // =========================================================================
  // VIEW: ALL CONCERT REVIEWS & SHOWS ARCHIVE (SEARCH & SEGMENTED FILTERS)
  // =========================================================================
  function renderReviewsView() {
    const outlet = document.getElementById('main-content-outlet');

    // Unique filter options
    const artists = ['all', ...Array.from(new Set(concerts.map(c => c.artist)))];
    const cities = ['all', ...Array.from(new Set(concerts.map(c => c.city)))];
    const tourRuns = ['all', ...Array.from(new Set(concerts.map(c => c.tourRun).filter(Boolean)))];

    // Filter concerts
    let filtered = concerts.filter(c => {
      // Search query across fields
      if (searchQuery) {
        const text = `${c.artist} ${c.supporting || ''} ${c.venue} ${c.city} ${c.state} ${c.tourRun} ${c.standoutQuote} ${c.review} ${c.setlist.map(s => s.song).join(' ')}`.toLowerCase();
        if (!text.includes(searchQuery)) return false;
      }
      // Artist filter
      if (selectedArtistFilter !== 'all' && c.artist !== selectedArtistFilter) {
        return false;
      }
      // City filter
      if (selectedCityFilter !== 'all' && c.city !== selectedCityFilter) {
        return false;
      }
      // Tour filter
      if (selectedTourFilter !== 'all' && c.tourRun !== selectedTourFilter) {
        return false;
      }
      // Rating filter
      if (minRatingFilter > 0 && c.ratings.overall < minRatingFilter) {
        return false;
      }
      // Favorites filter
      if (showFavoritesOnly && !c.favorite) {
        return false;
      }
      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.dateIso) - new Date(a.dateIso);
      if (sortBy === 'date-asc') return new Date(a.dateIso) - new Date(b.dateIso);
      if (sortBy === 'rating-desc') return b.ratings.overall - a.ratings.overall;
      if (sortBy === 'artist-asc') return a.artist.localeCompare(b.artist);
      return 0;
    });

    outlet.innerHTML = `
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <div class="text-xs font-mono tracking-widest text-amber-400 uppercase mb-1">EDITORIAL ARCHIVE</div>
            <h1 class="text-3xl sm:text-4xl font-serif-editorial font-bold text-stone-100">Concert Reviews & Show Logs</h1>
            <p class="text-stone-400 text-sm mt-1">Explore all ${concerts.length} documented tour dates with custom narratives, setlists, and 4-axis ratings.</p>
          </div>
          
          <div class="flex items-center gap-3">
            <button class="open-log-modal-btn px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm flex items-center gap-2 shadow-lg transition-all">
              <i data-lucide="plus-circle" class="w-4 h-4"></i>
              <span>Log a Show</span>
            </button>
            <button id="reset-defaults-btn" class="px-3.5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 text-xs font-mono flex items-center gap-1.5 transition-colors" title="Reset Local Storage to Default Archive">
              <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
              <span>Reset</span>
            </button>
          </div>
        </div>

        <!-- Filter & Search Control Panel -->
        <div class="deckled-card rounded-3xl p-6 border border-stone-800 bg-stone-900/90 mb-10 space-y-6">
          <!-- Search Bar -->
          <div class="relative">
            <i data-lucide="search" class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"></i>
            <input 
              type="text" 
              id="view-search-input" 
              placeholder="Search by artist, venue, city, song from setlist, or lyric quote... (Press '/' to focus)" 
              value="${searchQuery}"
              class="w-full bg-stone-950/80 border border-stone-700/80 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            ${searchQuery ? `
              <button id="clear-search-btn" class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-stone-400 hover:text-stone-200 bg-stone-800 px-2 py-1 rounded">Clear</button>
            ` : ''}
          </div>

          <!-- Segmented Select Filters -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Artist Select -->
            <div>
              <label class="block text-xs font-mono text-stone-400 uppercase mb-1">Artist</label>
              <select id="filter-artist-select" class="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-400">
                ${artists.map(a => `<option value="${a}" ${selectedArtistFilter === a ? 'selected' : ''}>${a === 'all' ? 'All Artists' : a}</option>`).join('')}
              </select>
            </div>

            <!-- City Select -->
            <div>
              <label class="block text-xs font-mono text-stone-400 uppercase mb-1">City</label>
              <select id="filter-city-select" class="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-400">
                ${cities.map(c => `<option value="${c}" ${selectedCityFilter === c ? 'selected' : ''}>${c === 'all' ? 'All Cities' : c}</option>`).join('')}
              </select>
            </div>

            <!-- Tour Run Select -->
            <div>
              <label class="block text-xs font-mono text-stone-400 uppercase mb-1">Tour Run</label>
              <select id="filter-tour-select" class="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-400">
                ${tourRuns.map(t => `<option value="${t}" ${selectedTourFilter === t ? 'selected' : ''}>${t === 'all' ? 'All Tour Runs' : t}</option>`).join('')}
              </select>
            </div>

            <!-- Sort By Select -->
            <div>
              <label class="block text-xs font-mono text-stone-400 uppercase mb-1">Sort Order</label>
              <select id="filter-sort-select" class="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-400">
                <option value="date-desc" ${sortBy === 'date-desc' ? 'selected' : ''}>Date: Most Recent First</option>
                <option value="date-asc" ${sortBy === 'date-asc' ? 'selected' : ''}>Date: Earliest First</option>
                <option value="rating-desc" ${sortBy === 'rating-desc' ? 'selected' : ''}>Overall Rating: Highest First</option>
                <option value="artist-asc" ${sortBy === 'artist-asc' ? 'selected' : ''}>Artist Name: A-Z</option>
              </select>
            </div>
          </div>

          <!-- Quick Toggle Pills & Rating Slider -->
          <div class="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-stone-800/80">
            <div class="flex items-center gap-3">
              <button id="toggle-favorites-btn" class="tag-pill ${showFavoritesOnly ? 'active' : ''}">
                <i data-lucide="star" class="w-3.5 h-3.5 ${showFavoritesOnly ? 'text-amber-400 fill-amber-400' : ''}"></i>
                <span>Favorites Only (${concerts.filter(c => c.favorite).length})</span>
              </button>

              <button id="clear-all-filters-btn" class="text-xs font-mono text-stone-400 hover:text-stone-200 underline">
                Reset All Filters
              </button>
            </div>

            <div class="flex items-center gap-3 text-xs font-mono text-stone-400">
              <span>Min Rating: <strong class="text-amber-400">${minRatingFilter > 0 ? minRatingFilter + '+' : 'Any'}</strong></span>
              <input 
                type="range" 
                id="filter-min-rating-slider" 
                min="0" 
                max="9.8" 
                step="0.1" 
                value="${minRatingFilter}" 
                class="analog-slider w-28" 
              />
            </div>
          </div>
        </div>

        <!-- Results Counter & Status -->
        <div class="flex items-center justify-between mb-6 text-xs font-mono text-stone-400">
          <span>Showing <strong>${filtered.length}</strong> of ${concerts.length} concerts</span>
          ${filtered.length === 0 ? '<span class="text-amber-400">No shows match your current filters. Try relaxing search criteria.</span>' : ''}
        </div>

        <!-- Concerts Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${filtered.map(concert => renderShowCardMarkup(concert)).join('')}
        </div>
      </section>
    `;

    // Attach dynamic filter events
    setupReviewFilterEvents();
  }

  function setupReviewFilterEvents() {
    const searchInput = document.getElementById('view-search-input');
    const clearSearch = document.getElementById('clear-search-btn');
    const artistSelect = document.getElementById('filter-artist-select');
    const citySelect = document.getElementById('filter-city-select');
    const tourSelect = document.getElementById('filter-tour-select');
    const sortSelect = document.getElementById('filter-sort-select');
    const favBtn = document.getElementById('toggle-favorites-btn');
    const clearBtn = document.getElementById('clear-all-filters-btn');
    const ratingSlider = document.getElementById('filter-min-rating-slider');
    const resetDefaultsBtn = document.getElementById('reset-defaults-btn');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderReviewsView();
      });
    }

    if (clearSearch) {
      clearSearch.addEventListener('click', () => {
        searchQuery = '';
        renderReviewsView();
      });
    }

    if (artistSelect) {
      artistSelect.addEventListener('change', (e) => {
        selectedArtistFilter = e.target.value;
        renderReviewsView();
      });
    }

    if (citySelect) {
      citySelect.addEventListener('change', (e) => {
        selectedCityFilter = e.target.value;
        renderReviewsView();
      });
    }

    if (tourSelect) {
      tourSelect.addEventListener('change', (e) => {
        selectedTourFilter = e.target.value;
        renderReviewsView();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        sortBy = e.target.value;
        renderReviewsView();
      });
    }

    if (favBtn) {
      favBtn.addEventListener('click', () => {
        showFavoritesOnly = !showFavoritesOnly;
        renderReviewsView();
      });
    }

    if (ratingSlider) {
      ratingSlider.addEventListener('input', (e) => {
        minRatingFilter = parseFloat(e.target.value);
        renderReviewsView();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchQuery = '';
        selectedArtistFilter = 'all';
        selectedCityFilter = 'all';
        selectedTourFilter = 'all';
        minRatingFilter = 0;
        showFavoritesOnly = false;
        sortBy = 'date-desc';
        renderReviewsView();
      });
    }

    if (resetDefaultsBtn) {
      resetDefaultsBtn.addEventListener('click', resetDefaultConcerts);
    }
  }

  // Helper: Card Markup for a single show in lists
  function renderShowCardMarkup(concert) {
    return `
      <article class="deckled-card rounded-3xl overflow-hidden border border-stone-800 bg-stone-900/90 flex flex-col group">
        <!-- Card Header Image with Film Sprockets -->
        <div class="relative h-56 overflow-hidden film-sprockets">
          <img 
            src="${concert.coverPhoto}" 
            alt="${concert.artist} live at ${concert.venue}" 
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent"></div>
          
          <!-- Top Badges -->
          <div class="absolute top-3 left-3 right-3 flex justify-between items-center z-20">
            <span class="px-2.5 py-1 rounded-full bg-stone-950/80 backdrop-blur border border-stone-700 text-stone-300 text-[11px] font-mono">
              ${concert.badge || concert.tourRun}
            </span>
            <div class="flex items-center gap-1.5">
              ${concert.favorite ? '<span class="p-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40"><i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i></span>' : ''}
              <span class="px-2.5 py-1 rounded-full bg-amber-500 text-stone-950 font-mono font-bold text-xs">
                ${concert.ratings.overall.toFixed(1)}
              </span>
            </div>
          </div>

          <!-- Bottom Image Meta -->
          <div class="absolute bottom-3 left-4 right-4 z-20">
            <span class="text-xs font-mono text-amber-400 tracking-wider uppercase">${concert.date}</span>
            <h3 class="text-xl font-serif-editorial font-bold text-stone-100 leading-snug line-clamp-1">${concert.artist}</h3>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div class="flex items-center gap-1.5 text-xs text-stone-400 font-mono mb-3">
              <i data-lucide="map-pin" class="w-3.5 h-3.5 text-stone-500"></i>
              <span>${concert.venue} · ${concert.city}, ${concert.state}</span>
            </div>

            <p class="text-stone-300 text-sm font-light line-clamp-3 italic font-serif-editorial text-base border-l-2 border-stone-700 pl-3">
              "${concert.standoutQuote}"
            </p>
          </div>

          <!-- 4-Axis Rating Mini Bars -->
          <div class="space-y-1.5 pt-2 border-t border-stone-800 text-[11px] font-mono">
            <div class="flex justify-between text-stone-400">
              <span>Energy: <strong class="text-amber-400">${concert.ratings.energy}</strong></span>
              <span>Vocals: <strong class="text-sky-400">${concert.ratings.vocals}</strong></span>
              <span>Crowd: <strong class="text-emerald-400">${concert.ratings.crowdVibe}</strong></span>
              <span>Acoustics: <strong class="text-purple-400">${concert.ratings.acoustics}</strong></span>
            </div>
            <div class="grid grid-cols-4 gap-1.5">
              <div class="axis-meter-bar"><div class="axis-meter-fill fill-energy" style="width: ${(concert.ratings.energy / 10) * 100}%"></div></div>
              <div class="axis-meter-bar"><div class="axis-meter-fill fill-vocals" style="width: ${(concert.ratings.vocals / 10) * 100}%"></div></div>
              <div class="axis-meter-bar"><div class="axis-meter-fill fill-crowd" style="width: ${(concert.ratings.crowdVibe / 10) * 100}%"></div></div>
              <div class="axis-meter-bar"><div class="axis-meter-fill fill-acoustics" style="width: ${(concert.ratings.acoustics / 10) * 100}%"></div></div>
            </div>
          </div>

          <!-- Action Footer -->
          <div class="pt-2 flex items-center justify-between border-t border-stone-800">
            <span class="text-xs font-mono text-stone-500 flex items-center gap-1">
              <i data-lucide="camera" class="w-3.5 h-3.5"></i>
              ${concert.photos?.length || 1} Photo${(concert.photos?.length || 1) > 1 ? 's' : ''}
            </span>
            <a 
              href="#/show/${concert.id}" 
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-300 text-xs font-semibold transition-all"
            >
              <span>View Review</span>
              <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
            </a>
          </div>
        </div>
      </article>
    `;
  }

  // =========================================================================
  // VIEW: INDIVIDUAL SHOW & REVIEW PAGE (CUSTOM NARRATIVE, 4-AXIS RATING, SETLIST)
  // =========================================================================
  function renderSingleShowView(showId) {
    const outlet = document.getElementById('main-content-outlet');
    const concert = concerts.find(c => c.id === showId);

    if (!concert) {
      outlet.innerHTML = `
        <div class="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
          <i data-lucide="alert-triangle" class="w-12 h-12 text-amber-400 mx-auto"></i>
          <h2 class="text-3xl font-serif-editorial font-bold text-stone-100">Concert Not Found</h2>
          <p class="text-stone-400">The concert review you requested does not exist or may have been removed.</p>
          <a href="#/reviews" class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 text-stone-950 font-semibold mt-4">
            <i data-lucide="arrow-left" class="w-4 h-4"></i> Back to All Reviews
          </a>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    // Previous and Next show in chronological order
    const sorted = [...concerts].sort((a, b) => new Date(a.dateIso) - new Date(b.dateIso));
    const currentIndex = sorted.findIndex(c => c.id === showId);
    const prevConcert = currentIndex > 0 ? sorted[currentIndex - 1] : null;
    const nextConcert = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;

    outlet.innerHTML = `
      <article class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <!-- Breadcrumbs & Actions -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-mono text-stone-400 border-b border-stone-800 pb-4">
          <div class="flex items-center gap-2">
            <a href="#/home" class="hover:text-amber-400">HOME</a>
            <span>/</span>
            <a href="#/reviews" class="hover:text-amber-400">REVIEWS</a>
            <span>/</span>
            <span class="text-stone-200 uppercase">${concert.city} (${concert.date})</span>
          </div>

          <div class="flex items-center gap-3">
            <button id="trigger-replace-photo-btn" class="px-3.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-400 hover:border-amber-400/50 flex items-center gap-1.5 transition-colors">
              <i data-lucide="image-plus" class="w-3.5 h-3.5 text-amber-400"></i>
              <span>Replace Photo</span>
            </button>
            <button id="trigger-edit-show-btn" class="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 flex items-center gap-1.5 transition-colors">
              <i data-lucide="edit-3" class="w-3.5 h-3.5 text-amber-400"></i>
              <span>Edit Ratings & Review</span>
            </button>
            <button id="toggle-card-favorite-btn" class="px-3.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-400 flex items-center gap-1.5 transition-colors">
              <i data-lucide="star" class="w-3.5 h-3.5 ${concert.favorite ? 'text-amber-400 fill-amber-400' : ''}"></i>
              <span>${concert.favorite ? 'Favorited' : 'Favorite'}</span>
            </button>
          </div>
        </div>

        <!-- Hero Header -->
        <div class="space-y-4">
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-wider">
              ${concert.tourRun || 'Tour Stop'}
            </span>
            <span class="px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-stone-300 text-xs font-mono">
              Perspective: ${concert.perspective || 'Barrier Center'}
            </span>
            ${concert.badge ? `<span class="px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-stone-400 text-xs font-mono">${concert.badge}</span>` : ''}
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-serif-editorial font-bold text-stone-100 tracking-tight leading-tight">
            ${concert.artist}
          </h1>

          ${concert.supporting ? `
            <div class="text-lg text-stone-400 font-light">
              With support from <strong class="text-stone-200">${concert.supporting}</strong>
            </div>
          ` : ''}

          <div class="flex flex-wrap items-center gap-6 pt-2 text-sm font-mono text-stone-400">
            <div class="flex items-center gap-2">
              <i data-lucide="calendar" class="w-4 h-4 text-amber-400"></i>
              <span>${concert.date}</span>
            </div>
            <div class="flex items-center gap-2">
              <i data-lucide="map-pin" class="w-4 h-4 text-amber-400"></i>
              <span>${concert.venue} · ${concert.city}, ${concert.state}</span>
            </div>
            <div class="flex items-center gap-2">
              <i data-lucide="camera" class="w-4 h-4 text-amber-400"></i>
              <span>${concert.gear || 'Sony A7IV'}</span>
            </div>
          </div>
        </div>

        <!-- Hero Cover Photo Banner with Film Sprockets -->
        <div class="film-sprockets rounded-3xl overflow-hidden relative shadow-2xl">
          <img 
            src="${concert.coverPhoto}" 
            alt="${concert.artist} at ${concert.venue}" 
            class="w-full h-80 sm:h-[450px] object-cover cursor-pointer hover:scale-[1.02] transition-transform duration-500" 
            id="hero-cover-photo-img"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-70"></div>
          <div class="absolute bottom-4 left-4 flex items-center gap-2 z-10">
            <button id="banner-replace-photo-btn" class="bg-stone-950/80 hover:bg-amber-500 hover:text-stone-950 text-stone-200 backdrop-blur px-3 py-1.5 rounded-xl border border-stone-800 text-xs font-mono flex items-center gap-1.5 transition-colors shadow-lg">
              <i data-lucide="upload" class="w-3.5 h-3.5 text-amber-400"></i>
              <span>Replace with Real Photo</span>
            </button>
          </div>
          <div class="absolute bottom-4 right-4 bg-stone-950/80 backdrop-blur px-3 py-1.5 rounded-xl border border-stone-800 text-xs font-mono text-stone-300 flex items-center gap-1.5 z-10">
            <i data-lucide="maximize-2" class="w-3.5 h-3.5"></i>
            <span>Click to expand in Lightbox</span>
          </div>
        </div>

        <!-- Standout Editorial Quote Callout -->
        <div class="deckled-card rounded-3xl p-8 border border-stone-800 bg-stone-900/80 relative">
          <span class="text-7xl font-serif text-amber-500/20 absolute -top-4 left-6 pointer-events-none">“</span>
          <p class="text-2xl sm:text-3xl font-serif-editorial italic text-stone-100 leading-snug relative z-10 pl-6 border-l-4 border-amber-500">
            ${concert.standoutQuote}
          </p>
          <div class="text-right text-xs font-mono text-stone-400 mt-4 uppercase tracking-widest">
            — Jodie Devine · ${concert.perspective || 'Barrier Center'}
          </div>
        </div>

        <!-- 4-Axis Rating System Radar & Meters -->
        <div class="deckled-card rounded-3xl p-6 sm:p-8 border border-stone-800 bg-stone-900 space-y-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-800 pb-4">
            <div>
              <div class="text-xs font-mono tracking-widest text-amber-400 uppercase">4-AXIS AUDIT & CRITIQUE</div>
              <h2 class="text-2xl font-serif-editorial font-bold text-stone-100">Live Performance Rating Profile</h2>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xs font-mono text-stone-400">OVERALL SCORE:</span>
              <span class="px-4 py-2 rounded-2xl bg-amber-500 text-stone-950 font-mono font-bold text-xl shadow-lg">
                ${concert.ratings.overall.toFixed(1)} / 10
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <!-- 4-Axis Detailed Progress Meters -->
            <div class="space-y-4">
              <!-- Energy -->
              <div class="space-y-1.5">
                <div class="flex justify-between items-center text-xs font-mono">
                  <span class="flex items-center gap-1.5 text-stone-300">
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    Stage Energy & Presence
                  </span>
                  <span class="text-amber-400 font-bold">${concert.ratings.energy.toFixed(1)} / 10</span>
                </div>
                <div class="axis-meter-bar h-2.5">
                  <div class="axis-meter-fill fill-energy" style="width: ${(concert.ratings.energy / 10) * 100}%"></div>
                </div>
              </div>

              <!-- Vocals -->
              <div class="space-y-1.5">
                <div class="flex justify-between items-center text-xs font-mono">
                  <span class="flex items-center gap-1.5 text-stone-300">
                    <span class="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                    Vocal Clarity & Control
                  </span>
                  <span class="text-sky-400 font-bold">${concert.ratings.vocals.toFixed(1)} / 10</span>
                </div>
                <div class="axis-meter-bar h-2.5">
                  <div class="axis-meter-fill fill-vocals" style="width: ${(concert.ratings.vocals / 10) * 100}%"></div>
                </div>
              </div>

              <!-- Crowd Vibe -->
              <div class="space-y-1.5">
                <div class="flex justify-between items-center text-xs font-mono">
                  <span class="flex items-center gap-1.5 text-stone-300">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    Pit Euphoria & Crowd Reciprocity
                  </span>
                  <span class="text-emerald-400 font-bold">${concert.ratings.crowdVibe.toFixed(1)} / 10</span>
                </div>
                <div class="axis-meter-bar h-2.5">
                  <div class="axis-meter-fill fill-crowd" style="width: ${(concert.ratings.crowdVibe / 10) * 100}%"></div>
                </div>
              </div>

              <!-- Acoustics -->
              <div class="space-y-1.5">
                <div class="flex justify-between items-center text-xs font-mono">
                  <span class="flex items-center gap-1.5 text-stone-300">
                    <span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                    Venue Acoustics & Low-End Separation
                  </span>
                  <span class="text-purple-400 font-bold">${concert.ratings.acoustics.toFixed(1)} / 10</span>
                </div>
                <div class="axis-meter-bar h-2.5">
                  <div class="axis-meter-fill fill-acoustics" style="width: ${(concert.ratings.acoustics / 10) * 100}%"></div>
                </div>
              </div>
            </div>

            <!-- Visual 4-Axis Radar Diagram -->
            <div class="flex flex-col items-center justify-center p-4 bg-stone-950/60 rounded-2xl border border-stone-800">
              <svg viewBox="0 0 240 240" class="w-56 h-56">
                <!-- Concentric Web Guides -->
                <circle cx="120" cy="120" r="100" fill="none" stroke="#2d2621" stroke-width="1" />
                <circle cx="120" cy="120" r="75" fill="none" stroke="#241e1a" stroke-width="1" />
                <circle cx="120" cy="120" r="50" fill="none" stroke="#241e1a" stroke-width="1" />
                <circle cx="120" cy="120" r="25" fill="none" stroke="#241e1a" stroke-width="1" />

                <!-- Axis Lines -->
                <line x1="120" y1="20" x2="120" y2="220" stroke="#38312b" stroke-width="1" />
                <line x1="20" y1="120" x2="220" y2="120" stroke="#38312b" stroke-width="1" />

                <!-- Dynamic Data Polygon -->
                ${renderRadarPolygon(concert.ratings)}

                <!-- Labels -->
                <text x="120" y="15" fill="#f59e0b" font-size="10" text-anchor="middle" font-family="Space Mono">ENERGY</text>
                <text x="225" y="123" fill="#38bdf8" font-size="10" text-anchor="start" font-family="Space Mono">VOCALS</text>
                <text x="120" y="235" fill="#10b981" font-size="10" text-anchor="middle" font-family="Space Mono">CROWD</text>
                <text x="15" y="123" fill="#a855f7" font-size="10" text-anchor="end" font-family="Space Mono">ACOUSTICS</text>
              </svg>
              <span class="text-[11px] font-mono text-stone-400 mt-2">Custom 4-Point Live Acoustic & Kinetic Matrix</span>
            </div>
          </div>
        </div>

        <!-- Main Narrative & Setlist Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <!-- Full Editorial Review Narrative -->
          <div class="lg:col-span-8 space-y-6">
            <div class="deckled-card rounded-3xl p-6 sm:p-8 border border-stone-800 bg-stone-900/90 space-y-4">
              <h2 class="text-2xl font-serif-editorial font-bold text-stone-100 border-b border-stone-800 pb-3 flex items-center gap-2">
                <i data-lucide="file-text" class="w-5 h-5 text-amber-400"></i>
                <span>Pit Dispatches & Critical Narrative</span>
              </h2>

              <div class="prose prose-invert max-w-none text-stone-300 font-light text-base sm:text-lg leading-relaxed space-y-4">
                <p>${concert.review}</p>
              </div>

              <!-- Photographer's Pit Field Notes -->
              <div class="pt-6 border-t border-stone-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div class="p-3 bg-stone-950/80 rounded-xl border border-stone-800">
                  <div class="text-stone-500 uppercase">Camera Gear Deployed</div>
                  <div class="text-stone-300 font-medium mt-0.5">${concert.gear || 'Sony A7IV · Prime Lens'}</div>
                </div>
                <div class="p-3 bg-stone-950/80 rounded-xl border border-stone-800">
                  <div class="text-stone-500 uppercase">Pit & Barrier Positioning</div>
                  <div class="text-stone-300 font-medium mt-0.5">${concert.perspective || 'Barrier Center'}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Setlist Column -->
          <div class="lg:col-span-4 space-y-6">
            <div class="deckled-card rounded-3xl p-6 border border-stone-800 bg-stone-900 space-y-4">
              <div class="flex items-center justify-between border-b border-stone-800 pb-3">
                <h3 class="text-xl font-serif-editorial font-bold text-stone-100 flex items-center gap-2">
                  <i data-lucide="music" class="w-4 h-4 text-amber-400"></i>
                  <span>Official Setlist</span>
                </h3>
                <span class="text-xs font-mono text-stone-400">${concert.setlist.length} Songs</span>
              </div>

              <ol class="space-y-2 font-mono text-xs text-stone-300">
                ${concert.setlist.map((item, idx) => `
                  <li class="p-2.5 rounded-xl ${item.highlight ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300' : 'bg-stone-950/60 border border-stone-800/80'} flex items-center justify-between gap-2">
                    <span class="flex items-center gap-2">
                      <span class="text-stone-500 w-4">${idx + 1}.</span>
                      <span class="font-medium">${item.song}</span>
                    </span>
                    ${item.highlight ? '<span class="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1"><i data-lucide="sparkles" class="w-3 h-3"></i> Highlight</span>' : ''}
                  </li>
                `).join('')}
              </ol>
            </div>
          </div>
        </div>

        <!-- Concert Photo Gallery & Lightbox Access -->
        <div class="space-y-6 pt-4">
          <div class="flex justify-between items-center border-b border-stone-800 pb-3">
            <div>
              <div class="text-xs font-mono tracking-widest text-amber-400 uppercase">PIT VAULT SELECTION</div>
              <h2 class="text-2xl font-serif-editorial font-bold text-stone-100">Live Pit & Stage Captures</h2>
            </div>
            <span class="text-xs font-mono text-stone-400">${concert.photos?.length || 1} High-Res Frames</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            ${(concert.photos || [{ url: concert.coverPhoto, caption: concert.standoutQuote, exif: '35mm · ISO 2500', perspective: concert.perspective }]).map((photo, pIdx) => `
              <div class="deckled-card rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 group cursor-pointer show-photo-thumbnail" data-photo-index="${pIdx}">
                <div class="relative h-64 overflow-hidden">
                  <img src="${photo.url}" alt="${photo.caption}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div class="absolute inset-0 bg-stone-950/20 group-hover:bg-transparent transition-colors"></div>
                  <div class="absolute top-3 left-3 bg-stone-950/80 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-mono text-stone-300 border border-stone-800">
                    ${photo.perspective || concert.perspective}
                  </div>
                  <div class="absolute bottom-3 right-3 bg-stone-950/80 backdrop-blur p-1.5 rounded-lg text-stone-300 border border-stone-800">
                    <i data-lucide="zoom-in" class="w-4 h-4"></i>
                  </div>
                </div>
                <div class="p-3.5 space-y-1">
                  <p class="text-xs text-stone-300 font-light line-clamp-1">${photo.caption}</p>
                  <div class="text-[10px] font-mono text-stone-500">${photo.exif || 'Full-Frame Capture'}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Next / Previous Tour Chronology Footer -->
        <div class="pt-8 border-t border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${prevConcert ? `
            <a href="#/show/${prevConcert.id}" class="deckled-card p-4 rounded-2xl border border-stone-800 bg-stone-900/80 hover:border-amber-400/40 flex items-center gap-3 transition-colors">
              <i data-lucide="arrow-left" class="w-5 h-5 text-amber-400 shrink-0"></i>
              <div class="overflow-hidden">
                <div class="text-[10px] font-mono text-stone-400 uppercase">Previous Chronological Show</div>
                <div class="text-sm font-serif-editorial font-bold text-stone-200 truncate">${prevConcert.artist} · ${prevConcert.city}</div>
              </div>
            </a>
          ` : '<div></div>'}

          ${nextConcert ? `
            <a href="#/show/${nextConcert.id}" class="deckled-card p-4 rounded-2xl border border-stone-800 bg-stone-900/80 hover:border-amber-400/40 flex items-center justify-end gap-3 text-right transition-colors">
              <div class="overflow-hidden">
                <div class="text-[10px] font-mono text-stone-400 uppercase">Next Chronological Show</div>
                <div class="text-sm font-serif-editorial font-bold text-stone-200 truncate">${nextConcert.artist} · ${nextConcert.city}</div>
              </div>
              <i data-lucide="arrow-right" class="w-5 h-5 text-amber-400 shrink-0"></i>
            </a>
          ` : '<div></div>'}
        </div>
      </article>
    `;

    // Attach click events for photos and edit modal
    setupSingleShowEvents(concert);
  }

  // Calculate radar polygon SVG points
  function renderRadarPolygon(ratings) {
    const center = 120;
    const maxRadius = 90;

    // Normalizing ratings (0 to 10 scale)
    const rEnergy = (ratings.energy / 10) * maxRadius;
    const rVocals = (ratings.vocals / 10) * maxRadius;
    const rCrowd = (ratings.crowdVibe / 10) * maxRadius;
    const rAcoustics = (ratings.acoustics / 10) * maxRadius;

    // Top: Energy (0, -r)
    const p1x = center;
    const p1y = center - rEnergy;

    // Right: Vocals (r, 0)
    const p2x = center + rVocals;
    const p2y = center;

    // Bottom: Crowd (0, r)
    const p3x = center;
    const p3y = center + rCrowd;

    // Left: Acoustics (-r, 0)
    const p4x = center - rAcoustics;
    const p4y = center;

    return `<polygon points="${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y} ${p4x},${p4y}" class="radar-polygon" />`;
  }

  function setupSingleShowEvents(concert) {
    // Open cover photo in lightbox
    const coverPhotoImg = document.getElementById('hero-cover-photo-img');
    if (coverPhotoImg) {
      coverPhotoImg.addEventListener('click', () => {
        openLightbox([{
          url: concert.coverPhoto,
          caption: `${concert.artist} live at ${concert.venue}`,
          exif: concert.gear || 'Sony A7IV',
          perspective: concert.perspective,
          showId: concert.id
        }], 0);
      });
    }

    // Open thumbnails in lightbox
    const thumbnails = document.querySelectorAll('.show-photo-thumbnail');
    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const pIdx = parseInt(thumb.getAttribute('data-photo-index'), 10);
        const photosList = (concert.photos || [{ url: concert.coverPhoto, caption: concert.standoutQuote, exif: '35mm' }]).map(p => ({
          ...p,
          showId: concert.id
        }));
        openLightbox(photosList, pIdx);
      });
    });

    // Edit modal trigger
    const editBtn = document.getElementById('trigger-edit-show-btn');
    if (editBtn) {
      editBtn.addEventListener('click', () => openEditModal(concert));
    }

    // Replace photo triggers
    const replacePhotoBtn = document.getElementById('trigger-replace-photo-btn');
    const bannerReplaceBtn = document.getElementById('banner-replace-photo-btn');
    if (replacePhotoBtn) replacePhotoBtn.addEventListener('click', () => openPhotoManagerModal(concert.id));
    if (bannerReplaceBtn) bannerReplaceBtn.addEventListener('click', () => openPhotoManagerModal(concert.id));

    // Favorite toggle
    const favBtn = document.getElementById('toggle-card-favorite-btn');
    if (favBtn) {
      favBtn.addEventListener('click', () => {
        concert.favorite = !concert.favorite;
        saveConcerts();
        renderSingleShowView(concert.id);
        showToast(concert.favorite ? 'Added to Favorites ⭐' : 'Removed from Favorites');
      });
    }
  }

  // =========================================================================
  // VIEW: MULTI-CITY ROAD TIMELINE ("TOUR RUN")
  // =========================================================================
  function renderTimelineView() {
    const outlet = document.getElementById('main-content-outlet');
    const sorted = [...concerts].sort((a, b) => new Date(a.dateIso) - new Date(b.dateIso));

    outlet.innerHTML = `
      <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <!-- Header -->
        <div class="border-b border-stone-800 pb-6">
          <div class="text-xs font-mono tracking-widest text-amber-400 uppercase mb-1">CHRONOLOGICAL ROAD LOG</div>
          <h1 class="text-3xl sm:text-4xl font-serif-editorial font-bold text-stone-100">Multi-City Road Timeline ("Tour Run")</h1>
          <p class="text-stone-300 font-light text-base mt-2 max-w-3xl">
            Chronologically tracking cross-country tour runs: the amphitheater circuits, back-to-back MSG residencies, 
            intimate island dive bars at The Muse, Memphis homecoming roots, and Midwest indie club marathons.
          </p>
        </div>

        <!-- Tour Run Highlights Pills -->
        <div class="flex flex-wrap gap-2.5 text-xs font-mono">
          <span class="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-400">KEY RUNS:</span>
          <span class="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">North American Arena Run</span>
          <span class="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300">MSG 2-Night Residency</span>
          <span class="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300">Island & Dive Bar Special (The Muse)</span>
          <span class="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300">Memphis Homecoming Residency</span>
          <span class="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300">Everyone's A Star! Amphitheaters</span>
          <span class="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300">Midwest Underground Tour</span>
        </div>

        <!-- Vertical Timeline Tree -->
        <div class="relative pl-6 sm:pl-10 border-l-2 border-stone-800 space-y-12 my-8">
          ${sorted.map((c, idx) => `
            <div class="relative group">
              <!-- Timeline Marker Node -->
              <div class="absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-stone-950 border-2 ${c.favorite ? 'border-amber-400 shadow-lg shadow-amber-500/30' : 'border-stone-700'} flex items-center justify-center text-xs group-hover:scale-125 transition-transform">
                <span class="w-2 h-2 rounded-full ${c.favorite ? 'bg-amber-400' : 'bg-stone-500'}"></span>
              </div>

              <!-- Timeline Entry Card -->
              <div class="deckled-card rounded-3xl p-6 border border-stone-800 bg-stone-900/90 hover:border-amber-400/40 transition-colors">
                <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-stone-800/80 pb-4 mb-4">
                  <div>
                    <div class="flex flex-wrap items-center gap-2 mb-1">
                      <span class="px-2.5 py-0.5 rounded-full bg-stone-950 text-amber-400 text-xs font-mono font-bold">
                        STOP #${idx + 1}
                      </span>
                      <span class="text-xs font-mono text-stone-400">${c.date}</span>
                      <span class="text-xs font-mono text-stone-500">·</span>
                      <span class="text-xs font-mono text-stone-400 uppercase">${c.tourRun || 'Tour Date'}</span>
                    </div>
                    <h3 class="text-2xl font-serif-editorial font-bold text-stone-100">${c.artist}</h3>
                    <div class="text-xs font-mono text-stone-400 mt-0.5">${c.venue} · ${c.city}, ${c.state}</div>
                  </div>

                  <div class="flex items-center gap-3">
                    <span class="px-3 py-1 rounded-xl bg-stone-950 border border-stone-800 text-xs font-mono text-stone-300">
                      ${c.perspective || 'Barrier Center'}
                    </span>
                    <a href="#/show/${c.id}" class="px-4 py-2 rounded-xl bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-all">
                      <span>View Review</span>
                      <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                    </a>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div class="md:col-span-8 space-y-3">
                    <blockquote class="text-stone-300 font-serif-editorial italic text-base border-l-2 border-stone-700 pl-3">
                      "${c.standoutQuote}"
                    </blockquote>
                    <div class="flex flex-wrap gap-4 text-xs font-mono text-stone-400 pt-1">
                      <span>Energy: <strong class="text-amber-400">${c.ratings.energy}</strong></span>
                      <span>Vocals: <strong class="text-sky-400">${c.ratings.vocals}</strong></span>
                      <span>Crowd: <strong class="text-emerald-400">${c.ratings.crowdVibe}</strong></span>
                      <span>Acoustics: <strong class="text-purple-400">${c.ratings.acoustics}</strong></span>
                    </div>
                  </div>

                  <div class="md:col-span-4">
                    <div class="h-32 rounded-2xl overflow-hidden relative">
                      <img src="${c.coverPhoto}" alt="${c.artist}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div class="absolute inset-0 bg-stone-950/20"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  // =========================================================================
  // VIEW: CONCERT PHOTO VAULT (MEDIA-FIRST GALLERY & LIGHTBOX)
  // =========================================================================
  function renderPhotoVaultView() {
    const outlet = document.getElementById('main-content-outlet');

    // Aggregate all photos across all concerts
    vaultPhotos = [];
    concerts.forEach(c => {
      if (c.photos && c.photos.length > 0) {
        c.photos.forEach(p => {
          vaultPhotos.push({
            ...p,
            artist: c.artist,
            venue: c.venue,
            city: c.city,
            date: c.date,
            showId: c.id,
            tourRun: c.tourRun
          });
        });
      } else {
        vaultPhotos.push({
          url: c.coverPhoto,
          caption: c.standoutQuote,
          exif: c.gear || '35mm Full-Frame',
          perspective: c.perspective || 'Barrier Center',
          artist: c.artist,
          venue: c.venue,
          city: c.city,
          date: c.date,
          showId: c.id,
          tourRun: c.tourRun
        });
      }
    });

    outlet.innerHTML = `
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-stone-800 pb-6">
          <div>
            <div class="text-xs font-mono tracking-widest text-amber-400 uppercase mb-1">MEDIA-FIRST GALLERY</div>
            <h1 class="text-3xl sm:text-4xl font-serif-editorial font-bold text-stone-100">Concert Photo Vault</h1>
            <p class="text-stone-300 font-light text-base mt-1">
              High-resolution concert photography captured exclusively from barrier perspectives, pit perimeters, and intimate front rows.
            </p>
          </div>
          <div class="text-xs font-mono text-stone-400">
            Total Vault Frames: <strong class="text-amber-400 font-bold">${vaultPhotos.length}</strong>
          </div>
        </div>

        <!-- Replace Photos Quick Callout Banner -->
        <div class="deckled-card p-4 sm:p-5 rounded-2xl border border-stone-800 bg-stone-900/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <i data-lucide="image-plus" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="text-sm font-serif-editorial font-bold text-stone-100">Display Your Real Live Concert Photography</div>
              <div class="text-xs text-stone-400 font-light">Replace any placeholder image with your real high-res pit and barrier captures from your device.</div>
            </div>
          </div>
          <button id="vault-open-pm-btn" class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow transition-colors shrink-0">
            <i data-lucide="upload" class="w-3.5 h-3.5"></i>
            <span>Replace Photos</span>
          </button>
        </div>

        <!-- Segmented Filter Pills for Vault -->
        <div class="flex flex-wrap gap-2 text-xs font-mono" id="vault-filter-pills">
          <button class="tag-pill active" data-vault-filter="all">All Photos (${vaultPhotos.length})</button>
          <button class="tag-pill" data-vault-filter="CAMINO">The Band CAMINO</button>
          <button class="tag-pill" data-vault-filter="5SOS">5 Seconds of Summer</button>
          <button class="tag-pill" data-vault-filter="Jonas">Jonas Brothers</button>
          <button class="tag-pill" data-vault-filter="Teddy">Teddy Swims</button>
          <button class="tag-pill" data-vault-filter="In Color">In Color / Wilt</button>
          <button class="tag-pill" data-vault-filter="Barrier">Barrier Center Only</button>
        </div>

        <!-- Photos Masonry Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="vault-gallery-grid">
          ${renderVaultGridItems(vaultPhotos)}
        </div>
      </section>
    `;

    setupVaultEvents();
  }

  function renderVaultGridItems(photos) {
    return photos.map((photo, index) => `
      <div class="deckled-card rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 group cursor-pointer vault-photo-card" data-index="${index}">
        <div class="relative h-72 overflow-hidden film-sprockets">
          <img 
            src="${photo.url}" 
            alt="${photo.caption || photo.artist}" 
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-60"></div>
          
          <div class="absolute top-3 left-3 bg-stone-950/80 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-mono text-stone-300 border border-stone-800">
            ${photo.perspective || 'Barrier Center'}
          </div>

          <div class="absolute bottom-3 left-3 right-3 text-stone-200">
            <span class="text-[10px] font-mono text-amber-400 block">${photo.date}</span>
            <h4 class="text-sm font-serif-editorial font-bold truncate">${photo.artist}</h4>
            <div class="text-[10px] font-mono text-stone-400 truncate">${photo.venue} · ${photo.city}</div>
          </div>
        </div>

        <div class="p-3 bg-stone-950/60 border-t border-stone-800 flex justify-between items-center text-[10px] font-mono text-stone-500">
          <span class="truncate max-w-[180px]">${photo.exif || 'Sony A7IV'}</span>
          <span class="text-amber-400 flex items-center gap-1 group-hover:underline">
            <i data-lucide="zoom-in" class="w-3 h-3"></i> Lightbox
          </span>
        </div>
      </div>
    `).join('');
  }

  function setupVaultEvents() {
    const filterPills = document.querySelectorAll('#vault-filter-pills button');
    const grid = document.getElementById('vault-gallery-grid');

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const filter = pill.getAttribute('data-vault-filter');
        let filtered = vaultPhotos;
        if (filter !== 'all') {
          filtered = vaultPhotos.filter(p => {
            if (filter === 'Barrier') return p.perspective?.toLowerCase().includes('barrier');
            return p.artist.toLowerCase().includes(filter.toLowerCase());
          });
        }
        grid.innerHTML = renderVaultGridItems(filtered);
        lucide.createIcons();
        attachVaultPhotoClickEvents(filtered);
      });
    });

    attachVaultPhotoClickEvents(vaultPhotos);

    const vaultPmBtn = document.getElementById('vault-open-pm-btn');
    if (vaultPmBtn) vaultPmBtn.addEventListener('click', () => openPhotoManagerModal());
  }

  function attachVaultPhotoClickEvents(photosList) {
    const cards = document.querySelectorAll('.vault-photo-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.getAttribute('data-index'), 10);
        openLightbox(photosList, idx);
      });
    });
  }

  // --- INTERACTIVE LIGHTBOX ---
  let activeLightboxPhotos = [];

  function openLightbox(photos, startIndex = 0) {
    activeLightboxPhotos = photos;
    activePhotoIndex = startIndex;

    const lightbox = document.getElementById('photo-lightbox');
    if (!lightbox) return;

    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    updateLightboxUI();
  }

  function closeLightbox() {
    const lightbox = document.getElementById('photo-lightbox');
    if (!lightbox) return;
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function nextLightboxPhoto() {
    if (activeLightboxPhotos.length === 0) return;
    activePhotoIndex = (activePhotoIndex + 1) % activeLightboxPhotos.length;
    updateLightboxUI();
  }

  function prevLightboxPhoto() {
    if (activeLightboxPhotos.length === 0) return;
    activePhotoIndex = (activePhotoIndex - 1 + activeLightboxPhotos.length) % activeLightboxPhotos.length;
    updateLightboxUI();
  }

  function updateLightboxUI() {
    const photo = activeLightboxPhotos[activePhotoIndex];
    if (!photo) return;

    const img = document.getElementById('lightbox-image');
    const caption = document.getElementById('lightbox-caption');
    const exif = document.getElementById('lightbox-exif');
    const counter = document.getElementById('lightbox-counter');
    const reviewLink = document.getElementById('lightbox-review-link');

    if (img) {
      img.src = photo.url;
      img.alt = photo.caption || 'Concert Photograph';
    }

    if (caption) {
      caption.textContent = photo.caption || `${photo.artist} live in ${photo.city}`;
    }

    if (exif) {
      exif.textContent = `${photo.perspective || 'Barrier Center'} · ${photo.exif || 'Full-Frame Capture'}`;
    }

    if (counter) {
      counter.textContent = `${activePhotoIndex + 1} / ${activeLightboxPhotos.length}`;
    }

    if (reviewLink) {
      if (photo.showId) {
        reviewLink.href = `#/show/${photo.showId}`;
        reviewLink.classList.remove('hidden');
        reviewLink.onclick = () => closeLightbox();
      } else {
        reviewLink.classList.add('hidden');
      }
    }
  }

  // =========================================================================
  // VIEW: SHOW ANALYTICS & RECORDS ("SHOW STATS") WITH INTERACTIVE MAP
  // =========================================================================
  function renderStatsView() {
    const outlet = document.getElementById('main-content-outlet');

    // Aggregate stats
    const totalShows = concerts.length;
    const uniqueCities = new Set(concerts.map(c => c.city)).size;
    const uniqueVenues = new Set(concerts.map(c => c.venue)).size;

    // Leaderboard calculation
    const bandCounts = {};
    concerts.forEach(c => {
      // Split co-bills / support
      if (c.artist.includes('The Band CAMINO') || c.supporting?.includes('The Band CAMINO')) {
        bandCounts['The Band CAMINO'] = (bandCounts['The Band CAMINO'] || 0) + 1;
      }
      if (c.artist.includes('5 Seconds of Summer')) {
        bandCounts['5 Seconds of Summer'] = (bandCounts['5 Seconds of Summer'] || 0) + 1;
      }
      if (c.artist.includes('Jonas Brothers')) {
        bandCounts['Jonas Brothers'] = (bandCounts['Jonas Brothers'] || 0) + 1;
      }
      if (c.artist.includes('In Color')) {
        bandCounts['In Color / Wilt / Jutes'] = (bandCounts['In Color / Wilt / Jutes'] || 0) + 1;
      }
      if (c.artist.includes('Teddy Swims')) {
        bandCounts['Teddy Swims'] = (bandCounts['Teddy Swims'] || 0) + 1;
      }
      if (c.artist.includes('The Strike')) {
        bandCounts['The Strike'] = (bandCounts['The Strike'] || 0) + 1;
      }
    });

    const leaderboard = Object.entries(bandCounts).sort((a, b) => b[1] - a[1]);

    // Average ratings
    const avgEnergy = (concerts.reduce((acc, c) => acc + c.ratings.energy, 0) / totalShows).toFixed(1);
    const avgVocals = (concerts.reduce((acc, c) => acc + c.ratings.vocals, 0) / totalShows).toFixed(1);
    const avgCrowd = (concerts.reduce((acc, c) => acc + c.ratings.crowdVibe, 0) / totalShows).toFixed(1);
    const avgAcoustics = (concerts.reduce((acc, c) => acc + c.ratings.acoustics, 0) / totalShows).toFixed(1);
    const avgOverall = (concerts.reduce((acc, c) => acc + c.ratings.overall, 0) / totalShows).toFixed(1);

    outlet.innerHTML = `
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <!-- Header -->
        <div class="border-b border-stone-800 pb-6">
          <div class="text-xs font-mono tracking-widest text-amber-400 uppercase mb-1">ARCHIVE INTELLIGENCE & GEOGRAPHY</div>
          <h1 class="text-3xl sm:text-4xl font-serif-editorial font-bold text-stone-100">Show Analytics & Records ("Show Stats")</h1>
          <p class="text-stone-300 font-light text-base mt-2">
            Tabular records, interactive geographic mapping of all tour stops, and headliner leaderboards featuring The Band CAMINO and 5SOS at the summit.
          </p>
        </div>

        <!-- Metric Counter Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="deckled-card rounded-3xl p-6 border border-stone-800 bg-stone-900">
            <span class="text-xs font-mono text-stone-400 uppercase">Total Shows Logged</span>
            <div class="text-4xl font-bold font-mono text-amber-400 mt-2">${totalShows}</div>
            <div class="text-xs text-stone-500 font-mono mt-1">Cross-Country Tours</div>
          </div>

          <div class="deckled-card rounded-3xl p-6 border border-stone-800 bg-stone-900">
            <span class="text-xs font-mono text-stone-400 uppercase">Unique Cities</span>
            <div class="text-4xl font-bold font-mono text-sky-400 mt-2">${uniqueCities}</div>
            <div class="text-xs text-stone-500 font-mono mt-1">From Boston to LA & Memphis</div>
          </div>

          <div class="deckled-card rounded-3xl p-6 border border-stone-800 bg-stone-900">
            <span class="text-xs font-mono text-stone-400 uppercase">Unique Venues</span>
            <div class="text-4xl font-bold font-mono text-emerald-400 mt-2">${uniqueVenues}</div>
            <div class="text-xs text-stone-500 font-mono mt-1">Arenas, Amps & Dive Bars</div>
          </div>

          <div class="deckled-card rounded-3xl p-6 border border-stone-800 bg-stone-900">
            <span class="text-xs font-mono text-stone-400 uppercase">Archive Avg Rating</span>
            <div class="text-4xl font-bold font-mono text-purple-400 mt-2">${avgOverall}</div>
            <div class="text-xs text-stone-500 font-mono mt-1">Across All 4 Axes</div>
          </div>
        </div>

        <!-- Interactive Map Section -->
        <div class="deckled-card rounded-3xl p-6 sm:p-8 border border-stone-800 bg-stone-900 space-y-4">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-800 pb-4">
            <div>
              <div class="text-xs font-mono tracking-widest text-amber-400 uppercase">GEOGRAPHIC TOUR DISCOVERY</div>
              <h2 class="text-2xl font-serif-editorial font-bold text-stone-100">Interactive US Tour Map</h2>
            </div>
            <div class="text-xs font-mono text-stone-400">
              Click pins to preview stops & jump to reviews
            </div>
          </div>

          <div id="tour-leaflet-map" class="w-full h-96 sm:h-[480px] rounded-2xl overflow-hidden border border-stone-800"></div>
        </div>

        <!-- Leaderboards & 4-Axis Rating Averages Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Most Seen Band Leaderboard -->
          <div class="lg:col-span-6 deckled-card rounded-3xl p-6 border border-stone-800 bg-stone-900 space-y-4">
            <h3 class="text-xl font-serif-editorial font-bold text-stone-100 flex items-center gap-2 border-b border-stone-800 pb-3">
              <i data-lucide="crown" class="w-5 h-5 text-amber-400"></i>
              <span>Most-Seen Band Leaderboard</span>
            </h3>

            <div class="space-y-4">
              ${leaderboard.map(([band, count], idx) => {
                const percentage = (count / 10) * 100;
                return `
                  <div class="space-y-1.5 font-mono text-xs">
                    <div class="flex justify-between items-center">
                      <span class="text-stone-200 font-medium flex items-center gap-2">
                        <span class="w-5 text-stone-500">#${idx + 1}</span>
                        <span>${band}</span>
                      </span>
                      <span class="text-amber-400 font-bold">${count} Show${count > 1 ? 's' : ''}</span>
                    </div>
                    <div class="h-2 rounded-full bg-stone-950 overflow-hidden">
                      <div class="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" style="width: ${percentage}%"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Overall 4-Axis Critical Benchmarks -->
          <div class="lg:col-span-6 deckled-card rounded-3xl p-6 border border-stone-800 bg-stone-900 space-y-4">
            <h3 class="text-xl font-serif-editorial font-bold text-stone-100 flex items-center gap-2 border-b border-stone-800 pb-3">
              <i data-lucide="bar-chart-2" class="w-5 h-5 text-amber-400"></i>
              <span>Archive 4-Axis Benchmarks</span>
            </h3>

            <div class="space-y-4">
              <div class="space-y-1 font-mono text-xs">
                <div class="flex justify-between text-stone-300">
                  <span>Energy & Presence Average</span>
                  <span class="text-amber-400 font-bold">${avgEnergy} / 10</span>
                </div>
                <div class="axis-meter-bar h-2"><div class="axis-meter-fill fill-energy" style="width: ${(avgEnergy / 10) * 100}%"></div></div>
              </div>

              <div class="space-y-1 font-mono text-xs">
                <div class="flex justify-between text-stone-300">
                  <span>Vocal Performance Average</span>
                  <span class="text-sky-400 font-bold">${avgVocals} / 10</span>
                </div>
                <div class="axis-meter-bar h-2"><div class="axis-meter-fill fill-vocals" style="width: ${(avgVocals / 10) * 100}%"></div></div>
              </div>

              <div class="space-y-1 font-mono text-xs">
                <div class="flex justify-between text-stone-300">
                  <span>Crowd Vibe & Pit Reciprocity Average</span>
                  <span class="text-emerald-400 font-bold">${avgCrowd} / 10</span>
                </div>
                <div class="axis-meter-bar h-2"><div class="axis-meter-fill fill-crowd" style="width: ${(avgCrowd / 10) * 100}%"></div></div>
              </div>

              <div class="space-y-1 font-mono text-xs">
                <div class="flex justify-between text-stone-300">
                  <span>Venue Acoustics Average</span>
                  <span class="text-purple-400 font-bold">${avgAcoustics} / 10</span>
                </div>
                <div class="axis-meter-bar h-2"><div class="axis-meter-fill fill-acoustics" style="width: ${(avgAcoustics / 10) * 100}%"></div></div>
              </div>
            </div>

            <!-- Tabular Venues List -->
            <div class="pt-4 border-t border-stone-800">
              <span class="text-xs font-mono text-stone-400 uppercase block mb-2">Venues Documented:</span>
              <div class="flex flex-wrap gap-1.5 text-[11px] font-mono">
                ${Array.from(new Set(concerts.map(c => c.venue))).map(v => `
                  <span class="bg-stone-950 px-2.5 py-1 rounded-lg border border-stone-800 text-stone-300">${v}</span>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    // Initialize Leaflet Map
    setTimeout(() => {
      initLeafletMap();
    }, 100);
  }

  function initLeafletMap() {
    const mapContainer = document.getElementById('tour-leaflet-map');
    if (!mapContainer) return;

    if (mapInstance) {
      mapInstance.remove();
      mapInstance = null;
    }

    // Centered on US
    mapInstance = L.map('tour-leaflet-map').setView([39.8283, -88.5795], 4);

    // CartoDB Dark Matter / Warm custom tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CartoDB</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(mapInstance);

    // Group concerts by city / coordinates
    const cityMap = {};
    concerts.forEach(c => {
      const key = `${c.city}_${c.state}`;
      if (!cityMap[key]) {
        cityMap[key] = {
          city: c.city,
          state: c.state,
          coords: c.coords,
          shows: []
        };
      }
      cityMap[key].shows.push(c);
    });

    // Add glowing amber circle markers
    Object.values(cityMap).forEach(loc => {
      if (!loc.coords) return;

      const marker = L.circleMarker(loc.coords, {
        radius: 8 + Math.min(loc.shows.length * 2, 10),
        fillColor: '#f59e0b',
        color: '#fef3c7',
        weight: 1.5,
        opacity: 0.9,
        fillOpacity: 0.8
      }).addTo(mapInstance);

      // Popup Content
      const popupHtml = `
        <div style="padding: 12px; font-family: 'Plus Jakarta Sans', sans-serif;">
          <div style="font-size: 11px; font-family: 'Space Mono', monospace; color: #f59e0b; text-transform: uppercase;">
            ${loc.shows.length} Show${loc.shows.length > 1 ? 's' : ''} Documented
          </div>
          <div style="font-size: 16px; font-weight: bold; color: #f6f3eb; margin: 2px 0 6px 0;">
            ${loc.city}, ${loc.state}
          </div>
          <div style="font-size: 12px; color: #d3cbbe; max-height: 120px; overflow-y: auto;">
            ${loc.shows.map(s => `
              <div style="padding: 4px 0; border-top: 1px solid #38312b;">
                <strong>${s.artist}</strong><br/>
                <span style="font-size: 10px; color: #a8a29e;">${s.venue} (${s.date})</span><br/>
                <a href="#/show/${s.id}" style="font-size: 11px; color: #f59e0b; text-decoration: underline;">Read Review &rarr;</a>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
    });
  }

  // =========================================================================
  // VIEW: FULL USER-FRIENDLY SITEMAP
  // =========================================================================
  function renderSitemapView() {
    const outlet = document.getElementById('main-content-outlet');

    // Group shows by tour run
    const tourRunGroups = {};
    concerts.forEach(c => {
      const run = c.tourRun || 'Standalone Headline';
      if (!tourRunGroups[run]) tourRunGroups[run] = [];
      tourRunGroups[run].push(c);
    });

    // Group shows by artist
    const artistGroups = {};
    concerts.forEach(c => {
      const art = c.artist;
      if (!artistGroups[art]) artistGroups[art] = [];
      artistGroups[art].push(c);
    });

    outlet.innerHTML = `
      <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <!-- Header -->
        <div class="border-b border-stone-800 pb-6">
          <div class="text-xs font-mono tracking-widest text-amber-400 uppercase mb-1">USER-FRIENDLY HIERARCHY</div>
          <h1 class="text-3xl sm:text-4xl font-serif-editorial font-bold text-stone-100">Full Archive Sitemap</h1>
          <p class="text-stone-300 font-light text-base mt-2">
            A comprehensive, structured architectural index of all reviews, individual show pages, tour runs, and platform destinations.
          </p>
        </div>

        <!-- Primary Hubs -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="#/reviews" class="deckled-card rounded-2xl p-5 border border-stone-800 bg-stone-900/90 hover:border-amber-400/40 block transition-colors">
            <i data-lucide="book-open" class="w-6 h-6 text-amber-400 mb-2"></i>
            <h3 class="text-lg font-serif-editorial font-bold text-stone-100">Editorial Reviews & Shows</h3>
            <p class="text-xs text-stone-400 mt-1">All ${concerts.length} documented shows with 4-axis ratings and setlists.</p>
          </a>

          <a href="#/vault" class="deckled-card rounded-2xl p-5 border border-stone-800 bg-stone-900/90 hover:border-amber-400/40 block transition-colors">
            <i data-lucide="camera" class="w-6 h-6 text-sky-400 mb-2"></i>
            <h3 class="text-lg font-serif-editorial font-bold text-stone-100">Concert Photo Vault</h3>
            <p class="text-xs text-stone-400 mt-1">Barrier perspectives, EXIF data, and interactive fullscreen lightbox.</p>
          </a>

          <a href="#/stats" class="deckled-card rounded-2xl p-5 border border-stone-800 bg-stone-900/90 hover:border-amber-400/40 block transition-colors">
            <i data-lucide="map" class="w-6 h-6 text-emerald-400 mb-2"></i>
            <h3 class="text-lg font-serif-editorial font-bold text-stone-100">Show Stats & US Map</h3>
            <p class="text-xs text-stone-400 mt-1">Leaderboards, 11 cities plotted, and performance analytics.</p>
          </a>
        </div>

        <!-- Individual Show Pages Tree by Tour Run -->
        <div class="deckled-card rounded-3xl p-6 sm:p-8 border border-stone-800 bg-stone-900 space-y-6">
          <h2 class="text-2xl font-serif-editorial font-bold text-stone-100 border-b border-stone-800 pb-3 flex items-center gap-2">
            <i data-lucide="folder-tree" class="w-5 h-5 text-amber-400"></i>
            <span>Individual Show & Review Pages by Tour Run</span>
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            ${Object.entries(tourRunGroups).map(([runName, shows]) => `
              <div class="space-y-3">
                <div class="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                  <i data-lucide="corner-down-right" class="w-3.5 h-3.5"></i>
                  <span>${runName} (${shows.length})</span>
                </div>
                <ul class="space-y-2 pl-5 border-l border-stone-800 text-xs font-mono">
                  ${shows.map(s => `
                    <li>
                      <a href="#/show/${s.id}" class="hover:text-amber-400 text-stone-300 flex items-center justify-between group py-1">
                        <span class="truncate">
                          <strong>${s.artist}</strong> 
                          <span class="text-stone-500">· ${s.venue} (${s.city})</span>
                        </span>
                        <span class="text-[10px] text-amber-500 group-hover:translate-x-1 transition-transform">&rarr;</span>
                      </a>
                    </li>
                  `).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Individual Shows by Artist Index -->
        <div class="deckled-card rounded-3xl p-6 sm:p-8 border border-stone-800 bg-stone-900 space-y-6">
          <h2 class="text-2xl font-serif-editorial font-bold text-stone-100 border-b border-stone-800 pb-3 flex items-center gap-2">
            <i data-lucide="mic-2" class="w-5 h-5 text-amber-400"></i>
            <span>Index by Artist</span>
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${Object.entries(artistGroups).map(([artistName, shows]) => `
              <div class="p-4 bg-stone-950/60 rounded-2xl border border-stone-800 space-y-2">
                <div class="text-sm font-serif-editorial font-bold text-stone-200">${artistName}</div>
                <div class="text-[11px] font-mono text-stone-500">${shows.length} Logged Show${shows.length > 1 ? 's' : ''}</div>
                <ul class="space-y-1.5 pt-2 text-xs font-mono border-t border-stone-900">
                  ${shows.map(s => `
                    <li>
                      <a href="#/show/${s.id}" class="hover:text-amber-400 text-stone-400 truncate block">
                        &bull; ${s.date} (${s.city})
                      </a>
                    </li>
                  `).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- External Direct Platforms & Contact -->
        <div class="deckled-card rounded-3xl p-6 border border-stone-800 bg-stone-900/60 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div class="space-y-1">
            <div class="text-stone-300 font-bold">External Network Links:</div>
            <div class="text-stone-500">Directly synchronized with Jodie Devine's publications & portfolio</div>
          </div>
          <div class="flex flex-wrap gap-3">
            <a href="https://jumbleofnotes.wordpress.com/" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-300 hover:text-amber-400 flex items-center gap-1.5">
              <i data-lucide="globe" class="w-3.5 h-3.5"></i> Jumble of Notes (WordPress)
            </a>
            <a href="https://www.instagram.com/jodiedevineart/" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-300 hover:text-amber-400 flex items-center gap-1.5">
              <i data-lucide="instagram" class="w-3.5 h-3.5"></i> Instagram @jodiedevineart
            </a>
            <a href="https://jodiedevinef.wixsite.com/jodiefolio" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-300 hover:text-amber-400 flex items-center gap-1.5">
              <i data-lucide="external-link" class="w-3.5 h-3.5"></i> Jodie Devine Folio
            </a>
          </div>
        </div>
      </section>
    `;
  }

  // =========================================================================
  // VIEW: ABOUT JODIE & PLATFORM INTEGRATIONS
  // =========================================================================
  function renderAboutView() {
    const outlet = document.getElementById('main-content-outlet');

    outlet.innerHTML = `
      <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <!-- Bio Hero Header -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div class="md:col-span-4">
            <div class="deckled-card rounded-3xl overflow-hidden border border-stone-700 p-2 bg-stone-900 shadow-2xl">
              <div class="film-sprockets rounded-2xl overflow-hidden h-80">
                <img 
                  src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80" 
                  alt="Jodie Devine Concert Photography" 
                  class="w-full h-full object-cover" 
                />
              </div>
              <div class="p-3 text-center text-xs font-mono text-stone-400">
                Jodie Devine · In The Pit
              </div>
            </div>
          </div>

          <div class="md:col-span-8 space-y-4">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-wider">
              Concert Photographer & Music Journalist
            </div>
            <h1 class="text-4xl sm:text-5xl font-serif-editorial font-bold text-stone-100">
              Jodie Devine
            </h1>
            <p class="text-lg text-stone-300 font-light leading-relaxed">
              ${JODIE_PROFILE.bio}
            </p>
            <p class="text-base text-stone-400 font-serif-editorial italic leading-relaxed border-l-2 border-amber-500 pl-3">
              "${JODIE_PROFILE.statement}"
            </p>
          </div>
        </div>

        <!-- Direct Social & Publication Channels Grid -->
        <div class="space-y-4">
          <h2 class="text-2xl font-serif-editorial font-bold text-stone-100">Direct Publications & Channels</h2>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- WordPress -->
            <a href="${JODIE_PROFILE.links.wordpress}" target="_blank" rel="noopener noreferrer" class="deckled-card p-5 rounded-2xl border border-stone-800 bg-stone-900 hover:border-amber-400/50 block group transition-all">
              <i data-lucide="globe" class="w-6 h-6 text-amber-400 mb-2"></i>
              <div class="text-sm font-bold text-stone-100 group-hover:text-amber-400">Jumble of Notes</div>
              <div class="text-xs text-stone-400 mt-1">WordPress Review Blog</div>
              <div class="text-[10px] font-mono text-amber-500 mt-3 flex items-center gap-1">
                <span>Visit Blog</span> &rarr;
              </div>
            </a>

            <!-- Instagram Art -->
            <a href="${JODIE_PROFILE.links.instagramArt}" target="_blank" rel="noopener noreferrer" class="deckled-card p-5 rounded-2xl border border-stone-800 bg-stone-900 hover:border-amber-400/50 block group transition-all">
              <i data-lucide="camera" class="w-6 h-6 text-pink-400 mb-2"></i>
              <div class="text-sm font-bold text-stone-100 group-hover:text-pink-400">@jodiedevineart</div>
              <div class="text-xs text-stone-400 mt-1">Concert Photography IG</div>
              <div class="text-[10px] font-mono text-pink-500 mt-3 flex items-center gap-1">
                <span>View Gallery</span> &rarr;
              </div>
            </a>

            <!-- Personal Instagram -->
            <a href="${JODIE_PROFILE.links.instagramPersonal}" target="_blank" rel="noopener noreferrer" class="deckled-card p-5 rounded-2xl border border-stone-800 bg-stone-900 hover:border-amber-400/50 block group transition-all">
              <i data-lucide="instagram" class="w-6 h-6 text-purple-400 mb-2"></i>
              <div class="text-sm font-bold text-stone-100 group-hover:text-purple-400">@jodiejodiejo</div>
              <div class="text-xs text-stone-400 mt-1">Behind The Lens / Personal</div>
              <div class="text-[10px] font-mono text-purple-400 mt-3 flex items-center gap-1">
                <span>Follow IG</span> &rarr;
              </div>
            </a>

            <!-- Wix Folio -->
            <a href="${JODIE_PROFILE.links.folio}" target="_blank" rel="noopener noreferrer" class="deckled-card p-5 rounded-2xl border border-stone-800 bg-stone-900 hover:border-amber-400/50 block group transition-all">
              <i data-lucide="external-link" class="w-6 h-6 text-sky-400 mb-2"></i>
              <div class="text-sm font-bold text-stone-100 group-hover:text-sky-400">Jodie Devine Folio</div>
              <div class="text-xs text-stone-400 mt-1">Official Photography Showcase</div>
              <div class="text-[10px] font-mono text-sky-400 mt-3 flex items-center gap-1">
                <span>Open Showcase</span> &rarr;
              </div>
            </a>
          </div>
        </div>

        <!-- Pit Gear Bag -->
        <div class="deckled-card rounded-3xl p-6 sm:p-8 border border-stone-800 bg-stone-900 space-y-6">
          <h2 class="text-2xl font-serif-editorial font-bold text-stone-100 border-b border-stone-800 pb-3 flex items-center gap-2">
            <i data-lucide="package" class="w-5 h-5 text-amber-400"></i>
            <span>The Pit Gear Bag & Optical Setup</span>
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            ${JODIE_PROFILE.gear.map(g => `
              <div class="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-1">
                <div class="text-sm font-bold font-mono text-amber-400">${g.item}</div>
                <div class="text-xs text-stone-400">${g.detail}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // =========================================================================
  // "LOG A SHOW" REVIEW BUILDER (CREATE NEW SHOWS DIRECTLY TO LOCALSTORAGE)
  // =========================================================================
  function openLogModal() {
    const modal = document.getElementById('log-show-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Set default date to today
    const dateInput = document.getElementById('log-input-date');
    if (dateInput && !dateInput.value) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }
  }

  function closeLogModal() {
    const modal = document.getElementById('log-show-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function setupLogShowForm() {
    const form = document.getElementById('log-show-form');
    if (!form) return;

    // Live rating value labels
    ['energy', 'vocals', 'crowd', 'acoustics'].forEach(axis => {
      const slider = document.getElementById(`log-rating-${axis}`);
      const valLabel = document.getElementById(`log-rating-${axis}-val`);
      if (slider && valLabel) {
        slider.addEventListener('input', () => {
          valLabel.textContent = parseFloat(slider.value).toFixed(1);
        });
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const artist = document.getElementById('log-input-artist').value.trim();
      const supporting = document.getElementById('log-input-supporting').value.trim();
      const dateVal = document.getElementById('log-input-date').value;
      const venue = document.getElementById('log-input-venue').value.trim();
      const city = document.getElementById('log-input-city').value.trim();
      const state = document.getElementById('log-input-state').value.trim();
      const tourRun = document.getElementById('log-input-tourrun').value.trim() || 'Tour Run';
      const perspective = document.getElementById('log-input-perspective').value.trim() || 'Barrier Center';
      const quote = document.getElementById('log-input-quote').value.trim();
      const reviewText = document.getElementById('log-input-review').value.trim();
      const setlistRaw = document.getElementById('log-input-setlist').value.trim();
      const photoUrl = document.getElementById('log-input-photo').value.trim() || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600&auto=format&fit=crop&q=80';

      const energy = parseFloat(document.getElementById('log-rating-energy').value);
      const vocals = parseFloat(document.getElementById('log-rating-vocals').value);
      const crowdVibe = parseFloat(document.getElementById('log-rating-crowd').value);
      const acoustics = parseFloat(document.getElementById('log-rating-acoustics').value);
      const overall = parseFloat(((energy + vocals + crowdVibe + acoustics) / 4).toFixed(1));

      // Parse setlist
      const setlist = setlistRaw.split('\n').filter(s => s.trim().length > 0).map(line => ({
        song: line.replace(/^[\d\.\-\*]\s*/, '').trim(),
        highlight: line.includes('*') || line.toLowerCase().includes('highlight')
      }));

      // Generate slug id
      const slug = `${artist.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${city.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;

      // Approximate coordinates for city if standard, else default US center
      let coords = [42.3601, -71.0589]; // default Boston
      if (city.toLowerCase().includes('york')) coords = [40.7128, -74.0060];
      if (city.toLowerCase().includes('angeles') || city.toLowerCase().includes('inglewood')) coords = [33.9583, -118.3419];
      if (city.toLowerCase().includes('memphis')) coords = [35.1495, -90.0490];
      if (city.toLowerCase().includes('detroit')) coords = [42.3314, -83.0458];
      if (city.toLowerCase().includes('toledo')) coords = [41.6528, -83.5379];
      if (city.toLowerCase().includes('buffalo')) coords = [42.8864, -78.8784];
      if (city.toLowerCase().includes('raleigh')) coords = [35.7796, -78.6382];

      const newConcert = {
        id: slug,
        artist,
        supporting,
        date: formatDateReadable(dateVal),
        dateIso: dateVal,
        venue,
        city,
        state,
        coords,
        tourRun,
        perspective,
        gear: 'Sony A7IV · Prime Lens',
        ratings: {
          energy,
          vocals,
          crowdVibe,
          acoustics,
          overall
        },
        standoutQuote: quote,
        review: reviewText,
        setlist: setlist.length > 0 ? setlist : [{ song: "Live Performance Set", highlight: true }],
        coverPhoto: photoUrl,
        photos: [
          {
            url: photoUrl,
            caption: `${artist} live at ${venue}`,
            exif: '35mm · f/1.4 · 1/500s · ISO 2500',
            perspective
          }
        ],
        badge: "New Log Entry",
        favorite: true
      };

      concerts.unshift(newConcert);
      saveConcerts();
      closeLogModal();
      form.reset();
      showToast(`Concert review for "${artist}" published and saved!`);
      navigateTo(`#/show/${newConcert.id}`);
    });
  }

  // =========================================================================
  // EDIT SHOW & RATINGS MODAL (IN-PLACE LIVE UPDATER)
  // =========================================================================
  let editingConcertId = null;

  function openEditModal(concert) {
    editingConcertId = concert.id;
    const modal = document.getElementById('edit-show-modal');
    if (!modal) return;

    document.getElementById('edit-modal-artist-title').textContent = `${concert.artist} · ${concert.venue}`;
    document.getElementById('edit-input-quote').value = concert.standoutQuote || '';
    document.getElementById('edit-input-review').value = concert.review || '';

    // Photo fields in edit modal
    const photoInput = document.getElementById('edit-input-photo');
    const photoPreview = document.getElementById('edit-photo-preview');
    if (photoInput) photoInput.value = concert.coverPhoto || '';
    if (photoPreview) photoPreview.src = concert.coverPhoto || '';

    const editFilePicker = document.getElementById('edit-file-picker');
    if (editFilePicker) {
      editFilePicker.value = '';
      editFilePicker.onchange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          compressAndReadImage(file, (dataUrl) => {
            if (photoPreview) photoPreview.src = dataUrl;
            if (photoInput) photoInput.value = dataUrl;
            showToast('Photo uploaded & compressed for web!');
          });
        }
      };
    }

    // Ratings
    ['energy', 'vocals', 'crowd', 'acoustics'].forEach(axis => {
      const val = axis === 'crowd' ? concert.ratings.crowdVibe : concert.ratings[axis];
      const slider = document.getElementById(`edit-rating-${axis}`);
      const valLabel = document.getElementById(`edit-rating-${axis}-val`);
      if (slider && valLabel) {
        slider.value = val;
        valLabel.textContent = val.toFixed(1);
      }
    });

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeEditModal() {
    const modal = document.getElementById('edit-show-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function setupEditShowForm() {
    const form = document.getElementById('edit-show-form');
    if (!form) return;

    ['energy', 'vocals', 'crowd', 'acoustics'].forEach(axis => {
      const slider = document.getElementById(`edit-rating-${axis}`);
      const valLabel = document.getElementById(`edit-rating-${axis}-val`);
      if (slider && valLabel) {
        slider.addEventListener('input', () => {
          valLabel.textContent = parseFloat(slider.value).toFixed(1);
        });
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!editingConcertId) return;

      const concert = concerts.find(c => c.id === editingConcertId);
      if (!concert) return;

      concert.standoutQuote = document.getElementById('edit-input-quote').value.trim();
      concert.review = document.getElementById('edit-input-review').value.trim();

      const newPhoto = document.getElementById('edit-input-photo')?.value.trim();
      if (newPhoto) {
        concert.coverPhoto = newPhoto;
        if (concert.photos && concert.photos.length > 0) {
          concert.photos[0].url = newPhoto;
        } else {
          concert.photos = [{
            url: newPhoto,
            caption: `${concert.artist} live at ${concert.venue}`,
            exif: concert.gear || 'Sony A7IV',
            perspective: concert.perspective || 'Barrier Center'
          }];
        }
      }

      const energy = parseFloat(document.getElementById('edit-rating-energy').value);
      const vocals = parseFloat(document.getElementById('edit-rating-vocals').value);
      const crowdVibe = parseFloat(document.getElementById('edit-rating-crowd').value);
      const acoustics = parseFloat(document.getElementById('edit-rating-acoustics').value);
      const overall = parseFloat(((energy + vocals + crowdVibe + acoustics) / 4).toFixed(1));

      concert.ratings = { energy, vocals, crowdVibe, acoustics, overall };

      saveConcerts();
      closeEditModal();
      showToast('Concert ratings & review narrative saved!');
      renderSingleShowView(concert.id);
    });
  }

  // --- CLIENT-SIDE IMAGE COMPRESSION UTILITY ---
  function compressAndReadImage(file, callback, maxWidth = 1920, quality = 0.85) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        callback(dataUrl);
      };
      img.onerror = () => {
        callback(e.target.result);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // --- PHOTO MANAGER UTILITY ---
  let selectedPmConcertId = null;

  function openPhotoManagerModal(defaultShowId = null) {
    const modal = document.getElementById('photo-manager-modal');
    if (!modal) return;

    const select = document.getElementById('pm-concert-select');
    if (select) {
      select.innerHTML = concerts.map(c => `
        <option value="${c.id}" ${c.id === defaultShowId ? 'selected' : ''}>
          ${c.artist} · ${c.venue} (${c.city})
        </option>
      `).join('');

      selectedPmConcertId = defaultShowId || select.value || (concerts[0] ? concerts[0].id : null);
      select.value = selectedPmConcertId;
    }

    updatePhotoManagerPreview();
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
  }

  function closePhotoManagerModal() {
    const modal = document.getElementById('photo-manager-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function updatePhotoManagerPreview() {
    const select = document.getElementById('pm-concert-select');
    if (!select) return;
    selectedPmConcertId = select.value;
    const concert = concerts.find(c => c.id === selectedPmConcertId);
    if (!concert) return;

    const previewImg = document.getElementById('pm-preview-img');
    const urlInput = document.getElementById('pm-url-input');
    const uploadBtnText = document.getElementById('pm-upload-btn-text');
    const fileInput = document.getElementById('pm-file-input');

    if (previewImg) previewImg.src = concert.coverPhoto;
    if (urlInput) urlInput.value = concert.coverPhoto;
    if (uploadBtnText) uploadBtnText.textContent = "Browse & Select Photo (JPG, PNG, WebP)";
    if (fileInput) fileInput.value = "";
  }

  function setupPhotoManagerEvents() {
    const select = document.getElementById('pm-concert-select');
    if (select) {
      select.addEventListener('change', () => {
        updatePhotoManagerPreview();
      });
    }

    // Direct file upload in Photo Manager
    const fileInput = document.getElementById('pm-file-input');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const btnText = document.getElementById('pm-upload-btn-text');
          if (btnText) btnText.textContent = `Optimizing: ${file.name}...`;

          compressAndReadImage(file, (dataUrl) => {
            const previewImg = document.getElementById('pm-preview-img');
            const urlInput = document.getElementById('pm-url-input');
            if (previewImg) previewImg.src = dataUrl;
            if (urlInput) urlInput.value = dataUrl;
            if (btnText) btnText.textContent = `Ready: ${file.name} (Compressed)`;
            showToast('Photo loaded & compressed for web!');
          });
        }
      });
    }

    // URL input live change
    const urlInput = document.getElementById('pm-url-input');
    if (urlInput) {
      urlInput.addEventListener('input', (e) => {
        const previewImg = document.getElementById('pm-preview-img');
        if (previewImg && e.target.value) {
          previewImg.src = e.target.value;
        }
      });
    }

    // Save Photo Button
    const savePhotoBtn = document.getElementById('pm-save-photo-btn');
    if (savePhotoBtn) {
      savePhotoBtn.addEventListener('click', () => {
        if (!selectedPmConcertId) return;
        const concert = concerts.find(c => c.id === selectedPmConcertId);
        if (!concert) return;

        const newUrl = document.getElementById('pm-url-input')?.value.trim();
        if (!newUrl) {
          alert('Please upload an image file or provide an image URL / path.');
          return;
        }

        concert.coverPhoto = newUrl;
        if (concert.photos && concert.photos.length > 0) {
          concert.photos[0].url = newUrl;
        } else {
          concert.photos = [{
            url: newUrl,
            caption: `${concert.artist} live at ${concert.venue}`,
            exif: concert.gear || 'Sony A7IV',
            perspective: concert.perspective || 'Barrier Center'
          }];
        }

        saveConcerts();
        showToast(`Real photography saved for ${concert.artist}!`);
        closePhotoManagerModal();
        renderCurrentView();
      });
    }

    // Switch all shows to local folder assets/photos/*.jpg
    const switchLocalBtn = document.getElementById('pm-switch-local-folder-btn');
    if (switchLocalBtn) {
      switchLocalBtn.addEventListener('click', () => {
        concerts.forEach(c => {
          const mappedPath = LOCAL_PHOTO_MAP[c.id] || `assets/photos/${c.id}.jpg`;
          c.coverPhoto = mappedPath;
          if (c.photos && c.photos[0]) {
            c.photos[0].url = mappedPath;
          }
        });

        saveConcerts();
        updatePhotoManagerPreview();
        renderCurrentView();
        showToast('All 18 shows switched to assets/photos/*.jpg!');
      });
    }

    // Restore web placeholder images
    const restorePlaceholdersBtn = document.getElementById('pm-restore-placeholders-btn');
    if (restorePlaceholdersBtn) {
      restorePlaceholdersBtn.addEventListener('click', () => {
        if (confirm('Restore default high-resolution web placeholder images?')) {
          DEFAULT_CONCERTS.forEach(defC => {
            const match = concerts.find(c => c.id === defC.id);
            if (match) {
              match.coverPhoto = defC.coverPhoto;
              if (defC.photos) {
                match.photos = JSON.parse(JSON.stringify(defC.photos));
              }
            }
          });

          saveConcerts();
          updatePhotoManagerPreview();
          renderCurrentView();
          showToast('Original placeholder images restored.');
        }
      });
    }
  }

  // --- TOAST NOTIFICATIONS ---
  function showToast(message) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notification';
      toast.className = 'fixed bottom-6 right-6 z-[10000] px-4 py-3 rounded-2xl bg-stone-900 border border-amber-500/40 text-stone-100 font-mono text-xs shadow-2xl flex items-center gap-2 transition-all transform translate-y-10 opacity-0 pointer-events-none';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400"></span><span>${message}</span>`;
    toast.classList.remove('translate-y-10', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      toast.classList.add('translate-y-10', 'opacity-0', 'pointer-events-none');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3200);
  }

  // Utility date formatter
  function formatDateReadable(isoString) {
    if (!isoString) return 'Date TBD';
    const [year, month, day] = isoString.split('-');
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const mIdx = parseInt(month, 10) - 1;
    return `${months[mIdx]} ${parseInt(day, 10)}, ${year}`;
  }

})();
