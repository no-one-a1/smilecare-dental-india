<script lang="ts">
    import { CLINIC_META, IMAGES } from '../lib/config/clinicData';
    import { dentalDB } from '../lib/core/db.svelte';
    import BookingForm from '../lib/ui/BookingForm.svelte';
    import TechShowcase from '../lib/ui/TechShowcase.svelte';

    // Interactive Verification UI State management hooks
    let activePromptId = $state<string | null>(null);
    let verificationPhoneInput = $state('');
    let systemErrorMessage = $state('');

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
</script>

<main class="page-shell">
    <div class="top-ribbon">
        <span class="location-span">📍 <strong>Telangana Hub:</strong> {CLINIC_META.address}</span>
        <span class="call-span">📞 Desk: <strong>{CLINIC_META.tel}</strong></span>
    </div>

    <section class="banner" style="--bg-asset: url('{IMAGES.heroOverlayBg}')">
        <div class="scrim"></div>
        <div class="banner-inner">
            <span class="pill-label">HITEC City & Siripuram Network Clusters</span>
            <h1>Premium Digital Dentistry. <br/>Localized Operational Standards.</h1>
            <p>Providing high-precision scans, explicit multi-chair configurations, and transparent token allocation ledgers.</p>
        </div>
    </section>

    <div class="responsive-container main-content-wrapper">
        <div class="split-workspace">
            <div class="form-column">
                <BookingForm />
            </div>
            
            <div class="ledger-column">
                <div class="ledger-header">
                    <h3>Active Consultation Token Stream</h3>
                    <span class="count-tag">{dentalDB.appointments.length} Slots Reserved</span>
                </div>

                {#if dentalDB.appointments.length === 0}
                    <div class="empty-placeholder">
                        <p>No active slots committed to static memory. Complete the reservation block inputs to generate tokens immediately.</p>
                    </div>
                {:else}
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
                                lock}
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    </div>

    <div class="responsive-container">
        <section class="bottom-infrastructure-panel">
            <TechShowcase />
        </section>
    </div>

    <footer class="clinic-footer">
        <p><strong>{CLINIC_META.name}</strong></p>
        <p class="footer-subtext">📍 <strong>AP Regional HQ:</strong> {CLINIC_META.vizagBranch}</p>
        <p class="footer-subtext">Operating parameters adhere to state health department biomedical diagnostic compliance frameworks.</p>
    </footer>
</main>

