
        // Veri Yapısı (Kolayca genişletilebilir)
        const data = {
            levhalar: [
                {
                    id: "01_Sa_a_Tehlikeli_Viraj__T_1a_.jpg",
                    title: "Sağa Tehlikeli Viraj",
                    type: "Tehlike (Üçgen)",
                    desc: "Yolun sağında tehlikeli bir viraj var. Hızını azalt, sollama yapma!"
                },
                {
                    id: "02_Sola_Tehlikeli_Viraj__T_1b_.jpg",
                    title: "Sola Tehlikeli Viraj",
                    type: "Tehlike (Üçgen)",
                    desc: "Yolun solunda tehlikeli bir viraj var. Hızını düşür!"
                },
                {
                    id: "08_Yol_Ver__TT_1_.jpg",
                    title: "Yol Ver",
                    type: "Tanzim (Ters Üçgen)",
                    desc: "Kavşaktaki diğer araçlara öncelik vermelisin. Yavaşla, gerekirse dur."
                },
                {
                    id: "09_Dur__TT_2_.jpg",
                    title: "DUR",
                    type: "Tanzim (Sekizgen)",
                    desc: "Mutlaka dur! Yolu kontrol et, boşsa geç. Yavaşlamak yetmez, tekerlekler durmalı."
                },
                {
                    id: "isaret_12.jpg", // Placeholder for a generic sign
                    title: "Yaya Geçidi",
                    type: "Bilgi / Uyarı",
                    desc: "Yayaların geçiş üstünlüğü var. Dur ve onlara yol ver anneciğim!"
                }
            ],
            motor: [
                {
                    id: "buji",
                    title: "Buji",
                    desc: "Benzinli motorlarda ateşlemeyi sağlar.",
                    tip: "Sınav Notu: Buji kablolarından biri çıkarsa motor sarsıntılı çalışır."
                },
                {
                    id: "radyator",
                    title: "Radyatör",
                    desc: "Motorun soğutma suyunun bulunduğu depodur.",
                    tip: "Sınav Notu: Su eksilirse motor hararet yapar!"
                },
                {
                    id: "karter",
                    title: "Karter",
                    desc: "Motor yağına depoluk eder.",
                    tip: "Sınav Notu: Karter delinirse motor yağı boşalır ve motor yanabilir."
                },
                {
                    id: "mars_motoru",
                    title: "Marş Motoru",
                    desc: "Motora ilk hareketi verir.",
                    tip: "Sınav Notu: Marşa basma süresi 10-15 saniyeyi geçmemelidir."
                }
            ],
            sorular: [
                {
                    q: "Kavşaklarda geçiş hakkı kime aittir?",
                    a: "Kavşak içindeki araca ve sağdan gelen araca aittir. (Geçiş üstünlüğü olan araçlar hariç: Ambulans, İtfaiye vb.)"
                },
                {
                    q: "Araç gösterge panelinde akü lambası yanarsa ne yapılmalı?",
                    a: "Araç derhal güvenli bir şekilde sağa çekilip durdurulmalı ve kontak kapatılmalıdır."
                },
                {
                    q: "Takip mesafesi ne kadar olmalıdır?",
                    a: "Aracın kilometre cinsinden hızının yarısı kadar metre olmalıdır. (Örn: 90 km/s hızda 45 metre)"
                },
                {
                    q: "Motor hararet yaparsa radyatör kapağı nasıl açılır?",
                    a: "Motor soğuduktan sonra, kapak yavaşça döndürülerek basıncı alınarak açılır. Sıcakken kesinlikle açılmaz!"
                }
            ]
        };

        // UI Oluşturma Fonksiyonları
        function createFlipCard(item, folder) {
            const imgSrc = folder === 'levhalar' ? `assets/img/${item.id}` : `assets/img/${item.id}.png`;
            const placeholder = folder === 'levhalar' ? '🚸' : '⚙️';
            
            // Handle placeholder if image fails to load gracefully
            const imgHtml = `
                <img src="${imgSrc}" alt="${item.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <div class="placeholder-icon" style="display:none; font-size:4rem; margin-top:10px;">${placeholder}</div>
            `;

            const extraContent = item.tip ? `<div class="exam-tip">${item.tip}</div>` : '';

            return `
                <div class="flip-card animate__animated animate__zoomIn" onclick="this.classList.toggle('flipped')">
                    <div class="flip-card-inner">
                        <div class="flip-card-front">
                            ${imgHtml}
                            <h3>${item.title}</h3>
                        </div>
                        <div class="flip-card-back">
                            <p>${item.desc}</p>
                            ${extraContent}
                        </div>
                    </div>
                </div>
            `;
        }

        function createQACard(item) {
            return `
                <div class="qa-item animate__animated animate__fadeInUp" onclick="this.classList.toggle('open')">
                    <div class="qa-question">
                        <span>❓ ${item.q}</span>
                        <span>🔽</span>
                    </div>
                    <div class="qa-answer">
                        ✅ ${item.a}
                    </div>
                </div>
            `;
        }

        // İçeriği Render Et
        function renderContent() {
            const levhalarGrid = document.getElementById('levhalar-grid');
            const motorGrid = document.getElementById('motor-grid');
            const sorularList = document.getElementById('sorular-list');

            levhalarGrid.innerHTML = data.levhalar.map(item => createFlipCard(item, 'levhalar')).join('');
            motorGrid.innerHTML = data.motor.map(item => createFlipCard(item, 'motor')).join('');
            sorularList.innerHTML = data.sorular.map(item => createQACard(item)).join('');
        }

        // Tab Değiştirme Mantığı
        const tabs = document.querySelectorAll('.tab-btn');
        const sections = document.querySelectorAll('.content-section');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));

                tab.classList.add('active');
                document.getElementById(tab.dataset.target).classList.add('active');
            });
        });

        // Müzik Kontrolü
        const musicBtn = document.getElementById('musicBtn');
        const bgMusic = document.getElementById('bgMusic');
        let isMusicPlaying = false;

        musicBtn.addEventListener('click', () => {
            if (isMusicPlaying) {
                bgMusic.pause();
                musicBtn.textContent = '🎵';
            } else {
                // If there's an actual audio source, play it. Otherwise, just toggle state.
                bgMusic.play().catch(e => console.log("Müzik kaynağı henüz eklenmedi."));
                musicBtn.textContent = '🔊';
            }
            isMusicPlaying = !isMusicPlaying;
        });

        // Mini Oyun Mantığı: Rükiş vs. Zabit Muhammed
        const gameModal = document.getElementById('game-modal');
        const startGameBtn = document.getElementById('startGameBtn');
        const cancelGameBtn = document.getElementById('cancelGameBtn');
        const startTimerBtn = document.getElementById('startTimerBtn');
        const gameIntro = document.getElementById('game-intro');
        const rukis = document.getElementById('rukis-char');
        const zabitScreen = document.getElementById('zabit-screen');
        const winScreen = document.getElementById('win-screen');
        
        let gameTimer;
        let moveInterval;

        startGameBtn.addEventListener('click', () => {
            gameModal.style.display = 'flex';
            gameIntro.style.display = 'flex';
            rukis.style.display = 'none';
            zabitScreen.style.display = 'none';
            winScreen.style.display = 'none';
        });

        cancelGameBtn.addEventListener('click', closeGame);

        startTimerBtn.addEventListener('click', () => {
            gameIntro.style.display = 'none';
            rukis.style.display = 'block';
            
            // Rükiş'i zıplat
            moveRukis();
            moveInterval = setInterval(moveRukis, 800);

            // 5 Saniye Süre
            gameTimer = setTimeout(() => {
                loseGame();
            }, 5000);
        });

        function moveRukis() {
            const area = document.querySelector('.game-area');
            const maxX = area.clientWidth - 80;
            const maxY = area.clientHeight - 80;
            
            const randomX = Math.floor(Math.random() * maxX);
            const randomY = Math.floor(Math.random() * maxY);

            rukis.style.left = `${randomX}px`;
            rukis.style.top = `${randomY}px`;
            
            // Rastgele boyut ve rotasyon efekti
            const scale = 0.8 + Math.random() * 0.4;
            const rot = -20 + Math.random() * 40;
            rukis.style.transform = `scale(${scale}) rotate(${rot}deg)`;
        }

        // Rükiş'e tıklanınca Kazan
        rukis.addEventListener('mousedown', () => {
            winGame();
        });
        rukis.addEventListener('touchstart', (e) => {
            e.preventDefault();
            winGame();
        });

        function winGame() {
            clearTimeout(gameTimer);
            clearInterval(moveInterval);
            rukis.style.display = 'none';
            winScreen.style.display = 'flex';
        }

        function loseGame() {
            clearInterval(moveInterval);
            rukis.style.display = 'none';
            zabitScreen.style.display = 'flex';
        }

        window.closeGame = function() {
            clearTimeout(gameTimer);
            clearInterval(moveInterval);
            gameModal.style.display = 'none';
        }

        // Başlangıç
        document.addEventListener('DOMContentLoaded', renderContent);

    