import { query } from "../db";
import { MqttTtnService } from "./ttn_mqttService";

type TtnServer = {
  id: string;
  appId: string;
  apiKey: string;
  appUrl: string;
};

export class TtnClientManager {
  private clients = new Map<string, MqttTtnService>();

  public async syncFromDatabase() {
    const servers: TtnServer[] = await query(
      'SELECT DISTINCT * FROM "TtnProvider"'
    );

    // Check for existing clients and disconnect if not in the database
    for (const client of this.clients.keys()) {
      if (!servers.some((server) => server.appId === client)) {
        this.clients.get(client)?.disconnect();
        this.clients.delete(client);
        console.log(`❌ TTN-client gestopt voor: ${client}`);
      }
    }

    for (const server of servers) {
      if (!this.clients.has(server.appId)) {
        const client = new MqttTtnService({
          appId: server.appId,
          apiKey: server.apiKey,
          appUrl: server.appUrl,
        });
        this.clients.set(server.appId, client);
        console.log(`✅ TTN-client gestart voor: ${server.appId}`);
      }
    }
  }
}
