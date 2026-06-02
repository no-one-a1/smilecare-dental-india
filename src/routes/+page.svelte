<script lang="ts">
    import { CLINIC_META, IMAGES } from '../lib/config/clinicData';
    import { dentalDB } from '../lib/core/db.svelte';
    import BookingForm from '../lib/ui/BookingForm.svelte';
    import TechShowcase from '../lib/ui/TechShowcase.svelte';
    import TokenQueue from '$lib/ui/TokenQueue.svelte';

    // Interactive Verification UI State management hooks
    let activePromptId = $state<string | null>(null);
    let verificationPhoneInput = $state('');
    let systemErrorMessage = $state('');
    
    // Mobile Responsive Navbar State
    let isMobileMenuOpen = $state(false);

    function triggerCancellationFlow(id: string) {
        activePromptId = id;
        verificationPhoneInput = '';
        systemErrorMessage = '';
    }

    function confirmCancellation(e: Event) {
        e.preventDefault();
        if (!activePromptId) return;

        const success = dentalDB.dropRecordSecurely(activePromptId, verificationPhoneInput);
        if (success) {
            activePromptId = null; // Collapse prompt container
            verificationPhoneInput = '';
        } else {
            systemErrorMessage = "Verification Failed! Mobile number mismatch for this token row.";
        }
    }

    function toggleMobileMenu() {
        isMobileMenuOpen = !isMobileMenuOpen;
    }
</script>

