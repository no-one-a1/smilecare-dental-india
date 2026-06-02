<!-- src/lib/ui/TechShowcase.svelte -->
<script lang="ts">
    import { CLINIC_SERVICES, CLINIC_EQUIPMENT } from '../config/clinicData';
</script>

<div class="showcase-container">
    <div class="block-header">
        <h2>Specialized Clinical Dental Services</h2>
        <p>Providing high-precision treatments adhering to strict Indian Dental Association sterilization matrices.</p>
    </div>

    <div class="services-grid">
        {#each CLINIC_SERVICES as service}
            <div class="service-card">
                <div class="service-image-frame">
                    <img src={service.imgSrc} alt={service.name} loading="lazy" />
                    <div class="icon-bubble">
                        {@html service.svgIcon}
                    </div>
                </div>
                <div class="service-body">
                    <h4>{service.name}</h4>
                    <p class="expandable-desc">{service.description}</p>
                </div>
            </div>
        {/each}
    </div>

    <hr class="section-divider" />

    <div class="block-header">
        <h2>Advanced In-House Diagnostics Infrastructure</h2>
        <p>We invest heavily in digital radiology scanners to completely avoid diagnostic errors.</p>
    </div>

    <div class="equipment-grid">
        {#each CLINIC_EQUIPMENT as hardware}
            <div class="eq-card">
                <div class="eq-image-frame">
                    <img src={hardware.imgSrc} alt={hardware.name} loading="lazy" />
                </div>
                <div class="eq-body">
                    <h4>{hardware.name}</h4>
                    <p class="expandable-desc">{hardware.description}</p>
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .showcase-container { width: 100%; font-family: inherit; }
    .block-header { margin-bottom: 35px; text-align: left; border-left: 5px solid #005b52; padding-left: 15px; }
    .block-header h2 { font-size: 1.65rem; color: #005b52; font-weight: 800; margin: 0; }
    .block-header p { color: #64748b; font-size: 0.95rem; margin-top: 5px; }
    
    .section-divider { border: 0; height: 1px; background: #e2e8f0; margin: 60px 0; }

    /* Services Grid styling - dynamic expansion */
    .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 30px; }
    .service-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; height: auto; }
    
    .service-image-frame { width: 100%; height: 200px; background: #f1f5f9; position: relative; overflow: hidden; flex-shrink: 0; }
    .service-image-frame img { width: 100%; height: 100%; object-fit: cover; display: block; }
    
    .icon-bubble { position: absolute; bottom: -20px; left: 20px; width: 45px; height: 45px; background: #005b52; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; padding: 10px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2); border: 2px solid #ffffff; z-index: 10; }
    :global(.icon-bubble svg) { width: 100%; height: 100%; }

    /* Auto-expanding content wrapper */
    .service-body { padding: 30px 20px 25px 20px; display: flex; flex-direction: column; flex-grow: 1; height: auto; }
    .service-body h4 { font-size: 1.15rem; color: #0f172a; font-weight: 700; margin: 0 0 10px 0; }
    
    /* Removed text truncation behaviors entirely */
    .expandable-desc { font-size: 0.88rem; color: #475569; line-height: 1.6; margin: 0; display: block; height: auto; overflow: visible; }

    /* Equipment Section Grid Layout adjustments */
    .equipment-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
    @media (max-width: 850px) { .equipment-grid { grid-template-columns: 1fr; } }
    
    .eq-card { display: flex; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; min-height: 180px; height: auto; }
    @media (max-width: 550px) { .eq-card { flex-direction: column; } }
    
    .eq-image-frame { width: 220px; height: auto; min-height: 180px; background: #e2e8f0; flex-shrink: 0; overflow: hidden; }
    @media (max-width: 550px) { .eq-image-frame { width: 100%; height: 180px; } }
    .eq-image-frame img { width: 100%; height: 100%; object-fit: cover; display: block; }
    
    .eq-body { padding: 25px; display: flex; flex-direction: column; justify-content: center; flex-grow: 1; height: auto; }
    .eq-body h4 { font-size: 1.1rem; color: #005b52; font-weight: 700; margin: 0 0 8px 0; }
</style>