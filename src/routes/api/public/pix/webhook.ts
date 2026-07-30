import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/pix/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const payload = (await request.json()) as {
            transaction_id?: string;
            status?: string;
            external_id?: string;
          };
          console.log(
            `FlevoPay webhook: tx=${payload?.transaction_id} ref=${payload?.external_id} status=${payload?.status}`,
          );
        } catch (error) {
          console.error("FlevoPay webhook parse error", error);
        }
        return new Response("ok");
      },
    },
  },
});
