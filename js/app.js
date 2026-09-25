document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       LANGUAGE TOGGLE LOGIC
       ========================================= */
    const langBtn = document.getElementById('langToggleBtn');
    let currentLang = 'jp'; // default

    if (langBtn) {
        langBtn.innerHTML = '<i data-feather="globe"></i> EN'; // Set button text for JP default
        langBtn.addEventListener('click', () => {
            if (currentLang === 'en') {
                document.body.classList.remove('lang-en');
                document.body.classList.add('lang-jp');
                currentLang = 'jp';
                langBtn.innerHTML = '<i data-feather="globe"></i> EN';
            } else {
                document.body.classList.remove('lang-jp');
                document.body.classList.add('lang-en');
                currentLang = 'en';
                langBtn.innerHTML = '<i data-feather="globe"></i> 日本語';
            }
            if (typeof feather !== 'undefined') feather.replace();
        });
    }

    /* =========================================
       RIPPLE EFFECT LOGIC (Global)
       ========================================= */
    const createRipple = (event) => {
        const button = event.currentTarget;
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        const rect = button.getBoundingClientRect();
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.classList.add("ripple");
        
        const ripple = button.getElementsByClassName("ripple")[0];
        if (ripple) ripple.remove();
        button.appendChild(circle);
    };
    
    document.querySelectorAll('.btn-ripple').forEach(btn => {
        btn.addEventListener('click', createRipple);
    });

    /* =========================================
       HELPER: MODAL LOGIC
       ========================================= */
    function setupModal(triggerBtnId, modalId, confirmBtnId, successTextHtml, originalBtn, isDesktop = false) {
        const trigger = document.getElementById(triggerBtnId);
        const modal = document.getElementById(modalId);
        const confirm = document.getElementById(confirmBtnId);
        
        if (!trigger || !modal) return; // Allow modals without confirm buttons (like chat)

        // Open
        trigger.addEventListener('click', () => modal.classList.add('active'));
        
        // Close via background or close button
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('close-modal') || e.target.id.includes('close')) {
                modal.classList.remove('active');
            }
        });

        const closeBtns = modal.querySelectorAll('.close-modal, [id^="close"]');
        closeBtns.forEach(btn => btn.addEventListener('click', () => modal.classList.remove('active')));

        // Confirm Action Simulation (if confirm button exists)
        if (confirm) {
            confirm.addEventListener('click', function() {
                const ogHtml = this.innerHTML;
                
                // Show loading state based on current language
                const loadingText = document.body.classList.contains('lang-jp') ? '処理中...' : 'Processing...';
                this.innerHTML = `<i data-feather="loader" class="spin"></i> ${loadingText}`;
                
                if (typeof feather !== 'undefined') feather.replace();
                
                setTimeout(() => {
                    this.innerHTML = `<i data-feather="check"></i> ${successTextHtml}`;
                    this.style.background = '#10B981'; // Green success
                    if (typeof feather !== 'undefined') feather.replace();
                    
                    setTimeout(() => {
                        modal.classList.remove('active');
                        this.innerHTML = ogHtml;
                        this.style.background = ''; // reset
                        
                        if (originalBtn) {
                            const successBtnText = document.body.classList.contains('lang-jp') ? '完了' : 'Success';
                            originalBtn.innerHTML = `<i data-feather="check-circle"></i> ${successBtnText}`;
                            originalBtn.style.background = '#10B981';
                            originalBtn.style.color = '#fff';
                            originalBtn.style.pointerEvents = 'none';
                            if (typeof feather !== 'undefined') feather.replace();
                        }
                    }, 1000);
                }, 1200);
            });
        }
    }

    /* =========================================
       WORKER APP LOGIC
       ========================================= */
    
    // Flashcard Flip
    const flashcard = document.getElementById('flashcard');
    if (flashcard) {
        flashcard.addEventListener('click', () => flashcard.classList.toggle('flipped'));
    }

    // Worker App Modals - bilingual success text
    const checkInSuccess = '<span class="en-text">Checked In</span><span class="jp-text">打刻完了</span>';
    const advanceSuccess = '<span class="en-text">Requested</span><span class="jp-text">申請完了</span>';
    const leaveSuccess = '<span class="en-text">Evidence Uploaded</span><span class="jp-text">提出完了</span>';
    const sosSuccess = '<span class="en-text">Alert Sent</span><span class="jp-text">送信完了</span>';

    setupModal('btnCheckIn', 'modalCheckIn', 'confirmCheckIn', checkInSuccess, document.getElementById('btnCheckIn'));
    setupModal('btnAdvance', 'modalAdvance', 'confirmAdvance', advanceSuccess, document.getElementById('btnAdvance'));
    setupModal('btnLeave', 'modalLeave', 'confirmLeave', leaveSuccess, document.getElementById('btnLeave'));
    setupModal('btnSOS', 'modalSOS', 'confirmSOS', sosSuccess, document.getElementById('btnSOS'));
    
    // Auto-Translate Chat Modal
    setupModal('btnChat', 'modalChat', null, null, null);


    /* =========================================
       DASHBOARD LOGIC
       ========================================= */
    const broadcastSuccess = '<span class="en-text">Broadcasted</span><span class="jp-text">配信完了</span>';
    setupModal('btnBroadcastSOS', 'modalDesktopSOS', 'confirmDesktopSOS', broadcastSuccess, null, true);


    /* =========================================
       PROTOTYPE TOAST FEEDBACK
       ========================================= */
    function showAppToast(msgEN, msgJP) {
        let toast = document.getElementById('app-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'app-toast';
            toast.style.cssText = 'position:fixed; bottom:90px; left:50%; transform:translateX(-50%) translateY(20px); background:rgba(0,0,0,0.8); color:white; padding:12px 24px; border-radius:30px; font-size:0.85rem; font-weight:600; z-index:9999; opacity:0; pointer-events:none; transition:all 0.3s; white-space:nowrap;';
            document.body.appendChild(toast);
        }
        
        const isJp = document.body.classList.contains('lang-jp');
        toast.innerHTML = isJp ? msgJP : msgEN;
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
        }, 2000);
    }

    // Attach to Bottom Nav (excluding Admin which links out)
    document.querySelectorAll('.nav-tab').forEach(tab => {
        if (tab.getAttribute('href') === '#') {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                showAppToast('Coming in full version', '本番環境で実装されます');
                document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        }
    });

    // Chat input
    const chatBtn = document.querySelector('.chat-input-area button');
    if (chatBtn) {
        chatBtn.addEventListener('click', () => {
            showAppToast('Auto-translation works here', 'ここに自動翻訳チャットが入ります');
        });
    }


    /* =========================================
       CSS ANIMATION INJECTIONS
       ========================================= */
    const style = document.createElement('style');
    style.innerHTML = `
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);

});
