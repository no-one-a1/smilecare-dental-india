<script lang="ts">
    import '../app.css'; // Your global stylesheet variable reference
    let isMobileMenuOpen = $state(false);

    function toggleMenu() {
        isMobileMenuOpen = !isMobileMenuOpen;
    }
</script>

<header class="main-header">
    <div class="header-container">
        <div class="brand">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#005b52" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <div class="brand-text">
                <h1>SmileCare</h1>
                <span>Corporate Dental India</span>
            </div>
        </div>

        <nav class="desktop-nav">
            <a href="#services">Clinical Tracks</a>
            <a href="#diagnostics">Advanced Tech</a>
            <a href="#booking" class="nav-booking-btn">Secure Token Desk ➔</a>
        </nav>

        <button class="hamburger" onclick={toggleMenu} aria-label="Toggle Navigation Options Menu">
            <div class="bar" class:open-bar1={isMobileMenuOpen}></div>
            <div class="bar" class:open-bar2={isMobileMenuOpen}></div>
            <div class="bar" class:open-bar3={isMobileMenuOpen}></div>
        </button>
    </div>

    {#if isMobileMenuOpen}
        <div class="mobile-drawer">
            <a href="#services" onclick={toggleMenu}>Clinical Tracks</a>
            <a href="#diagnostics" onclick={toggleMenu}>Advanced Tech</a>
            <a href="#booking" class="mobile-booking-btn" onclick={toggleMenu}>Book Appointment Token</a>
        </div>
    {/if}
</header>

<main class="page-body-wrapper">
    <slot />
</main>

<style>
    :global(html, body) {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        overflow-x: hidden; /* Prevents awkward horizontal breaking and scrolling on phones */
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        background-color: #f8fafc;
    }

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
        padding: 12px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .brand { display: flex; align-items: center; gap: 10px; }
    .brand-text h1 { font-size: 1.15rem; font-weight: 800; color: #0f172a; margin: 0; line-height: 1.1; }
    .brand-text span { font-size: 0.72rem; font-weight: 600; color: #64748b; tracking: 0.5px; text-transform: uppercase; }

    .desktop-nav { display: flex; align-items: center; gap: 24px; }
    .desktop-nav a { text-decoration: none; font-size: 0.9rem; font-weight: 600; color: #475569; transition: color 0.2s; }
    .desktop-nav a:hover { color: #005b52; }

    .nav-booking-btn {
        background: #005b52;
        color: #ffffff !important;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 0.85rem !important;
        transition: background 0.2s;
    }
    .nav-booking-btn:hover { background: #00443d; }

    /* Interactive Hamburger System layout dimensions configuration */
    .hamburger { display: none; background: none; border: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 5px; }
    .bar { width: 22px; height: 2.5px; background-color: #0f172a; border-radius: 2px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    
    /* Cross icon transformation properties when menu triggers open */
    .open-bar1 { transform: translateY(7.5px) rotate(45deg); }
    .open-bar2 { opacity: 0; }
    .open-bar3 { transform: translateY(-7.5px) rotate(-45deg); }

    .mobile-drawer {
        display: flex;
        flex-direction: column;
        background: #ffffff;
        border-top: 1px solid #e2e8f0;
        padding: 15px 20px;
        gap: 14px;
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
    }
    .mobile-drawer a { text-decoration: none; color: #334155; font-weight: 600; font-size: 0.95rem; padding: 8px 0; }
    .mobile-booking-btn { background: #f0fdf4; color: #005b52 !important; text-align: center; border-radius: 6px; padding: 10px !important; border: 1px solid #bbf7d0; }

    .page-body-wrapper {
        max-width: 1200px;
        margin: 0 auto;
        padding: 30px 20px;
        box-sizing: border-box;
    }

    /* Media Viewport Query Optimization Switcher for standard phones and tablets */
    @media (max-width: 768px) {
        .desktop-nav { display: none; }
        .hamburger { display: flex; }
    }
</style>