<main class="page-shell">
    <div class="top-ribbon">
        <span class="location-span">📍 <strong>Telangana Hub:</strong> {CLINIC_META.address}</span>
        <span class="call-span">📞 Desk: <strong>{CLINIC_META.tel}</strong></span>
    </div>

    <header class="main-header">
        <div class="header-container">
            <div class="brand">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#005b52" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                <div class="brand-text">
                    <h1>{CLINIC_META.name.split(' ')[0]}<span class="accent-text">Care</span></h1>
                    <span>Operational Gateway</span>
                </div>
            </div>

            <nav class="desktop-nav">
                <a href="#booking-section">Book Token</a>
                <a href="#ledger-section">Live Stream</a>
                <a href="#infrastructure-section">Advanced Tech</a>
            </nav>

            <button class="hamburger-btn" onclick={toggleMobileMenu} aria-label="Toggle Navigation Menu">
                <div class="bar" class:bar1-open={isMobileMenuOpen}></div>
                <div class="bar" class:bar2-open={isMobileMenuOpen}></div>
                <div class="bar" class:bar3-open={isMobileMenuOpen}></div>
            </button>
        </div>

        {#if isMobileMenuOpen}
            <div class="mobile-drawer">
                <a href="#booking-section" onclick={toggleMobileMenu}>Book Appointment</a>
                <a href="#ledger-section" onclick={toggleMobileMenu}>Active Token Stream</a>
                <a href="#infrastructure-section" onclick={toggleMobileMenu}>Clinic Infrastructure</a>
                <div class="drawer-contact">
                    <p>📞 {CLINIC_META.tel}</p>
                </div>
            </div>
        {/if}
    </header>

    <section class="banner" style="--bg-asset: url('{IMAGES.heroOverlayBg}')">
        <div class="scrim"></div>
        <div class="banner-inner">
            <span class="pill-label">HITEC City & Siripuram Network Clusters</span>
            <h1>Premium Digital Dentistry. <br/>Localized Operational Standards.</h1>
            <p>Providing high-precision scans, explicit multi-chair configurations, and transparent token allocation ledgers built right inside client memory frameworks.</p>
        </div>
    </section>

    <div class="split-workspace">
        <div id="booking-section" class="left-form-column">
            <BookingForm />
        </div>
        
        <div id="ledger-section" class="right-ledger-column">
            <div class="ledger-header">
                <h3>Active Consultation Token Stream</h3>
                <span class="count-tag">{dentalDB.appointments.length} Slots Reserved</span>
            </div>

            {#if dentalDB.appointments.length === 0}
                <div class="empty-placeholder">
                    <p>No active slots committed to static memory. Complete the reservation block inputs to generate tokens immediately.</p>
                </div>
            {:move}
                <div class="records-stack">
                    {#each dentalDB.appointments as record (record.id)}
                        <div class="record-row">
                            <div class="meta-block">
                                <h4>{record.patientName}</h4>
                                <span class="badge">{record.treatment}</span>
                                <small class="timing-highlight">⏰ <strong>{record.preferredDate}</strong> at <strong>{record.preferredTime}</strong></small>
                                <small class="token-id-text">Verification Reference Code: {record.id.slice(0,8).toUpperCase()}</small>
                            </div>

                            {#if activePromptId === record.id}
                                <form onsubmit={confirmCancellation} class="secure-cancellation-form">
                                    <input type="tel" bind:value={verificationPhoneInput} required placeholder="Enter Registered Mobile" />
                                    {#if systemErrorMessage}<p class="error-msg">{systemErrorMessage}</p>{/if}
                                    <div class="action-btn-row">
                                        <button type="submit" class="verify-confirm-btn">Confirm Drop</button>
                                        <button type="button" onclick={() => activePromptId = null} class="verify-cancel-btn">Back</button>
                                    </div>
                                </form>
                            {:else}
                                <button onclick={() => triggerCancellationFlow(record.id)} class="drop-action" title="Verify ownership to cancel">✕ Request Cancellation</button>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>

    <section id="infrastructure-section" class="bottom-infrastructure-panel">
        <TechShowcase />
    </section>

    <footer class="clinic-footer">
        <p><strong>{CLINIC_META.name}</strong></p>
        <p class="footer-subtext">📍 <strong>AP Regional HQ:</strong> {CLINIC_META.vizagBranch}</p>
        <p class="footer-subtext">Operating parameters adhere to state health department biomedical diagnostic compliance frameworks.</p>
    </footer>
</main>

<style>
    :global(body) { 
        margin: 0; 
        padding: 0; 
        font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; 
        background-color: #f8fafc; 
        color: #1e293b; 
        overflow-x: hidden;
    }
    
    .page-shell { 
        width: 100%; 
        max-width: 100%;
        overflow-x: hidden; 
    }

    /* Top Contact Ribbon Adaptations */
    .top-ribbon { 
        background: #005b52; 
        color: #f0fdfa; 
        display: flex; 
        justify-content: space-between; 
        padding: 10px 10%; 
        font-size: 0.82rem; 
        font-weight: 500; 
        border-bottom: 3px solid #eab308; 
    }

    /* New Navigation Styles */
    .main-header {
        position: sticky;
        top: 0;
        left: 0;
        width: 100%;
        background: rgba(255, 255, 255, 0.96);
        backdrop-filter: blur(8px);
        border-bottom: 1px solid #e2e8f0;
        z-index: 1000;
        box-sizing: border-box;
    }
    .header-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 12px 10%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .brand { display: flex; align-items: center; gap: 8px; }
    .brand-text h1 { font-size: 1.15rem; font-weight: 800; color: #0f172a; margin: 0; line-height: 1; }
    .brand-text h1 .accent-text { color: #005b52; }
    .brand-text span { font-size: 0.68rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
    
    .desktop-nav { display: flex; gap: 20px; }
    .desktop-nav a { text-decoration: none; color: #475569; font-weight: 600; font-size: 0.88rem; transition: color 0.2s; }
    .desktop-nav a:hover { color: #005b52; }

    /* Interactive Hamburger Button Styling */
    .hamburger-btn { display: none; background: none; border: none; flex-direction: column; gap: 4px; cursor: pointer; padding: 4px; }
    .bar { width: 20px; height: 2px; background-color: #0f172a; transition: all 0.2s ease-in-out; }
    .bar1-open { transform: translateY(6px) rotate(45deg); }
    .bar2-open { opacity: 0; }
    .bar3-open { transform: translateY(-6px) rotate(-45deg); }

    .mobile-drawer { display: flex; flex-direction: column; background: #ffffff; border-top: 1px solid #e2e8f0; padding: 15px 10%; gap: 12px; }
    .mobile-drawer a { text-decoration: none; color: #1e293b; font-weight: 600; font-size: 0.95rem; padding: 6px 0; border-bottom: 1px solid #f1f5f9; }
    .drawer-contact { font-size: 0.85rem; color: #005b52; font-weight: bold; margin-top: 5px; }

    /* Banner Improvements */
    .banner { position: relative; background-image: var(--bg-asset); background-size: cover; background-position: center; min-height: 40vh; display: flex; align-items: center; padding: 40px 10%; box-sizing: border-box; }
    .scrim { position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(90deg, rgba(255,255,255,0.98) 50%, rgba(255,255,255,0.6) 100%); }
    .banner-inner { position: relative; z-index: 2; max-width: 600px; }
    .pill-label { background: #ccfbf1; color: #115e59; padding: 4px 8px; border-radius: 4px; font-weight: 700; font-size: 0.7rem; text-transform: uppercase; }
    .banner-inner h1 { font-size: 2.2rem; font-weight: 800; color: #0f172a; margin: 12px 0 8px 0; line-height: 1.2; }
    .banner-inner p { color: #475569; font-size: 0.95rem; line-height: 1.5; }

    /* Workspaces & Grid Systems */
    .split-workspace { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 30px; padding: 40px 10%; }
    .right-ledger-column { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; box-sizing: border-box; height: fit-content; }
    .ledger-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 2px solid #f1f5f9; margin-bottom: 15px; }
    .ledger-header h3 { font-size: 1.05rem; font-weight: 700; color: #005b52; margin: 0; }
    .count-tag { background: #ccfbf1; color: #005b52; padding: 4px 10px; border-radius: 99px; font-size: 0.75rem; font-weight: 700; }
    
    .empty-placeholder { display: flex; align-items: center; justify-content: center; height: 250px; border: 2px dashed #cbd5e1; border-radius: 8px; text-align: center; color: #64748b; font-size: 0.9rem; padding: 20px; }
    .records-stack { display: flex; flex-direction: column; gap: 12px; max-height: 500px; overflow-y: auto; }
    .record-row { display: flex; flex-direction: column; gap: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-left: 5px solid #005b52; padding: 15px; border-radius: 8px; }
    .meta-block h4 { margin: 0; font-size: 1.05rem; color: #0f172a; font-weight: 700; }
    .badge { display: inline-block; font-size: 0.7rem; background: #e2e8f0; color: #334155; padding: 2px 6px; border-radius: 4px; margin: 4px 0; font-weight: 600; }
    .timing-highlight { display: block; font-size: 0.85rem; color: #0f766e; font-weight: 500; margin-top: 2px; }
    .token-id-text { display: block; font-size: 0.72rem; color: #94a3b8; font-family: monospace; margin-top: 2px; }
    
    .drop-action { background: #fff1f2; border: 1px solid #ffe4e6; color: #e11d48; cursor: pointer; font-size: 0.78rem; padding: 6px 10px; border-radius: 6px; font-weight: 600; align-self: flex-start; }
    
    /* Verification Challenges */
    .secure-cancellation-form { border-top: 1px dashed #cbd5e1; padding-top: 10px; display: flex; flex-direction: column; gap: 8px; width: 100%; }
    .secure-cancellation-form input { padding: 8px 12px; border: 1px solid #f43f5e; border-radius: 6px; background: #fff; font-size: 0.85rem; width: 100%; box-sizing: border-box; }
    .action-btn-row { display: flex; gap: 8px; }
    .verify-confirm-btn { background: #e11d48; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 0.78rem; font-weight: bold; cursor: pointer; }
    .verify-cancel-btn { background: #64748b; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 0.78rem; font-weight: bold; cursor: pointer; }
    .error-msg { color: #e11d48; font-size: 0.78rem; font-weight: 600; margin: 0; }

    .bottom-infrastructure-panel { padding: 40px 10%; border-top: 1px solid #e2e8f0; background: #ffffff; }
    .clinic-footer { background: #0f172a; color: #94a3b8; text-align: center; padding: 30px 20px; font-size: 0.85rem; border-top: 4px solid #005b52; }
    .clinic-footer strong { color: #ffffff; }
    .footer-subtext { font-size: 0.78rem; margin-top: 4px; color: #64748b; }

    /* ==========================================================
       🚀 CRITICAL RESPONSIVE MEDIA BREAKPOINTS 
       ========================================================== */
    
    /* Tablets & Large Phones Dropdowns */
    @media (max-width: 1024px) {
        .header-container, .top-ribbon, .banner, .split-workspace, .bottom-infrastructure-panel, .mobile-drawer {
            padding-left: 5%;
            padding-right: 5%;
        }
        .split-workspace { grid-template-columns: 1fr; gap: 30px; }
    }

    /* Target Handheld Mobile Interfaces */
    @media (max-width: 768px) {
        .top-ribbon { flex-direction: column; gap: 4px; align-items: center; text-align: center; }
        .desktop-nav { display: none; }
        .hamburger-btn { display: flex; }
        
        .banner { min-height: 45vh; padding-top: 30px; padding-bottom: 30px; }
        .banner-inner h1 { font-size: 1.6rem; }
        .banner-inner p { font-size: 0.88rem; }
        
        .right-ledger-column { padding: 15px; }
        .ledger-header h3 { font-size: 0.95rem; }
    }
</style>