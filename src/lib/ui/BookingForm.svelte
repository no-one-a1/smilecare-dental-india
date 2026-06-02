<!-- src/lib/ui/BookingForm.svelte -->
<script lang="ts">
    import { dentalDB } from '../core/db.svelte';
    import type { TreatmentType } from '../core/types';

    let name = $state('');
    let phone = $state('');
    let selectedTreatment = $state<TreatmentType>('Root Canal');
    let targetDate = $state('');
    let targetTime = $state('10:00 AM');
    
    // Status notifications
    let feedbackMessage = $state('');
    let isError = $state(false);

    const todayISOString = new Date().toISOString().split('T')[0];

    const treatmentOptions: TreatmentType[] = ['Root Canal', 'Dental Implants', 'Braces / Orthodontics', 'Teeth Whitening'];

    async function handleSubmission(e: Event) {
        e.preventDefault();
        feedbackMessage = "Processing booking...";
        
        const result = await dentalDB.insertRecord({
            patientName: name,
            phoneNumber: "+91 " + phone,
            treatment: selectedTreatment,
            preferredDate: targetDate,
            preferredTime: targetTime
        });

        feedbackMessage = result.message;
        isError = !result.success;

        if (result.success) {
            name = '';
            phone = '';
            targetDate = '';
        }
    }
</script>

<div class="booking-wrapper">
    <div class="form-header">
        <h3>Secure Token Desk</h3>
        <p>Live synchronized scheduling. Real-time availability.</p>
    </div>
    
    <form onsubmit={handleSubmission} class="form-grid">
        <div class="group">
            <label for="fname">Patient Full Name</label>
            <input id="fname" type="text" bind:value={name} required placeholder="e.g., K. Rama Rao" />
        </div>

        <div class="group">
            <label for="fphone">10-Digit Mobile Number</label>
            <div class="input-with-prefix">
                <span class="prefix">+91</span>
                <input id="fphone" type="tel" bind:value={phone} required pattern="[6-9][0-9]&#123;9&#125;" placeholder="98765 43210" />
            </div>
        </div>

        <div class="group">
            <label for="fservice">Clinical Service Track</label>
            <select id="fservice" bind:value={selectedTreatment}>
                {#each treatmentOptions as spec}
                    <option value={spec}>{spec}</option>
                {/each}
            </select>
        </div>

        <div class="datetime-row">
            <div class="group">
                <label for="fdate">Date</label>
                <input id="fdate" type="date" min={todayISOString} bind:value={targetDate} required />
            </div>

            <div class="group">
                <label for="ftime">Preferred Slot Time</label>
                <select id="ftime" bind:value={targetTime}>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                    <option value="07:00 PM">07:00 PM</option>
                </select>
            </div>
        </div>

        {#if feedbackMessage}
            <p class="notification-alert" class:error-style={isError}>{feedbackMessage}</p>
        {/if}

        <button type="submit" class="submit-action">Generate Clinic Token ➔</button>
    </form>
</div>

<style>
    .booking-wrapper { background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 35px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .form-header { margin-bottom: 25px; }
    h3 { color: #005b52; margin: 0; font-size: 1.35rem; font-weight: 800; }
    .form-header p { color: #64748b; font-size: 0.85rem; margin-top: 4px; }
    .form-grid { display: flex; flex-direction: column; gap: 16px; }
    .group { display: flex; flex-direction: column; gap: 6px; }
    label { font-size: 0.85rem; font-weight: 700; color: #334155; }
    input, select { padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem; background: #f8fafc; color: #0f172a; }
    .input-with-prefix { display: flex; align-items: center; }
    .prefix { background: #e2e8f0; border: 1px solid #cbd5e1; border-right: none; padding: 12px; font-size: 0.95rem; font-weight: 600; color: #475569; border-radius: 8px 0 0 8px; }
    .input-with-prefix input { border-radius: 0 8px 8px 0; width: 100%; }
    .datetime-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    
    .notification-alert { padding: 10px; border-radius: 6px; font-size: 0.85rem; font-weight: 600; text-align: center; background: #d1fae5; color: #065f46; }
    .error-style { background: #fee2e2; color: #991b1b; }

    .submit-action { background: #005b52; color: #ffffff; border: none; padding: 14px; font-size: 1rem; font-weight: 700; border-radius: 8px; cursor: pointer; margin-top: 10px; }
</style>