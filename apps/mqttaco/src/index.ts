// src/index.ts
import { MqttService } from './mqtt/mqttService';
import { TtnClientManager } from './ttn/ttn_clientManager'; // Zorg ervoor dat je manager importeert
import { startHttpServer } from './webserver';

const mqttService = new MqttService();
console.log('🚀 MQTT Service gestart...');

// Maak de TtnClientManager aan om TTN-clients te beheren
const ttnClientManager = new TtnClientManager();

// Start de HTTP-server met de TtnClientManager
startHttpServer(ttnClientManager);

// Functie om de TTN-servers te synchroniseren
async function syncTtnClients() {
    console.log('🔄 Synchroniseren van TTN-clients vanuit de database...');
    await ttnClientManager.syncFromDatabase(); // Dit haalt servers op en start clients
    console.log('🌐 Alle TTN-clients zijn gesynchroniseerd.');
}

// Start de synchronisatie van TTN-clients
syncTtnClients().catch((err) => {
    console.error('❌ Fout bij synchroniseren van TTN-clients:', err);
});
