import express from "express";
import { TtnClientManager } from "../src/ttn/ttn_clientManager";

export const startHttpServer = (ttnManager: TtnClientManager) => {
  const app = express();
  const port = 4000;

  app.get("/refresh-ttn-clients", async (req, res) => {
    try {
      await ttnManager.syncFromDatabase();
      res.status(200).json({ message: "TTN-clients gesynchroniseerd" });
    } catch (err) {
      res.status(500).json({ error: "Kon niet synchroniseren" });
    }
  });

  app.listen(port, () => {
    console.log(`🚀 HTTP-server gestart op http://localhost:${port}`);
  });
};