<style>
    /* Global System Overrides to force consistency across all devices */
    :global(html, body) { 
        margin: 0; 
        padding: 0; 
        font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; 
        background-color: #f8fafc; 
        color: #1e293b; 
        overflow-x: hidden;
        width: 100%;
        box-sizing: border-box;
    }

    :global(*, *:before, *:after) {
        box-sizing: inherit;
    }
    
    .page-shell { 
        width: 100%;
        overflow-x: hidden; 
    }

    /* Top Ribbon Realignment */
    .top-ribbon { 
        background: #005b52; 
        color: #f0fdfa; 
        display: flex; 
        justify-content: space-between; 
        padding: 12px 10%; 
        font-size: 0.85rem; 
        font-weight: 500; 
        border-bottom: 3px solid #eab308; 
    }

    /* Banner Alignment Safe Boundaries */
    .banner { 
        position: relative; 
        background-image: var(--bg-asset); 
        background-size: cover; 
        background-position: center; 
        min-height: 40vh; 
        display: flex; 
        align-items: center; 
        padding: 40px 10%; 
    }
    .scrim { position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(90deg, rgba(255,255,255,0.98) 40%, rgba(255,255,255,0.5) 100%); }
    .banner-inner { position: relative; z-index: 2; max-width: 600px; }
    .pill-label { background: #ccfbf1; color: #115e59; padding: 5px 10px; border-radius: 4px; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; }
    .banner-inner h1 { font-size: 2.4rem; font-weight: 800; color: #0f172a; margin: 15px 0 10px 0; line-height: 1.2; }
    .banner-inner p { color: #475569; font-size: 1rem; }

    /* ==========================================================
       🛡️ THE PERFECT ALIGNMENT FRAMEWORK (THE FIX)
       ========================================================== */
    .responsive-container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding-left: 10%;
        padding-right: 10%;
    }

    .main-content-wrapper {
        margin-top: 40px;
        margin-bottom: 20px;
    }

    .split-workspace { 
        display: grid; 
        grid-template-columns: 1.1fr 0.9fr; 
        gap: 40px; 
        width: 100%;
    }

    .form-column, .ledger-column {
        width: 100%;
    }

    .right-ledger-column { 
        background: #ffffff; 
        border: 1px solid #e2e8f0; 
        border-radius: 12px; 
        padding: 30px; 
        width: 100%;
    }

    /* Ledger Layout Blocks */
    .ledger-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 15px; border-bottom: 2px solid #f1f5f9; margin-bottom: 20px; }
    .ledger-header h3 { font-size: 1.1rem; font-weight: 700; color: #005b52; margin: 0; }
    .count-tag { background: #ccfbf1; color: #005b52; padding: 4px 12px; border-radius: 99px; font-size: 0.8rem; font-weight: 700; }
    
    .empty-placeholder { display: flex; align-items: center; justify-content: center; height: 300px; border: 2px dashed #cbd5e1; border-radius: 8px; text-align: center; color: #64748b; font-size: 0.95rem; padding: 20px; }
    .records-stack { display: flex; flex-direction: column; gap: 14px; max-height: 500px; overflow-y: auto; }
    .record-row { display: flex; flex-direction: column; gap: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-left: 5px solid #005b52; padding: 18px; border-radius: 8px; }
    .meta-block h4 { margin: 0; font-size: 1.15rem; color: #0f172a; font-weight: 700; }
    .badge { display: inline-block; font-size: 0.75rem; background: #e2e8f0; color: #334155; padding: 3px 8px; border-radius: 4px; margin: 6px 0; font-weight: 600; }
    .timing-highlight { display: block; font-size: 0.9rem; color: #0f766e; font-weight: 500; margin-top: 4px; }
    .token-id-text { display: block; font-size: 0.75rem; color: #94a3b8; font-family: monospace; margin-top: 2px; }
    
    .drop-action { background: #fff1f2; border: 1px solid #ffe4e6; color: #e11d48; cursor: pointer; font-size: 0.8rem; padding: 8px 12px; border-radius: 6px; font-weight: 600; align-self: flex-start; }
    
    .secure-cancellation-form { border-top: 1px dashed #cbd5e1; padding-top: 12px; display: flex; flex-direction: column; gap: 8px; width: 100%; }
    .secure-cancellation-form input { padding: 8px 12px; border: 1px solid #f43f5e; border-radius: 6px; background: #fff; font-size: 0.9rem; width: 100%; }
    .action-btn-row { display: flex; gap: 10px; }
    .verify-confirm-btn { background: #e11d48; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; cursor: pointer; }
    .verify-cancel-btn { background: #64748b; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; cursor: pointer; }
    .error-msg { color: #e11d48; font-size: 0.8rem; font-weight: 600; margin: 2px 0; }

    /* Infrastructure Alignment Box */
    .bottom-infrastructure-panel { 
        padding-top: 30px;
        padding-bottom: 50px;
        width: 100%;
    }

    /* Footer Parameters */
    .clinic-footer { background: #0f172a; color: #94a3b8; text-align: center; padding: 40px 20px; font-size: 0.9rem; border-top: 4px solid #005b52; width: 100%; }
    .clinic-footer strong { color: #ffffff; }
    .footer-subtext { font-size: 0.8rem; margin-top: 6px; color: #64748b; }

    /* ==========================================================
       📱 RESPONSIVE PAD REALIGNMENTS FOR MOBILE & TABLET
       ========================================================== */
    @media (max-width: 1024px) {
        .responsive-container {
            padding-left: 20px;
            padding-right: 20px;
        }
        .banner, .top-ribbon {
            padding-left: 20px;
            padding-right: 20px;
        }
        .split-workspace { 
            grid-template-columns: 1fr; 
            gap: 25px; 
        }
    }

    @media (max-width: 768px) {
        .top-ribbon { flex-direction: column; gap: 6px; align-items: center; text-align: center; padding: 10px; }
        .banner { min-height: 35vh; padding: 30px 20px; }
        .banner-inner h1 { font-size: 1.65rem; }
        .banner-inner p { font-size: 0.9rem; }
        .right-ledger-column { padding: 20px; }
        .main-content-wrapper { margin-top: 20px; }
    }
</style>