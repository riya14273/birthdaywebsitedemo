/**
 * ============================================================================
 * PERSONALIZED BIRTHDAY WISH WEBSITE - PARTY WEAR & DIRECT SHARING SCRIPT
 * Features:
 * - URL Parameter Auto-Display: Birthday Person doesn't need to fill anything!
 *   Opening `?name=Priya&msg=...` immediately launches their surprise with music!
 * - Multi-Song Selector with Arijit Singh Ballad Style, Party Beat, & Piano
 * - Custom MP3 Upload Support
 * - One-Click WhatsApp / Social Share Link generator with pre-packaged data
 * - High-Resolution Wish Card Image Download
 * - Canvas Confetti Blast & Interactive Birthday Cake
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- STATE MANAGEMENT ---
  const state = {
    name: 'Aryan',
    message: 'Wishing you an unforgettable birthday packed with great health, endless laughter, and monumental success! May your year ahead be as grand as tonight! Happy Birthday! 🥂✨',
    secretMessage: "You are one of the most incredible souls in the universe! May this year bring endless success, love, and wild celebrations! 💖🥂",
    photoDataUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    selectedTheme: 'theme-gold',
    selectedSongKey: 'arijit',
    customAudioDataUrl: null,
    isPlayingMusic: false,
    candlesLit: true
  };

  const songTitles = {
    arijit: 'Arijit Singh Ballad Style',
    party: 'Club Party Beat',
    piano: 'Grand Birthday Piano',
    custom: 'Custom Uploaded Song'
  };

  // Pre-written suggestions for Quick Wishes button
  const quickWishes = [
    "Wishing you an unforgettable birthday packed with love, health, and limitless joy! Keep conquering! 🍾👑",
    "May your special day be as legendary and vibrant as you are! Cheers to another thrilling year! 🥂🎉",
    "Happy Birthday to someone truly extraordinary! May every dream you chase turn into reality! 🌟💖",
    "Let the music play and the champagne pop! Have the most spectacular birthday party ever! 🎂🎈",
    "To the star of the night: May this year bring you boundless happiness, love, and huge milestones! 💖✨"
  ];

  // --- DOM ELEMENT REFERENCES ---
  const appBody = document.getElementById('appBody');
  const birthdayForm = document.getElementById('birthdayForm');
  const personNameInput = document.getElementById('personName');
  const photoInput = document.getElementById('photoInput');
  const dropZone = document.getElementById('dropZone');
  const birthdayMessageInput = document.getElementById('birthdayMessage');
  const charCountEl = document.getElementById('charCount');
  const secretSurpriseInput = document.getElementById('secretSurprise');
  const btnQuickWishes = document.getElementById('btnQuickWishes');
  const themeOptions = document.querySelectorAll('.theme-option');

  // Song Selector Elements
  const songOptions = document.querySelectorAll('.song-option');
  const customAudioInput = document.getElementById('customAudioInput');
  const customSongLabel = document.getElementById('customSongLabel');
  const btnPreviewSelectedSong = document.getElementById('btnPreviewSelectedSong');
  const previewSongBadge = document.getElementById('previewSongBadge');
  
  // Live Preview Elements
  const livePreviewImg = document.getElementById('livePreviewImg');
  const livePreviewName = document.getElementById('livePreviewName');
  const livePreviewMsg = document.getElementById('livePreviewMsg');
  const previewThemeBadge = document.getElementById('previewThemeBadge');
  const uploadedFileName = document.getElementById('uploadedFileName');
  const uploadPlaceholder = document.getElementById('uploadPlaceholder');
  const uploadSuccess = document.getElementById('uploadSuccess');
  const btnChangePhoto = document.getElementById('btnChangePhoto');

  // Error Message Elements
  const nameError = document.getElementById('nameError');
  const photoError = document.getElementById('photoError');
  const messageError = document.getElementById('messageError');

  // Views & Overlay Elements
  const creatorSection = document.getElementById('creatorSection');
  const surpriseSection = document.getElementById('surpriseSection');
  const countdownModal = document.getElementById('countdownModal');
  const countdownTimer = document.getElementById('countdownTimer');

  // Surprise Page Elements
  const surpriseHeadline = document.getElementById('surpriseHeadline');
  const surpriseName = document.getElementById('surpriseName');
  const surpriseImg = document.getElementById('surpriseImg');
  const surpriseMessageText = document.getElementById('surpriseMessageText');
  const openGiftBtn = document.getElementById('openGiftBtn');
  const secretGiftReveal = document.getElementById('secretGiftReveal');
  const secretGiftText = document.getElementById('secretGiftText');
  const interactiveCake = document.getElementById('interactiveCake');
  const flames = document.querySelectorAll('.flame');

  // Action Buttons & Share Modal
  const toggleMusicBtn = document.getElementById('toggleMusicBtn');
  const musicLabel = document.getElementById('musicLabel');
  const surpriseMusicBtn = document.getElementById('surpriseMusicBtn');
  const burstConfettiBtn = document.getElementById('burstConfettiBtn');
  const downloadCardBtn = document.getElementById('downloadCardBtn');
  const shareWishBtn = document.getElementById('shareWishBtn');
  const createAnotherBtn = document.getElementById('createAnotherBtn');
  const captureCard = document.getElementById('captureCard');

  const shareModal = document.getElementById('shareModal');
  const shareUrlInput = document.getElementById('shareUrlInput');
  const copyShareUrlBtn = document.getElementById('copyShareUrlBtn');
  const closeShareModalBtn = document.getElementById('closeShareModalBtn');

  // Toast
  const toastNotice = document.getElementById('toastNotice');
  const toastMessage = document.getElementById('toastMessage');

  // =========================================================================
  // 1. DYNAMIC AUDIO ENGINE & MULTI-SONG SWITCHER
  // =========================================================================
  let audioPlayer = new Audio();
  audioPlayer.loop = true;

  function getActiveSongSrc() {
    if (state.selectedSongKey === 'custom' && state.customAudioDataUrl) {
      return state.customAudioDataUrl;
    }
    if (typeof PRESET_SONGS !== 'undefined' && PRESET_SONGS[state.selectedSongKey]) {
      return PRESET_SONGS[state.selectedSongKey];
    }
    return (typeof PRESET_SONGS !== 'undefined') ? PRESET_SONGS.arijit : '';
  }

  function startMusic() {
    const src = getActiveSongSrc();
    if (!src) return;

    if (audioPlayer.src !== src) {
      audioPlayer.src = src;
    }

    state.isPlayingMusic = true;
    updateMusicUI(true);

    const playPromise = audioPlayer.play();
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        console.warn('Audio play restricted:', e);
      });
    }
  }

  function pauseMusic() {
    state.isPlayingMusic = false;
    updateMusicUI(false);
    audioPlayer.pause();
  }

  function toggleMusic() {
    if (state.isPlayingMusic) {
      pauseMusic();
      showToast('🔇 Music paused.');
    } else {
      startMusic();
      showToast(`🎶 Playing: ${songTitles[state.selectedSongKey] || 'Song'}`);
    }
  }

  function updateMusicUI(playing) {
    if (playing) {
      toggleMusicBtn.classList.add('playing');
      musicLabel.textContent = 'Pause Music';
      surpriseMusicBtn.innerHTML = '<span class="icon">⏸️</span><span class="text">Pause Music</span>';
      btnPreviewSelectedSong.textContent = '⏸️ Stop Preview';
    } else {
      toggleMusicBtn.classList.remove('playing');
      musicLabel.textContent = 'Play Music';
      surpriseMusicBtn.innerHTML = '<span class="icon">🎶</span><span class="text">Play Music</span>';
      btnPreviewSelectedSong.textContent = '▶️ Preview Song';
    }
  }

  toggleMusicBtn.addEventListener('click', toggleMusic);
  surpriseMusicBtn.addEventListener('click', toggleMusic);
  btnPreviewSelectedSong.addEventListener('click', () => {
    if (state.isPlayingMusic) {
      pauseMusic();
    } else {
      startMusic();
    }
  });

  // Song selection handler
  songOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      const radio = opt.querySelector('input');
      const val = radio.value;

      if (val === 'custom') {
        customAudioInput.click();
      }

      songOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      radio.checked = true;
      state.selectedSongKey = val;

      previewSongBadge.textContent = `🎵 Song: ${songTitles[val] || 'Selected Song'}`;

      if (state.isPlayingMusic) {
        startMusic();
      }
    });
  });

  // Custom audio file upload (MP3/WAV/AAC)
  customAudioInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      showToast('⚠️ Please upload a valid audio file (.mp3, .wav, .m4a).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      state.customAudioDataUrl = event.target.result;
      state.selectedSongKey = 'custom';
      customSongLabel.textContent = `Uploaded: ${file.name}`;
      songTitles.custom = file.name;
      previewSongBadge.textContent = `🎵 Song: ${file.name}`;
      showToast(`🎶 Custom song "${file.name}" loaded!`);

      if (state.isPlayingMusic) {
        startMusic();
      }
    };
    reader.readAsDataURL(file);
  });

  // =========================================================================
  // 2. ATMOSPHERIC PARTICLES GENERATION (Stars & Balloons)
  // =========================================================================
  function initAmbientAtmosphere() {
    const starsContainer = document.getElementById('ambientStars');
    const balloonsContainer = document.getElementById('ambientBalloons');

    for (let i = 0; i < 45; i++) {
      const star = document.createElement('div');
      star.className = 'ambient-star';
      const size = Math.random() * 3 + 2;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
      star.style.animationDelay = `${Math.random() * 3}s`;
      starsContainer.appendChild(star);
    }

    const balloonEmojis = ['🎈', '🍾', '🎈', '💖', '🎈', '⭐', '🎈', '🥂'];
    for (let i = 0; i < 8; i++) {
      const balloon = document.createElement('div');
      balloon.className = 'floating-balloon';
      balloon.textContent = balloonEmojis[i % balloonEmojis.length];
      balloon.style.left = `${(i * 12) + (Math.random() * 8)}%`;
      balloon.style.animationDelay = `${Math.random() * 12}s`;
      balloon.style.animationDuration = `${14 + Math.random() * 8}s`;
      balloonsContainer.appendChild(balloon);
    }
  }
  initAmbientAtmosphere();

  // =========================================================================
  // 3. LIVE FORM SYNCHRONIZATION
  // =========================================================================
  personNameInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    state.name = val || 'Aryan';
    livePreviewName.textContent = state.name;
    nameError.style.display = 'none';
  });

  birthdayMessageInput.addEventListener('input', (e) => {
    const val = e.target.value;
    charCountEl.textContent = val.length;
    state.message = val.trim() || 'Wishing you an unforgettable birthday packed with love, health, and limitless joy! Keep conquering! 🍾👑';
    livePreviewMsg.textContent = `"${state.message}"`;
    messageError.style.display = 'none';
  });

  btnQuickWishes.addEventListener('click', () => {
    const randomWish = quickWishes[Math.floor(Math.random() * quickWishes.length)];
    birthdayMessageInput.value = randomWish;
    charCountEl.textContent = randomWish.length;
    state.message = randomWish;
    livePreviewMsg.textContent = `"${randomWish}"`;
    messageError.style.display = 'none';
    showToast('✨ Pre-filled with an awesome birthday wish!');
  });

  themeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      themeOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      const radio = opt.querySelector('input');
      radio.checked = true;
      const theme = radio.value;
      state.selectedTheme = theme;
      
      appBody.className = theme;
      
      const themeLabel = opt.querySelector('.theme-name').textContent;
      previewThemeBadge.textContent = `Theme: ${themeLabel}`;
    });
  });

  // =========================================================================
  // 4. PHOTO UPLOAD & PREVIEW (FileReader & Drag-Drop)
  // =========================================================================
  function handlePhotoFile(file) {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('⚠️ Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      showToast('⚠️ Image size exceeds 12MB. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      state.photoDataUrl = e.target.result;
      livePreviewImg.src = state.photoDataUrl;
      surpriseImg.src = state.photoDataUrl;

      // Save into localStorage for automatic retrieval by direct link
      try {
        localStorage.setItem('wish_star_photo', state.photoDataUrl);
      } catch(err){}

      uploadedFileName.textContent = file.name;
      uploadPlaceholder.style.display = 'none';
      uploadSuccess.style.display = 'flex';
      photoError.style.display = 'none';
      showToast('📸 Photo uploaded successfully!');
    };
    reader.onerror = () => {
      showToast('⚠️ Could not load image. Please try another one.');
    };
    reader.readAsDataURL(file);
  }

  photoInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handlePhotoFile(e.target.files[0]);
    }
  });

  dropZone.addEventListener('click', () => photoInput.click());
  btnChangePhoto.addEventListener('click', (e) => {
    e.stopPropagation();
    photoInput.click();
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('dragover');
    });
  });

  dropZone.addEventListener('drop', (e) => {
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoFile(e.dataTransfer.files[0]);
    }
  });

  // =========================================================================
  // 5. FORM SUBMISSION -> START MUSIC INSTANTLY & REVEAL
  // =========================================================================
  birthdayForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const nameVal = personNameInput.value.trim();
    const msgVal = birthdayMessageInput.value.trim();

    if (!nameVal) {
      nameError.style.display = 'block';
      personNameInput.focus();
      isValid = false;
    } else {
      nameError.style.display = 'none';
    }

    if (!msgVal) {
      messageError.style.display = 'block';
      if (isValid) birthdayMessageInput.focus();
      isValid = false;
    } else {
      messageError.style.display = 'none';
    }

    if (!isValid) return;

    state.name = nameVal;
    state.message = msgVal;
    state.secretMessage = secretSurpriseInput.value.trim() || state.secretMessage;

    // Start user selected song immediately!
    startMusic();

    // Launch Countdown Reveal
    launchCountdownReveal();
  });

  function launchCountdownReveal() {
    countdownModal.style.display = 'flex';
    countdownModal.setAttribute('aria-hidden', 'false');
    let count = 3;
    countdownTimer.textContent = count;

    const timerInterval = setInterval(() => {
      count--;
      if (count > 0) {
        countdownTimer.textContent = count;
      } else {
        clearInterval(timerInterval);
        countdownModal.style.display = 'none';
        countdownModal.setAttribute('aria-hidden', 'true');
        showSurprisePage();
      }
    }, 850);
  }

  function showSurprisePage() {
    surpriseHeadline.innerHTML = `Happy Birthday, <span class="highlight-name" id="surpriseName">${escapeHtml(state.name)}</span>! 🎂`;
    surpriseImg.src = state.photoDataUrl;
    surpriseMessageText.textContent = state.message;
    secretGiftText.textContent = state.secretMessage;

    flames.forEach(f => f.classList.remove('blown-out'));
    state.candlesLit = true;

    secretGiftReveal.style.display = 'none';
    openGiftBtn.setAttribute('aria-expanded', 'false');

    creatorSection.style.display = 'none';
    surpriseSection.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    fireConfettiBurst(220);
    showToast(`🎂 Happy Birthday ${state.name}! Party has started! 🍾`);
  }

  // =========================================================================
  // 6. CAKE & CANDLE INTERACTION
  // =========================================================================
  interactiveCake.addEventListener('click', () => {
    if (state.candlesLit) {
      flames.forEach(f => f.classList.add('blown-out'));
      state.candlesLit = false;
      fireConfettiBurst(150);
      showToast('🌟 You blew out the candles! May all your wishes come true!');
    } else {
      flames.forEach(f => f.classList.remove('blown-out'));
      state.candlesLit = true;
      showToast('✨ Relit the candles with magic!');
    }
  });

  // =========================================================================
  // 7. SECRET GIFT BOX REVEAL
  // =========================================================================
  openGiftBtn.addEventListener('click', () => {
    const isExpanded = openGiftBtn.getAttribute('aria-expanded') === 'true';
    if (!isExpanded) {
      secretGiftReveal.style.display = 'block';
      openGiftBtn.setAttribute('aria-expanded', 'true');
      openGiftBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      fireConfettiBurst(180);
      showToast('🎁 Secret VIP surprise unlocked!');
    } else {
      secretGiftReveal.style.display = 'none';
      openGiftBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // =========================================================================
  // 8. SEND SURPRISE LINK TO BIRTHDAY PERSON (They don't fill anything!)
  // =========================================================================
  shareWishBtn.addEventListener('click', () => {
    // Encode parameters into URL so recipient sees their page immediately!
    const params = new URLSearchParams();
    params.set('recipient', 'true');
    params.set('name', state.name);
    params.set('msg', state.message);
    params.set('gift', state.secretMessage);
    params.set('theme', state.selectedTheme);
    params.set('song', state.selectedSongKey);

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    shareUrlInput.value = shareUrl;

    if (navigator.share) {
      navigator.share({
        title: `A VIP Birthday Surprise for ${state.name}! 🎂🍾`,
        text: `Open your special birthday surprise now! 🎁✨`,
        url: shareUrl
      }).then(() => {
        showToast('✨ Surprise link shared successfully!');
      }).catch(() => {
        shareModal.style.display = 'flex';
      });
    } else {
      shareModal.style.display = 'flex';
    }
  });

  copyShareUrlBtn.addEventListener('click', () => {
    shareUrlInput.select();
    navigator.clipboard.writeText(shareUrlInput.value)
      .then(() => {
        showToast('📋 Link copied! Send this to the birthday boy/girl!');
        copyShareUrlBtn.textContent = '✓ Copied!';
        setTimeout(() => copyShareUrlBtn.textContent = 'Copy Link', 2500);
      })
      .catch(() => {
        showToast('📋 Link selected, press Ctrl+C to copy!');
      });
  });

  closeShareModalBtn.addEventListener('click', () => {
    shareModal.style.display = 'none';
  });

  // =========================================================================
  // 9. CHECK IF OPENED VIA SHARE LINK (Direct recipient mode)
  // =========================================================================
  function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('recipient') === 'true' || urlParams.has('name')) {
      const pName = urlParams.get('name');
      const pMsg = urlParams.get('msg');
      const pGift = urlParams.get('gift');
      const pTheme = urlParams.get('theme');
      const pSong = urlParams.get('song');

      if (pName) state.name = pName;
      if (pMsg) state.message = pMsg;
      if (pGift) state.secretMessage = pGift;
      if (pTheme) {
        state.selectedTheme = pTheme;
        appBody.className = pTheme;
      }
      if (pSong && PRESET_SONGS[pSong]) {
        state.selectedSongKey = pSong;
      }

      // Check for saved local photo if shared locally
      try {
        const savedPhoto = localStorage.getItem('wish_star_photo');
        if (savedPhoto) state.photoDataUrl = savedPhoto;
      } catch(err){}

      // Direct recipient lands directly on the surprise celebration page!
      creatorSection.style.display = 'none';
      surpriseSection.style.display = 'block';
      surpriseHeadline.innerHTML = `Happy Birthday, <span class="highlight-name" id="surpriseName">${escapeHtml(state.name)}</span>! 🎂`;
      surpriseImg.src = state.photoDataUrl;
      surpriseMessageText.textContent = state.message;
      secretGiftText.textContent = state.secretMessage;

      // Start music on first click anywhere
      document.body.addEventListener('click', function autoMusic() {
        if (!state.isPlayingMusic) {
          startMusic();
        }
        document.body.removeEventListener('click', autoMusic);
      }, { once: true });

      setTimeout(() => {
        fireConfettiBurst(250);
        showToast(`🍾 Welcome to your VIP Birthday Party, ${state.name}!`);
      }, 500);
    }
  }
  checkUrlParams();

  // =========================================================================
  // 10. ACTION BUTTONS: CONFETTI, CARD DOWNLOAD & RESET
  // =========================================================================
  burstConfettiBtn.addEventListener('click', () => {
    fireConfettiBurst(260);
    showToast('🎊 Confetti shower launched!');
  });

  downloadCardBtn.addEventListener('click', () => {
    if (typeof html2canvas === 'undefined') {
      showToast('⚠️ Screenshot library still loading. Please try again.');
      return;
    }

    showToast('📸 Preparing your VIP Greeting Card...');
    
    html2canvas(captureCard, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = `Birthday-Wish-${state.name.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('🎉 Greeting Card downloaded successfully!');
    }).catch(err => {
      console.error(err);
      showToast('⚠️ Could not generate image. Please try taking a screenshot.');
    });
  });

  createAnotherBtn.addEventListener('click', () => {
    surpriseSection.style.display = 'none';
    creatorSection.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // =========================================================================
  // 11. HIGH PERFORMANCE CONFETTI ENGINE (HTML5 CANVAS)
  // =========================================================================
  const confettiCanvas = document.getElementById('confettiCanvas');
  const ctx = confettiCanvas.getContext('2d');
  let particles = [];
  let confettiAnimId = null;

  function resizeConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeConfettiCanvas);
  resizeConfettiCanvas();

  const confettiColors = ['#ffd700', '#ff007f', '#00f0ff', '#a855f7', '#ffffff', '#ffd166'];

  function createParticle() {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 5;
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2 - 50,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 5,
      size: Math.random() * 8 + 5,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      gravity: 0.18,
      opacity: 1,
      decay: Math.random() * 0.008 + 0.004
    };
  }

  function fireConfettiBurst(count = 150) {
    for (let i = 0; i < count; i++) {
      particles.push(createParticle());
    }
    if (!confettiAnimId) {
      runConfettiLoop();
    }
  }

  function runConfettiLoop() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.opacity -= p.decay;

      if (p.opacity <= 0 || p.y > confettiCanvas.height + 50) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
      ctx.restore();
    }

    if (particles.length > 0) {
      confettiAnimId = requestAnimationFrame(runConfettiLoop);
    } else {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      confettiAnimId = null;
    }
  }

  // =========================================================================
  // 12. TOAST NOTIFICATION HELPER
  // =========================================================================
  let toastTimeout = null;
  function showToast(msg) {
    if (toastTimeout) clearTimeout(toastTimeout);
    toastMessage.textContent = msg;
    toastNotice.classList.add('show');
    toastTimeout = setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3500);
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
  }

});
