// Consolidated JS for navigation, MCQ and side-by-side pair comparisons

document.addEventListener('DOMContentLoaded', () => {
  // --- Username / navigation logic ---
  const usernameInput = document.getElementById('username');
  const submitButtons = document.querySelectorAll('button'); // harmless fallback

  window.checkUser = function checkUser() {
    const input = document.getElementById('username');
    const message = document.getElementById('message');
    const val = (input && input.value || '').trim();

    if (!message) return; // no UI

    if (!val) {
      message.textContent = "Please enter a username ✨";
      message.className = 'message error';
      return;
    }

    if (val.length < 3) {
      message.textContent = "That's too short! 😅";
      message.className = 'message error';
      return;
    }

    message.textContent = "Yay! Welcome, beautiful! 🥰🌸";
    message.className = 'message success';

    setTimeout(() => window.location.href = 'second-page.html', 1000);
  };

  // wire any top-level submit button if present (index.html style)
  const indexSubmit = document.querySelector('body .container button');
  if (indexSubmit && usernameInput) {
    indexSubmit.addEventListener('click', (e) => {
      // if the button is used for other pages, guard
      const id = usernameInput.id;
      if (id) checkUser();
    });
  }

  // --- MCQ logic for second-page.html (if present) ---
  (function setupMCQ() {
    const mcq = document.getElementById('mcq-container');
    if (!mcq) return;

    const options = mcq.querySelectorAll('.option');
    const msg = document.getElementById('mcq-message');
    const tryAgainBtn = document.getElementById('try-again');
    let answered = false;

    options.forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;

        const correct = btn.getAttribute('data-correct') === 'true';
        btn.classList.add('selected');
        if (correct) {
          btn.classList.add('correct');
          msg.textContent = 'Yay! We will have it this time when we meet 🍽️💖';
        } else {
          btn.classList.add('wrong');
          msg.textContent = 'I wish it did bring a smile on your face but it does not 😅';
        }

        // disable all options visually
        options.forEach(o => o.disabled = true);

        // show try again / proceed button depending on correctness
        if (!tryAgainBtn) return;
        tryAgainBtn.style.display = 'inline-block';
        if (correct) {
          tryAgainBtn.textContent = 'Proceed ➡️';
          tryAgainBtn.onclick = () => {
            window.location.href = 'third-page.html';
          };
        } else {
          tryAgainBtn.textContent = 'Try Again 🔁';
          tryAgainBtn.onclick = () => {
            // reset state
            answered = false;
            msg.textContent = '';
            tryAgainBtn.style.display = 'none';
            options.forEach(o => {
              o.disabled = false;
              o.classList.remove('selected', 'correct', 'wrong');
            });
          };
        }
      });
    });
  })();

  // --- Side-by-side pair grid for third-page.html ---
  (function setupPairGrid() {
    const pairGrid = document.getElementById('pair-grid');
    const pairMsg = document.getElementById('pair-message');
    if (!pairGrid) return;

    const imagesDir = 'img/';
    const targetFilename = 'IMG_7770.jpg';
    const allImages = [
      'IMG_7770.jpg',
      'G4s4JoqXIAAkhT_.jpg',
      'India-Cricket-WCup-68_1699809986420_1699810043017.jpg.webp',
      'nutella-bomboloni-6157464.png.webp'
    ];

    function shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    function createPairs() {
      const others = allImages.filter(n => n !== targetFilename);
      const pairs = [];
      pairs.push([targetFilename, targetFilename]);
      pairs.push([targetFilename, others[0] || targetFilename]);
      pairs.push([targetFilename, others[1] || others[0] || targetFilename]);
      return shuffle(pairs);
    }

    function renderPairs() {
      pairGrid.innerHTML = '';
      if (pairMsg) pairMsg.textContent = '';
      const pairs = createPairs();

      pairs.forEach(pair => {
        const left = pair[0];
        const right = pair[1];

        const card = document.createElement('button');
        card.className = 'pair';
        card.type = 'button';
        card.dataset.left = left;
        card.dataset.right = right;

        const holder = document.createElement('div');
        holder.className = 'pair-holder';

        const limg = document.createElement('img');
        limg.src = imagesDir + left;
        limg.alt = left;
        limg.loading = 'lazy';

        const rimg = document.createElement('img');
        rimg.src = imagesDir + right;
        rimg.alt = right;
        rimg.loading = 'lazy';

        holder.appendChild(limg);
        holder.appendChild(rimg);
        card.appendChild(holder);

        const lpath = document.createElement('div');
        lpath.className = 'path';
        lpath.textContent = imagesDir + left;
        const rpath = document.createElement('div');
        rpath.className = 'path';
        rpath.textContent = imagesDir + right;

        card.appendChild(lpath);
        card.appendChild(rpath);

        card.addEventListener('click', () => {
          const isMatch = (left === targetFilename && right === targetFilename);
          if (isMatch) {
            card.classList.add('correct');
            if (pairMsg) pairMsg.textContent = `Correct — both paths are: ${imagesDir + targetFilename}`;
          } else {
            card.classList.add('wrong');
            if (pairMsg) pairMsg.textContent = `Not a match — left: ${imagesDir + left}, right: ${imagesDir + right}`;
            setTimeout(() => {
              card.classList.remove('wrong');
              if (pairMsg) pairMsg.textContent = '';
            }, 900);
          }
        });

        pairGrid.appendChild(card);
      });
    }

    renderPairs();
  })();

});