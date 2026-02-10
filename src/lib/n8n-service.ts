import { Client } from '../types';

interface N8nResponse {
    success: boolean;
    message?: string;
}

export const triggerWorkflow = async (
    webhookUrl: string,
    client: Client,
    type: 'meta' | 'alt_text'
): Promise<N8nResponse> => {

    if (!webhookUrl) {
        return { success: false, message: 'Keine Webhook URL hinterlegt.' };
    }

    // Transformation: App Data -> n8n JSON Structure
    // Matches the "Global SEO Memory" Sticky Note structure
    const payload = {
        client_id: client.id,
        website: client.website,
        wordpress_api_url: client.wordpressUrl,
        site_memory: {
            brand: client.seoMemory.brand,
            tone: client.seoMemory.tone,
            geo_policy: {
                allowed_cities: client.seoMemory.allowedCities,
                allowed_regions: [], // Default empty for now
                default_no_city: false,
                forbid_unlisted_cities: false
            },
            protected_main_keywords: [], // Can be added to UI later
            services_taxonomy: client.seoMemory.servicesTaxonomy,
            unique_selling_points: client.seoMemory.uniqueSellingPoints,
            forbidden_terms: client.seoMemory.forbiddenTerms,

            // Standard Hardcoded Guidelines (as per Sticky Note defaults)
            title_guidelines: { length_max: 60 },
            description_guidelines: { length_max: 160 },
            slug_from_primary: true
        },
        // Trigger Metadata
        trigger_source: "tech_seo_app",
        trigger_type: type,
        timestamp: new Date().toISOString()
    };

    try {
        // Send to n8n (using no-cors mode might be needed if n8n doesn't send CORS headers, 
        // but usually webhooks return simple 200 OK. 
        // We use 'no-cors' safely or standard POST if your n8n allows it. 
        // For now, standard POST with explicit JSON header).

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            return { success: true, message: 'Workflow erfolgreich gestartet!' };
        } else {
            return { success: false, message: `Fehler: ${response.statusText}` };
        }
    } catch (error) {
        console.error("N8N Trigger Error:", error);
        // Note: If CORS fails, the workflow might still trigger but the browser blocks the response.
        // We assume success if it's a network error related to CORS on simple webhooks often.
        return { success: false, message: 'Netzwerkfehler (CORS? Workflow läuft evtl. trotzdem).' };
    }
};
